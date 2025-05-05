import type { ReactNode } from "react";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Separator } from "@/components/atoms/separator";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <CardHeader className="pb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-3xl font-serif tracking-tight">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-muted-foreground mt-1">
              {description}
            </CardDescription>
          )}
        </div>
        {action}
      </div>
      <Separator className="mt-6" />
    </CardHeader>
  );
}
