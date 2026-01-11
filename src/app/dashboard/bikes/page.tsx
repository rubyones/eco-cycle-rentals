'use client';

import { MoreHorizontal, PlusCircle, Lock, Unlock, Trash2, Bike } from "lucide-react";
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
import { Ebike, Station } from "@/lib/types";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AddBikeForm } from "./add-bike-form";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, writeBatch } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { formatBikeId } from "@/lib/utils";

const statusVariant = {
    'Available': 'secondary',
    'In-Use': 'default',
    'Maintenance': 'destructive',
    'Locked': 'outline',
} as const;

export default function BikesPage() {
  const [isAddBikeOpen, setIsAddBikeOpen] = useState(false);
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const firestore = useFirestore();

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
  
  useEffect(() => {
    if (firestore && bikes?.length === 0 && !isLoadingBikes && stations && stations.length > 0 && !isSeeding) {
        const seedData = async () => {
            setIsSeeding(true);
            const batch = writeBatch(firestore);
            
            const initialBikes: Omit<Ebike, 'id' | 'image'>[] = [
                { stationId: stations[0].id, batteryLevel: 95, status: 'Available', locked: false, lastMaintenanceDate: new Date().toISOString() },
                { stationId: stations[0].id, batteryLevel: 82, status: 'Available', locked: false, lastMaintenanceDate: new Date().toISOString() },
                { stationId: stations[1 % stations.length].id, batteryLevel: 100, status: 'In-Use', locked: false, lastMaintenanceDate: new Date().toISOString() },
            ];

            initialBikes.forEach(bikeData => {
                const docRef = doc(collection(firestore, 'ebikes'));
                batch.set(docRef, bikeData);
            });

            await batch.commit();
            toast({
                title: "Sample E-Bikes Added",
                description: "Your database has been seeded with some sample e-bikes.",
            });
            setIsSeeding(false);
        };
        seedData();
    }
  }, [bikes, isLoadingBikes, stations, firestore, toast, isSeeding]);


  const handleAddBike = (newBikeData: Omit<Ebike, 'id' | 'lastMaintenanceDate' | 'image'>) => {
    if (!bikesCollection) return;
    
    const newBike: Omit<Ebike, 'id' | 'image'> = {
      ...newBikeData,
      locked: newBikeData.status === 'Locked',
      lastMaintenanceDate: new Date().toISOString(),
    };
    
    addDocumentNonBlocking(bikesCollection, newBike);
    
    toast({
        title: "E-Bike Added",
        description: `A new e-bike has been successfully added.`,
    });
    setIsAddBikeOpen(false);
  };

  const handleEdit = (bikeId: string) => {
    toast({
        title: `Editing ${formatBikeId(bikeId)}`,
        description: "This feature is not yet implemented.",
    });
  };

  const handleToggleLock = (bike: Ebike) => {
    if (!firestore) return;
    const bikeRef = doc(firestore, 'ebikes', bike.id);
    const newStatus = bike.locked ? 'Available' : 'Locked';
    const newLockedState = !bike.locked;
    
    updateDocumentNonBlocking(bikeRef, { status: newStatus, locked: newLockedState });

    toast({
      title: `Bike ${formatBikeId(bike.id)} ${newStatus}`,
      description: `The bike has been successfully ${newStatus.toLowerCase()}.`,
    });
  };

  const handleDelete = (bikeId: string) => {
    if (!firestore) return;
    const bikeRef = doc(firestore, 'ebikes', bikeId);
    deleteDocumentNonBlocking(bikeRef);
    toast({
        title: `Bike Deleted`,
        description: `Bike ${formatBikeId(bikeId)} has been successfully deleted.`,
        variant: "destructive"
    });
  }


  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>E-Bike Management</CardTitle>
                <CardDescription>
                Register new e-bike units, modify existing records, and remotely lock/unlock e-bikes.
                </CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={() => setIsAddBikeOpen(true)} disabled={isLoadingStations || !stations || stations.length === 0}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add E-Bike
                </span>
            </Button>
        </div>
         {(!stations || stations.length === 0) && !isLoadingStations && (
            <p className="text-sm text-destructive pt-2">Please add a station first before adding a bike.</p>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[64px] sm:table-cell">
                <span className="sr-only">Icon</span>
              </TableHead>
              <TableHead>E-Bike ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Battery</TableHead>
              <TableHead className="hidden md:table-cell">Station</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(isLoadingBikes || isSeeding) && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">Loading bikes...</TableCell>
                </TableRow>
            )}
            {!isLoadingBikes && !isSeeding && bikes?.map((bike, index) => {
              const station = stations?.find(s => s.id === bike.stationId);
              return (
              <TableRow key={bike.id}>
                 <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center justify-center h-16 w-16 bg-muted rounded-md">
                        <Bike className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </TableCell>
                <TableCell className="font-medium">{formatBikeId(bike.id)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[bike.status as keyof typeof statusVariant]}>{bike.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{bike.batteryLevel}%</TableCell>
                <TableCell className="hidden md:table-cell">{station?.name || bike.stationId}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleEdit(bike.id)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleLock(bike)}>
                        {bike.locked ? (
                          <><Unlock className="mr-2 h-4 w-4" />Unlock</>
                        ) : (
                          <><Lock className="mr-2 h-4 w-4" />Lock</>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(bike.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
            {!isLoadingBikes && !isSeeding && bikes?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">No bikes found. Add one to get started.</TableCell>
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
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
    <AddBikeForm 
        isOpen={isAddBikeOpen} 
        onOpenChange={setIsAddBikeOpen}
        onSubmit={handleAddBike}
        stations={stations || []}
    />
    </>
  );
}
