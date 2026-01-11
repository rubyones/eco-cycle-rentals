
'use client';

import { useRouter } from 'next/navigation';
import { Bike, Loader2, Mail, Lock, User as UserIcon, Phone, UserCog } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, initiateEmailSignIn, useUser, initiateEmailSignUp } from '@/firebase';
import { useEffect, useState } from 'react';
import { FirebaseClientProvider } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { FirebaseError } from 'firebase/app';

function LoginPageContent() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const { toast } = useToast();


  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/renter-dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleAuthAction = (e: React.FormEvent, action: 'login' | 'signup') => {
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
      
      const authPromise = action === 'login'
        ? initiateEmailSignIn(auth, email, password)
        : (() => {
            if (!firstName || !lastName || !phone) {
              toast({
                title: "Missing Information",
                description: "Please fill out all fields to sign up.",
                variant: "destructive",
              });
              setIsSigningIn(false);
              return Promise.reject(new Error("Missing signup fields"));
            }
            return initiateEmailSignUp(auth, email, password, { firstName, lastName, phone });
          })();

      authPromise
        .then(() => {
          // successful login/signup will be handled by the useEffect
        })
        .catch((error: FirebaseError | Error) => {
          setIsSigningIn(false);
          if ('code' in error) { // It's a FirebaseError
            if (error.code === 'auth/invalid-credential') {
              toast({
                title: "Login Failed",
                description: "The email or password you entered is incorrect.",
                variant: "destructive",
              });
            } else if (error.code === 'auth/email-already-in-use') {
              toast({
                title: "Sign-Up Failed",
                description: "An account with this email already exists. Please log in instead.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Authentication Error",
                description: error.message || "An unexpected error occurred.",
                variant: "destructive",
              });
            }
          } else { // It's a standard Error
             if (error.message !== "Missing signup fields") {
                toast({
                  title: "Error",
                  description: error.message || "An unexpected error occurred.",
                  variant: "destructive",
                });
             }
          }
        });
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
        <Tabs defaultValue="login" className="w-full">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto inline-block rounded-lg bg-primary p-3 text-primary-foreground">
              <Bike className="h-6 w-6" />
            </div>
            <CardTitle className="text-3xl font-headline">EcoCycle Rentals</CardTitle>
            <CardDescription>Your eco-friendly solution for city travel. Get started below.</CardDescription>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="login">
              <CardDescription className="text-center mb-4">Welcome back! Please sign in to your account.</CardDescription>
              <form onSubmit={(e) => handleAuthAction(e, 'login')} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email-login">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email-login"
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
                  <Label htmlFor="password-login">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password-login"
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
                  {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <CardDescription className="text-center mb-4">Create an account to start renting.</CardDescription>
              <form onSubmit={(e) => handleAuthAction(e, 'signup')} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="first-name" placeholder="Max" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email-signup" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="+639171234567" required value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password-signup" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" placeholder="••••••••" />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSigningIn}>
                  {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create account'}
                </Button>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
        <CardFooter className="flex-col gap-4 pt-4">
            <div className="relative w-full">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                    OR
                </span>
            </div>
             <Button variant="link" size="sm" asChild className="text-muted-foreground">
                <Link href="/login">
                    <UserCog className="mr-2 h-4 w-4" />
                    Continue as Admin
                </Link>
            </Button>
        </CardFooter>
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
