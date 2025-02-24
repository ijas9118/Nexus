import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const PasswordInput = ({ label, id, registerOptions, watchValue }: any) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="rounded-lg mt-1 pr-10"
          {...registerOptions}
        />
        <button
          type="button"
          className="absolute right-3 top-2.5 text-muted-foreground"
          onClick={() => setVisible((prev) => !prev)}
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {watchValue && <p className="text-sm text-pink-600">{watchValue}</p>}
    </div>
  );
};

export default PasswordInput;
