import { useCallback, useEffect, useMemo, useRef } from 'react';
import { notFound, useParams, usePathname, useRouter } from 'next/navigation';
import { LoadingBarRef } from 'react-top-loading-bar';
import toast from 'react-hot-toast';
import { get, isEmpty } from 'lodash';
import {
  useCreateQuoteMutation,
  useGetQuoteQuery,
} from '@/store/api/adaptiveApiSlice';
import { Step } from '@/store/api/types';
import {
  getAddressFromQuote,
  getBusinessInfoFromQuote,
  getCoverageFromQuote,
  getPolicyFromQuote,
} from '@/utils/adaptiveApiUtils';

type Props = {
  skipQuery?: boolean;
};

export const useQuote = ({ skipQuery = false }: Props = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const loadingRef = useRef<LoadingBarRef>(null);
  const { quoteId } = useParams<{ quoteId: string }>();
  const [handleQuoteMutation, createQuoteResult] = useCreateQuoteMutation();
  const { data: quote, ...quoteQueryResult } = useGetQuoteQuery(quoteId, {
    skip: skipQuery || !quoteId,
  });

  const { address, coverage, policy, businessInformation } = useMemo(
    () => ({
      address: getAddressFromQuote(quote),
      coverage: getCoverageFromQuote(quote),
      policy: getPolicyFromQuote(quote),
      businessInformation: getBusinessInfoFromQuote(quote),
    }),
    [quote]
  );

  const handleSubmitQuote = useCallback(
    async (step: Step, payload: any) => {
      try {
        loadingRef.current?.continuousStart();
        const res = await handleQuoteMutation({
          quoteId,
          step,
          product: 'Outage',
          [step]: payload,
        }).unwrap();
        loadingRef.current?.complete();
        return res;
      } catch (error: any) {
        loadingRef.current?.complete();
        throw error;
      }
    },
    [handleQuoteMutation, quoteId]
  );

  useEffect(() => {
    if (quoteId && quoteQueryResult.isLoading)
      loadingRef.current?.continuousStart();
    else if (quoteId) loadingRef.current?.complete();
  }, [quoteId, quoteQueryResult.isLoading]);

  // Quotes query error handling
  useEffect(() => {
    if (
      quoteQueryResult.isError ||
      (!quoteQueryResult.isLoading && isEmpty(quote) && quoteId && !skipQuery)
    ) {
      if (isEmpty(quote) || get(quoteQueryResult.error, 'status') === 404)
        notFound();
      else toast.error('Something went wrong.');
    }

    if (!quoteQueryResult.isFetching && quote) {
      const completed = quote.data.metadata.completed_sections;
      const page = pathname.split('/').at(-1) || '';
      if (
        !completed.coverage &&
        ['business-entity-details', 'review-quote'].includes(page)
      ) {
        router.push(`/${quoteId}/policy-selection`);
      } else if (!completed.businessInformation && page === 'review-quote') {
        router.push(`/${quoteId}/business-info/business-entity-details`);
      }
    }
  }, [
    quoteId,
    quote,
    quoteQueryResult.isError,
    quoteQueryResult.isLoading,
    quoteQueryResult.isFetching,
    quoteQueryResult.error,
    router,
    pathname,
    skipQuery,
  ]);

  return {
    quoteId,
    quote,
    address,
    coverage,
    policy,
    businessInformation,
    quoteQueryResult,
    createQuoteResult,
    handleSubmitQuote,
    loadingRef,
    router,
  };
};
