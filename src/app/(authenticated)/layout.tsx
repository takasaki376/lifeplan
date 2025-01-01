import '@/src/styles/globals.css';

import { Navigation } from '@/src/components/Navigation';

export const metadata = {
  title: 'Life-Plan',
  description: 'Generated by Next.js',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex justify-center">
          <div className=" bg-lightGray/20">
            <Navigation />
          </div>
          <div className="min-h-screen w-full">{children}</div>
        </div>
      </body>
    </html>
  );
}
