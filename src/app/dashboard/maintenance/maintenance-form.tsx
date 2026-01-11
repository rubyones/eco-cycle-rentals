'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, Loader2 } from 'lucide-react';

import { generatePredictiveMaintenanceSchedule, PredictiveMaintenanceScheduleInput } from '@/ai/flows/predictive-maintenance-schedule';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  historicalIssueData: z.string().min(10, "Please provide more detailed historical data."),
  realTimeEbikeStatus: z.string().min(10, "Please provide more detailed real-time status."),
});

export function MaintenanceForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      historicalIssueData: "Bike EBK004: Battery drain issue reported on 2024-05-15, resolved by replacing battery. Frequent brake adjustments needed every 2 months.\nBike EBK005: Flat tire on 2024-04-20. Chain replacement on 2024-03-10.",
      realTimeEbikeStatus: "Bike EBK004: Battery at 30%, last used 2 hours ago, mileage 1500km.\nBike EBK005: Battery at 75%, currently under maintenance, mileage 800km.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    try {
      const input: PredictiveMaintenanceScheduleInput = values;
      const response = await generatePredictiveMaintenanceSchedule(input);
      setResult(response.predictiveMaintenanceSchedule);
    } catch (error) {
      console.error("Error generating maintenance schedule:", error);
      toast({
        title: "Error",
        description: "Failed to generate maintenance schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="historicalIssueData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Historical Issue Data</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Bike EBK001: Brake pads replaced on 2024-01-15..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="realTimeEbikeStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Real-Time E-Bike Status</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Bike EBK001: Battery 85%, Location: Central Park..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : 'Generate Schedule'}
          </Button>
        </form>
      </Form>

      <div className="lg:mt-0">
        <Card className={`min-h-full transition-opacity ${loading || result ? 'opacity-100' : 'opacity-50'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              AI-Generated Schedule
            </CardTitle>
            <CardDescription>
                {loading ? "The AI is analyzing the data..." : "The generated maintenance schedule will appear here."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {result && (
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {result}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
