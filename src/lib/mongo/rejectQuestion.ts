"use server"

import prisma from "@/server/db/PrismaClientSingleton"

export const rejectQuestion = async (id : string) => {
    try {
        const response = await prisma.question.delete({
            where: {
                id: id,
            }
        })
        return response;
    } catch (error) {
        console.log("Error rejecting question \n", error);
        return {
            error : "Error rejecting question"
        }
    }
}