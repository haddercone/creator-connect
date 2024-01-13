"use server";

import { prisma } from "@/server/db/PrismaClientSingleton";
import { UserProps } from "../[username]/types";
import { Question } from "../dashboard/types";

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

    const answers = await prisma.answer.findMany();


    return [user, answers];
  } catch (error) {
    console.log("Couldn't find user", error);
  }
}

export async function createQuestion(formData: FormData, user: UserProps) {
  const question = formData.get("question");
  const recipientId = user?.id;

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
      where: {
        isDeleted: false,
        isAnswered: false,
        recipient: {
          email: email,
        },
      },
    });
    return questions;
  } catch (error) {
    console.log("error getting questions", error);
  }
}

export async function answerQuestion(questionId: string, formData: FormData) {
  const answerText = formData.get("answerText");
  try {
    await prisma.answer.create({
      data: {
        answer: answerText as string,
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
  }
}
