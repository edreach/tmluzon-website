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
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { UserProfile, AdminRole } from "@/lib/types";
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
import { setDocumentNonBlocking, deleteDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase/non-blocking-updates";


export default function SettingsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const { user, isUserLoading: isAuthLoading } = useUser();
    const [isAddUserDialogOpen, setAddUserDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '' });

    // 1. Check if the current user is an admin.
    const currentUserAdminRoleDoc = useMemoFirebase(
      () => (user ? doc(firestore, 'roles_admin', user.uid) : null),
      [firestore, user]
    );
    const { data: currentUserAdminRole, isLoading: isLoadingAdminRole } = useDoc<AdminRole>(currentUserAdminRoleDoc);
    const isCurrentUserAdmin = !!currentUserAdminRole;
    
    // 2. Only if the user is an admin, fetch the list of all users and all admin roles.
    const usersQuery = useMemoFirebase(
        () => (isCurrentUserAdmin ? collection(firestore, 'users') : null), 
        [firestore, isCurrentUserAdmin]
    );
    const { data: users, isLoading: isLoadingUsers } = useCollection<UserProfile>(usersQuery);
    
    const adminRolesQuery = useMemoFirebase(
        () => (isCurrentUserAdmin ? collection(firestore, 'roles_admin') : null), 
        [firestore, isCurrentUserAdmin]
    );
    const { data: adminRoles } = useCollection<AdminRole>(adminRolesQuery);

    const adminRoleIds = adminRoles?.map(role => role.id) || [];
    
    const handleToggleAdmin = (userToUpdate: UserProfile) => {
        if (!userToUpdate.uid) return;
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
    
    const handleAddUser = async () => {
        if (!newUser.name || !newUser.email) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please enter name and email.' });
            return;
        }

        try {
            const newUserId = `user_${Date.now()}`;
            // When adding a user via this form, we explicitly set the `id` field to be the same as `uid` for consistency
            // since `useCollection` adds the document ID as `id` on the returned object.
            await addDocumentNonBlocking(collection(firestore, 'users'), { ...newUser, uid: newUserId, id: newUserId });

            toast({ title: 'User Added', description: `${newUser.name} has been added.` });
            setNewUser({ name: '', email: '' });
            setAddUserDialogOpen(false);
            
        } catch (error) {
            console.error("Error adding user:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not add user.' });
        }
    };
    
    const handleDeleteUser = (userToDelete: UserProfile) => {
        if (!userToDelete.id) return;
        const userRef = doc(firestore, 'users', userToDelete.id);
        deleteDocumentNonBlocking(userRef);
        
        if(userToDelete.uid && adminRoleIds.includes(userToDelete.uid)) {
            const roleRef = doc(firestore, 'roles_admin', userToDelete.uid);
            deleteDocumentNonBlocking(roleRef);
        }

        toast({ title: 'User Deleted', description: `${userToDelete.name} has been removed.` });
    }

    const isLoading = isAuthLoading || isLoadingAdminRole;

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
                            Update your site logo. The image should be in PNG or SVG format. (Coming Soon)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="logo-upload" className="sr-only">Upload logo</Label>
                            <Input id="logo-upload" type="file" className="flex-1" disabled />
                            <Button disabled>Upload</Button>
                        </div>
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
                                     <Button disabled={!isCurrentUserAdmin}>
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
                                        <TableCell colSpan={4} className="text-center">Verifying permissions...</TableCell>
                                    </TableRow>
                                )}
                                {!isLoading && !isCurrentUserAdmin && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-destructive">
                                            You do not have permission to manage users.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!isLoading && isCurrentUserAdmin && (
                                    <>
                                        {isLoadingUsers && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center">Loading users...</TableCell>
                                            </TableRow>
                                        )}
                                        {users?.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{adminRoleIds.includes(user.uid) ? "Administrator" : "User"}</TableCell>
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
                                                                {adminRoleIds.includes(user.uid) ? (
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
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
