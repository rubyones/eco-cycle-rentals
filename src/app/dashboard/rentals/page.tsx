
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
import { Rental, Renter } from "@/lib/types";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, getDoc, Timestamp } from "firebase/firestore";

const statusVariant = {
    'active': 'default',
    'completed': 'secondary',
    'overdue': 'destructive',
} as const;

type RentalWithRenter = Rental & { renter?: Renter };


export default function RentalsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const rentalsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'rentals') : null, [firestore]);
  const { data: rentals, isLoading: isLoadingRentals } = useCollection<Rental>(rentalsCollection);

  const [rentalsWithRenters, setRentalsWithRenters] = useState<RentalWithRenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (rentals && firestore) {
      const fetchRenterDetails = async () => {
        setIsLoading(true);
        const rentalsWithRenterData = await Promise.all(
          rentals.map(async (rental) => {
            if (rental.renterId) {
              const renterRef = doc(firestore, "renters", rental.renterId);
              const renterSnap = await getDoc(renterRef);
              if (renterSnap.exists()) {
                return { ...rental, renter: { ...renterSnap.data(), id: renterSnap.id } as Renter };
              }
            }
            return rental;
          })
        );
        setRentalsWithRenters(rentalsWithRenterData);
        setIsLoading(false);
      };

      fetchRenterDetails();
    } else if(!isLoadingRentals) {
      setIsLoading(false);
    }
  }, [rentals, firestore, isLoadingRentals]);


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

  const formatTimestamp = (timestamp: string | Timestamp) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  }

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
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading rentals...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && rentalsWithRenters.map((rental) => (
              <TableRow key={rental.id}>
                <TableCell className="font-medium">{rental.id}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[rental.status.toLowerCase() as keyof typeof statusVariant]}>{rental.status}</Badge>
                </TableCell>
                <TableCell>{rental.renter ? `${rental.renter.firstName} ${rental.renter.lastName}` : 'Unknown'}</TableCell>
                <TableCell className="hidden md:table-cell">{rental.ebikeId}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatTimestamp(rental.startTime)}
                </TableCell>
                <TableCell className="text-right">₱{(rental.rentalFee || 0).toFixed(2)}</TableCell>
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
             {!isLoading && rentalsWithRenters.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">No rentals found.</TableCell>
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
