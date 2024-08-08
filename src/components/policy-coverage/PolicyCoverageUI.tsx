import React, { ChangeEvent } from 'react';
import { IAddress, ICoverage, IQuoteEstimate } from '@/store/api/types';
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
import { FormikValues } from 'formik';

type Props = {
  onShowModal: () => void;
  address: IAddress;
  values: FormikValues;
  setFieldValue: any;
  getFieldAttrs: (fieldName: string | number, extraAttrs?: any) => any;
  selectedEstimate: IQuoteEstimate;
  quoteEstimates: IQuoteEstimate[];
};

const PolicyCoverageUI = ({
  onShowModal,
  address,
  values,
  setFieldValue,
  getFieldAttrs,
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
              effectiveDateUtc={new Date(values.effectiveDate).toISOString()}
            />
            <HorizontalLine className="my-16" />
          </div>
          <HourCoverage
            address={address}
            coverageQuotes={quoteEstimates}
            selectedQuoteId={values.estimateId}
            onPolicyQuoteChange={(value: string) =>
              setFieldValue('estimateId', value)
            }
          />
          <CoverageLimit
            selectedDuration={selectedEstimate?.duration || 16}
            selectedLimit={values.coverageAmount}
            coverageLimitOpts={policyCoverageConfig.coverageLimitOpts}
            onPolicyLimitChange={(value: number) =>
              setFieldValue('coverageAmount', value)
            }
          />
          <FormikInputField
            {...getFieldAttrs('effectiveDate', {
              type: 'date',
              name: 'effectiveDate',
              label: 'Effective Date',
            })}
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
              effectiveDateUtc={new Date(values.effectiveDate).toISOString()}
            />
          </div>
        </QuoteCardWrapper>
      </PageWrapper>
    </div>
  );
};

export default PolicyCoverageUI;
