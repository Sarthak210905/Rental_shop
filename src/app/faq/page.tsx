import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function FaqPage() {
  const faqs = [
    {
      question: "How does the rental process work?",
      answer: "Browse our collection, select your favorite dress, choose your rental dates, and place your order. We'll deliver the dress to you before your event. After the event, simply pack it in the provided return bag and send it back to us.",
    },
    {
      question: "What is the rental duration?",
      answer: "Our standard rental period is 4 days. You can also opt for an extended rental period for an additional fee. Your rental period starts on the day your dress is delivered.",
    },
    {
        question: "What if the dress doesn't fit?",
        answer: "We offer a 'Fit Guarantee'. If your dress doesn't fit, contact us immediately. We can offer an exchange for a different size if available, or a credit for a future rental."
    },
    {
        question: "What happens if I damage the dress?",
        answer: "Minor wear and tear are covered by our standard rental fee. For significant damage, repair fees may apply, as outlined in our Rental Policy."
    },
    {
        question: "How do I return the dress?",
        answer: "Returning is easy! Just place the dress in the pre-paid return packaging we provide and drop it off at your nearest courier location by the specified return date."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-4xl font-headline">Frequently Asked Questions</CardTitle>
                <CardDescription>Find answers to common questions about our rental service.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                        {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    </div>
  );
}
