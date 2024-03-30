"use server";
import prisma from "@/server/db/PrismaClientSingleton";
import { revalidatePath } from "next/cache";

export async function getCreatorsByPage(pageNumber: number, perpage: number) {
  const skip = (pageNumber - 1) * perpage;
  try {
    const totalUsers = await prisma.user.count();
    const response = await prisma.user.findMany({
      orderBy: {
        id: "desc",
      },
      skip: skip,
      take: perpage,
      select: {
        name: true,
        username: true,
        profilePic: true,
        id: true,
      },
    });

    revalidatePath("/creators")
    return { response, totalUsers };
  } catch (error) {
    console.log("Error getting creators list: ", error);
    return {
      error: "Error getting creators list",
    };
  }
}
