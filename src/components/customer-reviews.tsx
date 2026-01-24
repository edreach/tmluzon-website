"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Review } from "@/lib/types";

interface CustomerReviewsProps {
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

export default function CustomerReviews({ reviews }: CustomerReviewsProps) {
  return (
    <section className="mt-16 lg:mt-24">
      <h2 className="text-3xl font-bold tracking-tight text-center font-headline">
        What Our Customers Say
      </h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <Card key={review.id} className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={review.avatar.imageUrl} alt={review.author} data-ai-hint={review.avatar.imageHint} />
                  <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{review.author}</p>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
                <div className="ml-auto">
                    <StarRating rating={review.rating} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">{review.title}</h3>
              <p className="text-muted-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
