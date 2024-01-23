import prisma from "@/server/db/PrismaClientSingleton";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  try {
    const answeredQuestions = await prisma.question.findMany({
      // include: {
      //   answer: true,
      // },
      select: {
        questionText: true,
        isAnswered: true,
        id: true,
        answer: {
          select: {
            answer: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
      where: {
        recipient: {
          username: username as string,
        },
        isAnswered: true,
      },
    });
    
    return NextResponse.json(answeredQuestions) ?? [];
  } catch (error) {
    console.log("Error getting questions", error);
    return NextResponse.json({
      error: "Error getting questions for username",
    });
  }
}
