'use client';

import { useRouter } from 'next/navigation';
import { Bike, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, initiateAnonymousSignIn, useUser } from '@/firebase';
import { useEffect, useState } from 'react';
import { FirebaseClientProvider } from '@/firebase';

function LoginPageContent() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    // If user object exists and is no longer loading, redirect to dashboard
    if (user && !isUserLoading) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = () => {
    if (auth) {
      setIsSigningIn(true);
      initiateAnonymousSignIn(auth);
    }
  };

  // If we are checking for user or signing in, show a loading state
  if (isUserLoading || isSigningIn) {
     return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Signing in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="space-y-2 text-center">
          <div className="inline-block rounded-lg bg-primary p-3 text-primary-foreground">
            <Bike className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl font-headline">eBike Admin</CardTitle>
          <CardDescription>Please log in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                defaultValue="admin@ebike.com"
                disabled
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                defaultValue="password"
                disabled
              />
            </div>
            <Button onClick={handleLogin} className="w-full" disabled={isSigningIn}>
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <FirebaseClientProvider>
      <LoginPageContent />
    </FirebaseClientProvider>
  );
}
