"use client";

import { RxCross1 } from "react-icons/rx";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

interface FormsubmitSuccessModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  text1?: string;
  text2?: string;
}

const FormsubmitSuccessModal = ({
  isModalOpen,
  setIsModalOpen,
  text1 = "Form submitted successfully.",
  text2 = "We will get back to you soon.",
}: FormsubmitSuccessModalProps) => {
  return (
    <div
      className={`${
        isModalOpen ? " visible" : " invisible"
      } w-full h-screen fixed top-0 left-0 z-[200000000] bg-[#0000002a] flex items-center justify-center transition-all duration-300`}
    >
      <div
        className={`${
          isModalOpen ? " scale-[1] opacity-100" : " scale-[0] opacity-0"
        } w-[90%] sm:w-[80%] md:w-[30%] bg-[#fff] rounded-lg p-4 transition-all duration-300`}
      >
        <div className="w-full flex items-end justify-end">
          <RxCross1
            className="p-2 text-[2.5rem] bg-black/45 hover:bg-[#656363] rounded-full transition-all duration-300 cursor-pointer"
            onClick={() => {
              setIsModalOpen(false);
            }}
          />
        </div>
        <div className="w-full flex items-center justify-center flex-col">
          <h2 className="text-[#2cac9f] text-[2rem] font-[500]">Success!</h2>

          <IoCheckmarkDoneCircleOutline className="p-2 text-[6rem] text-[#2cac9f]" />
          <p className="text-[1.5rem] text-gray-900 text-center mt-4 mb-2">
            <span className="font-[600] ">{text1}</span> <br />
            <span className="font-[600] ">{text2}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormsubmitSuccessModal;
