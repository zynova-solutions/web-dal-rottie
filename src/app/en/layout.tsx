import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Indian Restaurant Frankfurt | North Indian Cuisine | Dal Rotti',
  description: 'Craving authentic Indian food in Frankfurt? Dal Rotti is the best Indian restaurant in Frankfurt am Main serving rich, flavorful cuisine you will love.',
  keywords: 'Dal Rotti, Indian restaurant Frankfurt, North Indian cuisine, Indian food, Frankfurt restaurant, best Indian restaurant, authentic Indian food',
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout provides English-specific context
  // The html lang="en" is handled at the root layout level
  return <>{children}</>;
}
