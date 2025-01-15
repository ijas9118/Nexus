import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative px-6 lg:px-8">
      <div className="mx-auto max-w-4xl pt-32 pb-32 sm:pt-48 sm:pb-40">
        {/* Beta Badge */}
        <div className="flex justify-center mb-8">
          <Badge
            variant="destructive"
            className="text-sm font-light py-1 px-4 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 border-0"
          >
            Your Growth, Amplified
          </Badge>
        </div>

        {/* Hero Text */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-800 sm:text-6xl">
            Your Gateway to <span className="text-blue-700">Knowledge</span>,{" "}
            <span className="text-purple-700">Connection</span>, and Growth
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Join a community built for your professional growth.
          </p>
          <div className="mt-10 flex items-center justify-center">
            <Button
              size="lg"
              className="rounded-full px-8 bg-gray-900 hover:bg-gray-700"
            >
              Get started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
