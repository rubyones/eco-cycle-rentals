'use server';

/**
 * @fileOverview Generates predictive maintenance schedules for e-bikes based on historical issue data and real-time status.
 *
 * - generatePredictiveMaintenanceSchedule - A function that generates the predictive maintenance schedule.
 * - PredictiveMaintenanceScheduleInput - The input type for the generatePredictiveMaintenanceSchedule function.
 * - PredictiveMaintenanceScheduleOutput - The return type for the generatePredictiveMaintenanceSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveMaintenanceScheduleInputSchema = z.object({
  historicalIssueData: z
    .string()
    .describe(
      'Historical data of issues reported for each e-bike, including date, description, and resolution.'
    ),
  realTimeEbikeStatus: z
    .string()
    .describe(
      'Real-time status of each e-bike, including battery level, current location, and usage statistics.'
    ),
});
export type PredictiveMaintenanceScheduleInput = z.infer<
  typeof PredictiveMaintenanceScheduleInputSchema
>;

const PredictiveMaintenanceScheduleOutputSchema = z.object({
  predictiveMaintenanceSchedule: z
    .string()
    .describe(
      'A detailed maintenance schedule for each e-bike, including predicted maintenance dates and required actions.'
    ),
});
export type PredictiveMaintenanceScheduleOutput = z.infer<
  typeof PredictiveMaintenanceScheduleOutputSchema
>;

export async function generatePredictiveMaintenanceSchedule(
  input: PredictiveMaintenanceScheduleInput
): Promise<PredictiveMaintenanceScheduleOutput> {
  return predictiveMaintenanceScheduleFlow(input);
}

const predictiveMaintenanceSchedulePrompt = ai.definePrompt({
  name: 'predictiveMaintenanceSchedulePrompt',
  input: {schema: PredictiveMaintenanceScheduleInputSchema},
  output: {schema: PredictiveMaintenanceScheduleOutputSchema},
  prompt: `You are an expert in predicting maintenance schedules for e-bikes.

  Based on the historical issue data and real-time e-bike status provided, generate a predictive maintenance schedule for each e-bike.

  Historical Issue Data: {{{historicalIssueData}}}
  Real-Time E-Bike Status: {{{realTimeEbikeStatus}}}

  Provide a detailed maintenance schedule, including predicted maintenance dates and required actions for each e-bike.
  The maintenance schedule should be comprehensive and easy to understand.
  Consider the severity and frequency of past issues, as well as the current status of each e-bike, to determine the urgency and type of maintenance required.
  Ensure that the maintenance schedule optimizes the lifespan and performance of the e-bikes while minimizing downtime.
`,
});

const predictiveMaintenanceScheduleFlow = ai.defineFlow(
  {
    name: 'predictiveMaintenanceScheduleFlow',
    inputSchema: PredictiveMaintenanceScheduleInputSchema,
    outputSchema: PredictiveMaintenanceScheduleOutputSchema,
  },
  async input => {
    const {output} = await predictiveMaintenanceSchedulePrompt(input);
    return output!;
  }
);
