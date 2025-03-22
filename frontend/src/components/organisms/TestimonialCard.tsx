import { Card } from "@/components/molecules/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import React from "react";

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
    <Card className="p-6  h-full">
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
          <h3 className="font-semibold ">{name}</h3>
          <p className=" text-sm">{username}</p>
          <p className="mt-3  leading-relaxed">{text}</p>
        </div>
      </div>
    </Card>
  );
};

export default TestimonialCard;
