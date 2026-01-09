import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface FilterOption {
  value: string;
  label: string;
}

export interface FilterValues {
  periode: string;
  halaqoh: string;
  santri: string;
}

interface MobileFiltersProps {
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  onFilterChange?: (values: FilterValues) => void;
  filters?: {
    name: string;
    label: string;
    options: FilterOption[];
    value?: string;
    onChange?: (value: string) => void;
  }[];
}

export default function MobileFilters({
  searchPlaceholder = "Cari...",
  onSearchChange,
  onFilterChange,
  filters = [],
}: MobileFiltersProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const hasActiveFilters = filters.some(f => f.value && f.value !== "all");

  return (
    <div className="sticky top-0 z-30 bg-background border-b border-border p-3 space-y-2">
      <div className="flex gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-10"
          />
          {searchValue && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        {filters.length > 0 && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative h-10 w-10">
                <Filter className="h-4 w-4" />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto max-h-[70vh]">
              <SheetHeader>
                <SheetTitle>Filter</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4 pb-4">
                {filters.map((filter) => (
                  <div key={filter.name} className="space-y-2">
                    <label className="text-sm font-medium">{filter.label}</label>
                    <Select
                      value={filter.value}
                      onValueChange={filter.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Pilih ${filter.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        {filter.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
}
