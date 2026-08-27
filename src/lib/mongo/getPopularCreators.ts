"use server";
import prisma from "@/server/db/PrismaClientSingleton";

export type PopularCreator = {
  id: string;
  name: string;
  username: string;
  profilePic: string;
  answeredQuestions: number;
};

export const getPopularCreators = async (limit = 3) => {
  try {
    // Prisma's MongoDB groupBy does not support orderBy on _count, so sort in JS.
    const rankedGroups = await prisma.question.groupBy({
      by: ["recipientId"],
      where: {
        isApproved: true,
        isAnswered: true,
        isDeleted: false,
        answer: { isNot: null },
      },
      _count: { _all: true },
    });

    const ranked = rankedGroups
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, limit);

    const recipients = await prisma.user.findMany({
      where: {
        id: { in: ranked.map((r) => r.recipientId) },
      },
      orderBy: { id: "desc" },
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

    if (popularCreators.length >= limit) return popularCreators;

    const rankedIds = new Set(popularCreators.map((c) => c.id));
    const fillers = await prisma.user.findMany({
      where: { id: { notIn: Array.from(rankedIds) } },
      orderBy: { id: "desc" },
      take: limit - popularCreators.length,
      select: {
        id: true,
        name: true,
        username: true,
        profilePic: true,
      },
    });

    return [
      ...popularCreators,
      ...fillers.map((user) => ({ ...user, answeredQuestions: 0 })),
    ];
  } catch (error) {
    console.log("Error getting popular creators: \n", error);
    return { error: "Error getting popular creators" };
  }
};