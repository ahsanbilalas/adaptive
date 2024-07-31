import { number, object, ref, string } from "yup";

export const getQuoteSchema = object({
  address: string().required(''),
});


export const businessDetailsSchema = object({
  businessType: string().required("Business Type is a required field"),
  businessName: string().required("Business Name is a required field"),
  contactName: string().required("Contact Name is a required field"),
  email: string().email().required(),
  alternativeEmail: string().email("Alternative Email must be a valid email"),
  phone: string()
    .required("Phone number is a required field")
    .matches(/^\+[0-9]{11}$/, "Enter a valid phone number"),
});

export const businessAddressSchema = object({
  street: string().required("Address Line 1 is a required field"),
  street2: string(),
  city: string().required("City is a required field"),
  state: string().required("State is a required field"),
  zipCode: string()
    .required("Zip code is a required field")
    .matches(/^[0-9]{5}$/, "Please enter valid Zip code"),
});

export const businessRevenueSchema = object({
  revenueRangeFrom: number()
    .moreThan(0, "Please enter valid revenue")
    .required("Revenue From is a required field"),
  revenueRangeTo: number()
    .moreThan(ref("revenueRangeFrom"), "Please enter a valid revenue range")
    .required("Revenue To is a required field"),
});
