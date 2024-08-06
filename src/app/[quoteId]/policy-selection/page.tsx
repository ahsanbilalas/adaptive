'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { FormikHelpers, useFormik } from 'formik';
import { find } from 'lodash';
import toast from 'react-hot-toast';
import { policySelectionSchema } from '@/validations/quoteValidations';
import { useAppDispatch } from '@/store/hooks';
import { ICoverage, IQuoteEstimate, Step } from '@/store/api/types';
import { changeCoveragePolicy } from '@/store/feature/policy-coverage';
import {
  getAddressFromQuote,
  getCoverageFromQuote,
  getPolicyFromQuote,
} from '@/utils/adaptiveApiUtils';
import { useQuote } from '@/hooks/useQuote';
import BottomNavBar from '@/components/common/BottomNavBar';
import InstructionModal from '@/components/policy-coverage/InstructionModal';
import PolicyCoverageUI from '@/components/policy-coverage/PolicyCoverageUI';
import LoadingBar from 'react-top-loading-bar';

const PolicySelectionPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { quote, quoteQueryResult, loadingRef, handleQuoteMutation } =
    useQuote();

  const [isModelHidden, setIsModelHidden] = useState(true);

  const address = getAddressFromQuote(quote);
  const coverage: ICoverage = useMemo(() => {
    const coverageFromQuote = getCoverageFromQuote(quote);
    return {
      ...coverageFromQuote,
      effectiveDate: moment(coverageFromQuote.effectiveDate).format(
        'YYYY-MM-DD'
      ),
    };
  }, [quote]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: coverage,
    validationSchema: policySelectionSchema,
    onSubmit,
  });

  const selectedEstimate = useMemo(
    () =>
      find(quote?.data.quoteEstimates, {
        productId: formik.values.estimateId,
      }),
    [quote, formik.values.estimateId]
  );

  const updatePolicy = useCallback(async () => {
    try {
      await handleQuoteMutation(Step.coverage, {
        ...formik.values,
        effectiveDate: moment(formik.values.effectiveDate).format('MM/DD/YYYY'),
      });
    } catch (error: any) {
      if (error?.status === 400 && Array.isArray(error?.data?.message)) {
        error?.data?.message.forEach((err: string) => toast.error(err));
      } else {
        toast.error('Something went wrong. Try again.');
      }
    }
  }, [formik.values, handleQuoteMutation]);

  useEffect(() => {
    if (quote && !quote.data.quoteEstimates) {
      updatePolicy();
    }
  }, [quote, updatePolicy]);

  useEffect(() => {
    if (
      formik.initialValues === coverage &&
      formik.values.coverageAmount !== coverage.coverageAmount
    ) {
      updatePolicy();
    }
  }, [formik.initialValues, formik.values, coverage, updatePolicy]);

  async function onSubmit(
    values: ICoverage,
    { setSubmitting }: FormikHelpers<ICoverage>
  ) {
    try {
      await handleQuoteMutation(Step.coverage, {
        ...values,
        effectiveDate: moment(values.effectiveDate).format('MM/DD/YYYY'),
      });

      dispatch(
        changeCoveragePolicy({
          amount: values.coverageAmount,
          effectiveDateUtc: new Date(values.effectiveDate).toISOString(),
          selectedEstimateId: values.estimateId,
          quoteEstimates: quote?.data.quoteEstimates || [],
        })
      );
      router.push(`business-info/business-entity-details`);
    } catch (error: any) {
      if (error?.status === 400 && Array.isArray(error?.data?.message)) {
        error?.data?.message.forEach((err: string) => toast.error(err));
      } else {
        toast.error('Something went wrong. Try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <LoadingBar ref={loadingRef} />
      <form onSubmit={formik.handleSubmit}>
        <PolicyCoverageUI
          address={address}
          formik={formik}
          onShowModal={() => setIsModelHidden(false)}
          quoteEstimates={quote?.data.quoteEstimates as IQuoteEstimate[]}
          selectedEstimate={selectedEstimate as IQuoteEstimate}
        />
        <BottomNavBar
          buttonLabel="Next: Business Information"
          disabled={quoteQueryResult.isFetching || formik.isSubmitting}
        />
        <InstructionModal
          hide={isModelHidden}
          onCloseModal={() => setIsModelHidden(true)}
        />
      </form>
    </>
  );
};

export default PolicySelectionPage;
