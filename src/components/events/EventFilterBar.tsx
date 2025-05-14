
'use client';

import { useState } from 'react';
import { CalendarIcon, SearchIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Import Spanish locale

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Translated categories
const eventCategories = [
  { value: "__ALL_CATEGORIES_SENTINEL__", label: "Todas las Categorías" },
  { value: "Road Cycling", label: "Ciclismo de Ruta" },
  { value: "MTB", label: "MTB" },
  { value: "Family Ride", label: "Paseo Familiar" },
  { value: "Gravel", label: "Gravel" }
];
const ALL_CATEGORIES_SENTINEL_VALUE = "__ALL_CATEGORIES_SENTINEL__";

export default function EventFilterBar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);

  const handleSearch = () => {
    console.log('Buscando con filtros:', { 
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined, 
      category: selectedCategory
    });
  };

  const handleClearFilters = () => {
    setSelectedDate(undefined);
    setSelectedCategory(undefined);
    console.log('Filtros limpiados');
  }

  return (
    <Card className="mb-8 shadow-md">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
          {/* Date Picker */}
          <div className="flex-1 min-w-[180px]">
            <label htmlFor="event-date-picker" className="block text-sm font-medium text-muted-foreground mb-1.5">Fecha</label>
            <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="event-date-picker"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10", 
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setIsDatePopoverOpen(false);
                  }}
                  initialFocus
                  locale={es} // Pass Spanish locale to Calendar
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Category Select */}
          <div className="flex-1 min-w-[180px]">
             <label htmlFor="event-category-select" className="block text-sm font-medium text-muted-foreground mb-1.5">Categoría</label>
            <Select 
              value={selectedCategory} 
              onValueChange={(value) => {
                if (value === ALL_CATEGORIES_SENTINEL_VALUE) {
                  setSelectedCategory(undefined);
                } else {
                  setSelectedCategory(value);
                }
              }}
            >
              <SelectTrigger id="event-category-select" className="w-full h-10">
                <SelectValue placeholder="Todas las Categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipo de Evento</SelectLabel>
                  {eventCategories.map(category => (
                    <SelectItem 
                      key={category.value} 
                      value={category.value}
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {/* Search Button */}
          <Button onClick={handleSearch} className="w-full md:w-auto bg-primary hover:bg-primary/90 h-10">
            <SearchIcon className="mr-0 md:mr-2 h-4 w-4" />
            <span className="hidden md:inline">Buscar</span>
          </Button>

           {/* Clear Filters Button - only show if any filter is active */}
          {(selectedDate || selectedCategory) && (
            <Button onClick={handleClearFilters} variant="ghost" className="w-full md:w-auto text-muted-foreground h-10">
              Limpiar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
