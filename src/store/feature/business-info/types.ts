import { IAddress } from "@/store/api/types";

export interface IBusinessInfoState {
  businessType: string;
  businessName: string;
  contactName: string;
  email: string;
  alternativeEmail: string;
  phone: string;
  revenueRangeFrom: number;
  revenueRangeTo: number;
  mailingAddress: IAddress;
  billingAddress: IAddress;
}

export interface IBusinessDetails {
  businessType: string;
  businessName: string;
  contactName: string;
  email: string;
  alternativeEmail: string;
  phone: string;
}

export interface IBusinessRevenue {
  revenueRangeFrom: number;
  revenueRangeTo: number;
}
