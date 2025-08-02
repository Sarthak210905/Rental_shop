
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
import Link from "next/link"
import { ArrowLeft, CalendarIcon } from "lucide-react"
import { addDiscount, getDiscountById, updateDiscount } from "@/lib/services/discountService"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"


const discountSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(15, "Code cannot be longer than 15 characters").transform(val => val.toUpperCase()),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  expiry: z.date({ required_error: "Expiry date is required." }),
  status: z.enum(['active', 'expired']),
  type: z.enum(['percentage', 'fixed']),
  value: z.coerce.number().min(0.01, "Discount value must be greater than 0"),
  minOrderAmount: z.coerce.number().min(0, "Minimum order must be 0 or more"),
})

export default function EditDiscountPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const isNewDiscount = id === 'new';

  const form = useForm<z.infer<typeof discountSchema>>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: "",
      title: "",
      description: "",
      status: 'active',
      type: 'percentage',
      value: 10,
      minOrderAmount: 0,
    },
  })
  
  useEffect(() => {
    if (!isNewDiscount) {
      setIsLoading(true);
      getDiscountById(id).then(discount => {
        if (discount) {
          form.reset({
            ...discount,
            expiry: new Date(discount.expiry)
          });
        }
        setIsLoading(false);
      });
    } else {
        setIsLoading(false);
    }
  }, [id, isNewDiscount, form]);
  
  async function onSubmit(values: z.infer<typeof discountSchema>) {
    try {
        const dataToSave = {
            ...values,
            expiry: values.expiry.toISOString(),
        }

        if(isNewDiscount) {
            await addDiscount(dataToSave);
            toast({
                title: "Success!",
                description: `Discount "${values.code}" has been created.`
            });
        } else {
            await updateDiscount(id as string, dataToSave);
             toast({
                title: "Success!",
                description: `Discount "${values.code}" has been updated.`
            });
        }
        
        router.push("/admin/discounts");
        router.refresh();
    } catch (error) {
        toast({
            variant: "destructive",
            title: isNewDiscount ? "Error adding discount" : "Error updating discount",
            description: (error as Error).message,
        });
    }
  }
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                    <Link href="/admin/discounts">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    {isNewDiscount ? 'Add New Discount' : 'Edit Discount'}
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button variant="outline" size="sm" type="button" onClick={() => router.push("/admin/discounts")}>
                        Discard
                    </Button>
                    <Button size="sm" type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Saving..." : "Save Discount"}
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Discount Details</CardTitle>
                    <CardDescription>
                        Fill in the information for the promotional code.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Discount Code</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. FESTIVE10" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 10% Off Festive Wear" {...field} />
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
                                    placeholder="A brief description of what this discount offers..."
                                    className="min-h-24"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Discount Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="percentage">Percentage</SelectItem>
                                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Value ({form.watch('type') === 'percentage' ? '%' : '₹'})</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g. 10" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                     </div>
                      <FormField
                        control={form.control}
                        name="minOrderAmount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Minimum Order Amount (₹)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g. 500" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="expiry"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Expiry Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date < new Date()
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>
          
          <div className="flex items-center justify-end gap-2 md:hidden">
            <Button variant="outline" size="sm" type="button" onClick={() => router.push("/admin/discounts")}>
                Discard
            </Button>
            <Button size="sm" type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Discount"}
            </Button>
          </div>
        </form>
      </Form>
  );
}
