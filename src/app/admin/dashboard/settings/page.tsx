

"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCollection, useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking, useUser, useStorage } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { UserProfile, AdminRole, SiteSettings } from "@/lib/types";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from "firebase/storage";
import { Skeleton } from "@/components/ui/skeleton";


export default function SettingsPage() {
    const firestore = useFirestore();
    const storage = useStorage();
    const { toast } = useToast();
    const { user: currentUser, isUserLoading: isAuthLoading } = useUser();

    // Logo state
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch site settings
    const settingsRef = useMemoFirebase(() => (firestore && !isAuthLoading) ? doc(firestore, 'admin/dashboard/settings/tmluzon') : null, [firestore, isAuthLoading]);
    const { data: siteSettings, isLoading: isLoadingSettings } = useDoc<SiteSettings>(settingsRef);

    const usersQuery = useMemoFirebase(
        () => (firestore && !isAuthLoading) ? collection(firestore, 'users') : null, 
        [firestore, isAuthLoading]
    );
    const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersQuery);
    
    const adminRolesQuery = useMemoFirebase(
        () => (firestore && !isAuthLoading) ? collection(firestore, 'roles_admin') : null, 
        [firestore, isAuthLoading]
    );
    const { data: adminRoles, isLoading: isLoadingAdminRoles } = useCollection<AdminRole>(adminRolesQuery);

    const adminUsers = useMemo(() => {
        if (!users || !adminRoles) return [];
        const adminIds = new Set(adminRoles.map(role => role.id));
        return users.filter(user => user.uid && adminIds.has(user.uid));
    }, [users, adminRoles]);
    
    const handleDeleteUser = (userToDelete: UserProfile & { id: string }) => {
        if (currentUser?.uid === userToDelete.uid) {
            toast({ title: 'Action not allowed', description: 'You cannot delete your own account.', variant: 'destructive'});
            return;
        }

        if (!userToDelete.id || !userToDelete.uid || !firestore) return;
        
        deleteDocumentNonBlocking(doc(firestore, 'users', userToDelete.id));
        deleteDocumentNonBlocking(doc(firestore, 'roles_admin', userToDelete.uid));

        toast({ title: 'Administrator Deleted', description: `${userToDelete.name} has been removed.` });
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogoFile(e.target.files[0]);
        } else {
            setLogoFile(null);
        }
    };

    const handleUploadLogo = () => {
        if (!logoFile || !storage || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a file to upload.' });
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        console.log("Starting upload for:", logoFile.name);

        const sRef = storageRef(storage, `logos/${Date.now()}-${logoFile.name}`);
        const uploadTask = uploadBytesResumable(sRef, logoFile);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done. State: ${snapshot.state}`);
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload failed with error:", error);
                toast({ 
                    variant: 'destructive', 
                    title: 'Upload Failed', 
                    description: `Storage permission error. Please check your Firebase Storage rules in the console. Details: ${error.message}` 
                });
                setIsUploading(false);
                setUploadProgress(0);
            },
            () => {
                console.log("Upload complete. Getting download URL...");
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("Download URL obtained:", downloadURL);
                    const settingsDocRef = doc(firestore, 'admin/dashboard/settings/tmluzon');
                    setDocumentNonBlocking(settingsDocRef, { logoUrl: downloadURL }, { merge: true });

                    toast({ title: 'Logo Updated!', description: 'Your new site logo has been saved.' });
                    
                    setIsUploading(false);
                    setLogoFile(null);
                    // Hide progress bar after a delay
                    setTimeout(() => setUploadProgress(0), 2000);
                });
            }
        );
    };

    const isLoading = isAuthLoading || isLoadingUsers || isLoadingAdminRoles || isLoadingSettings;

    return (
        <>
            <div className="flex items-center mb-6">
                <h1 className="text-lg font-semibold md:text-2xl">Site Settings</h1>
            </div>
            <div className="grid gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Logo</CardTitle>
                        <CardDescription>
                            Update your site logo. The image should be in PNG, JPG, or SVG format.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(isLoading) && <Skeleton className="h-16 w-40" />}
                        {!isLoading && siteSettings?.logoUrl && (
                            <div>
                                <Label>Current Logo</Label>
                                <div className="mt-2 relative w-40 h-16 bg-muted rounded-md flex items-center justify-center border">
                                    <Image src={siteSettings.logoUrl} alt="Site Logo" fill style={{objectFit: "contain"}} className="p-2" />
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <Label htmlFor="logo-upload" className="sr-only">Upload logo</Label>
                            <Input id="logo-upload" type="file" className="flex-1" onChange={handleFileSelect} disabled={isUploading} accept="image/*" />
                            <Button onClick={handleUploadLogo} disabled={isUploading || !logoFile}>
                                {isUploading ? `Uploading...` : 'Upload'}
                            </Button>
                        </div>
                        {isUploading && <Progress value={uploadProgress} className="w-full" />}
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Administrator Management</CardTitle>
                        <CardDescription>
                            Administrators are managed via their Google accounts. To add a new admin, have them sign in to the dashboard once. Then, their account will appear here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">Loading users...</TableCell>
                                    </TableRow>
                                )}
                                {!isLoading && adminUsers?.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" disabled={currentUser?.uid === user.uid}>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!isLoading && !adminUsers?.length && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">No administrators found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
