import prisma from "@/server/db/PrismaClientSingleton";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username as string,
      },
      select: {
        profilePic: true,
        name: true,
        id: true,
        username: true,
      }
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "error getting user" });
    console.log("Couldn't find user", error);
  }
}
