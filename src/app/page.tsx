'use client';

import Link from 'next/link';
import { Bike, UserCog, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 pattern-graph-paper">
      <Card className="mx-auto max-w-md w-full shadow-lg text-center">
        <CardHeader className="space-y-2">
           <div className="mx-auto inline-block rounded-lg bg-primary p-3 text-primary-foreground">
            <Bike className="h-7 w-7" />
          </div>
          <CardTitle className="text-3xl font-headline">eBike Rental Platform</CardTitle>
          <CardDescription>
            Please select your role to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <Link href="/renter-login" passHref>
                <Button variant="outline" className="w-full h-16 text-lg">
                    <User className="mr-3 h-6 w-6" />
                    Continue as Renter
                </Button>
            </Link>
            <Link href="/login" passHref>
                 <Button className="w-full h-16 text-lg">
                    <UserCog className="mr-3 h-6 w-6" />
                    Continue as Admin
                </Button>
            </Link>
        </CardContent>
      </Card>
    </div>
  );
}
