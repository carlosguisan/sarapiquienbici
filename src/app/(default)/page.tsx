
import { getEvents } from '@/lib/data';
import EventCard from '@/components/events/EventCard';
import EventFilterBar from '@/components/events/EventFilterBar';

export default async function HomePage() {
  const events = await getEvents();

  return (
    <div>
      {/* Hero Section - Full Width */}
      <section className="relative w-full bg-card shadow-lg overflow-hidden">
        {/* Replaced next/image with standard img tag */}
        <img
          src="https://placehold.co/1600x450.png"
          alt="Ciclistas disfrutando de un hermoso paisaje en Sarapiquí"
          className="absolute inset-0 w-full h-full object-cover -z-10 opacity-20"
          data-ai-hint="cycling landscape scenic"
        />
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32"> {/* Constrained content within hero */}
          <div className="relative z-10 text-center space-y-6 md:space-y-8">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-primary mb-4">
                Encuentra Tu Próxima Aventura
              </h1>
              <p className="text-lg md:text-xl text-foreground/85 max-w-3xl mx-auto">
                Explora emocionantes eventos de ciclismo en Sarapiquí. Utiliza los filtros a continuación para descubrir tu ruta ideal.
              </p>
            </div>
            <div className="max-w-3xl mx-auto pt-4">
              <EventFilterBar />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section - Contained */}
      <section className="container mx-auto px-4 py-12">
        <header className="mb-8 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-primary mb-2">Eventos Destacados</h2>
          <p className="text-muted-foreground">
            Descubre los próximos eventos de ciclismo en la zona y planifica tu participación.
          </p>
        </header>
        
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center py-12 bg-card rounded-lg shadow">
            <p className="text-xl font-semibold text-muted-foreground mb-2">No se encontraron eventos próximos.</p>
            <p className="text-muted-foreground">Por favor, vuelve a consultar pronto o ajusta tus filtros.</p>
          </div>
        )}
      </section>
    </div>
  );
}
