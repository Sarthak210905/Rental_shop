
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters" }),
});

const notificationSchema = z.object({
  promotionalEmails: z.boolean().default(false),
  bookingUpdates: z.boolean().default(true),
});

export default function SettingsPage() {
  const { toast } = useToast();

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      promotionalEmails: false,
      bookingUpdates: true,
    },
  });

  function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    // In a real app, you would handle the password change with Firebase Auth.
    // For now, we'll just show a toast.
    console.log(values);
    toast({
      title: "Password Updated",
      description: "Your password has been changed (simulation).",
    });
    passwordForm.reset();
  }

  function onNotificationSubmit(values: z.infer<typeof notificationSchema>) {
     // In a real app, you'd save these preferences to the user's profile in Firestore.
    console.log(values);
     toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  }


  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your account's password. It's a good practice to use a strong, unique password.
          </CardDescription>
        </CardHeader>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                 {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Manage how you receive communications from us.
          </CardDescription>
        </CardHeader>
        <Form {...notificationForm}>
          <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}>
            <CardContent className="space-y-4">
                <FormField
                  control={notificationForm.control}
                  name="promotionalEmails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Promotional Emails</FormLabel>
                            <FormDescription>
                                Receive emails about new arrivals, special offers, and discounts.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={notificationForm.control}
                  name="bookingUpdates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Booking Updates</FormLabel>
                            <FormDescription>
                                Get notified about your booking status, from confirmation to return.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                  )}
                />
            </CardContent>
             <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={notificationForm.formState.isSubmitting}>
                 {notificationForm.formState.isSubmitting ? "Saving..." : "Save Preferences"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
