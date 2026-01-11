'use client';

import { useRouter } from 'next/navigation';
import { Bike, Loader2, Mail, Lock, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, initiateEmailSignIn, useUser } from '@/firebase';
import { useEffect, useState } from 'react';
import { FirebaseClientProvider } from '@/firebase';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';

function AdminLoginPageContent() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // If user object exists and is no longer loading, redirect to dashboard
    if (user && !isUserLoading) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (auth) {
      setIsSigningIn(true);
      initiateEmailSignIn(auth, email, password)
        .then(() => {
          // The useUser hook will handle redirection on successful login
        })
        .catch((error: FirebaseError) => {
          setIsSigningIn(false);
          if (error.code === 'auth/invalid-credential') {
            toast({
              title: "Login Failed",
              description: "The email or password you entered is incorrect.",
              variant: "destructive",
            });
          } else {
             toast({
              title: "Login Error",
              description: "An unexpected error occurred. Please try again.",
              variant: "destructive",
            });
          }
          console.error("Admin Sign-In Error:", error);
        });
    }
  };

  // If we are checking for user or signing in, or if user is already logged in, show loading state
  if (isUserLoading || (isSigningIn && !user) || user) {
     return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Accessing Admin Panel...</p>
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
          <CardDescription>Login to manage the e-bike fleet.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSigningIn}>
              {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue as Admin'}
            </Button>
          </form>
        </CardContent>
         <CardFooter className="flex-col gap-4 pt-4">
            <div className="relative w-full">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                    OR
                </span>
            </div>
             <Button variant="link" size="sm" asChild className="text-muted-foreground">
                <Link href="/renter-login">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Continue as Renter
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <FirebaseClientProvider>
      <AdminLoginPageContent />
    </FirebaseClientProvider>
  );
}
