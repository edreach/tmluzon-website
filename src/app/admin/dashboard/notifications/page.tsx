'use client';

import { useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SiteSettings, NotificationSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

const defaultSettings: NotificationSettings = {
    recipients: [],
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: ''
};

export default function NotificationSettingsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
    const [isSaving, setIsSaving] = useState(false);
    
    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'admin/dashboard/settings/tmluzon') : null, [firestore]);
    const { data: siteSettings, isLoading } = useDoc<SiteSettings>(settingsRef);

    useEffect(() => {
        if (siteSettings?.notificationSettings) {
            setSettings(siteSettings.notificationSettings);
        }
    }, [siteSettings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'recipients') {
            setSettings(prev => ({...prev, recipients: value.split('\n').filter(email => email.trim() !== '')}));
        } else if (name === 'smtpPort') {
            setSettings(prev => ({ ...prev, [name]: Number(value) }));
        } else {
            setSettings(prev => ({...prev, [name]: value}));
        }
    }

    const handleSave = () => {
        if (!settingsRef) return;
        setIsSaving(true);
        setDocumentNonBlocking(settingsRef, { notificationSettings: settings }, { merge: true });
        toast({ title: 'Settings Saved', description: 'Your notification settings have been updated.' });
        setIsSaving(false);
    };

    if (isLoading) {
        return (
             <div className='space-y-6'>
                <div className="flex items-center mb-6">
                    <h1 className="text-lg font-semibold md:text-2xl">Notifications</h1>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle><Skeleton className="h-8 w-64" /></CardTitle>
                        <CardDescription><Skeleton className="h-4 w-96" /></CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <Skeleton className="h-48 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className='space-y-6'>
            <div className="flex items-center mb-6">
                <h1 className="text-lg font-semibold md:text-2xl">Notification Settings</h1>
                 <Button onClick={handleSave} disabled={isSaving} className='ml-auto'>
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Email Recipients</CardTitle>
                    <CardDescription>
                        Enter the email addresses that should receive a notification when a new inquiry is submitted. 
                        Place each email on a new line.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="recipients" className="sr-only">Recipients</Label>
                    <Textarea
                        id="recipients"
                        name="recipients"
                        value={settings.recipients?.join('\n') || ''}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="admin1@example.com&#10;admin2@example.com"
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>SMTP Server Configuration</CardTitle>
                    <CardDescription>
                        Configure the SMTP server that will be used to send notification emails. 
                        These credentials are stored securely.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="smtpHost">SMTP Host</Label>
                            <Input id="smtpHost" name="smtpHost" value={settings.smtpHost || ''} onChange={handleInputChange} placeholder="smtp.example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smtpPort">SMTP Port</Label>
                            <Input id="smtpPort" name="smtpPort" type="number" value={settings.smtpPort || ''} onChange={handleInputChange} placeholder="587" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="smtpUser">SMTP Username</Label>
                        <Input id="smtpUser" name="smtpUser" value={settings.smtpUser || ''} onChange={handleInputChange} placeholder="user@example.com" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="smtpPass">SMTP Password</Label>
                        <Input id="smtpPass" name="smtpPass" type="password" value={settings.smtpPass || ''} onChange={handleInputChange} placeholder="••••••••" />
                    </div>
                </CardContent>
            </Card>
            
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
        </div>
    );
}
