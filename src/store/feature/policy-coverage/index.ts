import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { IQuoteEstimate } from '@/store/api/types';

export interface IPolicyCoverageState {
  quoteEstimates: IQuoteEstimate[];
  selectedEstimateId: string;
  amount: number;
  effectiveDateUtc: string;
}

export const initPolicyState = {
  quoteEstimates: [],
  selectedEstimateId: '',
  amount: 10000,
  effectiveDateUtc: '',
} satisfies IPolicyCoverageState as IPolicyCoverageState;

const policyCoverageSlice = createSlice({
  name: 'policy',
  initialState: initPolicyState,
  reducers: {
    changeCoveragePolicy(state, action: PayloadAction<IPolicyCoverageState>) {
      state.quoteEstimates = action.payload.quoteEstimates;
      state.selectedEstimateId = action.payload.selectedEstimateId;
      state.amount = action.payload.amount;
      state.effectiveDateUtc = action.payload.effectiveDateUtc;
    },
    changeQuoteEstimates(state, action: PayloadAction<IQuoteEstimate[]>) {
      state.quoteEstimates = action.payload;
    },
    changeCoverageAmount(state, action: PayloadAction<number>) {
      state.amount = action.payload;
    },
    changeSelectedQuoteId(state, action: PayloadAction<string>) {
      state.selectedEstimateId = action.payload;
    },
    changeEffectiveDate(state, action: PayloadAction<string>) {
      state.effectiveDateUtc = action.payload;
    },
  },
});

export const {
  changeCoveragePolicy,
  changeCoverageAmount,
  changeQuoteEstimates,
  changeSelectedQuoteId,
  changeEffectiveDate,
} = policyCoverageSlice.actions;

export default policyCoverageSlice;

export const selectPolicyCoverage = (state: RootState) => state.policy;
