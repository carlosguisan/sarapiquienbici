import type { Metadata } from 'next';

// Font imports and global CSS are typically handled by the root layout.
// If specific font overrides or additional global styles for ONLY this layout were needed,
// they could be included, but generally, it's cleaner to keep them in the root.

export const metadata: Metadata = {
  title: 'Mapa de Eventos - Sarapiqui en Bici',
  description: 'Explora eventos de ciclismo en Sarapiquí en un mapa interactivo.',
};

export default function MapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This main tag will fill the space between header and footer due to RootLayout's flex settings.
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {children}
    </main>
  );
}
