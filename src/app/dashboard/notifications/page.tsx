
'use client';

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
import { NotificationSetting } from "@/lib/types";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const initialSettings: NotificationSetting[] = [
    { id: 'rental-reminders', label: 'Rental Time Reminders', description: 'Notify renters before their rental period ends.', active: true },
    { id: 'payment-due', label: 'Payment Due Notices', description: 'Send automated reminders for overdue payments.', active: true },
    { id: 'lock-warnings', label: 'Lock Warnings', description: 'Warn users before an e-bike is locked due to non-payment.', active: false },
]

export default function NotificationsPage() {
  const [notificationSettings, setNotificationSettings] = useState(initialSettings);
  const [announcement, setAnnouncement] = useState("");
  const { toast } = useToast();

  const handleToggle = (id: 'rental-reminders' | 'payment-due' | 'lock-warnings') => {
    setNotificationSettings(currentSettings =>
      currentSettings.map(setting =>
        setting.id === id ? { ...setting, active: !setting.active } : setting
      )
    );
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (announcement.trim() === "") {
        toast({
            title: "Empty Message",
            description: "Cannot send an empty announcement.",
            variant: "destructive"
        });
        return;
    }
    toast({
        title: "Announcement Sent!",
        description: `Message: "${announcement}"`,
    });
    setAnnouncement("");
  };


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
                  checked={setting.active}
                  onCheckedChange={() => handleToggle(setting.id)}
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
            <form className="space-y-4" onSubmit={handleSendAnnouncement}>
                <Textarea
                    placeholder="Type your announcement here..."
                    className="min-h-36"
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                />
                <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" /> Send Announcement
                </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
