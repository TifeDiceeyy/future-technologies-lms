import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IconUpload, IconX, IconFile, IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  file: File;
  id: string;
  status: "uploading" | "done" | "error";
  progress: number;
}

export function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((accepted: File[]) => {
    const newFiles: UploadedFile[] = accepted.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      status: "uploading",
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((uf) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uf.id ? { ...f, progress: 100, status: "done" } : f,
            ),
          );
        } else {
          setFiles((prev) =>
            prev.map((f) => (f.id === uf.id ? { ...f, progress } : f)),
          );
        }
      }, 200);
    });
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 cursor-pointer transition-all",
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50",
        )}
      >
        <input {...getInputProps()} />

        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card transition-colors",
            isDragActive && "border-primary/50 bg-primary/10",
          )}
        >
          <IconUpload
            size={24}
            className={cn(
              "transition-colors",
              isDragActive ? "text-primary" : "text-muted-foreground",
            )}
          />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            or{" "}
            <span className="text-primary font-medium underline-offset-2 hover:underline">
              browse to upload
            </span>
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          PDF, DOC, DOCX, ZIP, PNG, JPG — any size
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((uf) => (
            <li
              key={uf.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
            >
              {/* Icon */}
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-secondary border border-border">
                <IconFile size={18} className="text-muted-foreground" />
              </div>

              {/* Info + progress */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {uf.file.name}
                  </p>
                  <span className="flex-shrink-0 text-xs text-muted-foreground">
                    {formatSize(uf.file.size)}
                  </span>
                </div>

                {uf.status === "uploading" && (
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-200"
                      style={{ width: `${uf.progress}%` }}
                    />
                  </div>
                )}

                {uf.status === "done" && (
                  <p className="mt-0.5 text-xs text-emerald-500">
                    Upload complete
                  </p>
                )}
              </div>

              {/* Status / remove */}
              {uf.status === "done" ? (
                <IconCheck
                  size={16}
                  className="flex-shrink-0 text-emerald-500"
                />
              ) : null}
              <button
                onClick={() => removeFile(uf.id)}
                className="flex-shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Remove file"
              >
                <IconX size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
