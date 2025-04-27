import BackgroundPattern from "@/components/molecules/BackgroundPattern";
import FeatureCard from "@/components/organisms/FeatureCard";
import HeroSection from "@/components/organisms/HeroSection";
import { Rocket, Send, Users, Zap } from "lucide-react";
import Navbar from "@/components/organisms/Navbar";
import TestimonialsCarousel from "@/components/organisms/TestimonialsCarousel";
import SectionHeader from "@/components/organisms/SectionHeader";
import Footer from "@/components/organisms/Footer";
import { useQuery } from "@tanstack/react-query";
import { IPlan } from "@/types/plans";
import PlanService from "@/services/planService";
import PriceCard from "@/components/organisms/PricingCard";
import { getPlanLogo } from "@/utils/planLogo";

const testimonials = [
  {
    name: "John Doe 1",
    username: "@johndoe",
    image: "/placeholder.svg",
    text: "Nexus transformed my learning and networking. The mentors and premium content are game-changers!",
  },
  {
    name: "Neha K 2",
    username: "@neha",
    image: "/placeholder.svg",
    text: "The premium features on Nexus are worth it. I've gained so much knowledge and made great connections.",
  },
  {
    name: "Rohit S 3",
    username: "@rohit",
    image: "/placeholder.svg",
    text: "Joining a tech squad changed everything. I've learned and connected more than ever before.",
  },
  {
    name: "Ankit T 4",
    username: "@ankit",
    image: "/placeholder.svg",
    text: "Nexus made professional networking easy and meaningful. The mentor sessions were invaluable!",
  },
  {
    name: "Vikram M 5",
    username: "@vikram",
    image: "/placeholder.svg",
    text: "Nexus has been a game-changer for my career. The mentors offer practical advice, and the premium content is top-notch.",
  },
  {
    name: "Sakshi J 6",
    username: "@sakshi",
    image: "/placeholder.svg",
    text: "Nexus made networking so easy! I've gained valuable connections and grown both professionally and personally.",
  },
  {
    name: "Sakshi J 7",
    username: "@sakshi",
    image: "/placeholder.svg",
    text: "Nexus made networking so easy! I've gained valuable connections and grown both professionally and personally.",
  },
];

const Home = () => {
  const {
    data: plans,
    isLoading,
    isError,
  } = useQuery<IPlan[]>({
    queryKey: ["plans"],
    queryFn: PlanService.getAllPlans,
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="relative isolate pt-14">
        <BackgroundPattern />
        <HeroSection />
      </div>

      <section className="py-24 px-4 ">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            badgeText="Features"
            heading="What Makes Nexus Your Professional Powerhouse?"
          />

          <div className="w-full flex justify-center">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 content-center w-2/3">
              <FeatureCard
                icon={<Rocket />}
                title="Premium Contents"
                description="Access high-quality, thought-provoking content made by industry mentors and experts."
                iconColor="text-blue-600 dark:text-blue-400"
                backgroundColor="bg-blue-100 dark:bg-blue-900"
              />
              <FeatureCard
                icon={<Zap />}
                title="Connect with Experts"
                description="Build meaningful connections with professionals, fostering collaboration and mentorship."
                iconColor="text-purple-600 dark:text-purple-400"
                backgroundColor="bg-purple-100 dark:bg-purple-900"
              />
              <FeatureCard
                icon={<Users />}
                title="Join Tech Squads"
                description="Collaborate, learn, and grow in topic-focused groups for AI, Web Development, Data Science, and more."
                iconColor="text-purple-600 dark:text-purple-400"
                backgroundColor="bg-purple-100 dark:bg-purple-900"
              />
              <FeatureCard
                icon={<Send />}
                title="Chat and Video Call"
                description="Communicate seamlessly with your network through integrated chat and video calling functionality."
                iconColor="text-blue-600 dark:text-blue-400"
                backgroundColor="bg-blue-100 dark:bg-blue-900"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            badgeText="Testimonial"
            heading="Trusted by all"
            description="Join thousands of satisfied users who rely on our platform for their personal and professional productivity needs."
          />

          <TestimonialsCarousel testimonials={testimonials} />
        </div>
        <BackgroundPattern />
      </section>

      <section className="py-24 px-4 ">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            badgeText="Get Access"
            heading="Choose the Perfect Plan for You"
            description="Unlock Nexus Premium to access exclusive content, connect with mentors, and join specialised tech squads. Choose the plan that fits your journey and grow professionally!"
          />

          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div>Something went wrong. Probably the server had a bad day.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans?.map((plan) => (
                <PriceCard
                  key={plan._id}
                  tier={plan.tier}
                  description={plan.description}
                  price={`₹${plan.price}`}
                  interval={plan.interval}
                  ctaText={plan.ctaText}
                  highlights={plan.highlights || []}
                  featured={plan.featured || false}
                  logo={getPlanLogo(plan.logo)}
                  isAdminView={false}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
