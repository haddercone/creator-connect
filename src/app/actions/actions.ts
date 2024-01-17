"use server";

import { prisma } from "@/server/db/PrismaClientSingleton";
import { Question } from "../dashboard/types";
import { revalidatePath } from "next/cache";
import { AnswerSchema, QuestionSchema } from "@/lib/types";

export async function getCreatorPageDetails({
  username,
}: {
  username: string | string[];
}) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username as string,
      },
    });

    // const answers = await prisma.answer.findMany();

    return user;
  } catch (error) {
    console.log("Couldn't find user", error);
  }
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
    await prisma.question.create({
      data: {
        questionText: question as string,
        recipientId: recipientId as string,
      },
    });
  } catch (error) {
    console.log("error creating question", error);
  }
}

export async function getAllQuestionsByUser(email: string) {
  try {
    const questions: Question[] | null = await prisma.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        isDeleted: false,
        recipient: {
          email: email,
        },
      },
    });
    return questions ?? [];
  } catch (error) {
    console.log("error getting questions", error);
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
    }
  }
}

export async function deleteQuestion(questionId: string) {
  try {
    await prisma.question.delete({
      where: {
        id: questionId,
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.log("error deleting question", error);
  }
}
