import React, { ChangeEvent } from 'react';
import { find } from 'lodash';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  changeCoverageAmount,
  changeEffectiveDate,
  changeSelectedQuoteId,
  selectPolicyCoverage,
} from '@/store/feature/policy-coverage';
import { IAddress } from '@/store/api/types';
import { policyCoverageConfig } from '@/config/policyCoverageConfig';
import { HorizontalLine } from '@/components/policy-coverage/style';
import {
  ErrorMessageText,
  InputFieldContainer,
} from '@/components/common/style';
import QuoteCard from './QuoteCard';
import Input from '@/elements/inputs/Input';
import HourCoverage from '@/components/policy-coverage/HourCoverage';
import CoverageLimit from '@/components/policy-coverage/CoverageLimit';

type Props = {
  onShowModal: () => void;
  dateInputError: string;
  address: IAddress;
};

const PolicyCoverageUI = (props: Props) => {
  const dispatch = useAppDispatch();
  const policy = useAppSelector(selectPolicyCoverage);
  const selectedEstimate = find(policy.quoteEstimates, {
    productId: policy.selectedEstimateId,
  });

  const date = new Date();
  const minDate = moment(date).add(1, 'days').format('YYYY-MM-DD');
  const selectedDate =
    policy.effectiveDateUtc === ''
      ? minDate
      : moment.utc(policy.effectiveDateUtc).format('YYYY-MM-DD');

  function handleDateChange(e: ChangeEvent<HTMLInputElement>) {
    const newDate = new Date(e.currentTarget.value);
    dispatch(changeEffectiveDate(newDate.toISOString()));
  }

  return (
    <>
      <div className="md:hidden">
        <QuoteCard />
        <HorizontalLine className="my-16" />
      </div>
      <HourCoverage
        address={props.address}
        coverageQuotes={policy.quoteEstimates}
        selectedQuoteId={policy.selectedEstimateId}
        onPolicyQuoteChange={(value: string) =>
          dispatch(changeSelectedQuoteId(value))
        }
      />
      <CoverageLimit
        selectedDuration={selectedEstimate?.duration || 16}
        selectedLimit={policy.amount}
        coverageLimitOpts={policyCoverageConfig.coverageLimitOpts}
        onPolicyLimitChange={(value: number) =>
          dispatch(changeCoverageAmount(value))
        }
      />
      <InputFieldContainer className="mb-12">
        <p>Effective Date</p>
        <Input
          type="date"
          value={selectedDate}
          min={minDate}
          onChange={handleDateChange}
        />
        {props.dateInputError !== '' && (
          <ErrorMessageText>{props.dateInputError}</ErrorMessageText>
        )}
      </InputFieldContainer>
      <div>
        <p
          className="w-fit cursor-pointer font-bold underline"
          onClick={props.onShowModal}
        >
          See what this means
        </p>
      </div>
    </>
  );
};

export default PolicyCoverageUI;
