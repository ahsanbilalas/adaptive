'use client';
import React, { Suspense } from 'react';
import { PageWrapper } from '@/components/policy-coverage/style';
import LayoutQuoteCard from '@/components/business-info/LayoutQuoteCard';

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="pb-24">
      <PageWrapper>
        <div className="mr-auto w-full md:pr-10 lg:px-32">
          <Suspense>{children}</Suspense>
        </div>
        <LayoutQuoteCard />
      </PageWrapper>
    </div>
  );
};

export default Layout;
