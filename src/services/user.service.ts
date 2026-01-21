import { userRepository } from "../repositories/user.repository";

export class UserService {
  async getOrCreateUser(clerkId: string, email: string, name?: string) {
    let user = await userRepository.findByClerkId(clerkId);
    if (!user) {
      user = await userRepository.createUser({ clerkId, email, name });
    }
    return user;
  }

  async updateProfile(clerkId: string, data: { college?: string | null; branch?: string | null; cgpa?: number | null; targetRole?: string | null; name?: string | null }) {
    return userRepository.updateUser(clerkId, data);
  }
}

export const userService = new UserService();
