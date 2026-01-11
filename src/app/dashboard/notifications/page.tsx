import { Bell, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { notificationSettings } from "@/lib/data";

export default function NotificationsPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Automated Alerts</CardTitle>
            <CardDescription>
              Configure automated alerts sent to renters for important events.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {notificationSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor={setting.id} className="text-base">
                    {setting.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                <Switch
                  id={setting.id}
                  aria-label={setting.label}
                  defaultChecked={setting.active}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
      <Card>
          <CardHeader>
            <CardTitle>Broadcast Announcements</CardTitle>
            <CardDescription>
              Send a message to all active renters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
                <Textarea
                    placeholder="Type your announcement here..."
                    className="min-h-36"
                />
                <Button className="w-full">
                    <Send className="mr-2 h-4 w-4" /> Send Announcement
                </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
