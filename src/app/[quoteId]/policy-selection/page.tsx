'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { FormikHelpers, FormikValues } from 'formik';
import { find } from 'lodash';
import toast from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import { policySelectionSchema } from '@/validations/quoteValidations';
import { useQuote } from '@/hooks/useQuote';
import { useQuoteForms } from '@/hooks/useQuoteForms';
import { ICoverage, IQuoteEstimate, Step } from '@/store/api/types';
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
    handleQuoteMutation,
    router,
  } = useQuote();

  const initialValues: ICoverage = useMemo(() => {
    return {
      ...coverage,
      effectiveDate: moment(coverage.effectiveDate, 'MM/DD/YY').format(
        'YYYY-MM-DD'
      ),
    };
  }, [coverage]);

  const { formik, getFieldAttrs } = useQuoteForms({
    skipQuery: true,
    enableReinitialize: true,
    initialValues,
    validationSchema: policySelectionSchema,
    onSubmit,
  });

  const selectedEstimate = useMemo(
    () =>
      find(quote?.data.quoteEstimates, {
        productId: formik.values.estimateId,
      }),
    [quote?.data.quoteEstimates, formik.values.estimateId]
  );

  const updatePolicy = useCallback(
    async (values: FormikValues) => {
      try {
        await handleQuoteMutation(Step.coverage, {
          ...values,
          effectiveDate: moment(values.effectiveDate).format('MM/DD/YYYY'),
        });
      } catch (error: any) {
        if (error?.status === 400 && Array.isArray(error?.data?.message)) {
          error?.data?.message.forEach((err: string) => toast.error(err));
        } else {
          toast.error('Something went wrong. Try again.');
        }
      }
    },
    [handleQuoteMutation]
  );

  useEffect(() => {
    if (quote && !quote.data.quoteEstimates) {
      updatePolicy(coverage);
    }
  }, [quote, coverage, updatePolicy]);

  useEffect(() => {
    if (
      formik.initialValues === initialValues &&
      formik.values.coverageAmount !== initialValues.coverageAmount
    ) {
      updatePolicy(formik.values);
    }
  }, [formik.initialValues, formik.values, initialValues, updatePolicy]);

  async function onSubmit(
    values: FormikValues,
    { setSubmitting }: FormikHelpers<FormikValues>
  ) {
    try {
      await handleQuoteMutation(Step.coverage, {
        ...values,
        effectiveDate: moment(values.effectiveDate).format('MM/DD/YYYY'),
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
