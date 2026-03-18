// Server component — no 'use client' needed.
// Previously used useTheme() just for theme.spacing(25) = 200px.
// Eliminating the client boundary reduces JS shipped to browser.

export default function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" style={{ minHeight: 'calc(100vh - 200px)' }}>
      {children}
    </main>
  );
}
