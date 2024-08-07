import React, { ChangeEvent } from 'react';
import { IAddress, IQuoteEstimate } from '@/store/api/types';
import { policyCoverageConfig } from '@/config/policyCoverageConfig';
import {
  PageWrapper,
  HorizontalLine,
  QuoteCardWrapper,
} from '@/components/policy-coverage/style';
import QuoteCard from './QuoteCard';
import HourCoverage from '@/components/policy-coverage/HourCoverage';
import CoverageLimit from '@/components/policy-coverage/CoverageLimit';
import FormikInputField from '@/components/common/FormikInputField';

type Props = {
  onShowModal: () => void;
  address: IAddress;
  formik: any;
  selectedEstimate: IQuoteEstimate;
  quoteEstimates: IQuoteEstimate[];
};

const PolicyCoverageUI = ({
  onShowModal,
  address,
  formik,
  selectedEstimate,
  quoteEstimates,
}: Props) => {
  return (
    <div className="pb-24">
      <PageWrapper>
        <div className="mr-auto w-full md:pr-10 lg:px-32">
          <div className="md:hidden">
            <QuoteCard
              selectedEstimate={selectedEstimate}
              effectiveDateUtc={new Date(
                formik.values.effectiveDate
              ).toISOString()}
            />
            <HorizontalLine className="my-16" />
          </div>
          <HourCoverage
            address={address}
            coverageQuotes={quoteEstimates}
            selectedQuoteId={formik.values.estimateId}
            onPolicyQuoteChange={(value: string) =>
              formik.setFieldValue('estimateId', value)
            }
          />
          <CoverageLimit
            selectedDuration={selectedEstimate?.duration || 16}
            selectedLimit={formik.values.coverageAmount}
            coverageLimitOpts={policyCoverageConfig.coverageLimitOpts}
            onPolicyLimitChange={(value: number) =>
              formik.setFieldValue('coverageAmount', value)
            }
          />
          <FormikInputField
            type="date"
            name="effectiveDate"
            value={formik.values.effectiveDate}
            error={formik.errors.effectiveDate}
            touched={formik.touched.effectiveDate}
            handleBlur={formik.handleBlur}
            handleChange={formik.handleChange}
          />
          <div>
            <p
              className="mt-12 w-fit cursor-pointer font-bold underline"
              onClick={onShowModal}
            >
              See what this means
            </p>
          </div>
        </div>
        <QuoteCardWrapper>
          <div className="fixed right-10">
            <QuoteCard
              selectedEstimate={selectedEstimate}
              effectiveDateUtc={new Date(
                formik.values.effectiveDate
              ).toISOString()}
            />
          </div>
        </QuoteCardWrapper>
      </PageWrapper>
    </div>
  );
};

export default PolicyCoverageUI;
