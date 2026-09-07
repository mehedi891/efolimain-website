"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Button from "./Button";
import FormsubmitSuccessModal from "./contact/FormsubmitSuccessModal";

interface ContactFormValues {
  name: string;
  company: string;
  email: string;
  service: string;
  message: string;
  hCaptchaToken: string;
}

interface FormProps {
  fClass?: string;
  btnClass?: string;
  btnTxt?: string;
  hideService?: boolean;
}

const Form = ({
  fClass = "",
  btnClass = "",
  btnTxt = "Submit",
  hideService = false,
}: FormProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      company: "",
      email: "",
      service: "Other",
      message: "",
      hCaptchaToken: "",
    },
  });

  const service = useWatch({ control, name: "service" });
  const isPlaceholder = service === "";

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setSubmitting(true);
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, String(v ?? "")));
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      const json = await res.json();
      if (json?.success) {
        setIsModalOpen(true);
        reset();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerificationSuccess = (token: string) => {
    setValue("hCaptchaToken", token, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className={`${fClass} pb-12`}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 lg:gap-15 max-w-full w-full"
      >
        <div>
          <label className="text-xl after:content-['*'] after:ml-1 after:text-red-500">
            What is your name?
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full py-4 border-b border-gray-300 focus:outline-none text-2xl/[1.67] placeholder:text-gray-400"
            {...register("name", {
              required: "Please enter your name",
              minLength: { value: 2, message: "Min 2 characters" },
              maxLength: { value: 150, message: "Max 150 characters" },
            })}
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-300">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="text-xl">What is your Company&apos;s name?</label>
          <input
            type="text"
            placeholder="Company"
            className="w-full py-4 border-b border-gray-300 focus:outline-none text-2xl/[1.67] placeholder:text-gray-400"
            {...register("company", {
              minLength: { value: 2, message: "Min 2 characters" },
              maxLength: { value: 150, message: "Max 150 characters" },
            })}
          />
          {errors.company && (
            <p className="mt-2 text-sm text-red-300">{errors.company.message}</p>
          )}
        </div>

        <div>
          <label className="text-xl after:content-['*'] after:ml-1 after:text-red-500">
            What is your email address?
          </label>
          <input
            type="email"
            placeholder="Email address"
            className="w-full py-4 border-b border-gray-300 focus:outline-none text-2xl/[1.67] placeholder:text-gray-400"
            {...register("email", {
              required: "Please enter your email address",
              minLength: { value: 2, message: "Min 2 characters" },
              maxLength: { value: 150, message: "Max 150 characters" },
            })}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-300">{errors.email.message}</p>
          )}
        </div>

        {!hideService && (
          <div>
            <label className="text-xl after:content-['*'] after:ml-1 after:text-red-500">
              Which service required?
            </label>
            <select
              id="service"
              defaultValue=""
              className={`w-full px-0 py-4 border-b focus:outline-none text-2xl/[1.67] cursor-pointer
    ${errors.service ? "border-red-500" : "border-gray-300"}
    ${isPlaceholder ? "text-[#9B9B9A]" : ""}`}
              {...register("service", { required: "Please select a service" })}
            >
              <option value="" disabled hidden>
                Please select
              </option>
              <option value="technical">Technical</option>
              <option value="info">Information</option>
              <option value="other">Other</option>
            </select>
            {errors.service && (
              <p className="mt-2 text-sm text-red-300">{errors.service.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="text-xl after:content-['*'] after:ml-1 after:text-red-500">
            How can we help you?
          </label>
          <textarea
            placeholder="Describe your challenges"
            className="w-full  py-4 border-b border-gray-300 focus:outline-none text-2xl/[1.67] placeholder:text-gray-400"
            {...register("message", {
              required: "Please enter your message",
              minLength: { value: 2, message: "Min 2 characters" },
              maxLength: { value: 1050, message: "Max 1050 characters" },
            })}
          />
          {errors.message && (
            <p className="mt-2 text-sm text-red-300">{errors.message.message}</p>
          )}
        </div>

        <div className="md:-mt-8">
          <HCaptcha
            sitekey="14b0da6a-9b72-410a-8758-d2787a2cb814"
            onVerify={(token) => handleVerificationSuccess(token)}
            size="normal"
          />
          <input
            type="hidden"
            {...register("hCaptchaToken", {
              required: "Please complete the CAPTCHA",
            })}
          />
          {errors.hCaptchaToken && (
            <p className="mt-2text-sm text-red-300">
              {errors.hCaptchaToken.message}
            </p>
          )}
        </div>

        <Button
          pClass={`max-w-max  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 md:-mt-8 ${btnClass}`}
          text1={submitting ? "Submitting..." : btnTxt}
          text2={submitting ? "Submitting..." : btnTxt}
          disabled={submitting}
        />
      </form>

      <FormsubmitSuccessModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default Form;
