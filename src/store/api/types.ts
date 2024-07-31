export interface IAddress {
  street: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ICoverage {
  coverageAmount: number;
  estimateId: string;
  effectiveDate: string;
}

export interface IBusinessInformation {
  businessType: string;
  businessName: string;
  contactName: string;
  mailingAddress: IAddress;
  billingAddress: IAddress;
  phone: string;
  email: string;
  alternativeEmail: string;
  revenueRangeFrom: number;
  revenueRangeTo: number;
}

export interface ICreateQuoteParams {
  step: "address" | "coverage" | "businessInformation" | "checkout";
  quoteId?: string;
  product: string;
  address: IAddress;
  coverage?: ICoverage;
  businessInformation?: IBusinessInformation;
  checkout?: {};
}

export interface IAddressCoordinates {
  latitude: string;
  longitude: string;
}

export interface ISections {
  address: boolean;
  coverage: boolean;
  businessInformation: boolean;
  checkout: boolean;
}

export interface IMetadata {
  visited_sections: ISections;
  completed_sections: ISections;
}

export interface IQuoteEstimate {
  type: string;
  duration: number;
  productId: string;
  countyFips: string;
  netRateOnline: number;
  premiumAmount: number;
  coverageAmount: number;
}

export interface IAscendData {
  programId: string;
  programUrl: string;
  billableId: string;
}

export interface IData {
  address: IAddressCoordinates;
  metadata: IMetadata;
  quoteEstimates: IQuoteEstimate[];
  selectedEstimateId: string;
  productRaterVersion: string;
  ascend: IAscendData;
}

export interface IMigration {
  completed_sections: boolean;
}

export interface IMetaData {
  migration: IMigration;
}

export interface IDocument {
  key: string;
  fileName: string;
  createdAt: string;
  documentUrl: string;
}

export interface IDocuments {
  quote: IDocument[];
}

export interface IAscendDetails {
  ascendId: string;
  ascendContactId: string;
}

export interface IInsured {
  id: string;
  businessName: string;
  businessType: string;
  contactName: string;
  mailingAddress: IAddress;
  billingAddress: IAddress;
  phone: string;
  email: string;
  alternativeEmail: string;
  revenueRangeFrom: number;
  revenueRangeTo: number;
  data: {
    ascend: IAscendDetails;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface IAgent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
  agencyName: string;
  status: string;
  agencyId: string;
  data: {
    ascend: IAscendDetails;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface IBillableData {
  id: string;
  carrier: {
    title: string;
    identifier: string;
    formatted_address: string;
    mailing_address_city: string;
    mailing_address_state: string;
    mailing_address_zip_code: string;
    mailing_address_street_one: string;
    mailing_address_street_two?: string;
  };
  is_filed: boolean;
  metadata?: any;
  documents: any[];
  program_id: string;
  wholesaler: {
    title: string;
    identifier: string;
    formatted_address: string;
    mailing_address_city: string;
    mailing_address_state: string;
    mailing_address_zip_code: string;
    mailing_address_street_one: string;
    mailing_address_street_two?: string;
  };
  description?: string;
  is_auditable: boolean;
  billable_type: string;
  coverage_type: {
    title: string;
    identifier: string;
  };
  is_short_rate: boolean;
  policy_number?: string;
  premium_cents: number;
  effective_date: string;
  expiration_date: string;
  min_earned_rate: number;
  broker_fee_cents: number;
  commission_terms: any[];
  other_fees_cents: number;
  policy_fee_cents: number;
  agency_fees_cents: number;
  min_days_to_cancel: number;
  parent_billable_id?: string;
  billable_identifier: string;
  taxes_and_fees_cents: number;
  seller_commission_rate: number;
  surplus_lines_tax_cents: number;
}

export interface IProgramInfo {
  id: string;
  quoteId: string;
  policyId?: string;
  data: {
    id: string;
    source: string;
    status: string;
    insured: {
      id: string;
      email: string;
      phone: string;
      last_name?: string;
      first_name: string;
      is_business: boolean;
      business_name: string;
      agency_contacts: any[];
      insured_contacts: {
        id: string;
        email: string;
        phone: string;
        last_name?: string;
        first_name: string;
        contact_type: string;
      }[];
      formatted_address: string;
      mailing_address_city: string;
      mailing_address_state: string;
      mailing_address_zip_code: string;
      mailing_address_street_one: string;
      mailing_address_street_two?: string;
    };
    metadata?: any;
    producer: {
      id: string;
      email: string;
      phone?: string;
      last_name: string;
      first_name: string;
    };
    created_at: string;
    return_url: string;
    updated_at: string;
    archived_at?: string;
    program_url: string;
    purchased_at?: string;
    billing_users: {
      id: string;
      email: string;
      phone?: string;
      last_name: string;
      first_name: string;
    }[];
    checkedout_at?: string;
    premium_cents: number;
    account_manager: {
      id: string;
      email: string;
      phone?: string;
      last_name: string;
      first_name: string;
    };
    sub_total_cents: number;
    failure_callback_url: string;
    success_callback_url: string;
    hidden_payment_options: string[];
    allowed_payment_methods: string[];
    selected_payment_option_type?: string;
  };
  billableData: IBillableData[];
  status: string;
  parentBillableId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  quote_id: string;
}

export interface IQuote {
  id: string;
  data: IData;
  metaData: IMetaData;
  street: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  product: string;
  countyFips: string;
  insuredId: string;
  agentId: string;
  agentEmail: string;
  carrier: string;
  effectiveDate: string;
  effectiveDateUtc: string;
  quoteDate: string;
  quoteDateUtc: string;
  addressId?: string;
  boundDate?: string;
  boundDateUtc?: string;
  documents: IDocuments;
  bound: boolean;
  quoteNumberInc: number;
  quoteNumber: string;
  policyId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  agent_id: string;
  insured: IInsured;
  agent: IAgent;
  address?: string;
  policy?: string;
  programInfo: IProgramInfo[];
}
