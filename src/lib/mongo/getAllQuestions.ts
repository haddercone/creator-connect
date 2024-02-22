import prisma from "@/server/db/PrismaClientSingleton"

type QuestionProp = {
    id: string,
    questionText: string,
    recipient: {
        name: string,
        profilePic: string,
        username: string,
    }
  }

export const getAllQuestions = async () => {
    try {
        const allQuestions : QuestionProp[] = await prisma.question.findMany({
            where : {
                isAnswered: false,
                isApproved: false,
            },
            select: {
                id: true,
                questionText: true,
                recipient: {
                    select: {
                        name: true,
                        profilePic: true,
                        username: true,
                    }
                }
            }
        })
        return allQuestions;
    } catch (error) {
        console.log("error geting questions: \n", error);
        return {error: "error getting questions"}
    }

}