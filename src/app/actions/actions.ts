"use server";

import { prisma } from "@/server/db/PrismaClientSingleton";
import { Question } from "../dashboard/types";
import { revalidatePath } from "next/cache";
import { AnswerSchema, QuestionSchema } from "@/lib/types";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { ALLOWED_REQUESTS } from "@/config/rateLimit";
import { createHash } from "crypto";

const questionRateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(ALLOWED_REQUESTS, "3600 s"),
});

function getClientIp(requestHeaders: Headers) {
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("cf-connecting-ip") ||
    requestHeaders.get("x-real-ip") ||
    "127.0.0.1"
  );
}

function getSubmitterKey(requestHeaders: Headers, recipientId: string) {
  return createHash("sha256")
    .update(`${recipientId}:${getClientIp(requestHeaders)}`)
    .digest("hex");
}

export async function createQuestion(newQuestion: unknown) {
  const result = QuestionSchema.safeParse(newQuestion);

  if (!result.success) {
    let errorMsg = "";
    result.error.format();
    result.error.issues.forEach((issue) => {
      errorMsg = errorMsg + issue.path[0] + ": " + issue.message + ". ";
    });

    return {
      error: errorMsg,
    };
  }
  const { question, recipientId } = result.data;

  try {
    const requestHeaders = await headers();
    const submitterKey = getSubmitterKey(requestHeaders, recipientId);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentQuestions = await prisma.question.count({
      where: {
        submitterKey,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentQuestions >= ALLOWED_REQUESTS) {
      return {
        error: "Your question limit of 2 questions per hour has been exceeded.",
      };
    }

    const { success } = await questionRateLimit.limit(
      `question:${submitterKey}`
    );

    if (!success) {
      return {
        error: "Your question limit of 2 questions per hour has been exceeded.",
      };
    }

    const result: Question = await prisma.question.create({
      data: {
        questionText: question as string,
        recipientId: recipientId as string,
        submitterKey,
      },
    });
    return result;
  } catch (error) {
    console.log("Error creating question", error);
    return { error: "Error creating question" };
  }
}

export async function getAllQuestionsByUser(email: string) {
  try {
    const questions: Question[] | null = await prisma.question.findMany({
      include: {
        answer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      where: {
        isApproved: true, 
        recipient: {
          email: email,
        },
      },
    });
    revalidatePath("/dashboard");
    return questions ?? [];
  } catch (error) {
    console.log("Error getting questions", error);
    // return { error: "Error getting questions" };
  }
}

export async function answerQuestion(newAnswer: unknown) {
  const result = AnswerSchema.safeParse(newAnswer);

  if (!result.success) {
    let errorMsg = "";
    result.error.format();
    result.error.issues.forEach((issue) => {
      errorMsg = errorMsg + issue.path[0] + ": " + issue.message + ". ";
    });

    return {
      error: errorMsg,
    };
  }

  const { answer, questionId } = result.data;

  try {
    await prisma.answer.create({
      data: {
        answer: answer as string,
        question: {
          connect: {
            id: questionId,
          },
        },
      },
    });

    await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        isAnswered: true,
      },
    });
  } catch (error) {
    console.log("Error answering question", error);
    return {
      error: "Error answering question",
    };
  }
}

export async function updateAnswer(updatedAnswer: unknown) {
  const result = AnswerSchema.safeParse(updatedAnswer);

  if (!result.success) {
    let errorMsg = "";
    result.error.format();
    result.error.issues.forEach((issue) => {
      errorMsg = errorMsg + issue.path[0] + ": " + issue.message + ". ";
    });

    return {
      error: errorMsg,
    };
  }
  const { answer, questionId } = result.data;
  try {
    await prisma.answer.update({
      where: {
        questionId: questionId,
      },
      data: {
        answer: answer,
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.log("Error updating question", error);
    return {
      error: "Error updating question",
    };
  }
}

export async function deleteQuestion(questionId: string) {
  try {
    await prisma.question.delete({
      where: {
        id: questionId,
      },
    });
  } catch (error) {
    console.log("Error deleting question", error);
    return {
      error: "Error deleting question",
    };
  }
}
