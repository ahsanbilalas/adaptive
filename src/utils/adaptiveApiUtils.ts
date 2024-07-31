import moment from "moment";
import { find } from "lodash";
import {
  IAddress,
  IBusinessInformation,
  ICoverage,
  IQuote,
} from "@/store/api/types";
import { initAddressState } from "@/store/feature/business-info";

export const getBusinessInfoFromQuote = (
  quote: IQuote | undefined
): IBusinessInformation => ({
  businessName: quote?.insured?.businessName || "",
  businessType: quote?.insured?.businessType || "",
  contactName: quote?.insured?.contactName || "",
  mailingAddress: quote?.insured?.mailingAddress || initAddressState,
  billingAddress: quote?.insured?.billingAddress || initAddressState,
  phone: quote?.insured?.phone || "",
  email: quote?.insured?.email || "",
  alternativeEmail: quote?.insured?.alternativeEmail || "",
  revenueRangeFrom: quote?.insured?.revenueRangeFrom || 0,
  revenueRangeTo: quote?.insured?.revenueRangeTo || 0,
});

export const getPolicyFromQuote = (quote: IQuote | undefined) => ({
  quoteEstimates: quote?.data.quoteEstimates || [],
  selectedEstimateId: quote?.data.selectedEstimateId || "",
  amount: quote?.data.quoteEstimates[0].coverageAmount || 10000,
  effectiveDateUtc: quote?.effectiveDateUtc || "",
});

export const getCoverageFromQuote = (quote: IQuote | undefined): ICoverage => {
  const selectedEstimate = find(quote?.data.quoteEstimates, {
    productId: quote?.data.selectedEstimateId,
  });

  return {
    coverageAmount: selectedEstimate?.coverageAmount || 10000,
    estimateId: selectedEstimate?.productId || "",
    effectiveDate: moment
      .utc(
        quote?.effectiveDateUtc
          ? quote?.effectiveDateUtc
          : new Date().toISOString()
      )
      .format("MM/DD/YY"),
  };
};

export const getAddressFromQuote = (quote: IQuote | undefined): IAddress => ({
  street: quote?.street || "",
  street2: quote?.street2 || "",
  city: quote?.city || "",
  state: quote?.state || "",
  zipCode: quote?.zipCode || "",
});
