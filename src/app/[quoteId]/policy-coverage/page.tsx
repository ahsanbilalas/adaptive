'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { isEmpty, isEqual } from 'lodash';
import toast from 'react-hot-toast';
import {
  useCreateQuoteMutation,
  useGetQuoteQuery,
} from '@/store/api/adaptiveApiSlice';
import { ICreateQuoteParams, IStep } from '@/store/api/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  initBusinessInfoState,
  setBusinessInformation,
} from '@/store/feature/business-info';
import {
  changeCoveragePolicy,
  initPolicyState,
  selectPolicyCoverage,
} from '@/store/feature/policy-coverage';
import {
  getAddressFromQuote,
  getBusinessInfoFromQuote,
  getPolicyFromQuote,
} from '@/utils/adaptiveApiUtils';
import { getCoverage } from '@/utils/quoteUtils';
import BottomNavBar from '@/components/common/BottomNavBar';
import InstructionModal from '@/components/policy-coverage/InstructionModal';
import PolicyCoverageUI from '@/components/policy-coverage/PolicyCoverageUI';
import Loader from '@/components/common/Loader';
import { useCreateQuote } from '@/config/useCreateQuote';
import { useFormik } from 'formik';
import { coverageValidation } from '@/validations/quoteValidations';

type Props = {};

const PolicyCoveragePage = (props: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { quoteId, quote, quoteQueryResult, handleSubmitQuote } =
    useCreateQuote();

  const [isModelHidden, setIsModelHidden] = useState(true);
  const [dateInputError, setDateInputError] = useState('');

  // const { data: quote, ...quoteQueryResult } = useGetQuoteQuery(quoteId);
  // const [createQuote, createQuoteResult] = useCreateQuoteMutation();

  const [loading, setLoading] = useState(false);

  const address = useMemo(() => getAddressFromQuote(quote), [quote]);

  const policy = useAppSelector(selectPolicyCoverage);

  const updatePolicy = useCallback(async () => {
    try {
      const payload = getCoverage(policy);
      const res = await handleSubmitQuote(IStep.coverage, payload);
      return res;
    } catch (error: any) {
      if (error?.status === 400 && Array.isArray(error?.data?.message)) {
        error?.data?.message.forEach((err: string) => toast.error(err));
      } else {
        toast.error('Something went wrong. Try again.');
      }
      throw error;
    }
  }, [handleSubmitQuote, policy]);

  // Initialize the policy state in redux that UI uses
  useEffect(() => {
    if (quote && quote.data.quoteEstimates && quote.data.selectedEstimateId) {
      const quotePolicy = getPolicyFromQuote(quote);
      dispatch(changeCoveragePolicy(quotePolicy));
      setLoading(false);
    } else if (
      quote &&
      (!quote.data.quoteEstimates || !quote.data.selectedEstimateId)
    ) {
      // init policy coverage & quote estimates
      updatePolicy();
    }
  }, [dispatch, quote, updatePolicy]);

  // // Updates quote estimates when coverage amount changes
  // useEffect(() => {
  //   if (
  //     quote &&
  //     quote.data.quoteEstimates &&
  //     quote.data.quoteEstimates[0].coverageAmount !== policy.amount
  //   ) {
  //     updatePolicy();
  //   }
  // }, [policy.amount, quote, updatePolicy]);

  useEffect(() => {
    // Quotes query error handling
    if (
      quoteQueryResult.isError ||
      (!quoteQueryResult.isLoading && isEmpty(quote))
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
      if (!completed.address) {
        router.push('/');
      } else if (!completed.coverage) {
        router.push(`/${quoteId}/policy-coverage`);
      }
    }
  }, [
    quote,
    quoteQueryResult.isError,
    quoteQueryResult.isFetching,
    quoteQueryResult.error,
    quoteQueryResult.isLoading,
    quoteId,
    router,
  ]);

  async function onSubmit() {
    try {
      if (
        quote?.data.selectedEstimateId !== policy.selectedEstimateId ||
        quote?.effectiveDateUtc !== policy.effectiveDateUtc
      ) {
        await updatePolicy();
      }
      router.push(`/${quote?.id}/business-info/business-entity-details`);
    } catch (error: any) {
      if (error?.status === 400 && Array.isArray(error?.data?.message)) {
        error?.data?.message.map((err: string) => {
          if (err.includes('effective date')) setDateInputError(err);
        });
      }
    }
  }

  const initialValues = useMemo(() => {
    return {
      coverageAmount: 100000,
      estimateId: '',
      effectiveDate: '08/03/2024',
    };
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: coverageValidation,
    onSubmit,
  });

  return (
    <>
      {loading && <Loader />}
      <PolicyCoverageUI
        onShowModal={() => setIsModelHidden(false)}
        address={address}
        dateInputError={dateInputError}
        values={formik.values}
        setFieldValue={formik.setFieldValue}
      />
      <BottomNavBar
        buttonLabel="Next: Business Information"
        onButtonClick={onSubmit}
        disabled={
          quoteQueryResult.isLoading ||
          !quote?.data.quoteEstimates ||
          !quote?.data.selectedEstimateId
          // createQuoteResult.isLoading ||
        }
      />
      <InstructionModal
        hide={isModelHidden}
        onCloseModal={() => setIsModelHidden(true)}
      />
    </>
  );
};

export default PolicyCoveragePage;
