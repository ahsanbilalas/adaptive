'use client';
import React, { useEffect, useState } from 'react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import { isEmpty, isEqual } from 'lodash';
import { useMask } from '@react-input/mask';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  initAddressState,
  initBusinessInfoState,
  selectBusinessBillingAddress,
  selectBusinessInformation,
  setBusinessBillingAddress,
  setBusinessInformation,
} from '@/store/feature/business-info';
import { useGetQuoteQuery } from '@/store/api/adaptiveApiSlice';
import {
  getAddressFromQuote,
  getBusinessInfoFromQuote,
  getPolicyFromQuote,
} from '@/utils/adaptiveApiUtils';
import { IAddress } from '@/store/api/types';
import { changeCoveragePolicy } from '@/store/feature/policy-coverage';
import { businessAddressConfig } from '@/config/businessAddressConfig';
import { businessAddressSchema } from '@/validations/quoteValidations';
import BusinessInfoFormsContainer from '@/components/business-info/BusinessInfoFormsContainer';
import FormikInputField from '@/components/common/FormikInputField';
import BottomNavBar from '@/components/common/BottomNavBar';
import Loader from '@/components/common/Loader';

type Props = {};

const BusinessBillingPage = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dispatch = useAppDispatch();
  const businessInformation = useAppSelector(selectBusinessInformation);
  const businessAddress = useAppSelector(selectBusinessBillingAddress);

  const quoteId = searchParams.get('quoteId') || '';

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
    initialValues: businessAddress,
    validationSchema: businessAddressSchema,
    onSubmit: (values, { setSubmitting }) => {
      dispatch(setBusinessBillingAddress(values));
      setSubmitting(false);
      router.push(`business-revenue?quoteId=${quoteId}`);
    },
  });

  const zipMaskRef = useMask({ mask: '_____', replacement: { _: /\d/ } });

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
      } else if (isEqual(businessAddress, initAddressState)) {
        const address = getAddressFromQuote(quote);
        dispatch(setBusinessBillingAddress(address));
      }
      setLoading(false);
    }
  }, [quote]);

  const getFieldAttrs = (fieldName: keyof IAddress, extraAttrs: any = {}) => ({
    ...extraAttrs,
    ...businessAddressConfig.inputs[fieldName],
    value: formik.values[fieldName],
    error: formik.errors[fieldName],
    touched: formik.touched[fieldName],
    handleChange: formik.handleChange,
    handleBlur: formik.handleBlur,
  });

  // Quotes query error handling
  if (isError || (!isLoading && isEmpty(quote))) {
    if (isEmpty(quote) || (error && 'status' in error && error.status === 404))
      return notFound();
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

  return (
    <BusinessInfoFormsContainer title="Enter your business billing address">
      <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
        {loading && <Loader />}
        <FormikInputField {...getFieldAttrs('street')} />
        <FormikInputField {...getFieldAttrs('street2')} />
        <FormikInputField {...getFieldAttrs('city')} />
        <FormikInputField {...getFieldAttrs('state')} />
        <FormikInputField
          {...getFieldAttrs('zipCode', {
            ref: zipMaskRef,
          })}
        />
        <BottomNavBar
          buttonLabel="Next: Business Revenue Range"
          disabled={formik.isSubmitting || isLoading}
        />
      </form>
    </BusinessInfoFormsContainer>
  );
};

export default BusinessBillingPage;
