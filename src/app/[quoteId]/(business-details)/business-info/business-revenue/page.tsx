'use client';
import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FormikHelpers, FormikValues } from 'formik';
import { isEqual } from 'lodash';
import toast from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import { useQuoteForms } from '@/hooks/useQuoteForms';
import { IBusinessRevenue } from '@/store/feature/business-info/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  initBusinessInfoState,
  selectBusinessInformation,
  selectBusinessRevenue,
  setBusinessInformation,
  setBusinessRevenue,
} from '@/store/feature/business-info';
import { getBusinessInfoFromQuote } from '@/utils/adaptiveApiUtils';
import { businessRevenueConfig } from '@/config/businessRevenueConfig';
import { IBusinessInformation, Step } from '@/store/api/types';
import { businessRevenueSchema } from '@/validations/quoteValidations';
import BusinessInfoFormsContainer from '@/components/business-info/BusinessInfoFormsContainer';
import FormikInputField from '@/components/common/FormikInputField';
import BottomNavBar from '@/components/common/BottomNavBar';

const BusinessRevenuePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const businessRevenue = useAppSelector(selectBusinessRevenue);
  const businessInformation = useAppSelector(
    selectBusinessInformation
  ) as IBusinessInformation;

  const {
    formik: { handleSubmit, isSubmitting },
    quoteId,
    quote,
    quoteQueryResult,
    createQuoteResult,
    loadingRef,
    handleQuoteMutation,
    getFieldAttrs,
  } = useQuoteForms({
    config: businessRevenueConfig.inputs,
    enableReinitialize: true,
    initialValues: businessRevenue,
    validationSchema: businessRevenueSchema,
    onSubmit,
  });

  const businessInfoFromQuote = useMemo(
    () => getBusinessInfoFromQuote(quote),
    [quote]
  );

  useEffect(() => {
    if (quote?.insured && isEqual(businessInformation, initBusinessInfoState)) {
      const businessInfo = getBusinessInfoFromQuote(quote);
      dispatch(setBusinessInformation(businessInfo));
    }
  }, [quote, businessInformation, businessInfoFromQuote, dispatch]);

  async function onSubmit(
    values: FormikValues,
    { setSubmitting }: FormikHelpers<FormikValues>
  ) {
    try {
      dispatch(setBusinessRevenue(values as IBusinessRevenue));
      const payload = { ...businessInformation, ...values };
      if (!isEqual(businessInfoFromQuote, payload))
        await handleQuoteMutation(Step.businessInformation, payload);
      router.push(`/${quoteId}/review-quote`);
    } catch (error: any) {
      if (error?.status === 400 && Array.isArray(error?.data?.message)) {
        error?.data?.message.map((err: string) => toast.error(err));
      } else toast.error('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <BusinessInfoFormsContainer title="Business Revenue Range">
      <LoadingBar ref={loadingRef} />
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <FormikInputField {...getFieldAttrs('revenueRangeFrom')} />
        <FormikInputField {...getFieldAttrs('revenueRangeTo')} />
        <BottomNavBar
          buttonLabel="Next: Review and Pay"
          disabled={
            createQuoteResult.isLoading ||
            quoteQueryResult.isLoading ||
            isSubmitting
          }
        />
      </form>
    </BusinessInfoFormsContainer>
  );
};

export default BusinessRevenuePage;
