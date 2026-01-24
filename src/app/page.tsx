import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { product, reviews } from "@/lib/data";
import { CheckCircle, Feather, HardDrive, Zap } from "lucide-react";
import ProductGallery from "@/components/product-gallery";
import CustomerReviews from "@/components/customer-reviews";
import AddToCartButton from "@/components/add-to-cart-button";

export default function Home() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
          <ProductGallery images={product.images} />

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
                {product.name}
              </h1>
              <p className="text-2xl font-semibold text-primary mt-2">
                ${product.price.toFixed(2)}
              </p>
              <p className="mt-4 text-muted-foreground">
                {product.description}
              </p>
            </div>

            <AddToCartButton product={product} />

            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Features</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Feather className="h-5 w-5 text-primary" />
                      <span>Lightweight and durable aluminum body</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <span>Energy-efficient LED with warm glow</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-primary" />
                      <span>Smart dimmer control compatible</span>
                    </li>
                     <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Easy to install with included kit</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Specifications</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-muted-foreground">
                    {product.specifications.map((spec) => (
                      <li key={spec.name}>
                        <strong>{spec.name}:</strong> {spec.value}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Free shipping on all orders. We offer a 30-day return policy for a full refund, no questions asked.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <CustomerReviews reviews={reviews} />
      </div>
    </div>
  );
}
