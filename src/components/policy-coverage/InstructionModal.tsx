import React from "react";
import Image from "next/image";
import { HorizontalLine, ModalContainer } from "@/components/policy-coverage/style";
import Modal from "@/components/common/Modal";

type Props = {
  hide: boolean;
  onCloseModal: () => void;
};

const InstructionModal = (props: Props) => {
  return (
    <Modal hide={props.hide} onCloseModal={props.onCloseModal}>
      <ModalContainer>
        <Image src={"/logo.svg"} alt="" width={85} height={85} />
        <p className="text-center">
          Based on your ZIP code and the recommended 12-hour coverage plan, our
          models predict you will receive your claim money in full 99% of the
          time.
        </p>
        <p className="text-center">
          That remaining 1% is for instances where more than 10% of the county’s
          power goes out. In which case, you’d still receive 40% of your chosen
          claim amount.
        </p>
        <p className="text-center">
          We reserve this for exceptionally rare instances that put a strain on
          our payment system. If this were to happen, Adaptive would still give
          you a 4x return on investment.
        </p>
        <HorizontalLine />
        <p className="text-gray text-center w-9/12">
          If you have any questions, please reach out to an agent at (123)
          456-7890.
        </p>
      </ModalContainer>
    </Modal>
  );
};

export default InstructionModal;
