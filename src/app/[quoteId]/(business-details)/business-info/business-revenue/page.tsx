'use client';
import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FormikHandlers, FormikHelpers, useFormik } from 'formik';
import { isEqual } from 'lodash';
import toast from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import { useQuote } from '@/hooks/useQuote';
import { IBusinessRevenue } from '@/store/feature/business-info/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  initBusinessInfoState,
  selectBusinessInformation,
  selectBusinessRevenue,
  setBusinessInformation,
  setBusinessRevenue,
} from '@/store/feature/business-info';
import {
  getBusinessInfoFromQuote,
  getPolicyFromQuote,
} from '@/utils/adaptiveApiUtils';
import { changeCoveragePolicy } from '@/store/feature/policy-coverage';
import { IBusinessInformation, Step } from '@/store/api/types';
import { businessRevenueSchema } from '@/validations/quoteValidations';
import { businessRevenueConfig } from '@/config/businessRevenueConfig';
import BusinessInfoFormsContainer from '@/components/business-info/BusinessInfoFormsContainer';
import FormikInputField from '@/components/common/FormikInputField';
import BottomNavBar from '@/components/common/BottomNavBar';

type Props = {};

const BusinessRevenuePage = (props: Props) => {
  const router = useRouter();

  const {
    quoteId,
    quote,
    quoteQueryResult,
    createQuoteResult,
    loadingRef,
    handleQuoteMutation,
  } = useQuote();

  const dispatch = useAppDispatch();
  const businessRevenue = useAppSelector(selectBusinessRevenue);
  const businessInformation = useAppSelector(
    selectBusinessInformation
  ) as IBusinessInformation;
  const businessInfoFromQuote = useMemo(
    () => getBusinessInfoFromQuote(quote),
    [quote]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: businessRevenue,
    validationSchema: businessRevenueSchema,
    onSubmit,
  });

  useEffect(() => {
    if (quote?.insured && isEqual(businessInformation, initBusinessInfoState)) {
      const businessInfo = getBusinessInfoFromQuote(quote);
      dispatch(setBusinessInformation(businessInfo));
    }
  }, [quote, businessInformation, businessInfoFromQuote, dispatch]);

  async function onSubmit(
    values: IBusinessRevenue,
    { setSubmitting }: FormikHelpers<IBusinessRevenue>
  ) {
    try {
      dispatch(setBusinessRevenue(values));
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

  const getFieldAttrs = (
    fieldName: keyof IBusinessRevenue,
    extraAttrs: any = {}
  ) => ({
    ...extraAttrs,
    ...businessRevenueConfig.inputs[fieldName],
    value: formik.values[fieldName],
    error: formik.errors[fieldName],
    touched: formik.touched[fieldName],
    handleChange: formik.handleChange,
    handleBlur: formik.handleBlur,
  });

  return (
    <BusinessInfoFormsContainer title="Business Revenue Range">
      <LoadingBar ref={loadingRef} />
      <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
        <FormikInputField {...getFieldAttrs('revenueRangeFrom')} />
        <FormikInputField {...getFieldAttrs('revenueRangeTo')} />
        <BottomNavBar
          buttonLabel="Next: Review and Pay"
          disabled={
            createQuoteResult.isLoading ||
            quoteQueryResult.isLoading ||
            formik.isSubmitting
          }
        />
      </form>
    </BusinessInfoFormsContainer>
  );
};

export default BusinessRevenuePage;
