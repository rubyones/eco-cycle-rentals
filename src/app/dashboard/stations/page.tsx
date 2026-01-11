
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
import { stations } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";

export default function StationsPage() {
    const mapPlaceholder = PlaceHolderImages.find(img => img.id === 'map-placeholder');
    const { toast } = useToast();

    const handleAddStation = () => {
        toast({
            title: "Add Station",
            description: "This would open a form to add a new station.",
        });
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

  return (
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
            <Button size="sm" className="gap-1" onClick={handleAddStation}>
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
                <TableHead>Bikes</TableHead>
                <TableHead className="hidden md:table-cell">Capacity</TableHead>
                <TableHead className="hidden md:table-cell">Location (Lat, Lng)</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell className="font-medium">{station.name}</TableCell>
                  <TableCell>{station.bikes}</TableCell>
                  <TableCell className="hidden md:table-cell">{station.capacity}</TableCell>
                  <TableCell className="hidden md:table-cell">{station.location}</TableCell>
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
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
  );
}
