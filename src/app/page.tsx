'use client';
import { useEffect, useMemo, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { map } from 'lodash';
import toast from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import { useAppDispatch } from '@/store/hooks';
import { useAutocompleteQuery } from '@/store/api/baseApi';
import { IAddress, Step } from '@/store/api/types';
import { useQuoteForms } from '@/hooks/useQuoteForms';
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
import Button from '@/elements/buttons/Button';
import FormikInputField from '@/components/common/FormikInputField';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [address, setAddress] = useState<IAddress>(initAddressState);

  const {
    formik,
    handleQuoteMutation,
    loadingRef,
    createQuoteResult,
    getFieldAttrs,
  } = useQuoteForms({
    skipQuery: true,
    initialValues: getQuoteConfig.initialValues,
    validationSchema: getQuoteSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const res = await handleQuoteMutation(Step.address, address);
        dispatch(setBusinessInformation(initBusinessInfoState));
        router.push(`${res.id}/policy-selection`);
      } catch (error: any) {
        setSubmitting(false);
        if (error?.status === 400) {
          toast.error('Please provide a valid address');
          setFieldError('address', 'Please provide a valid address');
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
          `${item.street_line}, ${item.secondary === '' ? '' : `${item.secondary}, `}${item.city}, ${item.state}, ${item.zipcode}`
      ),
    [data]
  );

  useEffect(() => {
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
  }, [data]);

  useEffect(() => {
    // SmartyStreets api error handling
    if (formik.values.address !== '' && isError) {
      if ('status' in error && error.status === 404) notFound();
      else toast.error('Something went wrong.');
    }
  }, [formik.values.address, isError, error]);

  return (
    <PageWrapper>
      <LoadingBar ref={loadingRef} />
      <Wrapper>
        <LogoContainer>
          {/* <Image
            className="size-20 md:size-24"
            src={'/logo.svg'}
            alt=""
            width={50}
            height={50}
          /> */}
          <p className="text-5xl md:text-5xl">Get a quote in seconds</p>
        </LogoContainer>

        <InputFormContainer onSubmit={formik.handleSubmit} autoComplete="off">
          <AutocompleteContainer>
            <FormikInputField
              {...getFieldAttrs('address', {
                name: 'address',
                placeholder: 'Enter Address',
              })}
            />
            {formik.errors.address && options.length === 0 && (
              <ErrorMessageText className="p-1">
                {formik.errors.address as string}
              </ErrorMessageText>
            )}
            {options.length > 0 &&
              options[0] !== formik.values.address &&
              formik.values.address !== '' && (
                <AutocompleteItems>
                  {map(options, (item: string, index: number) => (
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
            disabled={
              isFetching ||
              formik.isSubmitting ||
              createQuoteResult.isLoading ||
              address === initAddressState
            }
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
