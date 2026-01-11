'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Bike, Clock, DollarSign, Loader2, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { Rental } from '@/lib/types';
import { formatBikeId } from '@/lib/utils';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { RentBikeForm } from './rent-bike-form';

function RenterDashboardContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isRentFormOpen, setIsRentFormOpen] = useState(false);

  const rentalsCollection = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
        collection(firestore, 'rentals'), 
        where('renterId', '==', user.uid), 
        where('status', '==', 'active')
    );
  }, [firestore, user]);

  const { data: activeRentals, isLoading: isLoadingRentals } = useCollection<Rental>(rentalsCollection);
  const activeRental = useMemo(() => (activeRentals && activeRentals.length > 0 ? activeRentals[0] : null), [activeRentals]);
  
  const [duration, setDuration] = useState("0h 0m");
  const [fee, setFee] = useState("0.00");

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/renter-login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!activeRental) return;

    const calculateRentalInfo = () => {
        const startTime = activeRental.startTime instanceof Timestamp 
            ? activeRental.startTime.toDate() 
            : new Date(activeRental.startTime);
        
        const now = new Date();
        const durationMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        
        let currentFee = 0;
        if (hours >= 1) {
            currentFee = 120 + (hours - 1) * 50;
        } else {
            currentFee = 120;
        }

        setDuration(`${hours}h ${minutes}m`);
        setFee(currentFee.toFixed(2));
    };

    calculateRentalInfo(); // Initial calculation
    const interval = setInterval(calculateRentalInfo, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [activeRental]);

  const handleEndRental = () => {
    if (!firestore || !activeRental) return;
    
    const rentalRef = doc(firestore, 'rentals', activeRental.id);
    const ebikeRef = doc(firestore, 'ebikes', activeRental.ebikeId);

    const endTime = new Date();
    const finalFee = parseFloat(fee);

    updateDocumentNonBlocking(rentalRef, {
      status: 'completed',
      endTime: endTime.toISOString(),
      rentalFee: finalFee
    });
    
    updateDocumentNonBlocking(ebikeRef, {
      status: 'Available'
    });

    toast({
      title: "Rental Ended",
      description: "Thank you for riding with us!",
    });
  }

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
            <h1 className="text-xl font-bold font-headline">My Rental</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => router.push('/renter-login')}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Log out</span>
        </Button>
       </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-2xl">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Current Rental Status</CardTitle>
                    {activeRental && <CardDescription>You have an active rental. Please return the e-bike to the nearest station when finished.</CardDescription>}
                </CardHeader>
                <CardContent className="grid gap-6">
                    {isLoadingRentals && <div className="flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin"/></div>}
                    {!isLoadingRentals && activeRental && (
                      <>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">E-Bike ID</span>
                            <span className="font-semibold">{formatBikeId(activeRental.ebikeId)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Rental Duration</span>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span className="font-semibold">{duration}</span>
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
                            Lock E-Bike & End Rental
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
