// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define our single API slice object
export const baseApi = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: "smarty-street-api",
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery(),
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    autocomplete: builder.query({
      query: (search: string) => ({
        url: "https://us-autocomplete-pro.api.smarty.com/lookup",
        params: {
          key: process.env.NEXT_PUBLIC_SMARTY_KEY,
          search,
        },
      }),
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useAutocompleteQuery } = baseApi;

export default baseApi;
