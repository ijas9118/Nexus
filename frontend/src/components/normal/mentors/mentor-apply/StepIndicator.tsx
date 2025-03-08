const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Experience & Skills" },
    { number: 3, title: "Mentorship Details" },
  ];

  return (
    <div className="flex justify-between mb-8">
      {steps.map((step) => (
        <div key={step.number} className="flex flex-col items-center">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step.number
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {step.number}
          </div>
          <span className="text-sm mt-2">{step.title}</span>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
