"use server";
import prisma from "@/server/db/PrismaClientSingleton";

export type PopularCreator = {
  id: string;
  name: string;
  username: string;
  profilePic: string;
  answeredQuestions: number;
};

export const getPopularCreators = async (limit = 5) => {
  try {
    const ranked = await prisma.question.groupBy({
      by: ["recipientId"],
      where: { isAnswered: true },
      _count: { _all: true },
      orderBy: { _count: { recipientId: "desc" } },
      take: limit,
    });

    if (ranked.length === 0) return [];

    const recipients = await prisma.user.findMany({
      where: { id: { in: ranked.map((r) => r.recipientId) } },
      select: {
        id: true,
        name: true,
        username: true,
        profilePic: true,
      },
    });

    const recipientsById = new Map(
      recipients.map((user) => [user.id, user])
    );

    const popularCreators: PopularCreator[] = ranked
      .map((r) => {
        const user = recipientsById.get(r.recipientId);
        if (!user) return null;
        return {
          ...user,
          answeredQuestions: r._count._all,
        };
      })
      .filter((c): c is PopularCreator => c !== null);

    return popularCreators;
  } catch (error) {
    console.log("Error getting popular creators: \n", error);
    return { error: "Error getting popular creators" };
  }
};