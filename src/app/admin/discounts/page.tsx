
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getDiscounts, deleteDiscount } from "@/lib/services/discountService";
import { useEffect, useState } from "react";
import { Discount } from "@/lib/mock-data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";


export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<Discount | null>(null);
  const { toast } = useToast();
  
  async function fetchDiscounts() {
      const discountsData = await getDiscounts();
      setDiscounts(discountsData);
  }

  useEffect(() => {
    fetchDiscounts();
  }, []);
  
  const openDeleteDialog = (discount: Discount) => {
    setDiscountToDelete(discount);
    setIsAlertOpen(true);
  };
  
  const handleDelete = async () => {
      if (!discountToDelete) return;
      try {
          await deleteDiscount(discountToDelete.id);
          toast({
              title: "Discount Deleted",
              description: `Discount code "${discountToDelete.code}" has been deleted.`,
          });
          fetchDiscounts();
      } catch (error) {
           toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to delete discount.",
          });
      } finally {
          setIsAlertOpen(false);
          setDiscountToDelete(null);
      }
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Discounts</CardTitle>
                <CardDescription>
                Manage your promotional codes.
                </CardDescription>
            </div>
            <Button asChild>
                <Link href="/admin/discounts/edit/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Discount
                </Link>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.map((discount) => (
              <TableRow key={discount.id}>
                <TableCell className="font-mono font-medium">{discount.code}</TableCell>
                <TableCell>{discount.title}</TableCell>
                <TableCell>
                  <Badge variant={discount.status === "active" ? "default" : "secondary"} className={discount.status === 'active' ? 'bg-green-500 text-white' : ''}>
                    {discount.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(discount.expiry).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                            >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/discounts/edit/${discount.id}`}>Edit</Link>
                            </DropdownMenuItem>
                             <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(discount)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              discount code "{discountToDelete?.code}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
