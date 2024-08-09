'use client';
import React, { useEffect } from 'react';
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
  const dispatch = useAppDispatch();
  const businessRevenueState = useAppSelector(selectBusinessRevenue);
  const businessInfoState = useAppSelector(
    selectBusinessInformation
  ) as IBusinessInformation;

  const {
    router,
    formik: { handleSubmit, isSubmitting },
    quoteId,
    quote,
    businessInformation,
    quoteQueryResult,
    createQuoteResult,
    loadingRef,
    handleSubmitQuote,
    getFieldAttrs,
  } = useQuoteForms({
    config: businessRevenueConfig.inputs,
    enableReinitialize: true,
    initialValues: businessRevenueState,
    validationSchema: businessRevenueSchema,
    onSubmit,
  });

  useEffect(() => {
    if (quote?.insured && isEqual(businessInfoState, initBusinessInfoState)) {
      dispatch(setBusinessInformation(businessInformation));
    }
  }, [quote, businessInfoState, businessInformation, dispatch]);

  async function onSubmit(
    values: FormikValues,
    { setSubmitting }: FormikHelpers<FormikValues>
  ) {
    try {
      dispatch(setBusinessRevenue(values as IBusinessRevenue));
      const payload = { ...businessInfoState, ...values };
      if (!isEqual(businessInformation, payload))
        await handleSubmitQuote(Step.businessInformation, payload);
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
