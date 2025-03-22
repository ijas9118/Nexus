import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";

interface ServiceSelectionProps {
  step: number;
  sessionType: string;
  setSessionType: (value: string) => void;
  pricing: { type: string; price: number }[];
  onContinue: () => void;
}

const ServiceSelection = ({
  step,
  sessionType,
  setSessionType,
  pricing,
  onContinue,
}: ServiceSelectionProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">1. Choose a service</h2>

      <div className={step === 1 ? "block" : "hidden"}>
        <RadioGroup
          value={sessionType}
          onValueChange={setSessionType}
          className="space-y-3"
        >
          {pricing.map((option) => (
            <div key={option.type} className="flex">
              <RadioGroupItem
                value={option.type}
                id={option.type}
                className="peer sr-only"
              />
              <Label
                htmlFor={option.type}
                className="flex flex-1 cursor-pointer items-center justify-between rounded-md border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <div className="flex-1">
                  <div className="font-medium">{option.type}</div>
                  <div className="text-sm text-muted-foreground">
                    ${option.price}
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-6">
          <Button onClick={onContinue}>Continue</Button>
        </div>
      </div>
    </>
  );
};

export default ServiceSelection;
