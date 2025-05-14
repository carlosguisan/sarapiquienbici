
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Route, ExternalLink } from 'lucide-react';
import EventMap from './EventMap'; // Import the EventMap component

interface GpxRoutePlaceholderProps {
  eventName: string;
  gpxRouteUrl?: string;
}

export default function GpxRoutePlaceholder({ eventName, gpxRouteUrl }: GpxRoutePlaceholderProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-6 w-6 text-primary" />
          Ruta del Evento: {eventName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {gpxRouteUrl ? (
          <>
            <div className="h-96 md:h-[450px] w-full rounded-md overflow-hidden border border-border shadow-inner mb-4">
              <EventMap gpxUrl={gpxRouteUrl} interactive={true} />
            </div>
            <p className="text-sm">
              <a
                href={gpxRouteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-accent hover:underline"
              >
                Descargar archivo GPX <ExternalLink className="h-4 w-4 ml-1.5" />
              </a>
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">No hay ruta GPX disponible para este evento.</p>
        )}
      </CardContent>
    </Card>
  );
}
