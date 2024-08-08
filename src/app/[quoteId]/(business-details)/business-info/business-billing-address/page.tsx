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
} from '@/utils/adaptiveApiUtils';
import { IAddress } from '@/store/api/types';
import { businessAddressConfig } from '@/config/businessAddressConfig';
import { businessAddressSchema } from '@/validations/quoteValidations';
import BusinessInfoFormsContainer from '@/components/business-info/BusinessInfoFormsContainer';
import FormikInputField from '@/components/common/FormikInputField';
import BottomNavBar from '@/components/common/BottomNavBar';
import LoadingBar from 'react-top-loading-bar';
import { useQuoteForms } from '@/hooks/useQuoteForms';

const BusinessBillingPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const businessInformation = useAppSelector(selectBusinessInformation);
  const businessAddress = useAppSelector(selectBusinessBillingAddress);

  const {
    formik: { handleSubmit, isSubmitting },
    quote,
    loadingRef,
    quoteQueryResult: { isLoading },
    getFieldAttrs,
  } = useQuoteForms({
    config: businessAddressConfig.inputs,
    enableReinitialize: true,
    initialValues: businessAddress,
    validationSchema: businessAddressSchema,
    onSubmit: (values, { setSubmitting }) => {
      dispatch(setBusinessBillingAddress(values as IAddress));
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
