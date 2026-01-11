
'use client';

import Image from "next/image";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Station } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import { AddStationForm } from "./add-station-form";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, writeBatch } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const initialStations: Omit<Station, 'id'>[] = [
    { name: 'Davao City – SM Lanang area', latitude: 7.0931, longitude: 125.6128, parkingBays: 10 },
    { name: 'Davao City – GMall area', latitude: 7.0731, longitude: 125.6128, parkingBays: 15 },
    { name: 'Davao City – Ateneo de Davao University area', latitude: 7.065, longitude: 125.608, parkingBays: 20 },
];

export default function StationsPage() {
    const mapPlaceholder = PlaceHolderImages.find(img => img.id === 'map-placeholder');
    const { toast } = useToast();
    const [isAddStationOpen, setIsAddStationOpen] = useState(false);
    
    const firestore = useFirestore();

    const stationsCollection = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'stations');
    }, [firestore]);

    const { data: stations, isLoading } = useCollection<Station>(stationsCollection);
    const [isSeeding, setIsSeeding] = useState(false);

    useEffect(() => {
        if (firestore && stations?.length === 0 && !isLoading && !isSeeding) {
            const seedData = async () => {
                setIsSeeding(true);
                const batch = writeBatch(firestore);
                initialStations.forEach(stationData => {
                    const docRef = doc(collection(firestore, 'stations'));
                    batch.set(docRef, stationData);
                });
                await batch.commit();
                toast({
                    title: "Sample Stations Added",
                    description: "Your database has been seeded with some sample stations.",
                });
                setIsSeeding(false);
            };
            seedData();
        }
    }, [stations, isLoading, firestore, toast, isSeeding]);


    const handleAddStation = (newStation: Omit<Station, 'id'>) => {
      if (!stationsCollection) return;
        addDocumentNonBlocking(stationsCollection, newStation);
        toast({
            title: "Station Added",
            description: `Station ${newStation.name} has been successfully added.`,
        });
        setIsAddStationOpen(false);
    };

    const handleEdit = (stationId: string) => {
        toast({
            title: `Editing ${stationId}`,
            description: "This feature is not yet implemented.",
        });
    };

    const handleViewDetails = (stationId: string) => {
        toast({
            title: `Viewing Details for ${stationId}`,
            description: "This would navigate to a station details page.",
        });
    };
    
    const handleDelete = (stationId: string) => {
      if (!firestore) return;
      const stationRef = doc(firestore, 'stations', stationId);
      deleteDocumentNonBlocking(stationRef);
      toast({
          title: "Station Deleted",
          description: `Station has been successfully deleted.`,
          variant: "destructive"
      });
  };

  return (
    <>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Station Management</CardTitle>
              <CardDescription>
                Add or update station information and monitor e-bike distribution.
              </CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={() => setIsAddStationOpen(true)}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Station
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Station Name</TableHead>
                <TableHead>Parking Bays</TableHead>
                <TableHead className="hidden md:table-cell">Location (Lat, Lng)</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isLoading || isSeeding) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">Loading stations...</TableCell>
                </TableRow>
              )}
              {!isLoading && !isSeeding && stations?.map((station) => (
                <TableRow key={station.id}>
                  <TableCell className="font-medium">{station.name}</TableCell>
                  <TableCell>{station.parkingBays}</TableCell>
                  <TableCell className="hidden md:table-cell">{`${station.latitude}, ${station.longitude}`}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(station.id)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDetails(station.id)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(station.id)} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && !isSeeding && stations?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No stations found. Add one to get started.</TableCell>
                </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
          <CardHeader>
              <CardTitle>Station Map</CardTitle>
              <CardDescription>Visual overview of station locations.</CardDescription>
          </CardHeader>
          <CardContent>
            {mapPlaceholder && (
                <div className="relative aspect-[4/3] w-full">
                     <Image
                        src={mapPlaceholder.imageUrl}
                        alt={mapPlaceholder.description}
                        data-ai-hint={mapPlaceholder.imageHint}
                        fill
                        className="rounded-lg object-cover"
                    />
                </div>
            )}
          </CardContent>
      </Card>
    </div>
     <AddStationForm 
        isOpen={isAddStationOpen} 
        onOpenChange={setIsAddStationOpen}
        onSubmit={handleAddStation}
    />
    </>
  );
}
