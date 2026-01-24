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
import { useCollection, useDoc, useFirestore, useStorage, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
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
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";


export default function SettingsPage() {
    const firestore = useFirestore();
    const storage = useStorage();
    const { toast } = useToast();
    const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '' });

    // Logo state
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch site settings
    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'admin/dashboard/settings/tmluzon') : null, [firestore]);
    const { data: siteSettings } = useDoc<SiteSettings>(settingsRef);

    const usersQuery = useMemoFirebase(
        () => firestore ? collection(firestore, 'users') : null, 
        [firestore]
    );
    const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersQuery);
    
    const adminRolesQuery = useMemoFirebase(
        () => firestore ? collection(firestore, 'roles_admin') : null, 
        [firestore]
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
            setDocumentNonBlocking(roleRef, { uid: userToUpdate.uid }, {});
            toast({ title: "Admin Added", description: `${userToUpdate.name} is now an admin.` });
        }
    };
    
    const handleAddUser = () => {
        if (!newUser.name || !newUser.email) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please enter name and email.' });
            return;
        }
        
        if (!firestore) return;

        const newUserRef = doc(collection(firestore, "users"));
        const newUserId = newUserRef.id;
        setDocumentNonBlocking(newUserRef, { ...newUser, uid: newUserId }, { merge: true });

        toast({ title: 'User Added', description: `${newUser.name} has been added.` });
        setNewUser({ name: '', email: '' });
        setAddUserDialogOpen(false);
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
        }
    };

    const handleUploadLogo = () => {
        if (!logoFile || !storage || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a file to upload.' });
            return;
        }

        setIsUploading(true);
        const storageRef = ref(storage, `logos/site_logo`);
        const uploadTask = uploadBytesResumable(storageRef, logoFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload failed:", error);
                toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
                setIsUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const settingsDocRef = doc(firestore, 'admin/dashboard/settings/tmluzon');
                    setDocumentNonBlocking(settingsDocRef, { logoUrl: downloadURL }, { merge: true });
                    toast({ title: 'Logo Updated!', description: 'Your new site logo has been saved.' });
                    setIsUploading(false);
                    setLogoFile(null);
                    setUploadProgress(0);
                });
            }
        );
    };

    const isLoading = isLoadingUsers || isLoadingAdminRoles;

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
                        {siteSettings?.logoUrl && (
                            <div>
                                <Label>Current Logo</Label>
                                <div className="mt-2 relative w-40 h-16 bg-muted rounded-md flex items-center justify-center border">
                                    <Image src={siteSettings.logoUrl} alt="Site Logo" fill style={{objectFit: "contain"}} className="p-2" />
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <Label htmlFor="logo-upload" className="sr-only">Upload logo</Label>
                            <Input id="logo-upload" type="file" className="flex-1" onChange={handleFileSelect} disabled={isUploading} accept="image/png, image/jpeg, image/svg+xml" />
                            <Button onClick={handleUploadLogo} disabled={isUploading || !logoFile}>
                                {isUploading ? `Uploading... ${uploadProgress.toFixed(0)}%` : 'Upload'}
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
                                            Enter the user's details. This will only create a record in the database. You must create the actual user account in the Firebase Authentication console.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">Name</Label>
                                            <Input id="name" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value })} className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="email" className="text-right">Email</Label>
                                            <Input id="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value })} className="col-span-3" />
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
}
