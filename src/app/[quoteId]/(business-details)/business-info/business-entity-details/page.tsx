'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isEqual } from 'lodash';
import { useMask } from '@react-input/mask';
import LoadingBar from 'react-top-loading-bar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useQuoteForms } from '@/hooks/useQuoteForms';
import {
  initBusinessInfoState,
  selectBusinessDetails,
  selectBusinessInformation,
  setBusinessDetails,
  setBusinessInformation,
} from '@/store/feature/business-info';
import { IBusinessDetails } from '@/store/feature/business-info/types';
import { getBusinessInfoFromQuote } from '@/utils/adaptiveApiUtils';
import { businessDetailsSchema } from '@/validations/quoteValidations';
import { businessDetailsConfig } from '@/config/businessDetailsConfig';
import BusinessInfoFormsContainer from '@/components/business-info/BusinessInfoFormsContainer';
import BottomNavBar from '@/components/common/BottomNavBar';
import FormikInputField from '@/components/common/FormikInputField';

const BusinessEntityPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const businessDetails = useAppSelector(selectBusinessDetails);
  const businessInformation = useAppSelector(selectBusinessInformation);

  const {
    formik: { handleSubmit, isSubmitting },
    quote,
    quoteQueryResult: { isFetching },
    loadingRef,
    getFieldAttrs,
  } = useQuoteForms({
    config: businessDetailsConfig.inputs,
    enableReinitialize: true,
    initialValues: businessDetails,
    validationSchema: businessDetailsSchema,
    onSubmit: (values, { setSubmitting }) => {
      dispatch(setBusinessDetails(values as IBusinessDetails));
      setSubmitting(false);
      router.push(`business-mailing-address`);
    },
  });

  const phoneMaskRef = useMask({
    mask: '+___________',
    replacement: { _: /\d/ },
  });

  useEffect(() => {
    if (quote?.insured && isEqual(businessInformation, initBusinessInfoState)) {
      const businessInfo = getBusinessInfoFromQuote(quote);
      dispatch(setBusinessInformation(businessInfo));
    }
  }, [quote, businessInformation, dispatch]);

  return (
    <BusinessInfoFormsContainer title="Enter your business details">
      <LoadingBar ref={loadingRef} />
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
          disabled={isSubmitting || isFetching}
        />
      </form>
    </BusinessInfoFormsContainer>
  );
};

export default BusinessEntityPage;
