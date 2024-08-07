'use client';
import React from 'react';
import moment from 'moment';
import { find, map, round } from 'lodash';
import { useAppSelector } from '@/store/hooks';
import { selectPolicyCoverage } from '@/store/feature/policy-coverage';
import { currencyFormat } from '@/utils/quoteUtils';
import {
  HorizontalLine,
  QuoteContainer,
  QuoteWrapper,
} from '@/components/policy-coverage/style';
import Button from '@/elements/buttons/Button';
import BlueTickIcon from '@/elements/icons/BlueTickIcon';
import { IQuoteEstimate } from '@/store/api/types';

type Props = {
  selectedEstimate: IQuoteEstimate;
  effectiveDateUtc: string;
};

const QuoteCard = (props: Props) => {
  const includedInQuote = [
    `Coverage starting after ${
      props.selectedEstimate?.duration || 16
    } hours of power loss`,
    `Coverage limit of ${currencyFormat(
      props.selectedEstimate?.coverageAmount || 10000
    )}`,
    `Coverage starting as of ${moment
      .utc(props.effectiveDateUtc)
      .format('D MMM, YYYY')}`,
    'Easy payment once your power goes out',
  ];

  const premium = props.selectedEstimate?.premiumAmount
    ? props.selectedEstimate.premiumAmount
    : 0;

  return (
    <QuoteWrapper>
      <QuoteContainer>
        <div className="mr-auto md:mr-0">
          <p className="font-bold uppercase md:text-center">Your quote</p>
          <p className="mt-4 text-xl md:text-center">Adaptive Power</p>
          <p className="text-xl md:text-center">Outage Coverage</p>
        </div>

        <div>
          <p className="mt-3 text-5xl font-bold">{currencyFormat(premium)}</p>
        </div>
      </QuoteContainer>

      <div className="hidden md:block">
        <HorizontalLine className="mt-7" />
        <p className="my-7 text-center font-bold">What’s included:</p>

        <div className="flex flex-col gap-3">
          {map(includedInQuote, (item: any, index: number) => (
            <div className="flex items-center gap-4" key={index}>
              <div className="size-6">
                <BlueTickIcon />
              </div>
              <p className="leading-none">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full md:hidden">Next: Business Information</Button>
    </QuoteWrapper>
  );
};

export default QuoteCard;
