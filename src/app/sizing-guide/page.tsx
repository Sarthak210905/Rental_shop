import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SizingGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-headline">Sizing Guide</CardTitle>
          <CardDescription>
            Find your perfect fit. All our dresses are designed to be 'free size' to accommodate a range of body types.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground mb-6">Our 'free size' garments are typically adjustable with drawstrings, ties, and elasticated waistbands. Below are the general measurements to help you determine if our outfits will be a good fit for you.</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Measurement</TableHead>
                <TableHead>Chaniya Choli / Lehenga</TableHead>
                <TableHead>Kediyu (Men's)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Bust (Blouse)</TableCell>
                <TableCell>Adjustable up to 42 inches</TableCell>
                <TableCell>N/A</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Waist (Skirt)</TableCell>
                <TableCell>Adjustable from 28 to 40 inches</TableCell>
                <TableCell>N/A</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Skirt Length</TableCell>
                <TableCell>Approximately 40-42 inches</TableCell>
                <TableCell>N/A</TableCell>
              </TableRow>
               <TableRow>
                <TableCell className="font-medium">Chest (Kediyu)</TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>Fits up to 44 inches</TableCell>
              </TableRow>
               <TableRow>
                <TableCell className="font-medium">Kediyu Length</TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>Approximately 30-32 inches</TableCell>
              </TableRow>
            </TableBody>
          </Table>
           <p className="text-center text-muted-foreground mt-6 text-sm">If you have specific sizing questions, please don't hesitate to <a href="/contact" className="text-primary underline">contact us</a>.</p>
        </CardContent>
      </Card>
    </div>
  );
}
