'use client';
import React from 'react';
import { find } from 'lodash';
import { useQuote } from '@/hooks/useQuote';
import { currencyFormat } from '@/utils/quoteUtils';
import {
  BackIconContainer,
  QuoteContainer,
  BottomNavbarContainer,
} from './style';
import Button from '@/elements/buttons/Button';
import LeftArrowIcon from '@/elements/icons/LeftArrowIcon';

type Props = {
  buttonLabel: string;
  selectedId?: any;
  onButtonClick?: () => void;
  disabled?: boolean;
};

const BottomNavBar = (props: Props) => {
  const { router, policy } = useQuote();
  let productId = props.selectedId ?? policy.selectedEstimateId;
  const selectedEstimate = find(policy.quoteEstimates, {
    productId: productId,
  });
  const premium = selectedEstimate?.premiumAmount ?? 0;
  return (
    <BottomNavbarContainer>
      <BackIconContainer onClick={() => router.back()}>
        <LeftArrowIcon />
        <p className="font-bold">Back</p>
      </BackIconContainer>

      <QuoteContainer>
        <p className="text-sm font-bold uppercase">Your quote</p>
        <p className="text-lg">{currencyFormat(premium)}/mo</p>
      </QuoteContainer>

      <Button
        type="submit"
        onClick={props.onButtonClick}
        disabled={props.disabled}
      >
        {props.buttonLabel}
      </Button>
    </BottomNavbarContainer>
  );
};

export default BottomNavBar;
