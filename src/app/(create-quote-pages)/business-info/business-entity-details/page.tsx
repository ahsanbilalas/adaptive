'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import { isEmpty, isEqual } from 'lodash';
import { useMask } from '@react-input/mask';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  initBusinessInfoState,
  selectBusinessDetails,
  selectBusinessInformation,
  setBusinessDetails,
  setBusinessInformation,
} from '@/store/feature/business-info';
import { useGetQuoteQuery } from '@/store/api/adaptiveApiSlice';
import { changeCoveragePolicy } from '@/store/feature/policy-coverage';
import { IBusinessDetails } from '@/store/feature/business-info/types';
import {
  getBusinessInfoFromQuote,
  getPolicyFromQuote,
} from '@/utils/adaptiveApiUtils';
import { businessDetailsSchema } from '@/validations/quoteValidations';
import { businessDetailsConfig } from '@/config/businessDetailsConfig';
import BusinessInfoFormsContainer from '@/components/business-info/BusinessInfoFormsContainer';
import BottomNavBar from '@/components/common/BottomNavBar';
import FormikInputField from '@/components/common/FormikInputField';
import Loader from '@/components/common/Loader';

type Props = {};

const BusinessEntityPage = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dispatch = useAppDispatch();
  const businessDetails = useAppSelector(selectBusinessDetails);
  const businessInformation = useAppSelector(selectBusinessInformation);

  const quoteId = useMemo(
    () => searchParams.get('quoteId') || '',
    [searchParams]
  );

  const {
    data: quote,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetQuoteQuery(quoteId);

  const [loading, setLoading] = useState(quote ? false : true);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: businessDetails,
    validationSchema: businessDetailsSchema,
    onSubmit: (values, { setSubmitting }) => {
      dispatch(setBusinessDetails(values));
      setSubmitting(false);
      router.push(`business-mailing-address?quoteId=${quoteId}`);
    },
  });

  const phoneMaskRef = useMask({
    mask: '+___________',
    replacement: { _: /\d/ },
  });

  useEffect(() => {
    if (quote) {
      const policy = getPolicyFromQuote(quote);
      dispatch(changeCoveragePolicy(policy));
      if (
        quote.insured &&
        isEqual(businessInformation, initBusinessInfoState)
      ) {
        const businessInfo = getBusinessInfoFromQuote(quote);
        dispatch(setBusinessInformation(businessInfo));
      }
      setLoading(false);
    }
  }, [quote]);

  useEffect(() => {
    // Quotes query error handling
    if (isError || (!isLoading && isEmpty(quote))) {
      if (
        isEmpty(quote) ||
        (error && 'status' in error && error.status === 404)
      )
        notFound();
      else throw error;
    }

    if (!isFetching && quote) {
      const completed = quote.data.metadata.completed_sections;
      if (!completed.address) {
        router.push('/');
      } else if (!completed.coverage) {
        router.push(`/policy-coverage?quoteId=${quoteId}`);
      }
    }
  }, [quote, isError, isFetching, error, isLoading, quoteId, router]);

  const getFieldAttrs = (
    fieldName: keyof IBusinessDetails,
    extraAttrs: any = {}
  ) => ({
    ...extraAttrs,
    ...businessDetailsConfig.inputs[fieldName],
    value: formik.values[fieldName],
    error: formik.errors[fieldName],
    touched: formik.touched[fieldName],
    handleChange: formik.handleChange,
    handleBlur: formik.handleBlur,
  });

  return (
    <BusinessInfoFormsContainer title="Enter your business details">
      <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
        {loading && <Loader />}
        <FormikInputField {...getFieldAttrs('businessType')} />
        <FormikInputField {...getFieldAttrs('businessName')} />
        <FormikInputField {...getFieldAttrs('contactName')} />
        <FormikInputField {...getFieldAttrs('email')} />
        <FormikInputField {...getFieldAttrs('alternativeEmail')} />
        <FormikInputField
          {...getFieldAttrs('phone', {
            ref: phoneMaskRef,
          })}
        />
        <BottomNavBar
          buttonLabel="Next: Business Mailing Address"
          disabled={formik.isSubmitting || isLoading}
        />
      </form>
    </BusinessInfoFormsContainer>
  );
};

export default BusinessEntityPage;
