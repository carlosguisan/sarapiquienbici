// Este layout envuelve las páginas estándar con un contenedor y padding.
export default function DefaultPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-grow">
      {children}
    </main>
  );
}
