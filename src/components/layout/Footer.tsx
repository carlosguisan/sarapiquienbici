export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8 text-center text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} Sarapiqui en Bici. Todos los derechos reservados.</p>
        <p className="text-sm mt-1">¡Descubre la alegría de pedalear en Sarapiquí!</p>
      </div>
    </footer>
  );
}
