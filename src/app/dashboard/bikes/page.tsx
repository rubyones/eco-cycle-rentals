
'use client';

import Image from "next/image";
import { MoreHorizontal, PlusCircle, Lock, Unlock } from "lucide-react";
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
import { bikes as initialBikes, stations, Bike } from "@/lib/data";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AddBikeForm } from "./add-bike-form";

const statusVariant = {
    'Available': 'secondary',
    'In-Use': 'default',
    'Maintenance': 'destructive',
    'Locked': 'outline',
} as const;

export default function BikesPage() {
  const [bikes, setBikes] = useState<Bike[]>(initialBikes);
  const [isAddBikeOpen, setIsAddBikeOpen] = useState(false);
  const { toast } = useToast();

  const handleAddBike = (newBike: Omit<Bike, 'id' | 'image'>) => {
    const nextId = `EBK${(parseInt(bikes[bikes.length - 1].id.replace('EBK', '')) + 1).toString().padStart(3, '0')}`;
    const ebikeImages = ['ebike-1', 'ebike-2', 'ebike-3'];
    const randomImage = ebikeImages[Math.floor(Math.random() * ebikeImages.length)];
    const newBikeWithId: Bike = {
      ...newBike,
      id: nextId,
      image: randomImage,
    };
    setBikes(currentBikes => [...currentBikes, newBikeWithId]);
    toast({
        title: "E-Bike Added",
        description: `E-Bike ${newBikeWithId.id} has been successfully added.`,
    });
    setIsAddBikeOpen(false);
  };

  const handleEdit = (bikeId: string) => {
    toast({
        title: `Editing ${bikeId}`,
        description: "This feature is not yet implemented.",
    });
  };

  const handleToggleLock = (bikeId: string) => {
    setBikes(currentBikes =>
      currentBikes.map(bike => {
        if (bike.id === bikeId) {
          const newStatus = bike.status === 'Locked' ? 'Available' : 'Locked';
          toast({
            title: `Bike ${bikeId} ${newStatus}`,
            description: `The bike has been successfully ${newStatus.toLowerCase()}.`,
          });
          return { ...bike, status: newStatus };
        }
        return bike;
      })
    );
  };

  const handleDeactivate = (bikeId: string) => {
    toast({
        title: `Deactivating ${bikeId}`,
        description: "This feature is not yet implemented, but in a real app this would deactivate the bike.",
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
            <Button size="sm" className="gap-1" onClick={() => setIsAddBikeOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add E-Bike
                </span>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>E-Bike ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Battery</TableHead>
              <TableHead className="hidden md:table-cell">Station ID</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bikes.map((bike) => {
              const image = PlaceHolderImages.find(p => p.id === bike.image);
              return (
              <TableRow key={bike.id}>
                 <TableCell className="hidden sm:table-cell">
                    {image && (
                      <Image
                        alt={bike.id}
                        className="aspect-square rounded-md object-cover"
                        data-ai-hint={image.imageHint}
                        height="64"
                        src={image.imageUrl}
                        width="64"
                      />
                    )}
                  </TableCell>
                <TableCell className="font-medium">{bike.id}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[bike.status]}>{bike.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{bike.battery}%</TableCell>
                <TableCell className="hidden md:table-cell">{bike.stationId}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleToggleLock(bike.id)}>
                        {bike.status === 'Locked' ? (
                          <><Unlock className="mr-2 h-4 w-4" />Unlock</>
                        ) : (
                          <><Lock className="mr-2 h-4 w-4" />Lock</>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeactivate(bike.id)}>Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
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
    <AddBikeForm 
        isOpen={isAddBikeOpen} 
        onOpenChange={setIsAddBikeOpen}
        onSubmit={handleAddBike}
        stations={stations}
    />
    </>
  );
}
