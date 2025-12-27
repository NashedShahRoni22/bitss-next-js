import { useState } from "react";
import { Eye, EyeOff, Info } from "lucide-react";
import { useWatch } from "react-hook-form";

export default function FormField({
  label,
  type = "text",
  name,
  required = false,
  toolTip = false,
  togglePass,
  register,
  errors,
  validation = {},
  isBobosohoEmail = false,
  emailAvailable,
  emailLoading,
  onEmailChange,
  setValue,
  getValues,
  control,
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Only use useWatch for bobosoho email field
  const watchedEmail =
    isBobosohoEmail && control
      ? useWatch({
          control,
          name: name,
          defaultValue: "@bobosohomail.com",
        })
      : "@bobosohomail.com";

  // Extract username from full email
  const emailPrefix = isBobosohoEmail
    ? (watchedEmail || "@bobosohomail.com").replace("@bobosohomail.com", "")
    : "";

  const validateBobosohoEmailFormat = (value) => {
    const validPattern = /^[a-z0-9._-]+$/;

    if (!validPattern.test(value)) {
      return "Username can only contain lowercase letters, numbers, dots (.), hyphens (-), and underscores (_)";
    }

    if (!/^[a-z0-9].*[a-z0-9]$/.test(value) && value.length > 1) {
      return "Username must start and end with a letter or number";
    }

    if (value.length === 1 && !/^[a-z0-9]$/.test(value)) {
      return "Username must start with a letter or number";
    }

    if (value.includes("..")) {
      return "Consecutive dots are not allowed";
    }

    if (value.length < 3) {
      return "Username must be at least 3 characters long";
    }

    if (value.length > 64) {
      return "Username cannot exceed 64 characters";
    }

    return true;
  };

  const handleEmailChange = (e) => {
    if (!isBobosohoEmail) return;

    let inputValue = e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, "");

    const fullEmail = `${inputValue}@bobosohomail.com`;
    setValue(name, fullEmail, { shouldValidate: true });

    // Notify parent about the username change
    if (onEmailChange) {
      onEmailChange(inputValue);
    }
  };

  const getBorderClass = () => {
    if (errors?.[name]) {
      return "border-primary focus:border-primary";
    }

    if (isBobosohoEmail && emailAvailable !== null && emailPrefix.length >= 3) {
      return emailAvailable ? "border-green-600" : "border-red-600";
    }

    return "border border-gray-200 focus:border-gray-300";
  };

  const getBobosohoValidationRules = () => {
    if (!isBobosohoEmail) return validation;

    return {
      ...validation,
      validate: {
        format: (value) => {
          if (!value || value === "@bobosohomail.com") {
            return required ? "Username is required" : true;
          }
          const username = value.replace("@bobosohomail.com", "");
          return validateBobosohoEmailFormat(username);
        },
        ...validation.validate,
      },
    };
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-primary">*</span>}
      </label>

      <div className="relative w-full">
        {isBobosohoEmail ? (
          <div className="flex items-center">
            <input
              className={`w-full rounded-l border border-r-0 px-4 py-2 outline-none ${getBorderClass()}`}
              type="text"
              id={name}
              placeholder="Pick a username (ex. walterwhite)"
              value={emailPrefix}
              onChange={handleEmailChange}
            />
            <div
              className={`inline-flex items-center gap-2 rounded-r border bg-gray-50 px-4 py-2 ${getBorderClass()}`}
            >
              <div className="min-w-fit">@bobosohomail.com</div>
              {toolTip && (
                <div className="group relative">
                  <Info className="h-5 w-5 cursor-help text-gray-400" />
                  <div className="absolute right-0 bottom-full z-10 mb-2 hidden w-64 rounded bg-gray-800 p-2 text-xs text-white group-hover:block">
                    This is the main email that will receive the products. This
                    email will also be used for login to your account.
                    <div className="absolute top-full right-3 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              )}
            </div>
            {/* Hidden input for react-hook-form */}
            <input
              type="hidden"
              {...register(name, {
                required: required ? `${label} is required` : false,
                ...getBobosohoValidationRules(),
              })}
            />
          </div>
        ) : (
          <input
            className={`w-full rounded border px-4 py-2 ${togglePass ? "pr-10" : ""} outline-none ${getBorderClass()}`}
            type={togglePass ? (showPassword ? "text" : "password") : type}
            id={name}
            {...register(name, {
              required: required ? `${label} is required` : false,
              ...validation,
            })}
          />
        )}

        {togglePass && !isBobosohoEmail && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>

      {isBobosohoEmail && emailLoading && (
        <p className="text-sm text-gray-500">Checking availability...</p>
      )}

      {isBobosohoEmail &&
        !emailLoading &&
        emailPrefix.length >= 3 &&
        emailAvailable !== null && (
          <p
            className={`text-sm ${emailAvailable ? "text-green-600" : "text-red-600"}`}
          >
            <span className="font-medium">{emailPrefix}@bobosohomail.com</span>{" "}
            {emailAvailable ? "is available" : "already exists"}!
          </p>
        )}

      {errors?.[name] && (
        <p className="text-xs text-red-500">{errors[name].message}</p>
      )}
    </div>
  );
}
