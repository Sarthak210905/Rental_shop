
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
import { getDresses, deleteProduct, updateProduct } from "@/lib/services/productService";
import { Dress } from "@/lib/mock-data";
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


export default function AdminProductsPage() {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Dress | null>(null);
  const { toast } = useToast();

  async function fetchDresses() {
      const dressesData = await getDresses();
      setDresses(dressesData);
  }
  
  useEffect(() => {
    fetchDresses();
  }, []);
  
  const openDeleteDialog = (dress: Dress) => {
    setProductToDelete(dress);
    setIsAlertOpen(true);
  }

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
        await deleteProduct(productToDelete.id, 'dresses');
        toast({
            title: "Product Deleted",
            description: `"${productToDelete.name}" has been successfully deleted.`,
        });
        fetchDresses(); // Refresh the list
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

  const handleAvailabilityToggle = async (dress: Dress, newAvailability: boolean) => {
    try {
      await updateProduct(dress.id, { availability: newAvailability });
      toast({
        title: "Status Updated",
        description: `"${dress.name}" is now ${newAvailability ? 'Available' : 'Unavailable'}.`
      });
      fetchDresses();
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
                <CardTitle>Dresses</CardTitle>
                <CardDescription>
                Manage your dress inventory.
                </CardDescription>
            </div>
            <Button asChild>
                <Link href="/admin/products/edit/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Dress
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
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dresses.map((dress) => (
              <TableRow key={dress.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={dress.name}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={dress.imageUrl}
                    width="64"
                    data-ai-hint={dress.hint}
                  />
                </TableCell>
                <TableCell className="font-medium">{dress.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                        id={`availability-${dress.id}`}
                        checked={dress.availability}
                        onCheckedChange={(newVal) => handleAvailabilityToggle(dress, newVal)}
                        aria-label="Toggle Availability"
                    />
                     <Badge variant={dress.availability ? "default" : "secondary"} className={dress.availability ? 'bg-green-600 text-white' : ''}>
                        {dress.availability ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>₹{dress.price.toFixed(2)}</TableCell>
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
                               <Link href={`/admin/products/edit/${dress.id}`}>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(dress)}>
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
