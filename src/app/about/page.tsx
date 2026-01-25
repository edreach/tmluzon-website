'use client';

import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { SiteSettings, AboutUsContent, Brand } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';

const defaultContent: AboutUsContent = {
  intro_p1:
    'We as a young and dynamic company established on January 2015. We as an Air-conditioning company, which currently compose of Professional Mechanical Engineer; it has 20 employees, including office staff, service technicians, and Service Engineer and has the experience and expertise to successfully complete all types of residential, commercial and industrial projects.',
  intro_p2:
    "Tedhard Luzon, as the President, is responsible for the overall performance of the company Sales and Services, with his past experience and credentials from Concepcion Industries Inc., He maintains T. M. Luzon's reputation for quality maintenance and service programs. Currently, the Service Company operates a team of 10 experienced service technicians to service and maintain not only the company's purpose in areas of air conditioning installation and services.",
  intro_p3:
    'The Company operates at Stall 1 Prime Asiatique Commercial Center, Buhay Na Tubig, Imus City, Province of Cavite, Philippines 4103. Our business size means that we have the capacity to efficiently deal with large volumes of work. Particularly during peak periods, whilst still maintaining an excellent level of customer experience where our clients personalized requirements are met.',
  overview_p1:
    'We specialize in the supply, installation, and maintenance of high-quality air-conditioning systems for residential, commercial, and industrial clients. Our goal is to provide energy-efficient, cost-effective cooling solutions tailored to meet the unique needs of every customer.',
  service_consultation:
    'We begin with a detailed on-site evaluation to understand your cooling requirements, building layout, and budget. Our experts will recommend the best air-conditioning system to ensure optimal performance and efficiency.',
  service_supply:
    'We supply a wide range of reliable, high-performance air-conditioning units from leading brands such as Daikin, LG, Samsung, Mitsubishi Electric, Carrier, and more. Options include:',
  service_supply_list:
    'Split systems\nDucted systems\nVRF/VRV systems\nWindow units\nPortable AC units',
  service_installation:
    'Our certified technicians carry out all installations to the highest industry standards, ensuring safety, performance, and compliance with all local regulations. We handle electrical connections, ductwork, piping, and mounting with precision.',
  service_maintenance:
    'We offer ongoing maintenance contracts to ensure your system runs efficiently all year round. We also provide fast and reliable repair services for all major AC brands.',
  statement_purpose:
    'To be one of the best in the Mechanical Industry that provides Installation, Repair & Services, relationship and profitability for our clients and the company itself.',
  statement_vision:
    'To provide Excellent Services through our experience and capabilities and maintains an excellent level of Customer Service Satisfactory, where our clients personalized requirements are met.',
  statement_mission:
    'To build long term relationships with our customers and clients and provide exceptional customer services by pursuing business through innovative services with advanced technology for the industry.',
};

export default function AboutPage() {
  const firestore = useFirestore();
  
  const settingsRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'admin/dashboard/settings/tmluzon') : null),
    [firestore]
  );
  const { data: siteSettings, isLoading: isLoadingSettings } = useDoc<SiteSettings>(settingsRef);
  
  const brandsQuery = useMemoFirebase(
      () => (firestore ? collection(firestore, 'brands') : null),
      [firestore]
  );
  const { data: brands, isLoading: isLoadingBrands } = useCollection<Brand>(brandsQuery);

  const content = siteSettings?.aboutUsContent || defaultContent;
  const isLoading = isLoadingSettings || isLoadingBrands;


  if (isLoading) {
      return (
        <div className="bg-background text-foreground">
          <div className="container mx-auto px-4 py-16 sm:py-24 max-w-5xl">
            <div className="max-w-4xl mx-auto text-center">
                <Skeleton className="h-12 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
                <div className="mt-8 space-y-6 text-left">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
            <Separator className="my-16" />
             <div className="max-w-4xl mx-auto text-left">
                <Skeleton className="h-40 w-full" />
             </div>
          </div>
        </div>
      )
  }

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24 max-w-5xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
            T.M. LUZON ENGINEERING SALES & SERVICES COMPANY
          </h1>
          <p className="mt-2 text-md text-muted-foreground">
            (also Known as T.M. Luzon Airconditioning & Refrigeration Repair & Services)
          </p>
          <div className="mt-8 space-y-6 text-muted-foreground text-lg text-left">
            <p>{content.intro_p1}</p>
            <p>{content.intro_p2}</p>
            <p>{content.intro_p3}</p>
          </div>
        </div>

        <Separator className="my-16" />

        <div className="max-w-4xl mx-auto text-left">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
              Overview
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">{content.overview_p1}</p>

          <h3 className="text-2xl font-bold tracking-tight mt-12 mb-6 text-foreground">
            Our Services Include:
          </h3>

          <div className="space-y-8 text-lg">
            <div>
              <h4 className="font-bold text-xl text-foreground">-Consultation and Site Assessment</h4>
              <p className="mt-2 text-muted-foreground">{content.service_consultation}</p>
            </div>
            <div>
              <h4 className="font-bold text-xl text-foreground">-Air-Conditioner Supply</h4>
              <p className="mt-2 text-muted-foreground">{content.service_supply}</p>
              <ul className="list-disc list-inside mt-4 pl-4 text-muted-foreground space-y-2">
                {content.service_supply_list.split('\n').map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xl text-foreground">-Professional Installation</h4>
              <p className="mt-2 text-muted-foreground">{content.service_installation}</p>
            </div>
            <div>
              <h4 className="font-bold text-xl text-foreground">-Maintenance & Repairs</h4>
              <p className="mt-2 text-muted-foreground">{content.service_maintenance}</p>
            </div>
          </div>
        </div>

        <Separator className="my-16" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-8">Our Company Statement</h2>
            <div className="space-y-6 text-muted-foreground text-lg">
              <div>
                <h4 className="text-xl font-bold text-foreground">Purpose:</h4>
                <p>{content.statement_purpose}</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground">Vision:</h4>
                <p>{content.statement_vision}</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground">Mission Statement:</h4>
                <p>{content.statement_mission}</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/30 p-8 rounded-lg">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Brands</h2>
            <p className="text-muted-foreground text-lg mb-8">We work with the best brands.</p>
            <div className="grid grid-cols-3 gap-4">
              {brands?.map((brand) => (
                <div key={brand.id}>
                  {brand.websiteUrl ? (
                    <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className="block relative aspect-[3/2] bg-background rounded-lg flex items-center justify-center p-2 shadow-sm hover:shadow-md transition-shadow">
                      <Image src={brand.logoUrl} alt={brand.name} fill className="object-contain p-2" data-ai-hint={brand.imageHint} />
                    </a>
                  ) : (
                    <div className="relative aspect-[3/2] bg-background rounded-lg flex items-center justify-center p-2 shadow-sm">
                      <Image src={brand.logoUrl} alt={brand.name} fill className="object-contain p-2" data-ai-hint={brand.imageHint} />
                    </div>
                  )}
                </div>
              ))}
              {!brands?.length && !isLoading && (
                  <p className="col-span-3 text-center text-muted-foreground">No brands have been added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
