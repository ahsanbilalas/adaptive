// Import the RTK Query methods from the React-specific entry point
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { ICreateQuoteParams, IQuote } from "@/store/api/types";

// Define our single API slice object
export const adaptiveApiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: "adaptive-insurance-api",
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_ADAPTIVE_API_URL,
  }),
  tagTypes: ["QUOTE"],
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    getQuote: builder.query<IQuote, string>({
      query: (id) => `/v1/insurance-quote/${id}`,
      providesTags: ["QUOTE"],
    }),
    createQuote: builder.mutation<IQuote, ICreateQuoteParams>({
      query: (body) => ({
        url: "/v1/insurance-quote",
        method: "POST",
        body,
      }),
      invalidatesTags: ["QUOTE"],
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetQuoteQuery, useCreateQuoteMutation } = adaptiveApiSlice;

export default adaptiveApiSlice;
