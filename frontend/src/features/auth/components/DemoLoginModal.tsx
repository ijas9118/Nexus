import { X } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/molecules/card";

interface DemoLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (type: "normal" | "premium" | "mentor") => void;
}

export function DemoLoginModal({
  isOpen,
  onClose,
  onSelectAccount,
}: DemoLoginModalProps) {
  if (!isOpen) return null;

  const accounts = [
    {
      type: "normal" as const,
      title: "Normal User",
      description: "Basic access to platform features",
      email: "user@example.com",
      password: "password123",
    },
    {
      type: "premium" as const,
      title: "Premium User",
      description: "Access to premium features and content",
      email: "premium@example.com",
      password: "premium123",
    },
    {
      type: "mentor" as const,
      title: "Mentor",
      description: "Full access with mentoring capabilities",
      email: "mentor@example.com",
      password: "mentor123",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <h2 className="text-xl font-semibold mb-4">Select Demo Account</h2>

        <div className="space-y-3">
          {accounts.map((account) => (
            <div
              key={account.type}
              className="border rounded-lg p-4 hover:bg-muted cursor-pointer transition-colors"
              onClick={() => {
                onSelectAccount(account.type);
                onClose();
              }}
            >
              <div className="font-medium">{account.title}</div>
              <div className="text-sm text-muted-foreground mb-2">
                {account.description}
              </div>
              <div className="text-xs">
                <div>
                  <span className="font-medium">Email:</span> {account.email}
                </div>
                <div>
                  <span className="font-medium">Password:</span>{" "}
                  {account.password}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
