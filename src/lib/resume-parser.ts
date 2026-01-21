import mammoth from "mammoth";

export async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // Dynamically import pdf-parse to avoid Next.js server-side loading issues
    const pdfParseModule = await import("pdf-parse");
    
    // Support for pdf-parse v2+ which exports a PDFParse class
    if (pdfParseModule.PDFParse) {
      const parser = new pdfParseModule.PDFParse({ data: buffer });
      // @ts-expect-error - load is marked private in some type definitions but required at runtime
      await parser.load();
      const result = await parser.getText() as any;
      return result.text;
    }

    // Fallback for pdf-parse v1
    const pdfParse = ((pdfParseModule as { default?: (buffer: Buffer) => Promise<{ text: string }> }).default || pdfParseModule) as (buffer: Buffer) => Promise<{ text: string }>;
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error("Failed to parse PDF");
  }
}

export async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("DOCX Parsing Error:", error);
    throw new Error("Failed to parse DOCX");
  }
}
