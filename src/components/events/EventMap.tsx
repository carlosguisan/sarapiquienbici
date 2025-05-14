
'use client';

import type { Event } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, ScaleControl, Source, Layer } from 'react-map-gl/maplibre';
import type { MapRef, LngLatBounds, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Link from 'next/link';
import { MapPin, ExternalLink, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Feature, LineString as GeoJsonLineString } from 'geojson';
import GpxParser from 'gpxparser'; // Corrected import


interface EventMapProps {
  event?: Event;
  events?: Event[];
  gpxUrl?: string;
  className?: string;
  interactive?: boolean;
  onBoundsChange?: (bounds: maplibregl.LngLatBounds) => void;
}

const DEFAULT_CENTER_LAT = 10.4550;
const DEFAULT_CENTER_LNG = -84.0100;
const DEFAULT_ZOOM = 9;
const SINGLE_EVENT_ZOOM = 13;
const GPX_OVERVIEW_ZOOM = 10;

const osmRasterStyle = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: 'osm-raster',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export default function EventMap({
  event,
  events,
  gpxUrl,
  className,
  interactive = true,
  onBoundsChange,
}: EventMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [popupCoordinates, setPopupCoordinates] = useState<[number, number] | undefined>(undefined);
  const mapRef = useRef<MapRef | null>(null);

  const [routeGeoJson, setRouteGeoJson] = useState<Feature<GeoJsonLineString> | null>(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [mapStylePrimaryColor, setMapStylePrimaryColor] = useState('hsl(var(--primary))'); 
  const [mapStyleAccentColor, setMapStyleAccentColor] = useState('hsl(var(--accent))');


  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const primaryColorValue = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
      if (primaryColorValue) setMapStylePrimaryColor(`hsl(${primaryColorValue})`);

      const accentColorValue = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      if (accentColorValue) setMapStyleAccentColor(`hsl(${accentColorValue})`);
    }
  }, []);

  useEffect(() => {
    if (!gpxUrl || !isClient) {
      setRouteGeoJson(null);
      return;
    }

    const loadGpxRoute = async () => {
      setIsRouteLoading(true);
      setRouteError(null);
      setRouteGeoJson(null);

      try {
        const response = await fetch(gpxUrl);
        if (!response.ok) {
          throw new Error(`Error al cargar GPX: ${response.statusText} (URL: ${gpxUrl})`);
        }
        const gpxText = await response.text();

        const gpx = new GpxParser(); // Use constructor
        gpx.parse(gpxText);

        if (!gpx.tracks || gpx.tracks.length === 0 || !gpx.tracks[0].points || gpx.tracks[0].points.length === 0) {
          throw new Error('El archivo GPX no contiene datos de track válidos.');
        }

        const coordinates = gpx.tracks[0].points.map(p => [p.lon, p.lat]);
        if (coordinates.length < 2) {
          throw new Error('La ruta GPX debe tener al menos dos puntos.');
        }

        const geojsonFeature: Feature<GeoJsonLineString> = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        };
        setRouteGeoJson(geojsonFeature);

      } catch (error) {
        console.error("Error cargando o parseando la ruta GPX:", error);
        setRouteError(error instanceof Error ? error.message : 'Error desconocido al cargar la ruta GPX');
      } finally {
        setIsRouteLoading(false);
      }
    };

    loadGpxRoute();
  }, [gpxUrl, isClient]);
  
  const displayEvents = useMemo(() => {
    if (gpxUrl) return []; 
    const allEvents = event ? [event] : events || [];
    return allEvents.filter(
      (ev) =>
        ev.location.lat != null &&
        ev.location.lng != null &&
        Number.isFinite(ev.location.lat) &&
        Number.isFinite(ev.location.lng)
    );
  }, [event, events, gpxUrl]);

  const initialViewState = useMemo(() => {
    if (gpxUrl) {
      return { 
        longitude: DEFAULT_CENTER_LNG,
        latitude: DEFAULT_CENTER_LAT,
        zoom: GPX_OVERVIEW_ZOOM,
      };
    }
    if (event && Number.isFinite(event.location.lat) && Number.isFinite(event.location.lng)) {
      return {
        longitude: event.location.lng!,
        latitude: event.location.lat!,
        zoom: SINGLE_EVENT_ZOOM,
      };
    }
    if (displayEvents.length > 0) { 
      const firstValidEvent = displayEvents.find(ev => Number.isFinite(ev.location.lat) && Number.isFinite(ev.location.lng));
      if (firstValidEvent) {
        return {
          longitude: firstValidEvent.location.lng!,
          latitude: firstValidEvent.location.lat!,
          zoom: DEFAULT_ZOOM,
        };
      }
    }
    return {
      longitude: DEFAULT_CENTER_LNG,
      latitude: DEFAULT_CENTER_LAT,
      zoom: DEFAULT_ZOOM,
    };
  }, [event, displayEvents, gpxUrl]);

  const mapStyle = useMemo(() => osmRasterStyle as maplibregl.StyleSpecification, []);

  const handleMarkerClick = useCallback((clickedEvent: Event, e: MapLayerMouseEvent) => {
    if (!interactive) return;
    
    e.originalEvent.stopPropagation();

    if (clickedEvent.location.lat != null && clickedEvent.location.lng != null &&
        Number.isFinite(clickedEvent.location.lat) && Number.isFinite(clickedEvent.location.lng)) {
      setSelectedEvent(clickedEvent);
      setPopupCoordinates([clickedEvent.location.lng, clickedEvent.location.lat]);
      
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [clickedEvent.location.lng, clickedEvent.location.lat],
          zoom: Math.max(mapRef.current.getZoom(), SINGLE_EVENT_ZOOM -1),
          speed: 1.2,
        });
      }
    }
  }, [interactive]);

  const handlePopupClose = useCallback(() => {
    setSelectedEvent(null);
    setPopupCoordinates(undefined);
  }, []);

  const handleMapLoad = useCallback(() => {
    const mapInstance = mapRef.current?.getMap();
    if (mapInstance) {
      if (gpxUrl && routeGeoJson) {
        const coordinates = routeGeoJson.geometry.coordinates;
        if (coordinates.length > 0) {
          const bounds = new maplibregl.LngLatBounds();
          coordinates.forEach(coord => bounds.extend(coord as [number, number]));
           if (!bounds.isEmpty()) {
            mapInstance.fitBounds(bounds, { padding: 50, duration: 0 });
          }
        }
      } else if (!gpxUrl && !event && displayEvents.length > 1) { 
        const bounds = new maplibregl.LngLatBounds();
        displayEvents.forEach((ev) => {
          if (Number.isFinite(ev.location.lng) && Number.isFinite(ev.location.lat)) {
            bounds.extend([ev.location.lng!, ev.location.lat!]);
          }
        });
        if (!bounds.isEmpty()) {
          mapInstance.fitBounds(bounds, { padding: 60, maxZoom: SINGLE_EVENT_ZOOM - 1, duration: 0 });
        }
      } else if (!gpxUrl && event) { 
         if (Number.isFinite(event.location.lng) && Number.isFinite(event.location.lat)) {
            mapInstance.flyTo({
                center: [event.location.lng!, event.location.lat!],
                zoom: SINGLE_EVENT_ZOOM,
                duration: 0,
            });
        }
      }

      if (onBoundsChange) {
        onBoundsChange(mapInstance.getBounds());
      }
    }
  }, [event, displayEvents, gpxUrl, routeGeoJson, onBoundsChange]);
  
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (map && gpxUrl && routeGeoJson && routeGeoJson.geometry.coordinates.length > 0) {
      const coordinates = routeGeoJson.geometry.coordinates;
      const bounds = new maplibregl.LngLatBounds();
      coordinates.forEach(coord => bounds.extend(coord as [number, number]));
       if (!bounds.isEmpty()) {
         map.fitBounds(bounds, { padding: 50, duration: 1000 });
      }
    }
  }, [routeGeoJson, gpxUrl]);


  const handleMapMoveEnd = useCallback(() => {
    const mapInstance = mapRef.current?.getMap();
    if (mapInstance && onBoundsChange) {
      onBoundsChange(mapInstance.getBounds());
    }
  }, [onBoundsChange]);

  if (!isClient) {
    return (
      <div className={cn('w-full h-full bg-muted/50 flex items-center justify-center p-4', className)}>
        <p className="text-muted-foreground">Cargando mapa interactivo...</p>
      </div>
    );
  }

  if (isRouteLoading) {
    return (
      <div className={cn('w-full h-full bg-muted/50 flex items-center justify-center p-4', className)}>
        <p className="text-muted-foreground">Cargando ruta GPX...</p>
      </div>
    );
  }

  if (routeError) {
     return (
      <div className={cn('w-full h-full bg-destructive/10 text-destructive flex items-center justify-center p-4', className)}>
        <p>Error al cargar la ruta: {routeError}</p>
      </div>
    );
  }
  
  const showMarkers = !gpxUrl && displayEvents.length > 0;
  const isValidPopupPosition = popupCoordinates !== undefined && Number.isFinite(popupCoordinates[0]) && Number.isFinite(popupCoordinates[1]);

  return (
    <div className={cn('w-full h-full relative flex flex-col', className)}>
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        interactive={interactive}
        attributionControl={true}
        onLoad={handleMapLoad}
        onMoveEnd={handleMapMoveEnd}
        onZoomEnd={handleMapMoveEnd}
        mapLib={maplibregl}
      >
        {interactive && <NavigationControl position="top-right" />}
        {interactive && <FullscreenControl position="top-right" />}
        <ScaleControl />

        {showMarkers && displayEvents.map((ev) => (
          <Marker
            key={ev.id}
            longitude={ev.location.lng!}
            latitude={ev.location.lat!}
            anchor="bottom"
            onClick={(e) => handleMarkerClick(ev, e)}
          >
            <MapPin className={cn("h-10 w-10 text-primary fill-primary/30 hover:fill-primary/50 transition-colors", interactive && "cursor-pointer")} />
          </Marker>
        ))}

        {routeGeoJson && (
          <Source id="gpx-route" type="geojson" data={routeGeoJson}>
            <Layer
              id="gpx-route-layer"
              type="line"
              source="gpx-route"
              paint={{
                'line-color': mapStyleAccentColor, // Use accent color for GPX route
                'line-width': 4,
                'line-opacity': 0.8,
              }}
              layout={{
                'line-join': 'round',
                'line-cap': 'round',
              }}
            />
          </Source>
        )}
        
        {showMarkers && interactive && selectedEvent && isValidPopupPosition && (
           <Popup
            longitude={popupCoordinates[0]}
            latitude={popupCoordinates[1]}
            onClose={handlePopupClose}
            closeButton={false} // Use custom close button
            anchor="bottom"
            offset={25}
            maxWidth="280px"
            className="!p-0 !rounded-lg !shadow-xl !border !border-border !bg-card/90 !backdrop-blur-sm"
          >
            <div className="relative p-3">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-8 w-8 rounded-full hover:bg-muted/80 z-10"
                onClick={handlePopupClose}
                aria-label="Cerrar popup"
              >
                <XIcon className="h-5 w-5" />
              </Button>
              <h4 className="font-semibold text-base text-primary truncate pr-9 mb-1">{selectedEvent.name}</h4>
              <p className="text-muted-foreground text-xs line-clamp-2 mb-2">{selectedEvent.location.address}</p>
              <Button asChild variant="link" size="sm" className="text-accent p-0 h-auto text-xs">
                <Link href={`/events/${selectedEvent.id}`}>
                  Ver detalles del evento <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
