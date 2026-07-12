import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  createUserSchema,
  updateUserSchema,
} from "@/features/settings/settings-validation";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    });

    if (!currentUser?.isAdmin) {
      return errorResponse("Forbidden", 403);
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        isAdmin: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(users);
  } catch {
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    });

    if (!currentUser?.isAdmin) {
      return errorResponse("Forbidden", 403);
    }

    const body = await request.json();
    const result = createUserSchema.safeParse(body);

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Validation failed";
      return errorResponse(errorMessage, 400);
    }

    const { name, username, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return errorResponse("Username already exists", 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        username: true,
        isAdmin: true,
        isActive: true,
        createdAt: true,
      },
    });

    return successResponse(newUser, "User created successfully", 201);
  } catch {
    return errorResponse("Internal server error", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    });

    if (!currentUser?.isAdmin) {
      return errorResponse("Forbidden", 403);
    }

    const body = await request.json();
    const result = updateUserSchema.safeParse(body);

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Validation failed";
      return errorResponse(errorMessage, 400);
    }

    const { id, name, username, isAdmin, isActive } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser && existingUser.id !== id) {
      return errorResponse("Username already exists", 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        username,
        isAdmin,
        isActive,
      },
      select: {
        id: true,
        name: true,
        username: true,
        isAdmin: true,
        isActive: true,
        createdAt: true,
      },
    });

    return successResponse(updatedUser, "User updated successfully");
  } catch {
    return errorResponse("Internal server error", 500);
  }
}
