'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bike, Clock, DollarSign, Loader2, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { FirebaseClientProvider } from '@/firebase/client-provider';

function RenterDashboardContent() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  // Mock data for current rental
  const rental = {
    ebikeId: 'EBK-007',
    startTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
    status: 'active',
  };

  const calculateRentalInfo = (startTime: Date) => {
    const now = new Date();
    const durationMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    let fee = 0;
    if (hours >= 1) {
        fee = 120 + (hours - 1) * 50;
    } else {
        fee = 120;
    }

    return {
        duration: `${hours}h ${minutes}m`,
        fee: fee.toFixed(2),
    };
  };

  const { duration, fee } = calculateRentalInfo(rental.startTime);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
            <Bike className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold font-headline">My Rental</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Log out</span>
        </Button>
       </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-2xl">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Current Rental Status</CardTitle>
                    <CardDescription>You have an active rental. Please return the e-bike to the nearest station when finished.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">E-Bike ID</span>
                        <span className="font-semibold">{rental.ebikeId}</span>
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
                     <Button className="w-full">
                        Lock E-Bike & End Rental
                    </Button>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}


export default function RenterDashboard() {
    return (
        <FirebaseClientProvider>
            <RenterDashboardContent />
        </FirebaseClientProvider>
    )
}
