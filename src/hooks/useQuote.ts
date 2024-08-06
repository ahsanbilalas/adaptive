import { useCallback, useEffect, useRef } from 'react';
import { notFound, useParams, usePathname, useRouter } from 'next/navigation';
import { LoadingBarRef } from 'react-top-loading-bar';
import {
  useCreateQuoteMutation,
  useGetQuoteQuery,
} from '@/store/api/adaptiveApiSlice';
import { Step } from '@/store/api/types';
import { isEmpty } from 'lodash';

export const useQuote = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const pathname = usePathname();
  const loadingRef = useRef<LoadingBarRef>(null);
  const router = useRouter();
  const [createQuote, createQuoteResult] = useCreateQuoteMutation();
  const { data: quote, ...quoteQueryResult } = useGetQuoteQuery(quoteId, {
    skip: !quoteId,
  });

  const handleQuoteMutation = useCallback(
    async (step: Step, payload: any) => {
      try {
        loadingRef.current?.continuousStart();
        const res = await createQuote({
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
    [createQuote, quoteId]
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
      (!quoteQueryResult.isLoading && isEmpty(quote) && quoteId)
    ) {
      if (
        isEmpty(quote) ||
        (quoteQueryResult.error &&
          'status' in quoteQueryResult.error &&
          quoteQueryResult.error.status === 404)
      )
        notFound();
      else throw quoteQueryResult.error;
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
  ]);

  return {
    quoteId,
    quote,
    quoteQueryResult,
    createQuoteResult,
    handleQuoteMutation,
    loadingRef,
  };
};
