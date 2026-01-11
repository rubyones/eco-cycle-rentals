
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, Timestamp } from "firebase/firestore";
import { Payment, Renter } from "@/lib/types";
import { useEffect, useState } from "react";

const statusVariant = {
    'paid': 'secondary',
    'pending': 'default',
    'failed': 'destructive',
} as const;

type PaymentWithRenter = Payment & { renter?: Renter };

export default function PaymentsPage() {
    const firestore = useFirestore();

    const paymentsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'payments') : null, [firestore]);
    const rentersCollection = useMemoFirebase(() => firestore ? collection(firestore, 'renters') : null, [firestore]);
    
    const { data: payments, isLoading: isLoadingPayments } = useCollection<Payment>(paymentsCollection);
    const { data: renters, isLoading: isLoadingRenters } = useCollection<Renter>(rentersCollection);

    const [paymentsWithRenters, setPaymentsWithRenters] = useState<PaymentWithRenter[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (payments && renters) {
            setIsLoading(true);
            const enrichedPayments = payments.map(payment => ({
                ...payment,
                renter: renters.find(r => r.id === payment.renterId)
            }));
            setPaymentsWithRenters(enrichedPayments);
            setIsLoading(false);
        } else if (!isLoadingPayments && !isLoadingRenters) {
            setIsLoading(false);
        }
    }, [payments, renters, isLoadingPayments, isLoadingRenters]);


    const formatTimestamp = (timestamp: string | Timestamp | null) => {
        if (!timestamp) return 'N/A';
        if (timestamp instanceof Timestamp) {
          return timestamp.toDate().toLocaleString();
        }
        return new Date(timestamp as string).toLocaleString();
    }
  
    return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>
          A comprehensive log of all payment transactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">Payment ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Renter</TableHead>
              <TableHead className="hidden md:table-cell">Rental ID</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading payments...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && paymentsWithRenters.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium hidden sm:table-cell">{payment.id}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[payment.status.toLowerCase() as keyof typeof statusVariant]}>{payment.status}</Badge>
                </TableCell>
                <TableCell>{payment.renter ? `${payment.renter.firstName} ${payment.renter.lastName}` : 'Unknown'}</TableCell>
                <TableCell className="hidden md:table-cell">{payment.rentalId}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {formatTimestamp(payment.paymentDate)}
                </TableCell>
                <TableCell className="text-right">₱{(payment.amount || 0).toFixed(2)}</TableCell>
              </TableRow>
            ))}
             {!isLoading && paymentsWithRenters.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">No payments found.</TableCell>
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
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
