
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ebike, Station, Rental } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useState, useMemo } from 'react';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { formatBikeId } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

interface RentBikeFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userId: string;
}

export function RentBikeForm({ isOpen, onOpenChange, userId }: RentBikeFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedBike, setSelectedBike] = useState<Ebike | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bikesCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'ebikes');
  }, [firestore]);

  const stationsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'stations');
  }, [firestore]);

  const { data: bikes, isLoading: isLoadingBikes } = useCollection<Ebike>(bikesCollection);
  const { data: stations, isLoading: isLoadingStations } = useCollection<Station>(stationsCollection);
  
  const availableBikes = useMemo(() => {
    return bikes?.filter(bike => bike.status === 'Available') || [];
  }, [bikes]);
  
  const handleRentBike = () => {
    if (!firestore || !selectedBike || !userId) return;

    setIsSubmitting(true);

    const rentalCollection = collection(firestore, 'rentals');
    const bikeRef = doc(firestore, 'ebikes', selectedBike.id);
    
    const newRental: Omit<Rental, 'id'> = {
        renterId: userId,
        ebikeId: selectedBike.id,
        startTime: new Date().toISOString(),
        endTime: null,
        status: 'active',
        rentalFee: 0,
        stationId: selectedBike.stationId,
    };

    addDocumentNonBlocking(rentalCollection, newRental)
        .then((docRef) => {
            if(docRef){
                 updateDocumentNonBlocking(doc(firestore, 'rentals', docRef.id), { id: docRef.id });
            }
            updateDocumentNonBlocking(bikeRef, { status: 'In-Use' });
            toast({
                title: "Rental Started!",
                description: `You are now renting ${formatBikeId(selectedBike.id)}. Enjoy your ride!`,
            });
            onOpenChange(false);
            setSelectedBike(null);
        })
        .catch(() => {
             toast({
                title: "Rental Failed",
                description: "Could not start the rental. Please try again.",
                variant: 'destructive',
            });
        })
        .finally(() => {
            setIsSubmitting(false);
        });
  };

  const getStationName = (stationId: string) => {
    return stations?.find(s => s.id === stationId)?.name || 'Unknown Station';
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Rent a Bike</DialogTitle>
          <DialogDescription>
            Select an available e-bike from the list below to start your rental.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Bike ID</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="hidden sm:table-cell">Battery</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(isLoadingBikes || isLoadingStations) && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                            </TableCell>
                        </TableRow>
                    )}
                    {!isLoadingBikes && availableBikes.length > 0 && availableBikes.map((bike) => (
                        <TableRow 
                            key={bike.id} 
                            onClick={() => setSelectedBike(bike)}
                            className={`cursor-pointer ${selectedBike?.id === bike.id ? 'bg-muted/50' : ''}`}
                        >
                            <TableCell>{formatBikeId(bike.id)}</TableCell>
                            <TableCell>{getStationName(bike.stationId)}</TableCell>
                            <TableCell className="hidden sm:table-cell">{bike.batteryLevel}%</TableCell>
                            <TableCell className="text-right">
                                <Button 
                                    size="sm" 
                                    variant={selectedBike?.id === bike.id ? 'default' : 'outline'}
                                    onClick={() => setSelectedBike(bike)}
                                >
                                    {selectedBike?.id === bike.id ? 'Selected' : 'Select'}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {!isLoadingBikes && availableBikes.length === 0 && (
                         <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No bikes available for rent right now.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleRentBike} disabled={!selectedBike || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Rent Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
