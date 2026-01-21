import { prisma } from "@/lib/prisma";

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByClerkId(clerkId: string) {
    return prisma.user.findUnique({
      where: { clerkId },
    });
  }

  async createUser(data: { clerkId: string; email: string; name?: string }) {
    return prisma.user.create({
      data,
    });
  }

  async updateUser(clerkId: string, data: { college?: string | null; branch?: string | null; cgpa?: number | null; targetRole?: string | null; name?: string | null }) {
    return prisma.user.update({
      where: { clerkId },
      data,
    });
  }
}

export const userRepository = new UserRepository();
