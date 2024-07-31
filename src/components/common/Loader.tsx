import { LoaderWrapper } from "@/components/common/style";
import React from "react";
import { MoonLoader } from "react-spinners";

type Props = {};

const Loader = (props: Props) => {
  return (
    <LoaderWrapper>
      <MoonLoader />
    </LoaderWrapper>
  );
};

export default Loader;
