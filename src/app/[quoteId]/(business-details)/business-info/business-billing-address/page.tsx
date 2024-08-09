'use client';
import React, { useEffect } from 'react';
import { FormikHelpers, FormikValues } from 'formik';
import { isEqual } from 'lodash';
import { useMask } from '@react-input/mask';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useQuoteForms } from '@/hooks/useQuoteForms';
import {
  initAddressState,
  initBusinessInfoState,
  selectBusinessBillingAddress,
  selectBusinessInformation,
  setBusinessBillingAddress,
  setBusinessInformation,
} from '@/store/feature/business-info';
import { IAddress } from '@/store/api/types';
import { businessAddressConfig } from '@/config/businessAddressConfig';
import { businessAddressSchema } from '@/validations/quoteValidations';
import BusinessInfoFormsContainer from '@/components/business-info/BusinessInfoFormsContainer';
import FormikInputField from '@/components/common/FormikInputField';
import BottomNavBar from '@/components/common/BottomNavBar';
import LoadingBar from 'react-top-loading-bar';

const BusinessBillingPage = () => {
  const dispatch = useAppDispatch();
  const businessInfoState = useAppSelector(selectBusinessInformation);
  const businessAddressState = useAppSelector(selectBusinessBillingAddress);

  const {
    router,
    formik: { handleSubmit, isSubmitting },
    quote,
    address,
    businessInformation,
    loadingRef,
    quoteQueryResult: { isLoading },
    getFieldAttrs,
  } = useQuoteForms({
    config: businessAddressConfig.inputs,
    enableReinitialize: true,
    initialValues: businessAddressState,
    validationSchema: businessAddressSchema,
    onSubmit,
  });

  const zipMaskRef = useMask({ mask: '_____', replacement: { _: /\d/ } });

  useEffect(() => {
    if (quote?.insured && isEqual(businessInfoState, initBusinessInfoState)) {
      dispatch(setBusinessInformation(businessInformation));
    } else if (quote && isEqual(businessAddressState, initAddressState)) {
      dispatch(setBusinessBillingAddress(address));
    }
  }, [
    quote,
    businessInfoState,
    businessAddressState,
    address,
    businessInformation,
    dispatch,
  ]);

  function onSubmit(
    values: FormikValues,
    { setSubmitting }: FormikHelpers<FormikValues>
  ) {
    dispatch(setBusinessBillingAddress(values as IAddress));
    setSubmitting(false);
    router.push(`business-revenue`);
  }

  return (
    <BusinessInfoFormsContainer title="Enter your business billing address">
      <LoadingBar ref={loadingRef} />
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
          disabled={isSubmitting || isLoading}
        />
      </form>
    </BusinessInfoFormsContainer>
  );
};

export default BusinessBillingPage;
