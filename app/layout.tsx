import type { Metadata } from 'next';
import '@/index.css';
import { ApolloWrapper } from '@/components/ApolloWrapper';

export const metadata: Metadata = {
  title: 'BITFLIX | Movie Search App',
  description: 'Search and discover movies with BITFLIX',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
