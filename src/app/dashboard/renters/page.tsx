
'use client';

import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Renter } from "@/lib/types";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, Timestamp } from "firebase/firestore";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const statusVariant = {
    'active': 'secondary',
    'suspended': 'destructive',
    'deactivated': 'outline'
} as const;

export default function RentersPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const rentersCollection = useMemoFirebase(() => firestore ? collection(firestore, 'renters') : null, [firestore]);
  const { data: renters, isLoading } = useCollection<Renter>(rentersCollection);


  const handleViewProfile = (renterId: string) => {
    toast({
      title: `Viewing profile for ${renterId}`,
      description: "This feature is not yet implemented.",
    });
  };

  const handleToggleSuspend = (renter: Renter) => {
    if(!firestore) return;
    const renterRef = doc(firestore, 'renters', renter.id);
    const newStatus = renter.status === 'suspended' ? 'active' : 'suspended';
    
    updateDocumentNonBlocking(renterRef, { status: newStatus });
    
    toast({
      title: `Account ${newStatus}`,
      description: `Renter account has been ${newStatus}.`,
      variant: newStatus === 'suspended' ? 'destructive' : 'default',
    });
  };

  const handleDeactivate = (renterId: string) => {
    if(!firestore) return;
    const renterRef = doc(firestore, 'renters', renterId);
    updateDocumentNonBlocking(renterRef, { status: 'deactivated' });
    toast({
      title: `Account Deactivated`,
      description: "Renter account has been deactivated.",
      variant: 'destructive',
    });
  };

  const formatTimestamp = (timestamp: string | Timestamp) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Renter Management</CardTitle>
        <CardDescription>
          View renter profiles, current rental status, and rental history. Suspend or deactivate accounts if violations occur.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Avatar</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Join Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
                 <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">Loading renters...</TableCell>
                </TableRow>
            )}
            {!isLoading && renters?.map((renter) => {
              return (
                <TableRow key={renter.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{renter.firstName[0]}{renter.lastName[0]}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="font-medium">{renter.firstName} {renter.lastName}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[renter.status.toLowerCase() as keyof typeof statusVariant]}>{renter.status}</Badge>
                  </TableCell>
                   <TableCell className="hidden md:table-cell">{renter.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatTimestamp(renter.dateJoined)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewProfile(renter.id)}>View Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleSuspend(renter)}>
                          {renter.status === 'suspended' ? 'Unsuspend Account' : 'Suspend Account'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeactivate(renter.id)}>Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
             {!isLoading && renters?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">No renters found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
