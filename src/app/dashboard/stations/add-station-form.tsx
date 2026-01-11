
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Station } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().nonempty({ message: 'Please enter a station name.' }),
  location: z.string().regex(/^-?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*-?((1[0-7]\d)|([1-9]?\d))(\.\d+)?$/, { message: 'Invalid coordinates format (e.g., 40.782, -73.965).' }),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1.'),
});

type AddStationFormValues = z.infer<typeof formSchema>;

interface AddStationFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: Omit<Station, 'id' | 'bikes'>) => void;
}

export function AddStationForm({ isOpen, onOpenChange, onSubmit }: AddStationFormProps) {
  const form = useForm<AddStationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location: '',
      capacity: 10,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const handleSubmit = (values: AddStationFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Station</DialogTitle>
          <DialogDescription>
            Enter the details for the new station.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Station Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Downtown Plaza" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Lat, Lng)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 40.782, -73.965" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bike Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Add Station</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
