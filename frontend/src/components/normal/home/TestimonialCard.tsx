import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialProps {
  name: string;
  username: string;
  image: string;
  text: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({
  name,
  username,
  image,
  text,
}) => {
  return (
    <Card className="p-6 bg-gray-50 border-gray-100 h-full">
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-gray-500 text-sm">{username}</p>
          <p className="mt-3 text-gray-600 leading-relaxed">{text}</p>
        </div>
      </div>
    </Card>
  );
};

export default TestimonialCard;
