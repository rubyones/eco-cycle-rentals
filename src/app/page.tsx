'use client';

import { useRouter } from 'next/navigation';
import { Bike, Loader2, Mail, Lock } from 'lucide-react';

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
import { useAuth, initiateEmailSignIn, useUser } from '@/firebase';
import { useEffect, useState } from 'react';
import { FirebaseClientProvider } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

function LoginPageContent() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();


  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/renter-dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (auth) {
      if (!email || !password) {
        toast({
          title: "Missing Information",
          description: "Please enter both email and password.",
          variant: "destructive",
        });
        return;
      }
      setIsSigningIn(true);
      // In a real app, you'd use the provided email and password
      // For this demo, we will use a pre-seeded user for simplicity
      initiateEmailSignIn(auth, 'sample.renter@example.com', 'password123');
    }
  };

  if (isUserLoading || (user && !isUserLoading)) {
     return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 pattern-graph-paper">
      <Card className="mx-auto max-w-sm w-full shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto inline-block rounded-lg bg-primary p-3 text-primary-foreground">
            <Bike className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl font-headline">eBike Rentals</CardTitle>
          <CardDescription>Welcome back! Please sign in to your account.</CardDescription>
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
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="grid gap-2">
               <Label htmlFor="password">Password</Label>
               <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
             <p className="px-1 text-xs text-center text-muted-foreground">
                Demo login: <strong>sample.renter@example.com</strong> / <strong>password123</strong>
            </p>
            <Button type="submit" className="w-full" disabled={isSigningIn}>
              {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
            </Button>
            <Button variant="outline" className="w-full" type="button">
              Sign up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RenterLoginPage() {
  return (
    <FirebaseClientProvider>
      <LoginPageContent />
    </FirebaseClientProvider>
  );
}
