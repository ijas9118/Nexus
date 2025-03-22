import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-12">
        What Our Premium Members Say
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            name: "Sarah Johnson",
            role: "Frontend Developer",
            image: "S",
            quote:
              "The premium content has been invaluable for my career growth. The mentorship sessions helped me land my dream job at a top tech company.",
          },
          {
            name: "Michael Chen",
            role: "Full Stack Engineer",
            image: "M",
            quote:
              "Being part of premium squads has connected me with like-minded developers. The knowledge sharing and collaboration opportunities are incredible.",
          },
          {
            name: "Priya Sharma",
            role: "DevOps Specialist",
            image: "P",
            quote:
              "The yearly subscription is a no-brainer. The two free mentorship sessions alone are worth more than the subscription cost.",
          },
        ].map((testimonial, i) => (
          <Card key={i} className="relative">
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold">
                  {testimonial.image}
                </div>
              </div>
              <div className="mb-4">
                <p className="italic text-muted-foreground">
                  "{testimonial.quote}"
                </p>
              </div>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
