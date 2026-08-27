"use server";
import prisma from "@/server/db/PrismaClientSingleton";

export async function getCreatorsByPage(pageNumber: number, perpage: number) {
  const skip = (pageNumber - 1) * perpage;
  try {
    const [totalUsers, response] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        orderBy: {
          id: "desc",
        },
        skip,
        take: perpage,
        select: {
          name: true,
          username: true,
          profilePic: true,
          id: true,
        },
      }),
    ]);

    return { response, totalUsers };
  } catch (error) {
    console.log("Error getting creators list: ", error);
    return {
      error: "Error getting creators list",
    };
  }
}
