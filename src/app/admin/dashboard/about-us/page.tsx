'use client';

import { useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SiteSettings, AboutUsContent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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


export default function AboutUsSettingsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [content, setContent] = useState<AboutUsContent>(defaultContent);
    const [isSaving, setIsSaving] = useState(false);

    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'admin/dashboard/settings/tmluzon') : null, [firestore]);
    const { data: siteSettings, isLoading } = useDoc<SiteSettings>(settingsRef);

    useEffect(() => {
        if (siteSettings?.aboutUsContent) {
            setContent(siteSettings.aboutUsContent);
        }
    }, [siteSettings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent(prev => ({...prev, [name]: value}));
    }

    const handleSave = () => {
        if (!settingsRef) return;
        setIsSaving(true);
        setDocumentNonBlocking(settingsRef, { aboutUsContent: content }, { merge: true });
        toast({ title: 'Content Saved', description: 'Your "About Us" page has been updated.' });
        setIsSaving(false);
    };
    
    if (isLoading) {
        return (
             <div className='space-y-6'>
                <div className="flex items-center mb-6">
                    <h1 className="text-lg font-semibold md:text-2xl">About Us Page</h1>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle><Skeleton className="h-8 w-64" /></CardTitle>
                        <CardDescription><Skeleton className="h-4 w-96" /></CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <Skeleton className="h-48 w-full" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle><Skeleton className="h-8 w-64" /></CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className='space-y-6'>
            <div className="flex items-center mb-6">
                <h1 className="text-lg font-semibold md:text-2xl">About Us Page</h1>
                 <Button onClick={handleSave} disabled={isSaving} className='ml-auto'>
                    {isSaving ? 'Saving...' : 'Save Content'}
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Company Introduction</CardTitle>
                    <CardDescription>The main introduction at the top of the page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="intro_p1">Introduction Paragraph 1</Label>
                        <Textarea id="intro_p1" name="intro_p1" value={content.intro_p1} onChange={handleInputChange} rows={5} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="intro_p2">Introduction Paragraph 2</Label>
                        <Textarea id="intro_p2" name="intro_p2" value={content.intro_p2} onChange={handleInputChange} rows={5} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="intro_p3">Introduction Paragraph 3</Label>
                        <Textarea id="intro_p3" name="intro_p3" value={content.intro_p3} onChange={handleInputChange} rows={5} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Overview and Services</CardTitle>
                    <CardDescription>The content for the services section.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="overview_p1">Overview Paragraph</Label>
                        <Textarea id="overview_p1" name="overview_p1" value={content.overview_p1} onChange={handleInputChange} rows={4} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="service_consultation">Consultation Description</Label>
                        <Textarea id="service_consultation" name="service_consultation" value={content.service_consultation} onChange={handleInputChange} rows={3} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="service_supply">Supply Description</Label>
                        <Textarea id="service_supply" name="service_supply" value={content.service_supply} onChange={handleInputChange} rows={3} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="service_supply_list">Supply List (one item per line)</Label>
                        <Textarea id="service_supply_list" name="service_supply_list" value={content.service_supply_list} onChange={handleInputChange} rows={6} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="service_installation">Installation Description</Label>
                        <Textarea id="service_installation" name="service_installation" value={content.service_installation} onChange={handleInputChange} rows={3} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="service_maintenance">Maintenance Description</Label>
                        <Textarea id="service_maintenance" name="service_maintenance" value={content.service_maintenance} onChange={handleInputChange} rows={3} />
                    </div>
                </CardContent>
            </Card>
            
             <Card>
                <CardHeader>
                    <CardTitle>Company Statement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="statement_purpose">Purpose</Label>
                        <Textarea id="statement_purpose" name="statement_purpose" value={content.statement_purpose} onChange={handleInputChange} rows={3} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="statement_vision">Vision</Label>
                        <Textarea id="statement_vision" name="statement_vision" value={content.statement_vision} onChange={handleInputChange} rows={3} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="statement_mission">Mission Statement</Label>
                        <Textarea id="statement_mission" name="statement_mission" value={content.statement_mission} onChange={handleInputChange} rows={3} />
                    </div>
                </CardContent>
            </Card>
            
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Content'}
            </Button>
        </div>
    );
}
