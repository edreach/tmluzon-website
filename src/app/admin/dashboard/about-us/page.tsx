'use client';

import { useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SiteSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AboutUsSettingsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'admin/dashboard/settings/tmluzon') : null, [firestore]);
    const { data: siteSettings, isLoading } = useDoc<SiteSettings>(settingsRef);

    useEffect(() => {
        if (siteSettings?.aboutUsContent) {
            setContent(siteSettings.aboutUsContent);
        }
    }, [siteSettings]);

    const handleSave = () => {
        if (!settingsRef) return;
        setIsSaving(true);
        setDocumentNonBlocking(settingsRef, { aboutUsContent: content }, { merge: true });
        toast({ title: 'Content Saved', description: 'Your "About Us" page has been updated.' });
        setIsSaving(false);
    };
    
    if (isLoading) {
        return (
             <div>
                <h1 className="text-lg font-semibold md:text-2xl mb-6">About Us Page</h1>
                <Card>
                    <CardHeader>
                        <CardTitle><Skeleton className="h-8 w-64" /></CardTitle>
                        <CardDescription><Skeleton className="h-4 w-96" /></CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                             <Skeleton className="h-4 w-24" />
                             <Skeleton className="h-48 w-full" />
                        </div>
                        <Skeleton className="h-10 w-32" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center mb-6">
                <h1 className="text-lg font-semibold md:text-2xl">About Us Page</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Edit Page Content</CardTitle>
                    <CardDescription>
                        Update the content for your public "About Us" page. Simple HTML is supported.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="aboutUsContent">Page Content</Label>
                        <Textarea
                            id="aboutUsContent"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={15}
                            placeholder="Write about your company history, mission, and values here..."
                        />
                    </div>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Content'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
