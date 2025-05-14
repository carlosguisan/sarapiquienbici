
import Link from 'next/link';
import { Bike, Map as MapIcon, BarChart3 } from 'lucide-react'; 
import NavLink from './NavLink';

export default function Header() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <Bike className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Sarapiqui en Bici</h1>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <NavLink href="/">
            <Bike className="h-5 w-5 sm:hidden" />
            <span className="hidden sm:inline">Eventos</span>
          </NavLink>
          <NavLink href="/map">
             <MapIcon className="h-5 w-5 sm:hidden" />
            <span className="hidden sm:inline">Mapa</span>
          </NavLink>
          {/* El enlace a Strava Leaderboard fue revertido previamente
          <NavLink href="/strava-leaderboard">
            <BarChart3 className="h-5 w-5 sm:hidden" />
            <span className="hidden sm:inline">Leaderboard</span>
          </NavLink>
          */}
        </nav>
      </div>
    </header>
  );
}
