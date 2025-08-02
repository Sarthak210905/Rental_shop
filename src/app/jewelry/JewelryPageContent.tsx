
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import DressCard from "@/components/DressCard";
import { Jewelry } from "@/lib/mock-data";
import { useState, useMemo } from "react";

type JewelryPageContentProps = {
    jewelry: Jewelry[];
    uniqueTypes: string[];
}

export default function JewelryPageContent({ jewelry, uniqueTypes }: JewelryPageContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
  useState(() => {
    setSelectedTypes(uniqueTypes);
  });

  const handleTypeFilterChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((s) => s !== type)
        : [...prev, type]
    );
  };

  const filteredJewelry = useMemo(() => {
    return jewelry.filter((item) => {
      const searchTermMatch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(item.type);

      return searchTermMatch && typeMatch;
    });
  }, [searchTerm, selectedTypes, jewelry]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for 'earrings'..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {uniqueTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => handleTypeFilterChange(type)}
              >
                {type}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredJewelry.map((item) => (
          <DressCard key={item.id} dress={item} />
        ))}
      </div>
    </>
  );
}
