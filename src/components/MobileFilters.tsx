import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MobileFiltersProps {
  halaqohOptions?: { id: string; nama: string }[];
  santriOptions?: { id: string; nama: string }[];
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  periode: string;
  halaqoh: string;
  santri: string;
}

const periodeOptions = [
  { id: "today", label: "Hari Ini" },
  { id: "week", label: "Minggu Ini" },
  { id: "month", label: "Bulan Ini" },
  { id: "semester", label: "Semester Ini" },
  { id: "all", label: "Semua" },
];

const defaultHalaqoh = [
  { id: "1", nama: "Halaqoh Al-Azhary" },
  { id: "2", nama: "Halaqoh Al-Furqon" },
];

const defaultSantri = [
  { id: "1", nama: "Muhammad Faiz" },
  { id: "2", nama: "Fatimah Zahra" },
  { id: "3", nama: "Aisyah Nur" },
  { id: "4", nama: "Ahmad Fauzi" },
];

export function MobileFilters({ 
  halaqohOptions = defaultHalaqoh, 
  santriOptions = defaultSantri,
  onFilterChange 
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    periode: "all",
    halaqoh: "all",
    santri: "all",
  });

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = { periode: "all", halaqoh: "all", santri: "all" };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = filters.periode !== "all" || filters.halaqoh !== "all" || filters.santri !== "all";

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </Button>
        </CollapsibleTrigger>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1 text-muted-foreground">
            <X className="w-3 h-3" />
            Reset
          </Button>
        )}
      </div>
      
      <CollapsibleContent className="mt-3 space-y-3">
        {/* Periode */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Periode</label>
          <Select value={filters.periode} onValueChange={(v) => handleFilterChange("periode", v)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodeOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Halaqoh */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Halaqoh</label>
          <Select value={filters.halaqoh} onValueChange={(v) => handleFilterChange("halaqoh", v)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Halaqoh</SelectItem>
              {halaqohOptions.map((h) => (
                <SelectItem key={h.id} value={h.id}>
                  {h.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Santri */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Santri</label>
          <Select value={filters.santri} onValueChange={(v) => handleFilterChange("santri", v)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Santri</SelectItem>
              {santriOptions.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
