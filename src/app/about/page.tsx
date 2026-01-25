import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function AboutPage() {

  const brandLogos = [
    { src: "https://picsum.photos/seed/brand1/150/100", alt: "Brand 1", hint: "logo design"},
    { src: "https://picsum.photos/seed/brand2/150/100", alt: "Brand 2", hint: "logo design"},
    { src: "https://picsum.photos/seed/brand3/150/100", alt: "Brand 3", hint: "logo design"},
    { src: "https://picsum.photos/seed/brand4/150/100", alt: "Brand 4", hint: "logo design"},
    { src: "https://picsum.photos/seed/brand5/150/100", alt: "Brand 5", hint: "logo design"},
    { src: "https://picsum.photos/seed/brand6/150/100", alt: "Brand 6", hint: "logo design"},
    { src: "https://picsum.photos/seed/brand7/150/100", alt: "Brand 7", hint: "logo design"},
    { src: "https://picsum.photos/seed/brand8/150/100", alt: "Brand 8", hint: "logo design"},
    { src: "https://picsum.photos/seed/brand9/150/100", alt: "Brand 9", hint: "logo design"},
  ];

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
            Overview
          </h1>
        </div>

        <div className="max-w-4xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    T.M. LUZON ENGINEERING SALES & SERVICES COMPANY
                </h2>
                <p className="mt-4 text-md text-muted-foreground">
                    (also Known as T.M. Luzon Airconditioning & Refrigeration Repair & Services)
                </p>
            </div>

            <div className="mt-12 space-y-6 text-muted-foreground text-lg text-left">
                <p>
                    We as a young and dynamic company established on January 2015. We as an Air-conditioning company, which
                    currently compose of Professional Mechanical Engineer; it has 20 employees, including office staff, service
                    technicians, and Service Engineer and has the experience and expertise to successfully complete all types of
                    residential, commercial and industrial projects.
                </p>
                <p>
                    Tedhard Luzon, as the President, is responsible for the overall performance of the company Sales and Services, with
                    his past experience and credentials from Concepcion Industries Inc., He maintains T. M. Luzon's reputation for quality
                    maintenance and service programs. Currently, the Service Company operates a team of 10 experienced service
                    technicians to service and maintain not only the company's purpose in areas of air conditioning installation and
                    services.
                </p>
                <p>
                    The Company operates at Stall 1 Prime Asiatique Commercial Center, Buhay Na Tubig, Imus City, Province of Cavite,
                    Philippines 4103. Our business size means that we have the capacity to efficiently deal with large volumes of work.
                    Particularly during peak periods, whilst still maintaining an excellent level of customer experience where our clients
                    personalized requirements are met.
                </p>
            </div>
        </div>

        <Separator className="my-16" />
        
        <div className="max-w-4xl mx-auto text-left">
             <p className="text-lg text-muted-foreground">
                We specialize in the supply, installation, and maintenance of high-quality air-conditioning systems for residential, commercial, and industrial clients. Our goal is to provide energy-efficient, cost-effective cooling solutions tailored to meet the unique needs of every customer.
            </p>

            <h3 className="text-2xl font-bold tracking-tight mt-12 mb-6 text-foreground">Our Services Include:</h3>

            <div className="space-y-8 text-lg">
                <div>
                    <h4 className="font-bold text-xl text-foreground">-Consultation and Site Assessment</h4>
                    <p className="mt-2 text-muted-foreground">
                        We begin with a detailed on-site evaluation to understand your cooling requirements, building layout, and budget. Our experts will recommend the best air-conditioning system to ensure optimal performance and efficiency.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-xl text-foreground">-Air-Conditioner Supply</h4>
                    <p className="mt-2 text-muted-foreground">
                        We supply a wide range of reliable, high-performance air-conditioning units from leading brands such as Daikin, LG, Samsung, Mitsubishi Electric, Carrier, and more. Options include:
                    </p>
                    <ul className="list-disc list-inside mt-4 pl-4 text-muted-foreground space-y-2">
                        <li>Split systems</li>
                        <li>Ducted systems</li>
                        <li>VRF/VRV systems</li>
                        <li>Window units</li>
                        <li>Portable AC units</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-xl text-foreground">-Professional Installation</h4>
                    <p className="mt-2 text-muted-foreground">
                        Our certified technicians carry out all installations to the highest industry standards, ensuring safety, performance, and compliance with all local regulations. We handle electrical connections, ductwork, piping, and mounting with precision.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-xl text-foreground">-Maintenance & Repairs</h4>
                    <p className="mt-2 text-muted-foreground">
                        We offer ongoing maintenance contracts to ensure your system runs efficiently all year round. We also provide fast and reliable repair services for all major AC brands.
                    </p>
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
                        <p>To be one of the best in the Mechanical Industry that provides Installation, Repair & Services, relationship and profitability for our clients and the company itself.</p>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-foreground">Vision:</h4>
                        <p>To provide Excellent Services through our experience and capabilities and maintains an excellent level of Customer Service Satisfactory, where our clients personalized requirements are met.</p>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-foreground">Mission Statement:</h4>
                        <p>To build long term relationships with our customers and clients and provide exceptional customer services by pursuing business through innovative services with advanced technology for the industry.</p>
                    </div>
                </div>
            </div>
            <div className="bg-muted/30 p-8 rounded-lg">
                <h2 className="text-3xl font-bold tracking-tight mb-4">Our Brands</h2>
                <p className="text-muted-foreground text-lg mb-8">We work with the best brands.</p>
                <div className="grid grid-cols-3 gap-4">
                    {brandLogos.map((logo, index) => (
                        <div key={index} className="relative aspect-[3/2] bg-background rounded-lg flex items-center justify-center p-2 shadow-sm">
                            <Image src={logo.src} alt={logo.alt} fill className="object-contain p-2" data-ai-hint={logo.hint} />
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
