// Signup.jsx - With email ownership confirmation
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { authFormValidationRules } from "@/data/authFormValidationRules";
import FormField from "@/components/FormField";
import Link from "next/link";
import Image from "next/image";
import { postApi } from "@/api/api";

// Debounce utility
function debounce(func, wait) {
  let timeout;
  const debounced = function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
}

export default function Signup() {
  const router = useRouter();
  const [countries, setCountries] = useState([]);
  const [emailLoading, setEmailLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      bobosohomail: "@bobosohomail.com",
      password: "",
      contactEmail: "",
      country: "",
      address: "",
      terms: false,
      emailAvailableStatus: null, // null = not checked, true = available, false = taken
      confirmEmailOwnership: false, // New field for ownership confirmation
    },
  });

  const watchedFields = watch();

  // Watch the emailAvailableStatus field directly
  const emailAvailable = watch("emailAvailableStatus");
  const confirmOwnership = watch("confirmEmailOwnership");

  useEffect(() => {
    fetch("/country.json")
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []);

  // Email availability check function
  const checkEmailAvailability = async (username) => {
    if (username.length < 3) {
      setValue("emailAvailableStatus", null, { shouldValidate: false });
      setValue("confirmEmailOwnership", false, { shouldValidate: false });
      return;
    }

    setEmailLoading(true);
    try {
      const response = await fetch(
        "https://bobosohomail.com:8443/api/v2/cli/mail/call",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "8322d0fd-75a8-417e-9eb0-155ec4df16b5",
          },
          body: JSON.stringify({
            params: ["--info", `${username}@bobosohomail.com`],
          }),
        },
      );

      const data = await response.json();
      const isAvailable = data.code === 1;

      // Store availability status in form state
      setValue("emailAvailableStatus", isAvailable, {
        shouldValidate: false,
      });

      // Reset ownership confirmation when email changes
      setValue("confirmEmailOwnership", false, { shouldValidate: false });
    } catch (error) {
      console.error("Error checking email availability", error);
      setValue("emailAvailableStatus", false, { shouldValidate: false });
      setValue("confirmEmailOwnership", false, { shouldValidate: false });
    } finally {
      setEmailLoading(false);
    }
  };

  // Debounced version
  const debouncedCheckEmail = debounce(checkEmailAvailability, 500);

  // Callback for email input change
  const handleEmailChange = (username) => {
    if (username.length === 0) {
      setValue("emailAvailableStatus", null, { shouldValidate: false });
      setValue("confirmEmailOwnership", false, { shouldValidate: false });
      debouncedCheckEmail.cancel();
    } else {
      debouncedCheckEmail(username);
    }
  };

  // Form validation - now includes ownership confirmation when email is taken
  const isFormValid = () => {
    const baseValidation =
      watchedFields.name &&
      watchedFields.bobosohomail &&
      watchedFields.password &&
      watchedFields.contactEmail &&
      watchedFields.country &&
      watchedFields.address &&
      watchedFields.terms &&
      Object.keys(errors).length === 0;

    // If email is available (true), allow submission
    if (emailAvailable === true) {
      return baseValidation;
    }

    // If email is taken (false), require ownership confirmation
    if (emailAvailable === false) {
      return baseValidation && confirmOwnership === true;
    }

    // If email hasn't been checked yet (null), don't allow submission
    return false;
  };

  const onSubmit = async (data) => {
    if (!isFormValid()) return;

    setIsLoading(true);

    try {
      const {
        address,
        bobosohomail,
        contactEmail,
        country,
        name,
        password,
        confirmEmailOwnership,
      } = data;

      const payload = {
        address,
        username: bobosohomail.replace("@bobosohomail.com", ""),
        personal_email: contactEmail,
        country,
        name,
        password,
        existing_email: confirmEmailOwnership ? "yes" : "no",
      };

      const res = await postApi({
        endpoint: "/auth/user/register",
        payload,
      });

      if (res?.success) {
        toast.success(res?.message);
        router.push("/login");
      } else {
        toast.error(res?.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error?.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="font-roboto w-full py-10">
      <div className="mx-5 flex flex-col gap-8 md:container md:mx-auto md:flex-row md:gap-16">
        {/* form container */}
        <div className="w-full rounded-lg border border-gray-200 bg-white px-5 py-10 md:w-1/2">
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

            <div>
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
                emailAvailable={emailAvailable}
                emailLoading={emailLoading}
                onEmailChange={handleEmailChange}
              />

              {/* Email ownership confirmation checkbox - only show if email is taken */}
              {emailAvailable === false && (
                <div className="mt-3 flex items-start gap-2 rounded border border-amber-200 bg-amber-50 p-3">
                  <input
                    type="checkbox"
                    id="confirmEmailOwnership"
                    className="mt-0.5"
                    {...register("confirmEmailOwnership")}
                  />
                  <label
                    htmlFor="confirmEmailOwnership"
                    className="text-sm text-amber-900"
                  >
                    This email is already registered. Check this box to confirm
                    this is your email address.
                  </label>
                </div>
              )}
            </div>

            <FormField
              label="Password"
              type="password"
              name="password"
              required
              togglePass={true}
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
                className="w-full rounded border border-gray-200 px-4 py-2 outline-none"
                {...register("country", {
                  required: "Please select a country.",
                })}
              >
                <option value="">Select country</option>
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
                className={`inline-flex w-full shrink-0 items-center justify-center gap-2 rounded px-4 py-2 font-medium text-white transition-all duration-200 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 md:w-fit ${
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
            <p className="mx-auto mt-2 w-full max-w-lg text-center text-balance text-gray-700">
              Manage your digital security easily and efficiently. Anytime.
              Anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
