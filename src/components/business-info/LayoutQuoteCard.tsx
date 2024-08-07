'use client';
import React, { useMemo } from 'react';
import { find } from 'lodash';
import { useQuote } from '@/hooks/useQuote';
import { IQuoteEstimate } from '@/store/api/types';
import { getPolicyFromQuote } from '@/utils/adaptiveApiUtils';
import { QuoteCardWrapper } from '@/components/policy-coverage/style';
import QuoteCard from '@/components/policy-coverage/QuoteCard';

const LayoutQuoteCard = () => {
  const { quote } = useQuote();
  const policy = useMemo(() => getPolicyFromQuote(quote), [quote]);
  const selectedEstimate = useMemo(
    () =>
      find(policy.quoteEstimates, {
        productId: policy.selectedEstimateId,
      }),
    [policy]
  );
  return (
    <QuoteCardWrapper>
      <div className="fixed right-10">
        <QuoteCard
          selectedEstimate={selectedEstimate as IQuoteEstimate}
          effectiveDateUtc={policy.effectiveDateUtc}
        />
      </div>
    </QuoteCardWrapper>
  );
};

export default LayoutQuoteCard;
