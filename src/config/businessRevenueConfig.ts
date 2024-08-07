export const businessRevenueConfig = {
  initialValues: {
    revenueFrom: "",
    revenueTo: "",
  },
  inputs: {
    revenueRangeFrom: {
      type: "number",
      label: "Revernue From",
      name: "revenueRangeFrom",
    },
    revenueRangeTo: {
      type: "number",
      label: "Revenue To",
      name: "revenueRangeTo",
    },
  },
};
