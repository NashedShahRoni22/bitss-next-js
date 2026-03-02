import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  CircleAlert,
  CreditCard,
  Info,
} from "lucide-react";

export default function OrderInfo({
  domain,
  setDomain,
  currency,
  setCurrency,
  paymentType,
  setPaymentType,
  agreeTerms,
  setAgreeTerms,
  currencies,
  isDomainRequired, // ← now a direct prop; no need to re-derive from cartItems here
}) {
  const [domainError, setDomainError] = useState("");
  const [domainValid, setDomainValid] = useState(false);

  const validateDomain = (value) => {
    if (!value.trim()) return "Domain name is required";

    let cleanDomain = value.trim().toLowerCase();
    cleanDomain = cleanDomain.replace(/^https?:\/\//, "");
    cleanDomain = cleanDomain.replace(/^www\./, "");
    cleanDomain = cleanDomain.replace(/\/.*$/, "");
    cleanDomain = cleanDomain.replace(/:.*$/, "");

    const domainRegex =
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;

    if (!domainRegex.test(cleanDomain))
      return "Please enter a valid domain name (e.g., example.com)";
    if (cleanDomain.length < 4) return "Domain name is too short";
    if (cleanDomain.length > 253) return "Domain name is too long";
    if (!cleanDomain.includes("."))
      return "Please include a top-level domain (e.g., .com, .org)";

    const parts = cleanDomain.split(".");
    const tld = parts[parts.length - 1];
    if (tld.length < 2) return "Top-level domain must be at least 2 characters";
    if (parts.length < 2 || parts[0].length === 0)
      return "Please enter a complete domain name";
    if (cleanDomain.includes("..") || cleanDomain.includes("--"))
      return "Domain cannot contain consecutive dots or hyphens";
    if (cleanDomain.startsWith("-") || cleanDomain.endsWith("-"))
      return "Domain cannot start or end with a hyphen";

    return null;
  };

  const handleDomainChange = (e) => {
    const value = e.target.value;
    setDomain(value);
    const error = validateDomain(value);
    setDomainError(error || "");
    setDomainValid(!error && value.trim() !== "");
  };

  const handleDomainBlur = () => {
    if (domain.trim()) {
      let cleanDomain = domain.trim().toLowerCase();
      cleanDomain = cleanDomain.replace(/^https?:\/\//, "");
      cleanDomain = cleanDomain.replace(/^www\./, "");
      cleanDomain = cleanDomain.replace(/\/.*$/, "");
      cleanDomain = cleanDomain.replace(/:.*$/, "");

      if (cleanDomain !== domain) {
        setDomain(cleanDomain);
        const error = validateDomain(cleanDomain);
        setDomainError(error || "");
        setDomainValid(!error && cleanDomain !== "");
      }
    }
  };

  useEffect(() => {
    if (domain) {
      const error = validateDomain(domain);
      setDomainError(error || "");
      setDomainValid(!error);
    }
  }, []);

  const getDomainInputClass = () => {
    if (!domain) return "border-gray-300 focus:border-red-500 focus:ring-red-500";
    if (domainError) return "border-red-500 focus:border-red-500 focus:ring-red-500";
    if (domainValid) return "border-green-500 focus:border-green-500 focus:ring-green-500";
    return "border-gray-300 focus:border-red-500 focus:ring-red-500";
  };

  return (
    <div className="space-y-6 lg:col-span-2">
      {/* Domain Information — only shown when a domain is required */}
      {isDomainRequired && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Domain Information
          </h2>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Domain Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="example.com"
                className={`w-full rounded-md border px-3 py-2 pr-10 transition-colors focus:border-transparent focus:ring-2 focus:outline-none ${getDomainInputClass()}`}
                value={domain}
                onChange={handleDomainChange}
                onBlur={handleDomainBlur}
              />
              {domain && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {domainValid ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : domainError ? (
                    <CircleAlert className="h-5 w-5 text-red-500" />
                  ) : null}
                </div>
              )}
            </div>

            {domainError && (
              <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <CircleAlert className="h-4 w-4" />
                {domainError}
              </p>
            )}

            {domainValid && !domainError && (
              <p className="mt-1 flex items-center gap-1 text-sm text-green-600">
                <Check className="h-4 w-4" />
                Valid domain name
              </p>
            )}

            {!domain && (
              <p className="mt-1 text-sm text-gray-500">
                Enter the domain where you&apos;ll use these products (e.g.,
                example.com)
              </p>
            )}
          </div>
        </div>
      )}

      {/* Payment Options */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          Payment Options
        </h2>

        {/* Currency Selection */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Currency
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {!currencies ? (
                <option>Loading currencies...</option>
              ) : (
                <>
                  <option value="EUR">EUR</option>
                  {Object.keys(currencies)
                    .filter((curr) => curr !== "EUR")
                    .sort()
                    .map((currencyCode) => (
                      <option key={currencyCode} value={currencyCode}>
                        {currencyCode}
                      </option>
                    ))}
                </>
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute top-2.5 right-3 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Payment Type Selection */}
        <div className="space-y-3">
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Payment Method
          </label>

          <div className="space-y-2">
            <label
              className={`flex cursor-pointer items-center rounded-lg border p-4 transition-colors ${
                paymentType === "stripe"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                value="stripe"
                checked={paymentType === "stripe"}
                onChange={(e) => setPaymentType(e.target.value)}
                className="sr-only"
              />
              <div
                className={`mr-3 h-4 w-4 rounded-full border-2 ${
                  paymentType === "stripe"
                    ? "border-red-500 bg-red-500"
                    : "border-gray-300"
                } flex items-center justify-center`}
              >
                {paymentType === "stripe" && (
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
              <CreditCard className="mr-3 h-5 w-5 text-blue-500" />
              <div>
                <span className="font-medium text-gray-900">Stripe</span>
                <p className="text-sm text-gray-600">
                  Pay securely with credit/debit card
                </p>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-center rounded-lg border p-4 transition-colors ${
                paymentType === "bank"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                value="bank"
                checked={paymentType === "bank"}
                onChange={(e) => setPaymentType(e.target.value)}
                className="sr-only"
              />
              <div
                className={`mr-3 h-4 w-4 rounded-full border-2 ${
                  paymentType === "bank"
                    ? "border-red-500 bg-red-500"
                    : "border-gray-300"
                } flex items-center justify-center`}
              >
                {paymentType === "bank" && (
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
              <Building2 className="mr-3 h-5 w-5 text-green-500" />
              <div>
                <span className="font-medium text-gray-900">Bank Transfer</span>
                <p className="text-sm text-gray-600">
                  Direct bank transfer payment
                </p>
              </div>
            </label>
          </div>

          {paymentType === "bank" && (
            <div className="border-primary/10 bg-primary/5 mt-4 rounded-md border p-4">
              <div className="flex items-start">
                <Info className="text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                <div>
                  <h4 className="text-primary font-medium">
                    Bank Transfer Details
                  </h4>
                  <div className="text-primary mt-2 text-sm">
                    <p>
                      <strong>Bank:</strong> LCL Bank France
                    </p>
                    <p>
                      <strong>IBAN:</strong> FR62 3000 2030 3700 0007 3125 M63
                    </p>
                    <p>
                      <strong>BIC:</strong> CRLYFRPP
                    </p>
                    <p className="mt-2 text-xs">
                      Complete bank details will be provided after order
                      confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <label className="flex cursor-pointer items-start space-x-3">
          <div className="relative">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`h-5 w-5 rounded border-2 ${
                agreeTerms ? "border-red-500 bg-red-500" : "border-gray-300"
              } flex items-center justify-center`}
            >
              {agreeTerms && <Check className="h-3 w-3 text-white" />}
            </div>
          </div>
          <div className="text-sm text-gray-700">
            I agree to the{" "}
            <Link
              href="/terms-and-conditions"
              className="text-red-600 underline hover:text-red-700"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="text-red-600 underline hover:text-red-700"
            >
              Privacy Policy
            </Link>
          </div>
        </label>
      </div>
    </div>
  );
}