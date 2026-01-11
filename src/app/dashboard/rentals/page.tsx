
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
  CardFooter
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
import { Rental } from "@/lib/types";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const statusVariant = {
    'Active': 'default',
    'Completed': 'secondary',
    'Overdue': 'destructive',
} as const;

export default function RentalsPage() {
  const { toast } = useToast();
  const [rentals, setRentals] = useState<Rental[]>([]);

  const handleViewDetails = (rentalId: string) => {
    toast({
      title: `Viewing Details for ${rentalId}`,
      description: "This feature is not yet implemented.",
    });
  };

  const handleForceTermination = (rentalId: string) => {
    toast({
      title: `Force Terminating ${rentalId}`,
      description: "This would terminate the rental in a real application.",
      variant: "destructive",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rental Monitoring</CardTitle>
        <CardDescription>
          Monitor all active and completed rentals, rental duration, and computed rental fees.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rental ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Renter</TableHead>
              <TableHead className="hidden md:table-cell">Bike ID</TableHead>
              <TableHead className="hidden md:table-cell">Start Time</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentals.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell className="font-medium">{rental.id}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[rental.status]}>{rental.status}</Badge>
                </TableCell>
                <TableCell>{rental.renterName}</TableCell>
                <TableCell className="hidden md:table-cell">{rental.bikeId}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(rental.startTime).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">₱{rental.fee.toFixed(2)}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleViewDetails(rental.id)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleForceTermination(rental.id)}>Force Termination</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
             {rentals.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">Data is not available at this time.</TableCell>
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
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
