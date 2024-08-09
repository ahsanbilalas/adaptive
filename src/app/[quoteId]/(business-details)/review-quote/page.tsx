'use client';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import { useQuote } from '@/hooks/useQuote';
import { Step } from '@/store/api/types';
import { currencyFormat, getCompleteAddress } from '@/utils/quoteUtils';
import { Title } from '@/components/business-info/style';
import BottomNavBar from '@/components/common/BottomNavBar';
import DisabledInputField from '@/components/common/DisabledInputField';

const ReviewPage = () => {
  const {
    quote,
    address,
    businessInformation,
    quoteQueryResult,
    createQuoteResult,
    loadingRef,
    handleSubmitQuote,
  } = useQuote();

  useEffect(() => {
    const completeQuoteCheckout = async () => {
      try {
        await handleSubmitQuote(Step.checkout, {});
      } catch (error: any) {
        if (error?.status === 400 && Array.isArray(error?.data?.message)) {
          error?.data?.message.map((err: string) => toast.error(err));
        } else toast.error('An error ocurred while checking out');
      }
    };

    completeQuoteCheckout();
  }, [handleSubmitQuote]);

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
