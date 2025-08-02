
"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { ArrowLeft, LinkIcon } from "lucide-react"
import { addJewelry, updateJewelry } from "@/lib/services/productService"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Jewelry } from "@/lib/mock-data"


const jewelrySchema = z.object({
  name: z.string().min(1, "Jewelry name is required"),
  type: z.string().min(1, "Type is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  availability: z.boolean().default(true),
  imageUrl: z.string().url("Please enter a valid URL.").min(1, "Image URL is required."),
  unavailableDates: z.array(z.string()).optional(),
})

type JewelryEditFormProps = {
    initialData: Jewelry | null;
    isNewProduct: boolean;
}

export default function JewelryEditForm({ initialData, isNewProduct }: JewelryEditFormProps) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const form = useForm<z.infer<typeof jewelrySchema>>({
    resolver: zodResolver(jewelrySchema),
    defaultValues: initialData ? {
        ...initialData,
        unavailableDates: initialData.unavailableDates || []
    } : {
      name: "",
      type: "Necklace",
      price: 0,
      description: "",
      availability: true,
      imageUrl: "",
      unavailableDates: [],
    },
  })
  
  const imageUrl = form.watch("imageUrl");

  async function onSubmit(values: z.infer<typeof jewelrySchema>) {
    try {
        if(isNewProduct) {
            await addJewelry(values);
            toast({
                title: "Success!",
                description: `Jewelry "${values.name}" has been added.`
            });
        } else {
            await updateJewelry(id, values);
             toast({
                title: "Success!",
                description: `Jewelry "${values.name}" has been updated.`
            });
        }
        
        router.push("/admin/jewelry");
        router.refresh();
    } catch (error) {
        toast({
            variant: "destructive",
            title: isNewProduct ? "Error adding jewelry" : "Error updating jewelry",
            description: (error as Error).message,
        });
    }
  }

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                    <Link href="/admin/jewelry">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    {isNewProduct ? 'Add New Jewelry' : 'Edit Jewelry'}
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button variant="outline" size="sm" type="button" onClick={() => router.push("/admin/jewelry")}>
                        Discard
                    </Button>
                    <Button size="sm" type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Saving..." : "Save Jewelry"}
                    </Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card>
                    <CardHeader>
                        <CardTitle>Jewelry Details</CardTitle>
                        <CardDescription>
                            Fill in the information about the jewelry item.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Kundan Pearl Necklace" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="A detailed description of the item..."
                                        className="min-h-32"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Jewelry Image</CardTitle>
                            <CardDescription>
                             Provide a URL for the jewelry image.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image URL</FormLabel>
                                        <div className="flex items-start gap-4">
                                            <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center border shrink-0">
                                                {imageUrl ? (
                                                    <Image src={imageUrl} alt="Image Preview" width={96} height={96} className="object-cover rounded-md"/>
                                                ) : (
                                                    <LinkIcon className="h-8 w-8 text-muted-foreground"/>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <FormControl>
                                                    <Input 
                                                        placeholder="https://example.com/image.png"
                                                        {...field}
                                                        className="flex-1"
                                                    />
                                                </FormControl>
                                            </div>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Daily Availability</CardTitle>
                            <CardDescription>
                                Manually mark dates as unavailable. Click a date to select or unselect it. Booked dates are automatically added here.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="unavailableDates"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                             <Calendar
                                                mode="multiple"
                                                selected={(field.value || []).map(d => new Date(d))}
                                                onSelect={(dates) => {
                                                    const dateStrings = dates?.map(d => format(d, "yyyy-MM-dd")) || [];
                                                    field.onChange(dateStrings);
                                                }}
                                                className="rounded-md border"
                                                />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Type & Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="Necklace">Necklace</SelectItem>
                                    <SelectItem value="Earrings">Earrings</SelectItem>
                                    <SelectItem value="Bangles">Bangles</SelectItem>
                                    <SelectItem value="Full Set">Full Set</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                             <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Price (/day)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="₹1500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Master Availability</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="availability"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <FormLabel>In Stock</FormLabel>
                                            <FormDescription>
                                                Is this item available for rent?
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
                    </Card>
                </div>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden">
            <Button variant="outline" size="sm" type="button" onClick={() => router.push("/admin/jewelry")}>
                Discard
            </Button>
            <Button size="sm" type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Jewelry"}
            </Button>
          </div>
        </form>
      </Form>
  );
}
