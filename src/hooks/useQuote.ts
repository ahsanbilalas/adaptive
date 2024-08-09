import { useCallback, useEffect, useMemo, useRef } from 'react';
import { notFound, useParams, usePathname, useRouter } from 'next/navigation';
import { LoadingBarRef } from 'react-top-loading-bar';
import {
  useCreateQuoteMutation,
  useGetQuoteQuery,
} from '@/store/api/adaptiveApiSlice';
import { Step } from '@/store/api/types';
import { isEmpty } from 'lodash';
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
  const [createQuote, createQuoteResult] = useCreateQuoteMutation();
  const { data: quote, ...quoteQueryResult } = useGetQuoteQuery(quoteId, {
    skip: skipQuery || !quoteId,
  });

  const address = useMemo(() => getAddressFromQuote(quote), [quote]);
  const coverage = useMemo(() => getCoverageFromQuote(quote), [quote]);
  const policy = useMemo(() => getPolicyFromQuote(quote), [quote]);
  const businessInformation = useMemo(
    () => getBusinessInfoFromQuote(quote),
    [quote]
  );

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
      (!quoteQueryResult.isLoading && isEmpty(quote) && quoteId && !skipQuery)
    ) {
      console.log('error');
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
    handleQuoteMutation,
    loadingRef,
    router,
  };
};
