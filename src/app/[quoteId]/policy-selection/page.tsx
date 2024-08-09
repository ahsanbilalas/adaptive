'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormikHelpers, FormikValues } from 'formik';
import { find, isEqual } from 'lodash';
import toast from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import { policySelectionSchema } from '@/validations/quoteValidations';
import { useQuote } from '@/hooks/useQuote';
import { useQuoteForms } from '@/hooks/useQuoteForms';
import { ICoverage, IQuoteEstimate, Step } from '@/store/api/types';
import { convertCoverageDate, convertStandardDate } from '@/utils/quoteUtils';
import BottomNavBar from '@/components/common/BottomNavBar';
import InstructionModal from '@/components/policy-coverage/InstructionModal';
import PolicyCoverageUI from '@/components/policy-coverage/PolicyCoverageUI';

const PolicySelectionPage = () => {
  const [isModelHidden, setIsModelHidden] = useState(true);

  const {
    quote,
    address,
    coverage,
    quoteQueryResult,
    loadingRef,
    handleSubmitQuote,
    router,
  } = useQuote();

  const initialCoverage: ICoverage = useMemo(() => {
    return {
      ...coverage,
      effectiveDate: convertCoverageDate(coverage.effectiveDate),
    };
  }, [coverage]);

  const { formik, getFieldAttrs } = useQuoteForms({
    skipQuery: true,
    enableReinitialize: true,
    initialValues: initialCoverage,
    validationSchema: policySelectionSchema,
    onSubmit,
  });

  const selectedEstimate = useMemo(
    () =>
      find(quote?.data.quoteEstimates, {
        productId: formik.values.estimateId,
      }),
    [quote?.data?.quoteEstimates, formik.values.estimateId]
  );

  const updatePolicy = useCallback(
    async (values: FormikValues) => {
      try {
        await handleSubmitQuote(Step.coverage, {
          ...values,
          effectiveDate: convertStandardDate(values.effectiveDate),
        });
      } catch (error: any) {
        if (error?.status === 400 && Array.isArray(error?.data?.message)) {
          error?.data?.message.forEach((err: string) => toast.error(err));
        } else {
          toast.error('Something went wrong. Try again.');
        }
      }
    },
    [handleSubmitQuote]
  );

  useEffect(() => {
    if (!quote?.data?.quoteEstimates) {
      updatePolicy(coverage);
    }
  }, [quote?.data?.quoteEstimates, coverage, updatePolicy]);

  useEffect(() => {
    if (
      isEqual(formik.initialValues, initialCoverage) &&
      !isEqual(formik.values.coverageAmount, initialCoverage.coverageAmount)
    ) {
      updatePolicy(formik.values);
    }
  }, [formik.initialValues, formik.values, initialCoverage, updatePolicy]);

  async function onSubmit(
    values: FormikValues,
    { setSubmitting }: FormikHelpers<FormikValues>
  ) {
    try {
      await handleSubmitQuote(Step.coverage, {
        ...values,
        effectiveDate: convertStandardDate(values.effectiveDate),
      });
      router.push(`business-info/business-entity-details`);
    } catch (error: any) {
      if (error?.status === 400 && Array.isArray(error?.data?.message))
        error?.data?.message.forEach((err: string) => toast.error(err));
      else toast.error('Something went wrong. Try again.');
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
          values={formik.values}
          setFieldValue={formik.setFieldValue}
          getFieldAttrs={getFieldAttrs}
          onShowModal={() => setIsModelHidden(false)}
          quoteEstimates={quote?.data.quoteEstimates as IQuoteEstimate[]}
          selectedEstimate={selectedEstimate as IQuoteEstimate}
        />
        <BottomNavBar
          selectedId={formik.values.estimateId}
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
