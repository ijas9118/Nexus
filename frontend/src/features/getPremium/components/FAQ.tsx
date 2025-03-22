import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/molecules/accordion";

const FAQ = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            What's included in the premium membership?
          </AccordionTrigger>
          <AccordionContent>
            Premium membership includes access to all premium blogs across all
            squads, the ability to join premium-only squads, and the option to
            book mentorship sessions with industry experts. Yearly subscribers
            also get 2 free mentorship sessions and discounts on additional
            sessions.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            How do I redeem my free mentorship sessions?
          </AccordionTrigger>
          <AccordionContent>
            After subscribing to the yearly plan, you'll receive two mentorship
            credits in your account. You can use these credits when booking
            sessions with any available mentor on the platform. Simply select
            "Use mentorship credit" during the booking process.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I cancel my subscription?</AccordionTrigger>
          <AccordionContent>
            Yes, you can cancel your subscription at any time. If you cancel,
            you'll continue to have premium access until the end of your current
            billing period. For yearly subscriptions, we do not offer prorated
            refunds for unused time.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            What happens to my free mentorship sessions if I cancel?
          </AccordionTrigger>
          <AccordionContent>
            Any unused mentorship credits will remain valid until the end of
            your subscription period. We recommend using your credits before
            canceling your subscription.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            Can I upgrade from monthly to yearly?
          </AccordionTrigger>
          <AccordionContent>
            Yes, you can upgrade from a monthly to a yearly subscription at any
            time. When you upgrade, you'll be charged the yearly rate, and your
            subscription will be extended accordingly. You'll also immediately
            receive your two free mentorship session credits.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQ;
