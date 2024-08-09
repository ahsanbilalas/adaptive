import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { IPolicyCoverageState } from '@/store/feature/policy-coverage';
import { IAddress } from '@/store/api/types';

dayjs.extend(utc);

const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function currencyFormat(price: number) {
  return USDollar.format(price);
}

export function getCoverage(policy: IPolicyCoverageState) {
  return {
    coverageAmount: policy.amount,
    estimateId: policy.selectedEstimateId,
    effectiveDate: getCoverageDate(policy.effectiveDateUtc),
  };
}

export function getCoverageDate(selectedUtc?: string) {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return dayjs(
    !selectedUtc || selectedUtc === '' ? date.toISOString() : selectedUtc
  ).format('MM/DD/YY');
}

export function convertCoverageDate(date: string) {
  return dayjs(date, 'MM/DD/YY').format('YYYY-MM-DD');
}

export function convertStandardDate(date: string) {
  return dayjs(date, 'YYYY-MM-DD').format('MM/DD/YY');
}

export function getCompleteAddress(address: IAddress) {
  return `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}`;
}
