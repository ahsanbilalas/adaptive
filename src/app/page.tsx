'use client';
import { useEffect, useMemo, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { map } from 'lodash';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/store/hooks';
import { useAutocompleteQuery } from '@/store/api/baseApi';
import { useCreateQuoteMutation } from '@/store/api/adaptiveApiSlice';
import { IAddress, ICreateQuoteParams } from '@/store/api/types';
import {
  changeCoveragePolicy,
  initPolicyState,
} from '@/store/feature/policy-coverage';
import {
  initAddressState,
  initBusinessInfoState,
  setBusinessInformation,
} from '@/store/feature/business-info';
import { getQuoteConfig } from '@/config/getQuoteConfig';
import { getQuoteSchema } from '@/validations/quoteValidations';
import {
  AutocompleteContainer,
  AutocompleteItems,
  AutocompleteOptions,
  InputFormContainer,
  LogoContainer,
  PageWrapper,
  Wrapper,
} from '@/components/get-quote/style';
import { ErrorMessageText } from '@/components/common/style';
import Image from 'next/image';
import Button from '@/elements/buttons/Button';
import FormikInputField from '@/components/common/FormikInputField';
import Loader from '@/components/common/Loader';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [createQuote, createQuoteResult] = useCreateQuoteMutation();

  const [address, setAddress] = useState<IAddress>(initAddressState);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [inputError, setInputError] = useState<string | undefined>();
  const [apiLoading, setApiLoading] = useState(false);

  const createQuoteParams: ICreateQuoteParams = {
    address,
    step: 'address',
    product: 'Outage',
  };

  const formik = useFormik({
    initialValues: getQuoteConfig.initialValues,
    validationSchema: getQuoteSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setApiLoading(true);
        const res = await createQuote(createQuoteParams).unwrap();
        dispatch(changeCoveragePolicy(initPolicyState));
        dispatch(setBusinessInformation(initBusinessInfoState));
        router.push(`policy-coverage?quoteId=${res.id}`);
      } catch (error: any) {
        setApiLoading(false);
        setSubmitting(false);
        if (error?.status === 400) {
          toast.error('Please provide a valid address');
          setInputError('Please provide a valid address');
        } else toast.error('Something went wrong. Try again.');
      }
    },
  });

  const { data, isFetching, isError, error } = useAutocompleteQuery(
    formik.values.address
  );

  const options = useMemo(
    () =>
      map(
        data?.suggestions,
        (item: any) =>
          `${item.street_line}, ${item.city}, ${item.state}, ${item.zipcode}`
      ),
    [data]
  );

  const disableSubmit =
    apiLoading ||
    isFetching ||
    formik.isSubmitting ||
    address === initAddressState;

  useEffect(() => {
    !isFetching && setAutocompleteOptions(options);

    if (data?.suggestions.length === 1) {
      let addr = data?.suggestions[0];
      setAddress({
        street: addr.street_line,
        street2: addr.secondary,
        zipCode: addr.zipcode,
        city: addr.city,
        state: addr.state,
      });
    } else {
      setAddress(initAddressState);
    }
  }, [data, options, isFetching]);

  // SmartyStreets api error handling
  if (formik.values.address !== '' && isError) {
    if ('status' in error && error.status === 404) return notFound();
    else throw error;
  }

  return (
    <PageWrapper>
      {apiLoading && <Loader />}
      <Wrapper>
        <LogoContainer>
          <Image
            className="size-20 md:size-24"
            src={'/logo.svg'}
            alt=""
            width={50}
            height={50}
          />
          <p className="text-3xl md:text-5xl">Get a quote in seconds</p>
        </LogoContainer>

        <InputFormContainer onSubmit={formik.handleSubmit} autoComplete="off">
          <AutocompleteContainer>
            <FormikInputField
              value={formik.values.address}
              error={formik.errors.address}
              touched={formik.touched.address}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              {...getQuoteConfig.inputs.address}
            />
            {inputError && autocompleteOptions.length === 0 && (
              <ErrorMessageText className="p-1">{inputError}</ErrorMessageText>
            )}
            {autocompleteOptions.length > 0 &&
              autocompleteOptions[0] !== formik.values.address &&
              formik.values.address !== '' && (
                <AutocompleteItems>
                  {map(autocompleteOptions, (item: string, index: number) => (
                    <AutocompleteOptions
                      key={index}
                      onClick={() => formik.setFieldValue('address', item)}
                    >
                      {item}
                    </AutocompleteOptions>
                  ))}
                </AutocompleteItems>
              )}
          </AutocompleteContainer>
          <Button
            className="w-full text-sm md:w-2/5"
            type="submit"
            disabled={disableSubmit}
          >
            Get Your Quote
          </Button>
        </InputFormContainer>

        <p className="text-center md:w-2/4">
          If you have more than one location, reach out to us directly at
          123-456-7890.
        </p>
      </Wrapper>
    </PageWrapper>
  );
}
