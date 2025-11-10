import { useEffect, useState } from "react";
import { Eye, EyeOff, Info } from "lucide-react";
import { debounce } from "@/utils/debounce";
import Loader from "./shared/Loader";

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
  onEmailAvailabilityChange,
  setValue,
  getValues,
}) {
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailPrefix, setEmailPrefix] = useState("");

  const validateEmailAvailability = async (email) => {
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
            params: ["--info", email],
          }),
        }
      );

      const data = await response.json();
      if (data.code === 1) {
        setEmailAvailable(true);
        setEmailLoading(false);
      } else {
        setEmailAvailable(false);
        setEmailLoading(false);
      }
    } catch (error) {
      console.error("Error checking email availability", error);
      setEmailAvailable(false);
      setEmailLoading(false);
    }
  };

  const debouncedValidateEmailAvailability = debounce(
    validateEmailAvailability,
    300
  );

  // Validate BoboSoho email format
  const validateBobosohoEmailFormat = (value) => {
    // Allow only lowercase letters, numbers, dots, hyphens, and underscores
    const validPattern = /^[a-z0-9._-]+$/;

    if (!validPattern.test(value)) {
      return "Username can only contain lowercase letters, numbers, dots (.), hyphens (-), and underscores (_)";
    }

    // Must start and end with alphanumeric character
    if (!/^[a-z0-9].*[a-z0-9]$/.test(value) && value.length > 1) {
      return "Username must start and end with a letter or number";
    }

    // Single character must be alphanumeric
    if (value.length === 1 && !/^[a-z0-9]$/.test(value)) {
      return "Username must start with a letter or number";
    }

    // No consecutive dots
    if (value.includes("..")) {
      return "Consecutive dots are not allowed";
    }

    // Minimum length check
    if (value.length < 3) {
      return "Username must be at least 3 characters long";
    }

    // Maximum length check (most email providers limit to 64 characters)
    if (value.length > 64) {
      return "Username cannot exceed 64 characters";
    }

    return true;
  };

  // Handle email input change for bobosoho email
  const handleEmailChange = (e) => {
    if (!isBobosohoEmail) return;

    let inputValue = e.target.value;

    // Convert to lowercase and remove invalid characters
    inputValue = inputValue.toLowerCase().replace(/[^a-z0-9._-]/g, "");

    // Update the input field display
    setEmailPrefix(inputValue);

    const fullEmail = `${inputValue}@bobosohomail.com`;
    setValue(name, fullEmail); // Update react-hook-form value

    if (inputValue === "") {
      setEmailAvailable(null); // Reset email availability when the input is empty
    } else {
      // Skip validation if email is the default
      if (fullEmail !== "@bobosohomail.com") {
        // Only check availability if format is valid
        const formatValidation = validateBobosohoEmailFormat(inputValue);
        if (formatValidation === true) {
          debouncedValidateEmailAvailability(fullEmail);
        } else {
          setEmailAvailable(null); // Don't check availability for invalid format
        }
      } else {
        setEmailAvailable(false); // Force "not available" when it's the default email
      }
    }
  };

  // Notify parent component about email availability
  useEffect(() => {
    if (isBobosohoEmail && onEmailAvailabilityChange) {
      onEmailAvailabilityChange(emailAvailable);
    }
  }, [emailAvailable, isBobosohoEmail, onEmailAvailabilityChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedValidateEmailAvailability.cancel?.();
    };
  }, []);

  // Determine border color based on email availability for bobosoho email
  const getBorderClass = () => {
    if (errors?.[name]) {
      return "border-primary focus:border-primary";
    }

    if (
      isBobosohoEmail &&
      emailAvailable !== null &&
      getValues(name) !== "@bobosohomail.com"
    ) {
      return emailAvailable ? "border-green-600" : "border-red-600";
    }

    return "border border-gray-200 focus:border-gray-300";
  };

  // Get validation rules for BoboSoho email
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
          // Special layout for bobosoho email with domain suffix
          <div className="flex items-center">
            <input
              className={`w-full rounded-l border border-r-0 px-4 py-2 outline-none ${getBorderClass()}`}
              type="text"
              id={name}
              placeholder="Pick a username (ex. walterwhite)"
              value={emailPrefix}
              {...register(name, {
                required: required ? `${label} is required` : false,
                onChange: handleEmailChange,
                ...getBobosohoValidationRules(),
              })}
            />
            <div
              className={`inline-flex items-center gap-2 rounded-r border bg-gray-50 px-4 py-2 ${getBorderClass()}`}
            >
              <div className="min-w-fit">@bobosohomail.com</div>
              {/* bobosoho email tooltip */}
              {toolTip && (
                <div className="group relative">
                  <Info className="h-5 w-5 cursor-help text-gray-400" />
                  <div className="absolute bottom-full right-0 z-10 mb-2 hidden w-64 rounded bg-gray-800 p-2 text-xs text-white group-hover:block">
                    This is the main email that will receive the products. This
                    email will also be used for login to your account.
                    <div className="absolute right-3 top-full -mt-1 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Regular input field
          <input
            className={`w-full rounded border px-4 py-2 pr-7 outline-none ${getBorderClass()}`}
            type={type}
            id={name}
            {...register(name, {
              required: required ? `${label} is required` : false,
              ...validation,
            })}
          />
        )}

        {/* password toggle */}
        {togglePass && !isBobosohoEmail && (
          <button
            type="button"
            onClick={() => togglePass((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {type === "password" ? (
              <Eye className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeOff className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>

      {/* Email loading indicator */}
      {isBobosohoEmail && emailLoading && <Loader />}

      {/* Email availability message */}
      {isBobosohoEmail &&
        !emailLoading &&
        getValues(name) &&
        getValues(name) !== "@bobosohomail.com" &&
        emailAvailable !== null && (
          <p
            className={`mt-2 text-sm ${
              emailAvailable ? "text-green-600" : "text-red-600"
            }`}
          >
            <span className="font-medium">{emailPrefix}@bobosohomail.com</span>{" "}
            is {emailAvailable ? "available" : "not available"}!
          </p>
        )}

      {/* Error message display */}
      {errors?.[name] && (
        <p className="mt-1 text-xs text-red-500">{errors[name].message}</p>
      )}
    </div>
  );
}
