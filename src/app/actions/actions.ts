"use server";
import { prisma } from "@/server/db/PrismaClientSingleton"

export default async function  getCreatorPageDetails({username} : { username: string  | string []} ) {
    const user = await prisma.user.findFirst({
       where: {
        username: username as string
       }
    })
    
    return user;
}