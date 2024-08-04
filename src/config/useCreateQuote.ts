import {
  useCreateQuoteMutation,
  useGetQuoteQuery,
} from '@/store/api/adaptiveApiSlice';
import { IStep } from '@/store/api/types';
import {
  getAddressFromQuote,
  getBusinessInfoFromQuote,
  getCoverageFromQuote,
  getPolicyFromQuote,
} from '@/utils/adaptiveApiUtils';
import { get } from 'lodash';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export const useCreateQuote = () => {
  const params = useParams();

  const quoteId = useMemo(
    () => (get(params, 'quoteId', '') as string) || '',
    [params]
  );
  const { data: quote, ...quoteQueryResult } = useGetQuoteQuery(quoteId, {
    skip: !quoteId,
  });

  const [handleCreateQuoteMutation, createQuoteResult] =
    useCreateQuoteMutation();

  const handleSubmitQuote = async (step: IStep, payload: any) => {
    const address = getAddressFromQuote(quote);
    const policy = getPolicyFromQuote(quote);
    const coverage = getCoverageFromQuote(quote);
    const businessInformation = getBusinessInfoFromQuote(quote);

    const resp = await handleCreateQuoteMutation({
      product: 'Outage',
      quoteId,
      address,
      coverage,
      businessInformation,
      checkout: {},
      step,
      [step]: payload,
    }).unwrap();
    return resp;
  };

  return {
    quoteId,
    quote,
    quoteQueryResult,
    handleSubmitQuote,
  };
};
