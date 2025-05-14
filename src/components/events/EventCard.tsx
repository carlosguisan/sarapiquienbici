
import type { Event } from '@/lib/data';
// Removed Image from next/image
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, MapPin, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);

  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          {/* Replaced next/image with standard img tag */}
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover"
            data-ai-hint="cycling event outdoor"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl mb-2 line-clamp-2">{event.name}</CardTitle>
        <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span>{eventDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })} - {eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{event.location.address}</span>
        </div>
        <p className="text-sm text-foreground/80 line-clamp-3 mb-3">
          {event.shortDescription}
        </p>
        {event.category && (
          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
            <Tag className="h-3 w-3" />
            {event.category}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/events/${event.id}`}>Ver Detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
