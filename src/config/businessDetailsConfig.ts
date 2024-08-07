export const businessDetailsConfig = {
  initialValues: {
    businessType: "",
    businessName: "",
    contactName: "",
    email: "",
    alternateEmail: "",
    phone: "",
  },
  inputs: {
    businessType: {
      label: "Business Type",
      name: "businessType",
      as: "select",
      options: [
        {
          value: "smallBusiness",
          label: "Small Business",
        },
        {
          value: "mediumBusiness",
          label: "Medium Business",
        },
        {
          value: "largeBusiness",
          label: "Large Business",
        },
      ],
    },
    businessName: {
      label: "Busniess Name *",
      name: "businessName",
    },
    contactName: {
      label: "Contact Name *",
      name: "contactName",
    },
    email: {
      type: "email",
      label: "Email *",
      name: "email",
    },
    alternativeEmail: {
      type: "email",
      label: "Alternative Email",
      name: "alternativeEmail",
    },
    phone: {
      label: "Phone *",
      name: "phone",
    },
  },
};
