import ExperienceForm from "@/components/normal/mentors/mentor-apply/ExperienceForm";
import MentorshipDetailsForm from "@/components/normal/mentors/mentor-apply/MentorshipDetailsForm";
import PersonalInfoForm from "@/components/normal/mentors/mentor-apply/PersonalInfoForm";
import StepIndicator from "@/components/normal/mentors/mentor-apply/StepIndicator";
import { Button } from "@/components/ui/button";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const MentorApply = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast("Application submitted", {
        description:
          "We've received your mentor application. We'll review it and get back to you soon.",
      });
    }, 2000);
  };

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "Mentors", url: "/mentors" },
        { title: "Apply", url: "" },
      ]),
    );
  }, []);

  const renderStepForm = () => {
    switch (step) {
      case 1:
        return <PersonalInfoForm onContinue={handleContinue} />;
      case 2:
        return (
          <ExperienceForm onBack={handleBack} onContinue={handleContinue} />
        );
      case 3:
        return (
          <MentorshipDetailsForm
            onBack={handleBack}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return <PersonalInfoForm onContinue={handleContinue} />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-3xl">
      <div className="mb-8">
        <Link to="/mentors">
          <Button variant="ghost">← Back to mentors</Button>
        </Link>
      </div>

      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Become a Mentor
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Share your knowledge and expertise with those who need it. Apply to
            become a mentor and make a difference in someone's career.
          </p>
        </div>

        <StepIndicator currentStep={step} />

        {renderStepForm()}
      </div>
    </div>
  );
};

export default MentorApply;
