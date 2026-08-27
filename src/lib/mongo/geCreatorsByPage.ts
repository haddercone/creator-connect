"use server";
import prisma from "@/server/db/PrismaClientSingleton";

export async function getCreatorsByPage(
  pageNumber: number,
  perpage: number,
  excludeIds: string[] = []
) {
  const skip = (pageNumber - 1) * perpage;
  try {
    const where = { id: { notIn: excludeIds } };
    const [totalUsers, gridTotal, response] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
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

    return { response, totalUsers, gridTotal };
  } catch (error) {
    console.log("Error getting creators list: ", error);
    return {
      error: "Error getting creators list",
    };
  }
}