import React from "react";
import CrossIcon from "@/elements/icons/CrossIcon";
import { IconContainer, ModalContainer, ModalWrapper } from "@/components/common/style";

type Props = {
  children: React.ReactNode;
  hide: boolean;
  onCloseModal: () => void;
};

const Modal = (props: Props) => {
  return (
    <>
      {!props.hide && (
        <ModalWrapper onClick={props.onCloseModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <IconContainer>
              <div
                className="cursor-pointer"
                onClick={() => props.onCloseModal()}
              >
                <CrossIcon />
              </div>
            </IconContainer>
            {props.children}
          </ModalContainer>
        </ModalWrapper>
      )}
    </>
  );
};

export default Modal;
