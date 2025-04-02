import { Button } from "@/components/atoms/button";
import { Textarea } from "@/components/atoms/textarea";

interface ReplyInputProps {
  replyText: string;
  setReplyText: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  to: string;
  isPending?: boolean;
}

export const ReplyInput = ({
  to,
  replyText,
  setReplyText,
  onSubmit,
  onCancel,
  isPending,
}: ReplyInputProps) => {
  return (
    <div className="mt-2">
      <Textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        className="mb-2 resize-none text-sm"
        placeholder={`Write a reply to ${to}`}
      />
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={onSubmit} disabled={!replyText.trim()}>
          {isPending ? "Replying..." : "Reply"}
        </Button>
      </div>
    </div>
  );
};
