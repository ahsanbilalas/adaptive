"use client";
import React from "react";
import moment from "moment";
import { find, map, round } from "lodash";
import { useAppSelector } from "@/store/hooks";
import { selectPolicyCoverage } from "@/store/feature/policy-coverage";
import { currencyFormat } from "@/utils/quoteUtils";
import {
  HorizontalLine,
  QuoteContainer,
  QuoteWrapper,
} from "@/components/policy-coverage/style";
import Button from "@/elements/buttons/Button";
import BlueTickIcon from "@/elements/icons/BlueTickIcon";

type Props = {};

const QuoteCard = (props: Props) => {
  const policy = useAppSelector(selectPolicyCoverage);

  const selectedEstimate = find(policy.quoteEstimates, {
    productId: policy.selectedEstimateId,
  });

  const includedInQuote = [
    `Coverage starting after ${
      selectedEstimate?.duration || 16
    } hours of power loss`,
    `Coverage limit of ${currencyFormat(
      selectedEstimate?.coverageAmount || 10000
    )}`,
    `Coverage starting as of ${moment
      .utc(policy.effectiveDateUtc)
      .format("D MMM, YYYY")}`,
    "Easy payment once your power goes out",
  ];

  const premium = selectedEstimate?.premiumAmount
    ? selectedEstimate.premiumAmount
    : 0;

  return (
    <QuoteWrapper>
      <QuoteContainer>
        <div className="mr-auto md:mr-0">
          <p className="font-bold uppercase md:text-center">Your quote</p>
          <p className="text-xl mt-4 md:text-center">Adaptive Power</p>
          <p className="text-xl md:text-center">Outage Coverage</p>
        </div>

        <div>
          <p className="text-5xl font-bold mt-3">{currencyFormat(premium)}</p>
        </div>
      </QuoteContainer>

      <div className="hidden md:block">
        <HorizontalLine className="mt-7" />
        <p className="font-bold my-7 text-center">What’s included:</p>

        <div className="flex flex-col gap-3">
          {map(includedInQuote, (item: any, index: number) => (
            <div className="flex gap-4 items-center" key={index}>
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
