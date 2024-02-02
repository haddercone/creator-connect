"use server"

import prisma from "@/server/db/PrismaClientSingleton"
import { revalidatePath } from "next/cache";

export const rejectQuestion = async (id : string) => {
    try {
        const response = await prisma.question.delete({
            where: {
                id: id,
            }
        })
        revalidatePath("/dashboard/admin")
        return response;
    } catch (error) {
        console.log("Error rejecting question \n", error);
        return {
            error : "Error rejecting question"
        }
    }
}