import React from "react";
import { Check, Pencil, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";

interface PriceCardProps {
  tier: string;
  description: string;
  price: string;
  interval: string;
  ctaText: string;
  highlights: string[];
  featured: boolean;
  logo: React.ReactNode;
  isAdminView: boolean; // <- New
  onEdit?: () => void; // <- New
  onDelete?: () => void;
  onCTAClick?: () => void;
}

export default function PriceCard({
  tier,
  description,
  price,
  interval,
  ctaText,
  highlights,
  featured = false,
  logo = null,
  isAdminView,
  onEdit,
  onDelete,
  onCTAClick,
}: PriceCardProps) {
  return (
    <Card
      className={`relative group w-full max-w-sm transition-all flex flex-col ${featured ? "border-primary shadow-lg" : "border-border"}  max-h-[600px]`}
    >
      {featured && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-max">
          <Badge className="bg-primary px-4 py-1 rounded-full shadow-md">
            Recommended
          </Badge>
        </div>
      )}
      <CardHeader className="relative">
        {isAdminView && (
          <div className="absolute top-2 opacity-0 group-hover:opacity-100 transition-all duration-300 right-2 flex gap-2">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )}
        {logo && <div className="mb-4">{logo}</div>}

        <CardTitle className="text-2xl font-bold">{tier}</CardTitle>
        <CardDescription className="text-gray-500">
          {description}
        </CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{price}</span>
          {interval && <span className="text-gray-500 ml-1">/ {interval}</span>}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className=" space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Features
          </h3>
          <ul className="space-y-3">
            {highlights?.map((item, index) => (
              <li key={`highlight-${index}`} className="flex items-start">
                <span className="mr-3 mt-1">
                  <Check className="h-5 w-5 text-emerald-400 dark:text-emerald-600" />
                </span>
                <span className="text-muted-foreground text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={!isAdminView ? onCTAClick : undefined}
          className={`w-full ${featured ? "bg-primary" : ""}`}
          variant={featured ? "default" : "outline"}
        >
          {ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
}
