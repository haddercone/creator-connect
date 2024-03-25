"use server";

import prisma from "@/server/db/PrismaClientSingleton";
import { z } from "zod";

const querySchema = z.string();

export const searchUsers = async (searchQuery: unknown) => {
  const result = querySchema.safeParse(searchQuery);
  console.log("Result:", result);
  
  if (!result.success) {
    let errorMsg = "";  
    result.error.format();
    result.error.issues.forEach((issue) => {
      errorMsg = errorMsg + issue.path[0] + ": " + issue.message + ". ";
    });

    return {
      error: errorMsg,
    };
  }

  const query  = result.data;

  try {
    const result = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        profilePic: true,
      }
    });
    console.log(result);
    
    return result;
  } catch (error) {
    console.log("Error searching user", error);
    return {
      error: "Error searching user",
    };
  }
};
