'use client';
import React, { Suspense } from 'react';
import QuoteCard from '@/components/policy-coverage/QuoteCard';
import {
  PageWrapper,
  QuoteCardWrapper,
} from '@/components/policy-coverage/style';

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
        <QuoteCardWrapper>
          <div className="fixed right-10">
            <QuoteCard />
          </div>
        </QuoteCardWrapper>
      </PageWrapper>
    </div>
  );
};

export default Layout;
