'use client';
import React, { Suspense } from 'react';
import { find } from 'lodash';
import { useAppSelector } from '@/store/hooks';
import { selectPolicyCoverage } from '@/store/feature/policy-coverage';
import { IQuoteEstimate } from '@/store/api/types';
import {
  PageWrapper,
  QuoteCardWrapper,
} from '@/components/policy-coverage/style';
import QuoteCard from '@/components/policy-coverage/QuoteCard';

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const policy = useAppSelector(selectPolicyCoverage);
  const selectedEstimate = find(policy.quoteEstimates, {
    productId: policy.selectedEstimateId,
  });
  return (
    <div className="pb-24">
      <PageWrapper>
        <div className="mr-auto w-full md:pr-10 lg:px-32">
          <Suspense>{children}</Suspense>
        </div>
        <QuoteCardWrapper>
          <div className="fixed right-10">
            <QuoteCard
              selectedEstimate={selectedEstimate as IQuoteEstimate}
              effectiveDateUtc={policy.effectiveDateUtc}
            />
          </div>
        </QuoteCardWrapper>
      </PageWrapper>
    </div>
  );
};

export default Layout;
