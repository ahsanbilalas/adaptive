import React from "react";
import map from "lodash/map";
import { IAddress, IQuoteEstimate } from "@/store/api/types";
import { HoursCard, Title } from "@/components/policy-coverage/style";

type Props = {
  address: IAddress;
  coverageQuotes: IQuoteEstimate[];
  selectedQuoteId: string;
  onPolicyQuoteChange: (value: string) => void;
};

const HourCoverage = (props: Props) => {
  return (
    <>
      <Title>Based on your area, </Title>
      <Title>16-hour coverage is right for you</Title>
      <p className="my-8 text-center md:text-left">
        {props.address.city}, {props.address.state} is at a{" "}
        <span className="text-deep-blue inline">Medium</span> risk for
        experiencing power loss in the next 12 months. How long can your
        business go without power before requiring assistance?
      </p>

      <div className="flex flex-wrap gap-8 mb-12">
        {map(props.coverageQuotes, (coverage: IQuoteEstimate) => (
          <HoursCard
            key={coverage.productId}
            $selectedId={props.selectedQuoteId}
            $id={coverage.productId}
            onClick={() => props.onPolicyQuoteChange(coverage.productId)}
          >
            <p className="font-bold text-xl lg:text-4xl mt-auto mb-auto">
              {coverage.duration} hours
            </p>
            {/* <p className="text-center text-sm mb-auto">{coverage.text}</p> */}
          </HoursCard>
        ))}
      </div>
    </>
  );
};

export default HourCoverage;
