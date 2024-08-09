import { FormikHelpers, FormikValues, useFormik } from 'formik';
import { ObjectSchema } from 'yup';
import { useQuote } from '@/hooks/useQuote';

type Props = {
  enableReinitialize?: boolean;
  initialValues: FormikValues;
  validationSchema: ObjectSchema<FormikValues>;
  onSubmit: (
    values: FormikValues,
    { setSubmitting }: FormikHelpers<FormikValues>
  ) => void | Promise<any>;
  config?: any;
  skipQuery?: boolean;
};

export const useQuoteForms = ({
  config,
  initialValues,
  validationSchema,
  onSubmit,
  enableReinitialize = false,
  skipQuery = false,
}: Props) => {
  const {
    quoteId,
    quote,
    address,
    coverage,
    policy,
    businessInformation,
    quoteQueryResult,
    createQuoteResult,
    handleSubmitQuote,
    loadingRef,
    router,
  } = useQuote({ skipQuery });

  const formik = useFormik({
    enableReinitialize,
    initialValues,
    validationSchema,
    onSubmit,
  });

  const getFieldAttrs = (
    fieldName: keyof typeof initialValues,
    extraAttrs: any = {}
  ) => ({
    ...extraAttrs,
    ...(config?.[fieldName] || {}),
    value: formik.values[fieldName],
    error: formik.errors[fieldName],
    touched: formik.touched[fieldName],
    handleChange: formik.handleChange,
    handleBlur: formik.handleBlur,
  });

  return {
    quoteId,
    quote,
    address,
    coverage,
    policy,
    businessInformation,
    quoteQueryResult,
    createQuoteResult,
    handleSubmitQuote,
    loadingRef,
    formik,
    getFieldAttrs,
    router,
  };
};
