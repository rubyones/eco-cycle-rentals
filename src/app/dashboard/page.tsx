
'use client';

import {
  Activity,
  ArrowUpRight,
  Bike,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, getDoc, Timestamp } from "firebase/firestore";
import { Ebike, Rental, Renter } from "@/lib/types";
import { useEffect, useState } from "react";
import { formatBikeId } from "@/lib/utils";

const chartData = [
  { month: "January", revenue: 93000 },
  { month: "February", revenue: 152500 },
  { month: "March", revenue: 118500 },
  { month: "April", revenue: 36500 },
  { month: "May", revenue: 104500 },
  { month: "June", revenue: 107000 },
];
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
};

type RecentRental = Rental & { renter?: Renter };

export default function Dashboard() {
  const firestore = useFirestore();

  const bikesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'ebikes') : null, [firestore]);
  const rentersCollection = useMemoFirebase(() => firestore ? collection(firestore, 'renters') : null, [firestore]);
  const rentalsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'rentals') : null, [firestore]);

  const { data: bikes, isLoading: isLoadingBikes } = useCollection<Ebike>(bikesCollection);
  const { data: renters, isLoading: isLoadingRenters } = useCollection<Renter>(rentersCollection);
  const { data: rentals, isLoading: isLoadingRentals } = useCollection<Rental>(rentalsCollection);

  const [recentRentals, setRecentRentals] = useState<RecentRental[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);

  useEffect(() => {
    if (rentals && renters) {
        setIsLoadingRecent(true);
        const sortedRentals = [...rentals]
          .sort((a, b) => {
            const timeA = a.startTime instanceof Timestamp ? a.startTime.toMillis() : new Date(a.startTime).getTime();
            const timeB = b.startTime instanceof Timestamp ? b.startTime.toMillis() : new Date(b.startTime).getTime();
            return timeB - timeA;
          })
          .slice(0, 4);

        const rentalsWithRenters = sortedRentals.map(rental => {
            const renter = renters.find(r => r.id === rental.renterId);
            return { ...rental, renter };
        });
        
        setRecentRentals(rentalsWithRenters);
        setIsLoadingRecent(false);
    } else if (!isLoadingRentals && !isLoadingRenters) {
        setIsLoadingRecent(false);
    }
  }, [rentals, renters, isLoadingRentals, isLoadingRenters]);

  const totalRenters = renters?.length || 0;
  const totalBikes = bikes?.length || 0;
  const activeRentals = rentals?.filter(r => r.status === 'active').length || 0;
  const totalRevenue = rentals?.reduce((acc, r) => acc + (r.rentalFee || 0), 0) || 0;

  const isLoading = isLoadingBikes || isLoadingRentals || isLoadingRenters;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-muted-foreground">₱</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Renters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRenters}</div>
            <p className="text-xs text-muted-foreground">+{totalRenters} from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total E-Bikes</CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBikes}</div>
            <p className="text-xs text-muted-foreground">+5 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRentals}</div>
            <p className="text-xs text-muted-foreground">+2 since last hour</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>
              Graphical reports for system analytics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart accessibilityLayer data={chartData}>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `₱${value / 1000}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Rentals</CardTitle>
              <CardDescription>
                An overview of the most recent rental activities.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/rentals">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-8">
            {isLoadingRecent && <p className="text-sm text-center text-muted-foreground">Loading recent rentals...</p>}
            {!isLoadingRecent && recentRentals.map((rental, index) => {
                const renterName = rental.renter ? `${rental.renter.firstName} ${rental.renter.lastName}` : 'Unknown Renter';
                const renterInitials = rental.renter ? `${rental.renter.firstName[0]}${rental.renter.lastName[0]}` : 'UR';

                return (
                    <div key={rental.id} className="flex items-center gap-4">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarFallback>
                                {renterInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">{renterName}</p>
                            <p className="text-sm text-muted-foreground">Bike ID: {formatBikeId(rental.ebikeId, index)}</p>
                        </div>
                        <div className="ml-auto font-medium">₱{(rental.rentalFee || 0).toFixed(2)}</div>
                    </div>
                )
            })}
             {!isLoadingRecent && (!rentals || rentals.length === 0) && (
              <p className="text-sm text-center text-muted-foreground col-span-full h-24 flex items-center justify-center">No recent rentals.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
