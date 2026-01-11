
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Renter } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const statusVariant = {
    'Active': 'secondary',
    'Suspended': 'destructive',
} as const;

export default function RentersPage() {
  const [renters, setRenters] = useState<Renter[]>([]);
  const { toast } = useToast();

  const handleViewProfile = (renterId: string) => {
    toast({
      title: `Viewing profile for ${renterId}`,
      description: "This feature is not yet implemented.",
    });
  };

  const handleToggleSuspend = (renterId: string) => {
    setRenters(currentRenters =>
      currentRenters.map(renter => {
        if (renter.id === renterId) {
          const newStatus = renter.status === 'Suspended' ? 'Active' : 'Suspended';
          toast({
            title: `Account ${newStatus}`,
            description: `Renter ${renter.name}'s account has been ${newStatus.toLowerCase()}.`,
            variant: newStatus === 'Suspended' ? 'destructive' : 'default',
          });
          return { ...renter, status: newStatus };
        }
        return renter;
      })
    );
  };

  const handleDeactivate = (renterId: string) => {
    toast({
      title: `Deactivating ${renterId}`,
      description: "This is a placeholder. A real app would deactivate the account.",
      variant: 'destructive',
    });
  };

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
              <TableHead className="hidden md:table-cell">Rental Status</TableHead>
              <TableHead className="hidden md:table-cell">Join Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renters.map((renter) => {
              const avatar = PlaceHolderImages.find(p => p.id === renter.avatar);
              return (
                <TableRow key={renter.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Avatar className="h-9 w-9">
                      {avatar && <AvatarImage src={avatar.imageUrl} alt={renter.name} data-ai-hint={avatar.imageHint} />}
                      <AvatarFallback>{renter.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="font-medium">{renter.name}</div>
                    <div className="text-sm text-muted-foreground md:hidden">{renter.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[renter.status]}>{renter.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{renter.rentalStatus}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(renter.joinDate).toLocaleDateString()}
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
                        <DropdownMenuItem onClick={() => handleToggleSuspend(renter.id)}>
                          {renter.status === 'Suspended' ? 'Unsuspend Account' : 'Suspend Account'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeactivate(renter.id)}>Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
             {renters.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">Data is not available at this time.</TableCell>
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
