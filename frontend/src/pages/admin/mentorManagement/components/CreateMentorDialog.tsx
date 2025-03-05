import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogProps } from "@/types/dialog";
import MentorService from "@/services/admin/mentorService";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email"),
  specialization: z.string().min(2, "Specialization is required"),
});

type FormData = z.infer<typeof formSchema>;

export function CreateMentorDialog({ open, onOpenChange }: DialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      specialization: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await MentorService.sendInvite({
        email: data.email,
        name: data.name,
        specialization: data.specialization,
      });

      toast("Invitation Sent", {
        description: `A magic link has been sent to ${data.email}.`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error sending invite", error);
      toast.error("Error", {
        description: "Failed to send invitation. Please try again.",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Mentor</DialogTitle>
            <DialogDescription>
              Enter mentor details below. A magic link will be sent for
              confirmation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              {/* Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="name"
                        placeholder="Enter mentor's name"
                        {...field}
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="email"
                        placeholder="Enter mentor's email"
                        {...field}
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Specialization */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="specialization" className="text-right">
                  Specialization
                </Label>
                <div className="col-span-3">
                  <Controller
                    name="specialization"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="specialization"
                        placeholder="e.g., JavaScript, AI"
                        {...field}
                      />
                    )}
                  />
                  {errors.specialization && (
                    <p className="text-sm text-red-600">
                      {errors.specialization.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Send Invite</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
