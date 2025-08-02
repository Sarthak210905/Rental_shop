
"use client";

import Image from "next/image";
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
import { getJewelry, deleteProduct, updateJewelry } from "@/lib/services/productService";
import { Jewelry } from "@/lib/mock-data";
import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";


export default function AdminJewelryPage() {
  const [jewelry, setJewelry] = useState<Jewelry[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Jewelry | null>(null);
  const { toast } = useToast();

  async function fetchJewelry() {
      const jewelryData = await getJewelry();
      setJewelry(jewelryData);
  }
  
  useEffect(() => {
    fetchJewelry();
  }, []);
  
  const openDeleteDialog = (item: Jewelry) => {
    setProductToDelete(item);
    setIsAlertOpen(true);
  }

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
        await deleteProduct(productToDelete.id, 'jewelry');
        toast({
            title: "Product Deleted",
            description: `"${productToDelete.name}" has been successfully deleted.`,
        });
        fetchJewelry(); // Refresh the list
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error Deleting Product",
            description: (error as Error).message,
        });
    } finally {
        setIsAlertOpen(false);
        setProductToDelete(null);
    }
  }

  const handleAvailabilityToggle = async (item: Jewelry, newAvailability: boolean) => {
    try {
      await updateJewelry(item.id, { availability: newAvailability });
      toast({
        title: "Status Updated",
        description: `"${item.name}" is now ${newAvailability ? 'Available' : 'Unavailable'}.`
      });
      fetchJewelry();
    } catch (error) {
       toast({
          variant: "destructive",
          title: "Error Updating Status",
          description: (error as Error).message,
      });
    }
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Jewelry</CardTitle>
                <CardDescription>
                Manage your jewelry inventory.
                </CardDescription>
            </div>
            <Button asChild>
                <Link href="/admin/jewelry/edit/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Jewelry
                </Link>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jewelry.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={item.name}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={item.imageUrl}
                    width="64"
                    data-ai-hint={item.hint}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                        id={`availability-${item.id}`}
                        checked={item.availability}
                        onCheckedChange={(newVal) => handleAvailabilityToggle(item, newVal)}
                        aria-label="Toggle Availability"
                    />
                     <Badge variant={item.availability ? "default" : "secondary"} className={item.availability ? 'bg-green-600 text-white' : ''}>
                        {item.availability ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>₹{item.price.toFixed(2)}</TableCell>
                <TableCell>{item.type}</TableCell>
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
                               <Link href={`/admin/jewelry/edit/${item.id}`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(item)}>
                                Delete
                            </DropdownMenuItem>
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
              product "{productToDelete?.name}".
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
