
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function NewsPage() {
  const newsItems = [
    {
      title: "WE ARE HIRING",
      date: "October 14, 2025",
      imageUrl: "https://picsum.photos/seed/hiring1/600/400",
      imageHint: "office job",
      description: null,
    },
    {
      title: "WE ARE HIRING",
      date: "October 14, 2025",
      imageUrl: "https://picsum.photos/seed/hiring2/600/400",
      imageHint: "team meeting",
      description: null,
    },
    {
      title: "WE ARE HIRING",
      date: "October 14, 2025",
      imageUrl: "https://picsum.photos/seed/hiring3/600/400",
      imageHint: "developer coding",
      description: null,
    },
    {
      title: "We Are Hiring",
      date: "September 25, 2025",
      imageUrl: "https://picsum.photos/seed/hiring4/600/400",
      imageHint: "resume application",
      description: "URGENT HIRING !!! THOSE WHO ARE INTERESTED, SEE DETAILS BELOW. OR SEND YOU'RE CV DIRECLTY TO; t.m.luzon.aircon@gmail.com OR CALL US @...",
    },
    {
      title: "We Are Hiring!",
      date: "September 25, 2025",
      imageUrl: "https://picsum.photos/seed/hiring5/600/400",
      imageHint: "job interview",
      description: "URGENT HIRING !!! THOSE WHO ARE INTERESTED, SEE DETAILS BELOW. OR SEND YOU'RE CV DIRECLTY TO; t.m.luzon.aircon@gmail.com OR CALL US @...",
    },
    {
      title: "Rainy Season Promo",
      date: "September 25, 2025",
      imageUrl: "https://picsum.photos/seed/rainy-promo-news/600/400",
      imageHint: "rainy day",
      description: (
        <>
          <p>TM Luzon Engineering Sales &amp; Services Company</p>
          <p className="flex items-start gap-2 mt-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
            <span>Prime Asiatique Commercial Center, Buhay Na Tubig Imus, Cavite</span>
          </p>
          <p className="mt-1 pl-6">046-5316307,046-4580686 /0923-593...</p>
        </>
      ),
    },
  ];

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
            News &amp; Updates
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Stay informed with our latest articles, announcements, and special offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <Card key={index} className="overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <div className="relative w-full h-48 bg-muted">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  data-ai-hint={item.imageHint}
                />
              </div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.date}</p>
                {item.description && (
                  <div className="text-sm text-muted-foreground mt-4 flex-grow">
                    {item.description}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
