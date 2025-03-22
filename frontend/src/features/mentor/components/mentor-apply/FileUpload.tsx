import { Upload } from "lucide-react";

interface FileUploadProps {
  acceptedFileTypes: string;
}

const FileUpload = ({ acceptedFileTypes }: FileUploadProps) => {
  return (
    <div className="flex items-center justify-center border-2 border-dashed rounded-md p-6 bg-muted/50">
      <div className="flex flex-col items-center gap-2">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag and drop, or{" "}
          <span className="text-primary font-medium">browse</span>
        </p>
        <p className="text-xs text-muted-foreground">{acceptedFileTypes}</p>
      </div>
    </div>
  );
};

export default FileUpload;
