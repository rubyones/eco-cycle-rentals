import { MaintenanceForm } from "./maintenance-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function MaintenancePage() {
    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Predictive Maintenance</CardTitle>
                    <CardDescription>
                        Generate predictive maintenance schedules based on historical issue data and real-time e-bike status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MaintenanceForm />
                </CardContent>
            </Card>
        </div>
    );
}
