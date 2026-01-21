import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export class StorageService {
  private readonly UPLOAD_DIR = path.join(process.cwd(), "uploads", "resumes");

  async saveFile(buffer: Buffer, originalExt: string): Promise<string> {
    await fs.mkdir(this.UPLOAD_DIR, { recursive: true });
    
    // Sanitize and generate secure unique filename
    const uuid = crypto.randomUUID();
    const safeExt = originalExt.replace(/[^a-z0-9.]/gi, "").toLowerCase();
    const safeExtFinal = safeExt.startsWith(".") ? safeExt : `.${safeExt}`;
    const uniqueFileName = `${uuid}${safeExtFinal}`;
    
    const filePath = path.join(this.UPLOAD_DIR, uniqueFileName);
    
    // Prevent directory traversal
    if (!filePath.startsWith(this.UPLOAD_DIR)) {
      throw new Error("Invalid file path");
    }

    await fs.writeFile(filePath, buffer);
    return `/uploads/resumes/${uniqueFileName}`;
  }
}

export const storageService = new StorageService();
