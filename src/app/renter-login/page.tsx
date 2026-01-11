'use client';

import { useRouter } from 'next/navigation';
import { Bike, Loader2, Mail, Lock, User as UserIcon, Phone } from 'lucide-react';

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
import { useAuth, initiateEmailSignIn, useUser, initiateEmailSignUp } from '@/firebase';
import { useEffect, useState } from 'react';
import { FirebaseClientProvider } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function LoginPageContent() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('Sample');
  const [lastName, setLastName] = useState('Renter');
  const [phone, setPhone] = useState('555-555-5555');
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
      if (action === 'login') {
        initiateEmailSignIn(auth, email, password);
      } else {
        if (!firstName || !lastName || !phone) {
           toast({
            title: "Missing Information",
            description: "Please fill out all fields to sign up.",
            variant: "destructive",
          });
          setIsSigningIn(false);
          return;
        }
        initiateEmailSignUp(auth, email, password, { firstName, lastName, phone });
      }
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
      <Tabs defaultValue="login" className="mx-auto max-w-sm w-full">
      <Card className="mx-auto w-full shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto inline-block rounded-lg bg-primary p-3 text-primary-foreground">
            <Bike className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl font-headline">Renter Portal</CardTitle>
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
                  <Input id="password-signup" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSigningIn}>
                {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create account'}
              </Button>
            </form>
          </TabsContent>
        </CardContent>
        </Card>
      </Tabs>
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
