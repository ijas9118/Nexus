import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import {
  AtSign,
  Bold,
  Image,
  Italic,
  Link,
  Smile,
  Underline,
} from "lucide-react";

const CommentToolbar = () => {
  return (
    <div className="flex space-x-2">
      {[Bold, Italic, Underline, Link, Image, Smile, AtSign].map(
        (Icon, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md"
          >
            <Icon />
          </Button>
        ),
      )}
      <Separator orientation="vertical" className="h-6 my-auto" />
    </div>
  );
};

export default CommentToolbar;
