"use server"
import prisma from "@/server/db/PrismaClientSingleton"

export const approveQuestion = async (id : string) => {
    try {
        const response = await prisma.question.update({
            where : {
                id: id,
            },
            data : {
                isApproved : true,
            }
        })
        return response;
    } catch (error) {
        console.log("Error approving question \n", error);
        return {
            error : "Error updating question"
        }
    }
}