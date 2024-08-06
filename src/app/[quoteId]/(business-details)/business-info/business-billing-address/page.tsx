'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { isEqual } from 'lodash';
import { useMask } from '@react-input/mask';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useQuote } from '@/hooks/useQuote';
import {
  initAddressState,
  initBusinessInfoState,
  selectBusinessBillingAddress,
  selectBusinessInformation,
  setBusinessBillingAddress,
  setBusinessInformation,
} from '@/store/feature/business-info';
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
import LoadingBar from 'react-top-loading-bar';

const BusinessBillingPage = () => {
  const router = useRouter();

  const {
    quote,
    quoteQueryResult: { isLoading },
    loadingRef,
  } = useQuote();

  const dispatch = useAppDispatch();
  const businessInformation = useAppSelector(selectBusinessInformation);
  const businessAddress = useAppSelector(selectBusinessBillingAddress);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: businessAddress,
    validationSchema: businessAddressSchema,
    onSubmit: (values, { setSubmitting }) => {
      dispatch(setBusinessBillingAddress(values));
      setSubmitting(false);
      router.push(`business-revenue`);
    },
  });

  const zipMaskRef = useMask({ mask: '_____', replacement: { _: /\d/ } });

  useEffect(() => {
    if (quote?.insured && isEqual(businessInformation, initBusinessInfoState)) {
      const businessInfo = getBusinessInfoFromQuote(quote);
      dispatch(setBusinessInformation(businessInfo));
    } else if (quote && isEqual(businessAddress, initAddressState)) {
      const address = getAddressFromQuote(quote);
      dispatch(setBusinessBillingAddress(address));
    }
  }, [quote, businessInformation, businessAddress, dispatch]);

  const getFieldAttrs = (fieldName: keyof IAddress, extraAttrs: any = {}) => ({
    ...extraAttrs,
    ...businessAddressConfig.inputs[fieldName],
    value: formik.values[fieldName],
    error: formik.errors[fieldName],
    touched: formik.touched[fieldName],
    handleChange: formik.handleChange,
    handleBlur: formik.handleBlur,
  });

  return (
    <BusinessInfoFormsContainer title="Enter your business billing address">
      <LoadingBar ref={loadingRef} />
      <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
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
