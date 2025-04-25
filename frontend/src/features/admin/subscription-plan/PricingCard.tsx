import { Check, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/molecules/card";
import { Badge } from "@/components/atoms/badge";

const PricingCard = ({ plan, onEdit, onDelete }) => {
  return (
    <div className="flex justify-center p-6">
      <Card className="w-80 overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background/70 to-background/40 backdrop-blur-sm relative">
        {/* Glossy effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-primary/10 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent_20%,black_60%)] pointer-events-none" />

        {/* Light reflections for glossy effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-primary/5 rounded-full blur-xl" />

        <div className="z-50 absolute top-2 right-2 flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onEdit(plan)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive"
            onClick={() => onDelete(plan.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <CardHeader className="pb-3 relative">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xl">{plan.name}</h3>
            {plan.featured && (
              <Badge
                variant="secondary"
                className="bg-primary text-primary-foreground"
              >
                {plan.badge || "PRO"}
              </Badge>
            )}
          </div>
          <div className="mt-2">
            <span className="text-4xl font-bold">${plan.price}</span>
            <span className="text-muted-foreground ml-1">{plan.interval}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{feature}</p>
            </div>
          ))}
        </CardContent>

        <CardFooter className="pt-4 relative">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
            {plan.buttonText || "Upgrade Plan"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PricingCard;
