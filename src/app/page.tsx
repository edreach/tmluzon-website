import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <Card className="relative h-[550px] w-full overflow-hidden rounded-lg shadow-lg">
              <Image
                src="https://picsum.photos/seed/promo-night/1200/800"
                alt="Rainy Season Promo"
                fill
                className="object-cover"
                data-ai-hint="night sky"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-8 text-white">
                <h2 className="text-4xl font-bold">Rainy Season Promo</h2>
                <p className="mt-2 text-lg">TM Luzon Engineering Sales & Services Company</p>
                <p className="text-sm">Prime Asiatique Commercial Center, Buhay Na Tubig I</p>
                <Button className="mt-4 w-fit">Read More</Button>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            <Card className="relative h-[260px] w-full overflow-hidden rounded-lg shadow-lg">
              <Image
                src="https://picsum.photos/seed/hiring-cactus/600/400"
                alt="We are hiring"
                fill
                className="object-cover"
                data-ai-hint="cactus needles"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 text-white">
                <h3 className="text-2xl font-bold">We Are Hiring</h3>
              </div>
            </Card>
            <Card className="relative h-[260px] w-full overflow-hidden rounded-lg shadow-lg">
              <Image
                src="https://picsum.photos/seed/hiring-grass/600/400"
                alt="We are hiring"
                fill
                className="object-cover"
                data-ai-hint="grass field"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 text-white">
                <h3 className="text-2xl font-bold">We Are Hiring!</h3>
              </div>
            </Card>
          </div>
        </div>

        {/* HVAC Section */}
        <section className="mt-16 md:mt-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Comprehensive HVAC Solutions
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            From installation to maintenance and emergency repairs, we offer a complete range of services to keep your systems running efficiently.
          </p>
        </section>
      </div>
    </div>
  );
}
