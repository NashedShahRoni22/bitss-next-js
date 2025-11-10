"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { postApi } from "@/api/api";
import { authFormValidationRules } from "@/data/authFormValidationRules";
import FormField from "@/components/FormField";
import Link from "next/link";
import Image from "next/image";

export default function Signup() {
  const { addAuthInfo } = useAuth();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [countries, setCountries] = useState([]);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  // Watch the bobosohomail field to track changes
  const watchedFields = watch();

  useEffect(() => {
    fetch("/country.json")
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []);

  // Handle email availability change from FormField
  const handleEmailAvailabilityChange = (isAvailable) => {
    setEmailAvailable(isAvailable);
  };

  // Check if form is valid and can be submitted
  const isFormValid = () => {
    // Check if all required fields have values
    const hasRequiredFields =
      watchedFields.name &&
      watchedFields.bobosohomail &&
      watchedFields.password &&
      watchedFields.contactEmail &&
      watchedFields.country &&
      watchedFields.address &&
      watchedFields.terms;

    // Check if there are no validation errors
    const hasNoErrors = Object.keys(errors).length === 0;

    // Check if bobosoho email is available
    const isEmailValid = emailAvailable === true;

    return hasRequiredFields && hasNoErrors && isEmailValid;
  };

  const onSubmit = async (data) => {
    // Only submit if form is valid and email is available
    if (isFormValid()) {
      setIsLoading(true);

      try {
        const { address, bobosohomail, contactEmail, country, name, password } =
          data;

        const payload = {
          address,
          // email: `${bobosohomail}@bobosohomail.com`,
          username: bobosohomail,
          personal_email: contactEmail,
          country,
          name,
          password,
        };

        const res = await postApi({
          endpoint: "/auth/user/register",
          payload,
        });

        if (res?.success) {
          toast.success(res?.message);
          addAuthInfo(res?.data);
          router.push("/login");
        } else {
          // Handle API response with success: false
          toast.error(res?.message || "Registration failed. Please try again.");
        }
      } catch (error) {
        // Handle network errors or other exceptions
        console.error("Registration error:", error);
        toast.error(
          error?.message ||
            "An error occurred during registration. Please try again."
        );
      } finally {
        // Always set loading to false, whether success or error
        setIsLoading(false);
      }
    }
  };

  return (
    <section className="w-full py-10 font-roboto">
      <div className="mx-5 flex flex-col gap-8 md:container md:mx-auto md:flex-row md:gap-16">
        {/* form container */}
        <div className="borer-gray-200 w-full rounded-lg border bg-white px-5 py-10 md:w-1/2">
          <h1 className="text-center text-2xl font-semibold">
            Create your account
          </h1>
          <p className="text-center text-lg">
            Join us to protect your digital life
          </p>

          {/* form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <FormField
              label="Full Name"
              name="name"
              required
              register={register}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
            />

            <FormField
              label="Bobosohomail"
              name="bobosohomail"
              required
              toolTip
              register={register}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
              isBobosohoEmail={true}
              onEmailAvailabilityChange={handleEmailAvailabilityChange}
            />

            <FormField
              label="Password"
              type={showPass ? "text" : "password"}
              name="password"
              required
              togglePass={setShowPass}
              register={register}
              errors={errors}
              validation={authFormValidationRules.password}
              setValue={setValue}
              getValues={getValues}
            />

            <FormField
              label="Contact Email (Secondary)"
              type="email"
              name="contactEmail"
              required
              register={register}
              errors={errors}
              validation={authFormValidationRules.contactEmail}
              setValue={setValue}
              getValues={getValues}
            />

            {/* countries select dropdown */}
            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium">
                Country <span className="text-primary">*</span>
              </label>

              <select
                id="country"
                className="w-full rounded border px-4 py-2 outline-none focus:border-black"
                {...register("country", {
                  required: "Please select a country.",
                })}
              >
                <option value="" disabled>
                  Select country
                </option>
                {countries.map((country, i) => (
                  <option key={i} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>

              {/* Error message display */}
              {errors?.country && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.country.message}
                </p>
              )}
            </div>

            {/* address */}
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address <span className="text-primary">*</span>
              </label>

              <textarea
                name="address"
                rows={3}
                {...register("address", { required: "Address is required" })}
                className={`w-full rounded border px-4 py-2 outline-none ${
                  errors?.address
                    ? "border-primary focus:border-primary"
                    : "border border-gray-200 focus:border-gray-300"
                }`}
              />

              {/* Error message display */}
              {errors?.address && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* terms & condition agreement */}
            <div className="flex gap-2 text-sm">
              <input
                type="checkbox"
                {...register("terms", authFormValidationRules.terms)}
              />
              <p>
                I agree to the{" "}
                <Link
                  href="/terms-and-conditions"
                  className="text-blue-500 hover:underline"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-blue-500 hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Error message display */}
            {errors?.terms && (
              <p className="mt-1 text-xs text-red-500">
                {errors.terms.message}
              </p>
            )}

            {/* submit button */}
            <div className="flex flex-col-reverse items-center justify-between gap-4 md:flex-row">
              <Link
                href="/login"
                className="text-sm text-blue-500 hover:underline"
              >
                Already have an account? Sign in
              </Link>
              <button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className={`inline-flex w-full flex-shrink-0 items-center justify-center gap-2 rounded px-4 py-2 font-medium text-white transition-all duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 md:w-fit ${
                  isFormValid()
                    ? "bg-primary hover:bg-primary-hover active:scale-[0.98]"
                    : "cursor-not-allowed bg-gray-400"
                }`}
              >
                {isLoading ? "Creating" : "Create"} Account{" "}
                {isLoading && <LoaderCircle className="animate-spin" />}
              </button>
            </div>
          </form>
        </div>

        {/* text info */}
        <div className="flex w-full flex-col px-5 py-10 md:w-1/2">
          <div>
            <Image
              src="/images/logo/logo.png"
              alt="bitss logo"
              width={80}
              height={80}
              className="mx-auto"
            />
            <h2 className="mt-6 text-center text-2xl font-medium text-gray-900">
              Protect your devices with one account
            </h2>
            <p className="mx-auto mt-2 w-full max-w-lg text-balance text-center text-gray-700">
              Manage your digital security easily and efficiently. Anytime.
              Anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
