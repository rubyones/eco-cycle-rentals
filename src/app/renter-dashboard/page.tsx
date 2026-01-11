
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Bike, Clock, DollarSign, Loader2, LogOut, History, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useCollection, useFirestore, useMemoFirebase, useAuth } from '@/firebase';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Rental, Payment, Station } from '@/lib/types';
import { formatBikeId } from '@/lib/utils';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { RentBikeForm } from './rent-bike-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';


const statusVariant = {
    'active': 'default',
    'completed': 'secondary',
    'overdue': 'destructive',
    'paid': 'outline',
} as const;


function RenterDashboardContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const [isRentFormOpen, setIsRentFormOpen] = useState(false);

  const rentalsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
        collection(firestore, 'rentals'), 
        where('renterId', '==', user.uid)
    );
  }, [firestore, user]);
  
  const stationsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'stations');
  }, [firestore]);


  const { data: allRentals, isLoading: isLoadingRentals } = useCollection<Rental>(rentalsQuery);
  const { data: stations, isLoading: isLoadingStations } = useCollection<Station>(stationsCollection);

  const activeRental = useMemo(() => allRentals?.find(r => r.status === 'active') || null, [allRentals]);
  const rentalHistory = useMemo(() => allRentals?.filter(r => r.status !== 'active').sort((a, b) => {
    const timeA = a.endTime ? (a.endTime instanceof Timestamp ? a.endTime.toMillis() : new Date(a.endTime as string).getTime()) : 0;
    const timeB = b.endTime ? (b.endTime instanceof Timestamp ? b.endTime.toMillis() : new Date(b.endTime as string).getTime()) : 0;
    return timeB - timeA;
  }) || [], [allRentals]);

  const [duration, setDuration] = useState("0h 0m 0s");
  const [fee, setFee] = useState("0.00");
  const [startStation, setStartStation] = useState<Station | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/renter-login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!activeRental) return;

    const getStartStation = () => {
        if(stations && activeRental) {
            const bikeStartStation = stations.find(s => s.id === activeRental.stationId);
            if(bikeStartStation) {
                setStartStation(bikeStartStation);
            }
        }
    }
    
    const calculateRentalInfo = () => {
        const startTime = activeRental.startTime instanceof Timestamp 
            ? activeRental.startTime.toDate() 
            : new Date(activeRental.startTime as string);
        
        const now = new Date();
        const durationSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        const hours = Math.floor(durationSeconds / 3600);
        const minutes = Math.floor((durationSeconds % 3600) / 60);
        const seconds = durationSeconds % 60;
        
        const durationMinutes = Math.floor(durationSeconds / 60);

        let currentFee = 0;
        if (durationMinutes <= 60) {
            currentFee = 120;
        } else {
            const extraHours = Math.ceil((durationMinutes - 60) / 60);
            currentFee = 120 + extraHours * 50;
        }


        setDuration(`${hours}h ${minutes}m ${seconds}s`);
        setFee(currentFee.toFixed(2));
    };
    
    getStartStation();
    calculateRentalInfo(); // Initial calculation
    const interval = setInterval(calculateRentalInfo, 1000); // Update every second

    return () => clearInterval(interval);
  }, [activeRental, stations]);

  const handleEndRental = () => {
    if (!firestore || !activeRental || !user) return;
    
    const rentalRef = doc(firestore, 'rentals', activeRental.id);
    const ebikeRef = doc(firestore, 'ebikes', activeRental.ebikeId);
    const paymentsCollection = collection(firestore, 'payments');

    const endTime = new Date();
    const finalFee = parseFloat(fee);

    // Create payment record
    const newPayment: Omit<Payment, 'id'> = {
        renterId: user.uid,
        rentalId: activeRental.id,
        paymentDate: endTime.toISOString(),
        amount: finalFee,
        status: 'paid'
    };

    addDocumentNonBlocking(paymentsCollection, newPayment).then(docRef => {
        if(docRef) {
            updateDocumentNonBlocking(doc(firestore, 'payments', docRef.id), { id: docRef.id });
        }
        
        // Update rental status to paid
        updateDocumentNonBlocking(rentalRef, {
          status: 'paid',
          endTime: endTime.toISOString(),
          rentalFee: finalFee
        });
        
        // Update bike status to available
        updateDocumentNonBlocking(ebikeRef, {
          status: 'Available'
        });

        toast({
          title: "Payment Successful & Rental Ended",
          description: `Payment of ₱${finalFee.toFixed(2)} received. Thank you for riding!`,
        });
    }).catch(() => {
        toast({
            title: "Payment Failed",
            description: "Could not process payment or end rental. Please try again.",
            variant: "destructive"
        });
    });
  }

  const formatTimestamp = (timestamp: string | Timestamp | null) => {
    if (!timestamp) return 'N/A';
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp as string).toLocaleString();
  }

  const calculateDuration = (startTime: string | Timestamp, endTime: string | Timestamp | null) => {
    if (!endTime) return 'N/A';

    const start = startTime instanceof Timestamp ? startTime.toDate() : new Date(startTime as string);
    const end = endTime instanceof Timestamp ? endTime.toDate() : new Date(endTime as string);

    const durationMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  }

  const handleLogout = () => {
    if (auth) {
      signOut(auth).then(() => {
        router.push('/renter-login');
      });
    }
  };

  const getStationName = (stationId: string) => {
    if (!stations) return '...';
    return stations.find(s => s.id === stationId)?.name || 'Unknown';
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
            <Bike className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold font-headline">
              Welcome, {user.displayName || 'Renter'}!
            </h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' })}>
                <History className="h-5 w-5" />
                <span className="sr-only">History</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
            </Button>
        </div>
       </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Current Rental Status</CardTitle>
                    {activeRental && <CardDescription>You have an active rental. Please return the e-bike to the nearest station when finished.</CardDescription>}
                </CardHeader>
                <CardContent className="grid gap-6">
                    {(isLoadingRentals || isLoadingStations) && <div className="flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin"/></div>}
                    {!isLoadingRentals && activeRental && (
                      <>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">E-Bike ID</span>
                            <span className="font-semibold">{formatBikeId(activeRental.ebikeId)}</span>
                        </div>
                        {startStation && (
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Start Station</span>
                                 <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span className="font-semibold">{startStation.name}</span>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Rental Duration</span>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span className="font-semibold tabular-nums">{duration}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Current Fee</span>
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-semibold text-lg">₱{fee}</span>
                            </div>
                        </div>
                        <Button className="w-full" onClick={handleEndRental}>
                            Pay & End Rental
                        </Button>
                      </>
                    )}
                    {!isLoadingRentals && !activeRental && (
                        <div className="text-center text-muted-foreground py-8">
                            <p>You have no active rentals.</p>
                            <Button className="mt-4" onClick={() => setIsRentFormOpen(true)}>Rent a Bike</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card id="history">
                <CardHeader>
                    <CardTitle>Rental History</CardTitle>
                    <CardDescription>A record of your past e-bike rentals.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bike ID</TableHead>
                                <TableHead>Start Station</TableHead>
                                <TableHead>Started</TableHead>
                                <TableHead>Ended</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead className="text-right">Fee</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(isLoadingRentals || isLoadingStations) && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">Loading history...</TableCell>
                                </TableRow>
                            )}
                            {!isLoadingRentals && !isLoadingStations && rentalHistory.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">No past rentals found.</TableCell>
                                </TableRow>
                            )}
                            {!isLoadingRentals && !isLoadingStations && rentalHistory.map(rental => (
                                <TableRow key={rental.id}>
                                    <TableCell>{formatBikeId(rental.ebikeId)}</TableCell>
                                    <TableCell>{getStationName(rental.stationId)}</TableCell>
                                    <TableCell>{formatTimestamp(rental.startTime)}</TableCell>
                                    <TableCell>{formatTimestamp(rental.endTime)}</TableCell>
                                    <TableCell>{calculateDuration(rental.startTime, rental.endTime)}</TableCell>
                                    <TableCell className="text-right">₱{rental.rentalFee.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[rental.status.toLowerCase() as keyof typeof statusVariant]}>{rental.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
     {user && <RentBikeForm isOpen={isRentFormOpen} onOpenChange={setIsRentFormOpen} userId={user.uid} />}
    </>
  );
}


export default function RenterDashboard() {
    return (
        <FirebaseClientProvider>
            <RenterDashboardContent />
        </FirebaseClientProvider>
    )
}
