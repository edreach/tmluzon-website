"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import CartSheetContent from "./cart-sheet";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/pricelist", label: "Pricelist" },
  { href: "/about", label: "About Us" },
  { href: "/news", label: "News" },
];

export default function Header() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 text-foreground backdrop-blur-sm">
      <div className="container mx-auto px-4 grid grid-cols-[1fr_auto_1fr] h-16 items-center">
        
        {/* LEFT: Logo */}
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg">TM Luzon Logo</span>
          </Link>
        </div>
        
        {/* CENTERED: Desktop Navigation */}
        <nav className="hidden md:flex justify-center items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-primary whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT: Cart, Login, and Mobile Toggle */}
        <div className="flex items-center justify-end space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Open cart</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg text-foreground">
              <SheetHeader className="px-6">
                <SheetTitle>Shopping Cart</SheetTitle>
              </SheetHeader>
              <CartSheetContent />
            </SheetContent>
          </Sheet>
          
          <div className="hidden md:flex items-center gap-2">
            <Button asChild>
                <Link href="/admin">Login</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background text-foreground">
                    <SheetHeader>
                        <SheetTitle>
                            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                                <span className="font-bold text-lg">TM Luzon</span>
                            </Link>
                        </SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-4 mt-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-lg font-medium transition-colors hover:text-primary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-8 border-t border-border pt-4">
                        <Button asChild className="w-full">
                            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
