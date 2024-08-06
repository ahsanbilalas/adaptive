'use client';
import React, { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import { isEqual } from 'lodash';
import {
  changeCoveragePolicy,
  initPolicyState,
} from '@/store/feature/policy-coverage';
import { useAppDispatch } from '@/store/hooks';
import { useQuote } from '@/hooks/useQuote';
import { Step } from '@/store/api/types';
import { currencyFormat, getCompleteAddress } from '@/utils/quoteUtils';
import {
  getAddressFromQuote,
  getBusinessInfoFromQuote,
  getPolicyFromQuote,
} from '@/utils/adaptiveApiUtils';
import { Title } from '@/components/business-info/style';
import BottomNavBar from '@/components/common/BottomNavBar';
import DisabledInputField from '@/components/common/DisabledInputField';

type Props = {};

const ReviewPage = (props: Props) => {
  const {
    quote,
    quoteQueryResult,
    createQuoteResult,
    loadingRef,
    handleQuoteMutation,
  } = useQuote();

  const dispatch = useAppDispatch();

  const address = getAddressFromQuote(quote);
  const businessInformation = getBusinessInfoFromQuote(quote);
  const policy = useMemo(() => getPolicyFromQuote(quote), [quote]);

  useEffect(() => {
    const completeQuoteCheckout = async () => {
      try {
        await handleQuoteMutation(Step.checkout, {});
      } catch (error: any) {
        if (error?.status === 400 && Array.isArray(error?.data?.message)) {
          error?.data?.message.map((err: string) => toast.error(err));
        } else toast.error('An error ocurred while checking out');
      }
    };

    completeQuoteCheckout();
  }, [handleQuoteMutation]);

  useEffect(() => {
    dispatch(changeCoveragePolicy(policy));
  }, [policy, dispatch]);

  return (
    <div className="flex flex-col gap-5">
      <LoadingBar ref={loadingRef} />
      <Title>Review Information</Title>
      <DisabledInputField
        label="Business Name"
        value={businessInformation.businessName}
      />
      <DisabledInputField
        label="Business Type"
        value={businessInformation.businessType}
      />
      <DisabledInputField
        label="Contact Name"
        value={businessInformation.contactName}
      />
      <DisabledInputField label="Email" value={businessInformation.email} />
      <DisabledInputField
        label="Alternative Email"
        value={businessInformation.alternativeEmail}
      />
      <DisabledInputField label="Phone" value={businessInformation.phone} />
      <DisabledInputField
        label="Business Address"
        value={getCompleteAddress(address)}
      />
      <DisabledInputField
        label="Mailing Address"
        value={getCompleteAddress(businessInformation.mailingAddress)}
      />
      <DisabledInputField
        label="Billing Address"
        value={getCompleteAddress(businessInformation.billingAddress)}
      />
      <DisabledInputField
        label="Revenue Range"
        value={`${currencyFormat(
          businessInformation.revenueRangeFrom
        )} - ${currencyFormat(businessInformation.revenueRangeTo)}`}
      />
      <BottomNavBar
        buttonLabel="Next: Checkout"
        disabled={
          quoteQueryResult.isLoading ||
          createQuoteResult.isLoading ||
          !quote?.programInfo
        }
        onButtonClick={() =>
          window.open(quote?.programInfo[0].data.program_url, '_blank')
        }
      />
    </div>
  );
};

export default ReviewPage;
