

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
import { MoreHorizontal, UserPlus, Shield, ShieldOff, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCollection, useDoc, useFirestore, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking, useUser, useStorage, useAuth } from "@/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import type { UserProfile, AdminRole, SiteSettings } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from "firebase/storage";
import { Skeleton } from "@/components/ui/skeleton";
import { createUserWithEmailAndPassword } from "firebase/auth";


export default function SettingsPage() {
    const firestore = useFirestore();
    const storage = useStorage();
    const auth = useAuth();
    const { toast } = useToast();
    const { isUserLoading: isAuthLoading } = useUser();
    const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });

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

    const adminRoleIds = adminRoles?.map(role => role.id) || [];
    
    const handleToggleAdmin = (userToUpdate: UserProfile & { id: string }) => {
        if (!userToUpdate.uid || !firestore) return;
        const isAdmin = adminRoleIds.includes(userToUpdate.uid);
        const roleRef = doc(firestore, 'roles_admin', userToUpdate.uid);
        if (isAdmin) {
            deleteDocumentNonBlocking(roleRef);
            toast({ title: "Admin Removed", description: `${userToUpdate.name} is no longer an admin.` });
        } else {
            setDocumentNonBlocking(roleRef, { uid: userToUpdate.uid }, { merge: true });
            toast({ title: "Admin Added", description: `${userToUpdate.name} is now an admin.` });
        }
    };
    
    const handleAddUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please enter name, email, and password.' });
            return;
        }

        if (newUser.password.length < 6) {
            toast({ variant: 'destructive', title: 'Error', description: 'Password must be at least 6 characters.' });
            return;
        }
        
        if (!firestore || !auth) return;

        try {
            // This will sign in the new user and sign out the current admin.
            const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
            const authUser = userCredential.user;
            
            // Create the user profile in Firestore using the UID from Auth as the document ID.
            const userDocRef = doc(firestore, "users", authUser.uid);
            await setDoc(userDocRef, { 
                uid: authUser.uid,
                name: newUser.name, 
                email: newUser.email 
            });

            toast({ title: 'User Created', description: `${newUser.name} has been created.` });
            setNewUser({ name: '', email: '', password: '' });
            setAddUserDialogOpen(false);

            // Inform the admin that they've been signed out.
            toast({
                title: "You have been signed out.",
                description: "Please log back in with your admin credentials to continue.",
                duration: 9000,
                variant: 'destructive',
            });

        } catch (error: any) {
            console.error("Error creating user:", error);
            toast({ 
                variant: 'destructive', 
                title: 'User Creation Failed', 
                description: error.message || 'An unknown error occurred.' 
            });
        }
    };
    
    const handleDeleteUser = (userToDelete: UserProfile & { id: string }) => {
        if (!userToDelete.id || !userToDelete.uid || !firestore) return;
        
        deleteDocumentNonBlocking(doc(firestore, 'users', userToDelete.id));
        
        if(adminRoleIds.includes(userToDelete.uid)) {
            deleteDocumentNonBlocking(doc(firestore, 'roles_admin', userToDelete.uid));
        }

        toast({ title: 'User Deleted', description: `${userToDelete.name} has been removed.` });
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
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>
                                    Manage administrators and users for your dashboard.
                                </CardDescription>
                            </div>
                            <Dialog open={isAddUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
                                <DialogTrigger asChild>
                                     <Button>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Add User
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New User</DialogTitle>
                                        <DialogDescription>
                                            Enter the user's details. This will create their account in Firebase Authentication and sign you out. You will need to log back in.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">Name</Label>
                                            <Input id="name" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value })} className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="email" className="text-right">Email</Label>
                                            <Input id="email" type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value })} className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="password" className="text-right">Password</Label>
                                            <Input id="password" type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value })} className="col-span-3" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAddUser}>Save User</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">Loading users...</TableCell>
                                    </TableRow>
                                )}
                                {!isLoading && users?.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.uid && adminRoleIds.includes(user.uid) ? "Administrator" : "User"}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleToggleAdmin(user)}>
                                                        {user.uid && adminRoleIds.includes(user.uid) ? (
                                                            <><ShieldOff className="mr-2 h-4 w-4" />Remove Admin</>
                                                        ) : (
                                                            <><Shield className="mr-2 h-4 w-4" />Make Admin</>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!isLoading && !users?.length && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">No users found. Click "Add User" to start.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );

    
