import '@/src/styles/globals.css';

import { Navigation } from '@/src/components/Navigation';

// import { Providers } from '../providers';

export const metadata = {
  title: 'Life-Plan',
  description: 'Generated by Next.js',
};

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    // <Providers>
    <div className="flex justify-center">
      <div className=" bg-lightGray/20">
        <Navigation />
      </div>
      <div className="min-h-screen w-full">{children}</div>
    </div>
    // </Providers>
  );
}
