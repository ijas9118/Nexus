import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import { CreditCard } from "lucide-react";

interface PaymentDetailsProps {
  onBack: () => void;
  price: number;
  step: number;
}

const PaymentDetails = ({ onBack, price, step }: PaymentDetailsProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">3. Payment details</h2>

      <div className={step === 3 ? "block" : "hidden"}>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name on card</Label>
            <Input id="name" placeholder="Enter your full name" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="card">Card number</Label>
            <Input id="card" placeholder="1234 5678 9012 3456" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="expiry">Expiry date</Label>
              <Input id="expiry" placeholder="MM/YY" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Share what you'd like to discuss in the session..."
              className="min-h-[100px] w-full text-sm"
            ></Textarea>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button className="gap-2">
            <CreditCard className="h-4 w-4" />
            Pay ${price}
          </Button>
        </div>
      </div>
    </>
  );
};

export default PaymentDetails;
