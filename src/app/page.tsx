
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, ShieldCheck, Wrench } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { Product, Service, NewsArticleData } from '@/lib/types';
import { format } from 'date-fns';
import { getProducts, getServices, getNews } from '@/lib/data-server';

export default async function Home() {

  const [productListings, services, newsItems] = await Promise.all([
    getProducts({ limit: 8 }),
    getServices({ limit: 3 }),
    getNews({ limit: 3 })
  ]);

  const latestNews = newsItems?.[0];
  const secondNews = newsItems?.[1];
  const thirdNews = newsItems?.[2];

  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Best quality",
      description: "We are committed to providing the highest quality products and services to our customers.",
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: "Professional Installation",
      description: "Our team of certified technicians ensures your equipment is installed for peak performance and longevity.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Warranty",
      description: "All our products come with a one-year warranty, ensuring peace of mind.",
    },
  ]

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Comprehensive HVAC Solutions
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            From installation to maintenance and emergency repairs, we offer a complete range of services to keep your systems running efficiently.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {services?.map((service: Service) => (
            <Card key={service.id} className="overflow-hidden rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl flex flex-col">
              <div className="relative w-full h-48 bg-muted">
                <Image
                  src={service.imageUrls?.[0] || `https://picsum.photos/seed/${service.id}/600/400`}
                  alt={service.name}
                  fill
                  className="object-cover"
                  data-ai-hint="service technician"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold h-14">{service.name}</h3>
                <p className="text-muted-foreground text-sm h-24 overflow-hidden">
                  {service.description.split('.')[0]}. ...
                </p>
                <Button asChild className="w-full mt-auto">
                  <Link href={`/services/${service.id}`}>View Details</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" asChild>
            <Link href="/services">View All Services</Link>
          </Button>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why choose us?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            The benefits that will make you comfort
          </p>

          <div className="mt-16 grid grid-cols-1 gap-y-12 gap-x-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-lg font-medium">{feature.title}</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
              Featured Products
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Check out our top-of-the-line HVAC units, designed for maximum efficiency and reliability.
            </p>
          </div>
          <div className="mt-16">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent>
                  {productListings.map((product) => (
                    <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div className="p-1 h-full">
                        <Card className="overflow-hidden flex flex-col h-full">
                          <div className="relative w-full h-48 bg-muted">
                            <Image
                              src={product.imageUrls?.[0] || `https://picsum.photos/seed/${product.id}/400/400`}
                              alt={product.name}
                              fill
                              className="object-cover"
                              data-ai-hint="hvac unit"
                            />
                          </div>
                          <CardContent className="p-4 text-center flex flex-col flex-grow">
                            <h3 className="font-semibold text-sm h-10 truncate flex-grow" title={product.name}>{product.name}</h3>
                            <p className="text-xs text-muted-foreground uppercase">{product.subType}</p>
                            <Button asChild size="sm" className="mt-4">
                              <Link href={`/products/${product.id}`}>View Details</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 md:-left-12" />
              <CarouselNext className="-right-4 md:-right-12" />
            </Carousel>
          </div>
          <div className="mt-8 text-center">
            <Button size="lg" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>

        <div className="mt-24">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                    Latest News & Updates
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Stay informed about our company, new products, and special offers.
                </p>
            </div>
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                {latestNews ? (
                <Link href={`/news/${latestNews.id}`} className="lg:col-span-2 relative rounded-xl overflow-hidden shadow-lg h-[450px] group">
                    <Image src={latestNews.imageUrls?.[0] || "https://picsum.photos/seed/news1/1200/900"} alt={latestNews.title} fill className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-300" data-ai-hint={latestNews.imageHint || 'news article'} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="relative h-full flex flex-col justify-end p-8 md:p-12 text-white">
                        <h2 className="text-3xl md:text-4xl font-bold">{latestNews.title}</h2>
                        <p className="mt-2 text-sm text-white/80">{format(new Date(latestNews.date), 'MMMM d, yyyy')}</p>
                        <Button className="mt-4 w-fit">Read More</Button>
                    </div>
                </Link>
                ) : (
                    <div className="lg:col-span-2 relative rounded-xl overflow-hidden shadow-lg h-[450px] bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">No recent news.</p>
                    </div>
                )}


                {/* Right Column */}
                <div className="flex flex-col gap-8">
                    {secondNews ? (
                    <Link href={`/news/${secondNews.id}`} className="relative rounded-xl overflow-hidden shadow-lg flex-1 h-[209px] group">
                        <Image src={secondNews.imageUrls?.[0] || "https://picsum.photos/seed/news2/600/400"} alt={secondNews.title} fill className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-300" data-ai-hint={secondNews.imageHint || 'news article'} />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="relative h-full flex items-end p-6 text-white">
                            <h3 className="text-2xl font-bold">{secondNews.title}</h3>
                        </div>
                    </Link>
                    ) : (
                       <div className="relative rounded-xl overflow-hidden shadow-lg flex-1 h-[209px] bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">No other news.</p>
                        </div>
                    )}
                    {thirdNews ? (
                    <Link href={`/news/${thirdNews.id}`} className="relative rounded-xl overflow-hidden shadow-lg flex-1 h-[209px] group">
                        <Image src={thirdNews.imageUrls?.[0] || "https://picsum.photos/seed/news3/600/400"} alt={thirdNews.title} fill className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-300" data-ai-hint={thirdNews.imageHint || 'news article'} />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="relative h-full flex items-end p-6 text-white">
                            <h3 className="text-2xl font-bold">{thirdNews.title}</h3>
                        </div>
                    </Link>
                    ) : (
                      !secondNews &&  <div className="relative rounded-xl overflow-hidden shadow-lg flex-1 h-[209px] bg-muted" />
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

