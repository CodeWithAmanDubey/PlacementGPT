"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function UploadZone() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    if (!["pdf", "docx"].includes(ext || "")) {
      setError("Please upload a PDF or DOCX file.");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      router.refresh(); // Refresh the page to show new analysis
      
      // Close the <details> dropdown so the user can see the updated results
      const detailsElement = document.querySelector("details");
      if (detailsElement) {
        detailsElement.removeAttribute("open");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsUploading(false);
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-indigo-500 bg-indigo-500/5" : "border-white/10 hover:border-indigo-500/30 hover:bg-white/5"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <p className="text-neutral-300 font-medium">Analyzing your resume...</p>
            <p className="text-sm text-neutral-500">This may take a few seconds.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white/5 rounded-full">
              <UploadCloud className="w-10 h-10 text-neutral-400" />
            </div>
            <div>
              <p className="text-neutral-300 font-medium mb-1">
                {isDragActive ? "Drop your resume here" : "Drag and drop your resume"}
              </p>
              <p className="text-sm text-neutral-500">or click to browse from your computer</p>
            </div>
            <div className="flex gap-4 mt-2">
              <span className="flex items-center gap-1 text-xs font-medium text-neutral-400 bg-white/5 px-2 py-1 rounded">
                <File className="w-3 h-3" /> PDF
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-neutral-400 bg-white/5 px-2 py-1 rounded">
                <File className="w-3 h-3" /> DOCX
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-neutral-400 bg-white/5 px-2 py-1 rounded">
                Max 5MB
              </span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
