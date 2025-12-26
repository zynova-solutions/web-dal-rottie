import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bestes indisches Restaurant Frankfurt | Nordindische Küche | Dal Rotti',
  description: 'Lust auf authentisches indisches Essen in Frankfurt? Dal Rotti ist das beste indische Restaurant in Frankfurt am Main und serviert reichhaltige, geschmackvolle Küche, die Sie lieben werden.',
  keywords: 'Dal Rotti, Indisches Restaurant Frankfurt, Nordindische Küche, Indisches Essen, Frankfurt Restaurant, bestes indisches Restaurant, authentisches indisches Essen',
};

export default function GermanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout provides German-specific context
  // The html lang attribute is modified via the I18nProvider
  return <>{children}</>;
} 