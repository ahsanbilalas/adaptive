import React from 'react';
import map from 'lodash/map';
import { IAddress, IQuoteEstimate } from '@/store/api/types';
import { HoursCard, Title } from '@/components/policy-coverage/style';
import { currencyFormat } from '@/utils/quoteUtils';
import Button from '@/elements/buttons/Button';

type Props = {
  address: IAddress;
  coverageQuotes: IQuoteEstimate[];
  selectedQuoteId: string;
  onPolicyQuoteChange: (value: string) => void;
};

const HourCoverage = (props: Props) => {
  return (
    <>
      <Title>Based on your location, </Title>
      <Title>16-hour coverage is suitable for you</Title>
      <p className="my-8 text-center md:text-left">
        {props.address.city}, {props.address.state} faces a{' '}
        <span className="inline text-deep-blue">Medium</span> risk of power loss
        within the next 12 months. How long can your business operate without
        power before needing assistance?
      </p>

      <div className="mb-12 flex flex-wrap gap-8">
        {map(props.coverageQuotes, (coverage: IQuoteEstimate) => (
          <HoursCard
            key={coverage.productId}
            $selectedId={props.selectedQuoteId}
            $id={coverage.productId}
            onClick={() => props.onPolicyQuoteChange(coverage.productId)}
          >
            <div className="flex items-center gap-12">
              <div>
                <p className="text-sm">Duration</p>
                <p className="mb-auto mt-auto font-bold md:text-xl lg:text-4xl">
                  {coverage.duration} hours
                </p>
              </div>
              <div>
                <p className="text-sm">Premium</p>
                <p className="mb-auto mt-auto font-bold md:text-xl lg:text-4xl">
                  {currencyFormat(coverage.premiumAmount)}
                </p>
              </div>
            </div>
          </HoursCard>
        ))}
      </div>
    </>
  );
};

export default HourCoverage;
