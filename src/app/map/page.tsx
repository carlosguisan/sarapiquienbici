
'use client';

import EventMap from '@/components/events/EventMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getEvents } from '@/lib/data';
import type { Event } from '@/lib/data';
import Link from 'next/link';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useCallback } from 'react';
import type { LngLatBounds } from 'maplibre-gl';

const headerFooterHeight = '10rem'; // Aproximación de la altura del header + footer

export default function MapPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<Event[]>([]);
  const [currentMapBounds, setCurrentMapBounds] = useState<LngLatBounds | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setIsLoadingEvents(true);
      const fetchedEvents = await getEvents();
      setAllEvents(fetchedEvents);
      // Initialize with all events, will be filtered once map bounds are available
      setVisibleEvents(fetchedEvents); 
      setIsLoadingEvents(false);
    }
    fetchEvents();
  }, []);

  const handleBoundsChange = useCallback((bounds: LngLatBounds) => {
    setCurrentMapBounds(bounds);
  }, []);

  useEffect(() => {
    if (currentMapBounds && allEvents.length > 0) {
      const filtered = allEvents.filter(event => {
        if (event.location.lat != null && event.location.lng != null && Number.isFinite(event.location.lat) && Number.isFinite(event.location.lng)) {
          return currentMapBounds.contains([event.location.lng, event.location.lat]);
        }
        return false;
      });
      setVisibleEvents(filtered);
    } else if (!currentMapBounds && allEvents.length > 0) {
      // If map bounds are not yet set, show all events or keep current list
      // For a better UX, we might want to wait for initial bounds or show a specific message.
      // For now, this ensures visibleEvents is initialized from allEvents if bounds are null.
      setVisibleEvents(allEvents);
    }
  }, [currentMapBounds, allEvents]);

  return (
    <div className="relative w-full" style={{ height: `calc(100vh - ${headerFooterHeight})` }}>
      <div className="absolute inset-0">
        <EventMap events={allEvents} interactive={true} onBoundsChange={handleBoundsChange} />
      </div>

      <Card className="absolute top-3 left-3 md:top-4 md:left-4 w-[calc(100%-1.5rem)] max-w-xs sm:max-w-sm max-h-[calc(100%-3rem)] md:max-h-[calc(100%-2rem)] bg-card/80 backdrop-blur-sm flex flex-col shadow-2xl rounded-md z-10 overflow-hidden">
        <CardHeader className="py-3 px-4 md:py-4 md:px-5 shrink-0">
          <CardTitle className="text-lg md:text-xl text-primary">
            Eventos Visibles ({isLoadingEvents ? '...' : visibleEvents.length})
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1 min-h-0"> {/* Adjusted classes for better flex scroll */}
          <CardContent className="space-y-2 md:space-y-3 p-3 md:p-4 pt-1 md:pt-2">
            {isLoadingEvents ? (
              <p className="text-muted-foreground text-sm text-center py-4">Cargando eventos...</p>
            ) : visibleEvents.length > 0 ? (
              visibleEvents.map((event: Event) => (
                <div key={event.id} className="p-2 md:p-3 border rounded-md bg-background/70 hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-primary/50">
                  <h4 className="font-semibold text-sm md:text-base text-foreground/90 truncate mb-0.5">{event.name}</h4>
                  <div className="flex items-center text-xs md:text-sm text-muted-foreground mb-1">
                    <MapPin className="h-3 w-3 mr-1.5 text-primary/70 flex-shrink-0" />
                    <span className="truncate">{event.location.address}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">
                    {event.shortDescription}
                  </p>
                  <Button asChild variant="link" size="sm" className="text-accent p-0 h-auto text-xs">
                    <Link href={`/events/${event.id}`}>
                      Ver detalles <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">
                No hay eventos visibles en esta área del mapa.
              </p>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
