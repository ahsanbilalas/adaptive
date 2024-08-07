import React from "react";
import { map } from "lodash";
import {
  CoverageCardContainer,
  CoverageLimitCard,
} from "@/components/policy-coverage/style";
import { currencyFormat } from "@/utils/quoteUtils";

type Props = {
  selectedDuration: number;
  coverageLimitOpts: Array<{ limit: number }>;
  selectedLimit: number;
  onPolicyLimitChange: (value: number) => void;
};

const CoverageLimit = (props: Props) => {
  return (
    <>
      <p className="text-5xl text-center md:text-left">
        Now, select your coverage limit
      </p>
      <p className="my-6 text-center md:text-left">
        Should your business lose power for {props.selectedDuration} hours, how
        much would you need to cover operations?
      </p>

      <CoverageCardContainer>
        {map(props.coverageLimitOpts, (coverage: any, index: number) => (
          <CoverageLimitCard
            key={index}
            $selectedLimit={props.selectedLimit}
            $limit={coverage.limit}
            onClick={() => props.onPolicyLimitChange(coverage.limit)}
          >
            <p className="font-bold md:text-xl lg:text-2xl">
              {currencyFormat(coverage.limit)}
            </p>
          </CoverageLimitCard>
        ))}
      </CoverageCardContainer>
    </>
  );
};

export default CoverageLimit;
