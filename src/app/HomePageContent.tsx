
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, HandPlatter, Sparkles, ShoppingBag, Repeat } from "lucide-react";
import DressCard from "@/components/DressCard";
import { Product, Dress, Jewelry } from "@/lib/mock-data";
import { getProducts, getDresses, getJewelry } from "@/lib/services/productService";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HomePageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [jewelry, setJewelry] = useState<Jewelry[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const heroTitleRef = useRef(null);
  const heroParaRef = useRef(null);
  const heroButtonRef = useRef(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [productsData, dressesData, jewelryData] = await Promise.all([
        getProducts(),
        getDresses(),
        getJewelry(),
      ]);
      setProducts(productsData);
      setDresses(dressesData);
      setJewelry(jewelryData);
      setLoading(false);
    }
    fetchData();
  }, []);
  
  const dressStyles = useMemo(() => Array.from(new Set(dresses.map(d => d.style))), [dresses]);
  
  useEffect(() => {
    if(dressStyles.length > 0) {
        setSelectedStyles(dressStyles);
    }
  }, [dressStyles]);

  useEffect(() => {
    if (loading) return;

    // Hero animation
    gsap.fromTo(heroTitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(heroParaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 });
    gsap.fromTo(heroButtonRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.4 });
    
    // Section animations on scroll
    sectionRefs.current.forEach((el) => {
      if (el) {
        gsap.fromTo(el, 
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    });

  }, [loading]);


  const handleStyleFilterChange = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  };

  const filteredDresses = useMemo(() => {
    if (loading) return [];
    return products.filter((product) => {
      const searchTermMatch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const styleMatch =
        selectedStyles.length === 0 || ('style' in product && selectedStyles.includes(product.style));
        
      const typeMatch = 'type' in product; // Only show dresses on home page for now

      return searchTermMatch && (styleMatch && !typeMatch);
    });
  }, [searchTerm, selectedStyles, products, loading]);

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
            </div>
        ))}
    </div>
  );
  
  const howItWorksSteps = [
    { icon: Sparkles, title: "1. Discover", description: "Explore our curated collection of stunning ethnic wear." },
    { icon: HandPlatter, title: "2. Book", description: "Select your dates, book your outfit, and we'll handle the rest." },
    { icon: ShoppingBag, title: "3. Wear It", description: "Look fabulous at your event with a professionally cleaned, perfect-fit dress." },
    { icon: Repeat, title: "4. Return", description: "Simply use the pre-paid packaging to return the dress after your event." }
  ];

  const featuredCategories = [
    { name: "Chaniya Choli", href: "/#inventory", imageUrl: "https://placehold.co/400x500", hint: "chaniya choli" },
    { name: "Lehengas", href: "/#inventory", imageUrl: "https://placehold.co/400x500", hint: "lehenga" },
    { name: "Jewelry", href: "/jewelry", imageUrl: "https://placehold.co/400x500", hint: "jewelry" },
  ];

  return (
    <>
       <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
        <Image
            src="/herobg (1).png"
            alt="Hero background"
            fill
            priority
            className="absolute inset-0 z-0 object-cover"
            data-ai-hint="women dancing in traditional indian dresses"
        />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 container mx-auto px-4">
            <h1 ref={heroTitleRef} className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold drop-shadow-lg">
                Rent the Look, Own the Moment
            </h1>
            <p ref={heroParaRef} className="max-w-[600px] mx-auto mt-4 text-lg md:text-xl text-white/90 drop-shadow-md">
                Unlock an endless wardrobe of designer ethnic wear. Perfect for weddings, festivals, and any special occasion.
            </p>
            <div ref={heroButtonRef}>
              <Button asChild size="lg" className="mt-8">
                  <Link href="#inventory">Browse Collection</Link>
              </Button>
            </div>
        </div>
      </section>


      <section id="how-it-works" ref={el => sectionRefs.current[0] = el} className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
               <div className="text-center mb-12">
                  <h2 className="text-4xl font-headline font-bold text-foreground">How It Works</h2>
                  <p className="text-muted-foreground mt-2">A simple, seamless rental experience.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {howItWorksSteps.map((step, index) => (
                    <Card key={index} className="text-center p-6 border-2 border-transparent hover:border-primary hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-center mb-4">
                            <div className="bg-primary/10 text-primary p-4 rounded-full">
                                <step.icon className="w-8 h-8" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold font-headline">{step.title}</h3>
                        <p className="text-muted-foreground mt-2">{step.description}</p>
                    </Card>
                ))}
              </div>
          </div>
      </section>
      
       <section id="featured-categories" ref={el => sectionRefs.current[1] = el} className="py-16 md:py-24">
          <div className="container mx-auto px-4">
               <div className="text-center mb-12">
                  <h2 className="text-4xl font-headline font-bold text-foreground">Featured Categories</h2>
                  <p className="text-muted-foreground mt-2">Explore our most popular collections.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredCategories.map((category) => (
                  <Link href={category.href} key={category.name}>
                    <Card className="relative group overflow-hidden rounded-lg">
                      <Image 
                        src={category.imageUrl}
                        alt={category.name}
                        width={400}
                        height={500}
                        className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                        data-ai-hint={category.hint}
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-3xl font-headline font-bold text-white drop-shadow-lg">{category.name}</h3>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
          </div>
      </section>

      <section id="inventory" className="py-12 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-headline font-bold text-foreground">
              Our Dress Collection
            </h2>
            <p className="text-muted-foreground mt-2">
              Discover our exquisite range of dresses for your next event.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for 'Chaniya Choli'..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Style</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {dressStyles.map(style => (
                  <DropdownMenuCheckboxItem
                    key={style}
                    checked={selectedStyles.includes(style)}
                    onCheckedChange={() => handleStyleFilterChange(style)}
                  >
                    {style}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {loading ? renderSkeletons() : (
            <>
              {filteredDresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredDresses.map((dress) => (
                    <DressCard key={dress.id} dress={dress} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground">No dresses match your current filters.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

       <section id="why-choose-us" ref={el => sectionRefs.current[2] = el} className="py-16 md:py-24">
        <div className="container mx-auto px-4">
           <div className="text-center mb-12">
              <h2 className="text-4xl font-headline font-bold text-foreground">Why Prency Hangers?</h2>
              <p className="text-muted-foreground mt-2">Experience the difference.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex items-start gap-4">
              <Sparkles className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold">Quality Assured</h3>
                <p className="text-muted-foreground mt-1">Every outfit is dry-cleaned, sanitized, and meticulously inspected before delivery.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <HandPlatter className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold">Unique Designs</h3>
                <p className="text-muted-foreground mt-1">Access a curated wardrobe of designer pieces you won't find anywhere else.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <ShoppingBag className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold">Smart & Sustainable</h3>
                <p className="text-muted-foreground mt-1">Look amazing while promoting sustainable fashion. It's a win-win.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
