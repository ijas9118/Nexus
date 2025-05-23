import { Button } from "@/components/atoms/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/organisms/input-otp";

interface OtpVerificationProps {
  handleComplete: (value: string) => void;
  onResend: () => void;
  canResend: boolean;
  timer: number;
}

export function OtpVerification({
  handleComplete,
  onResend,
  canResend,
  timer,
}: OtpVerificationProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">
        Verify Your Email
      </h1>
      <p className="text-muted-foreground">
        Enter the OTP sent to your email to complete registration
      </p>
      <div className="space-y-8 flex flex-col items-center">
        <InputOTP maxLength={6} onComplete={handleComplete}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button onClick={onResend} className="w-full" disabled={!canResend}>
          {canResend ? "Resend OTP" : `Resend in ${timer}s`}
        </Button>
      </div>
    </div>
  );
}
