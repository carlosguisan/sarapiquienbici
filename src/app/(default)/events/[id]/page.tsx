
import { getEventById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, Clock, Tag, Link as LinkIcon, Facebook, Instagram, Twitter, Globe, Route as RouteIcon, ExternalLink, X as XIcon } from 'lucide-react';
import GpxRoutePlaceholder from '@/components/events/GpxRoutePlaceholder';
import EventMap from '@/components/events/EventMap';
import type { SocialLink } from '@/lib/data';
import { Button } from '@/components/ui/button';

// Helper to get appropriate social icon
const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook': return <Facebook className="h-4 w-4" />;
    case 'instagram': return <Instagram className="h-4 w-4" />;
    case 'twitter': return <Twitter className="h-4 w-4" />;
    case 'website': return <Globe className="h-4 w-4" />;
    case 'strava': return <RouteIcon className="h-4 w-4" />; // Using RouteIcon as a stand-in for Strava
    default: return <LinkIcon className="h-4 w-4" />;
  }
};

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);

  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.date);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <article>
          <header className="mb-8">
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg mb-6">
              <img
                src={event.imageUrl}
                alt={event.name}
                className="w-full h-full object-cover"
                data-ai-hint="cycling race action"
              />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-3">{event.name}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground mb-2">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-5 w-5 text-accent" />
                {eventDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-5 w-5 text-accent" />
                {eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
              <MapPin className="h-5 w-5 text-accent" />
              {event.location.address}
            </div>
            {event.category && (
              <Badge variant="default" className="bg-primary/80 text-primary-foreground flex items-center gap-1 w-fit">
                <Tag className="h-4 w-4" />
                {event.category}
              </Badge>
            )}
          </header>
          
          <Separator className="my-8" />

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle>Descripción del Evento</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{event.fullDescription}</p>
                </CardContent>
              </Card>

              {event.schedule && event.schedule.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Horario</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {event.schedule.map((item, index) => (
                        <li key={index} className="flex gap-4 items-start">
                          <Badge variant="outline" className="text-accent border-accent whitespace-nowrap mt-1">{item.time}</Badge>
                          <p className="text-foreground/80">{item.activity}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              
              <GpxRoutePlaceholder eventName={event.name} gpxRouteUrl={event.gpxRouteUrl} />

            </div>

            <aside className="space-y-6">
              
               {event.location.lat && event.location.lng && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-6 w-6 text-primary" />
                      Ubicación en el Mapa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 md:h-[400px] w-full rounded-md overflow-hidden border border-border shadow-inner">
                      <EventMap event={event} interactive={false} />
                    </div>
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Organizador</CardTitle></CardHeader>
                <CardContent>
                  <p className="font-semibold text-foreground/90 mb-2">{event.organizerName}</p>
                  {event.organizerSocial && event.organizerSocial.length > 0 && (
                    <ul className="space-y-1.5">
                      {event.organizerSocial.map((social, index) => (
                        <li key={index}>
                          <Button 
                            variant="link" 
                            asChild 
                            className="p-0 h-auto text-sm text-accent hover:underline flex items-center gap-2"
                          >
                            <a 
                              href={social.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                            >
                              {getSocialIcon(social.platform)}
                              {social.platform}
                              <ExternalLink className="h-3 w-3 ml-0.5" />
                            </a>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </aside>
          </div>
        </article>
      </div>
    </div>
  );
}
