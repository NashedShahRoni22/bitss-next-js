"use client";
import { useState } from "react";
import {
  Box,
  CheckCircle,
  LoaderCircle,
  Shield,
  Usb,
  Minus,
  Plus,
  CreditCard,
  Landmark,
  Download,
  PhoneIcon,
} from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";
import { CONTENT } from "./content";
import { postApi } from "@/api/api";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// ─── Static License Data ─────────────────────────────────────────────────────

const LICENSES = [
  {
    id: "personal_1",
    nameEn: "Personal 1",
    nameBn: "পার্সোনাল ১",
    euro: 4.76,
    taka: 690,
  },
  {
    id: "personal_2",
    nameEn: "Personal 2",
    nameBn: "পার্সোনাল ২",
    euro: 8.63,
    taka: 1250,
  },
  {
    id: "personal_3",
    nameEn: "Personal 3",
    nameBn: "পার্সোনাল ৩",
    euro: 12.08,
    taka: 1750,
  },
  {
    id: "sme_6",
    nameEn: "SME Pack 6",
    nameBn: "এসএমই প্যাক ৬",
    euro: 13.46,
    taka: 1950,
  },
  {
    id: "biz_12",
    nameEn: "Business Pack 12",
    nameBn: "বিজনেস প্যাক ১২",
    euro: 16.91,
    taka: 2450,
  },
];

const PAYMENT_METHODS = [
  { 
    id: "ONLINE", 
    labelEn: "Stripe", 
    labelBn: "স্ট্রাইপ", 
    icon: CreditCard 
  },
  {
    id: "BANK_TRANSFER",
    labelEn: "Bank Transfer",
    labelBn: "ব্যাংক ট্রান্সফার",
    icon: Landmark,
  },
  {
    id: "MOBILE_BANKING",
    labelEn: "Mobile Banking",
    labelBn: "মোবাইল ব্যাংকিং",
    icon: PhoneIcon,
  },
];


// ─── Component ───────────────────────────────────────────────────────────────

export default function BitssVwarUsbFlashMemory() {
  const router = useRouter();
  const { authInfo } = useAuth();

  const [lang, setLang] = useState("en");
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const t = CONTENT[lang];

  const handleQuantity = (delta) =>
    setQuantity((prev) => Math.max(1, prev + delta));

  // ── Toolkit Download
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href =
      "https://bitts.fr/usb_files/srv/api-files/data/download.php?token=USB-TK26-1902-SCURE-x9fKvP2mW8qL7zR4jN5tB3gY6hM1wE0uA";
    a.download = "Installation_Toolkit_USB.exe";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ── Place Order
  const handleOrder = async () => {
    if (!selectedLicense) {
      toast.error(t.noneSelected);
      return;
    }
    if (!authInfo?.access_token) {
      return router.push("/login?redirect=/bitss-vwar-usb");
    }
    setSubmitting(true);
    try {
      const amount =
        lang === "en"
          ? parseFloat((selectedLicense.euro * quantity).toFixed(2))
          : selectedLicense.taka * quantity;

      const payload = {
        usb_device_quantity: quantity,
        amount,
        currency: lang === "en" ? "USD" : "BDT",
        payment_type: paymentMethod, // "ONLINE" | "BANK_TRANSFER" | "MOBILE_BANKING"
        // discount: 10,
        // discount_type: "PERCENT", // "PERCENT" | "FLAT"
      };
      const response = await postApi({
        endpoint: "/orders/vwar/usb-usb-key-protection/order",
        payload,
        token: authInfo?.access_token,
      });
      if (response?.success) {
        toast.success("Order placed! We'll contact you within 24-48 hours.");
        setSelectedLicense(null);
        setQuantity(1);
        setPaymentMethod("ONLINE");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionContainer>
      <div className="mx-auto w-full max-w-7xl">
        {/* Language Toggle */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-full border border-gray-200 bg-white p-1 shadow-sm">
            {[
              { key: "en", label: "🇬🇧 English" },
              { key: "bn", label: "🇧🇩 বাংলা" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setLang(key);
                  setSelectedLicense(null);
                  setQuantity(1);
                }}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200 ${
                  lang === key
                    ? "bg-red-600 text-white shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-600">
            <Usb className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            {t.pageTitle}
          </h1>
          <p className="text-gray-500">{t.productType}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* ── Left: Info + License Table ── */}
          <div className="overflow-hidden rounded-xl bg-white shadow">
            {/* Banner */}
            <div className="bg-gradient-to-r from-red-600 to-indigo-600 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-white/20">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-white">
                    {t.pageTitle}
                  </h2>
                  <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                    💾 USB Flash Memory
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6">
              {/* Description */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  {t.descriptionTitle}
                </h3>
                <div className="space-y-3">
                  {t.description.map((para, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed text-gray-700"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  {t.featuresTitle}
                </h3>
                <ul className="space-y-2">
                  {t.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                      <span className="text-sm text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Download Toolkit ── */}
              <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                      <Download className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {t.downloadTitle}
                      </p>
                      <p className="text-xs text-gray-500">
                        Installation Toolkit - USB .exe
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {downloading ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        {t.downloadLoading}
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        {t.downloadBtn}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* License Table */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  {t.selectLicense}
                </h3>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase">
                          {t.colLicense}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-gray-600 uppercase">
                          {t.colPrice}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {LICENSES.map((lic) => {
                        const isSelected = selectedLicense?.id === lic.id;
                        return (
                          <tr
                            key={lic.id}
                            onClick={() => setSelectedLicense(lic)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-red-50 ring-2 ring-red-500 ring-inset"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? "border-red-600 bg-red-600" : "border-gray-300 bg-white"}`}
                                >
                                  {isSelected && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                  )}
                                </span>
                                <span
                                  className={`font-medium ${isSelected ? "text-red-700" : "text-gray-800"}`}
                                >
                                  {t.name(lic)}
                                </span>
                              </div>
                            </td>
                            <td
                              className={`px-4 py-3 text-right font-semibold ${isSelected ? "text-red-700" : "text-gray-700"}`}
                            >
                              {t.price(lic)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Order Card ── */}
          <div className="h-fit rounded-xl bg-white p-6 shadow lg:p-8">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              {t.orderTitle}
            </h3>

            <div className="space-y-5">
              {/* Summary Box */}
              <div className="min-h-[110px] rounded-lg border border-red-200 bg-gradient-to-br from-red-50 to-indigo-50 p-5">
                {selectedLicense ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {t.selectedPlan}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {t.name(selectedLicense)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {t.unitPrice}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {t.unit_price(selectedLicense)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-red-200 pt-2.5">
                      <span className="font-bold text-gray-900">{t.total}</span>
                      <span className="text-2xl font-bold text-red-600">
                        {t.total_price(selectedLicense, quantity)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="flex h-full items-center justify-center py-8 text-center text-sm text-gray-400">
                    {t.noneSelected}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {t.quantity}
                </label>
                <div className="flex overflow-hidden rounded-lg border border-gray-200">
                  <button
                    onClick={() => handleQuantity(-1)}
                    disabled={quantity <= 1}
                    className="flex h-12 w-12 items-center justify-center bg-gray-50 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex flex-1 items-center justify-center text-lg font-bold text-gray-900">
                    {quantity}
                  </div>
                  <button
                    onClick={() => handleQuantity(1)}
                    className="flex h-12 w-12 items-center justify-center bg-gray-50 text-gray-600 transition hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {t.selectPayment}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map(
                    ({ id, labelEn, labelBn, icon: Icon }) => {
                      const isActive = paymentMethod === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setPaymentMethod(id)}
                          className={`flex items-center justify-center gap-2 rounded-lg border-2 py-3 text-sm font-semibold transition-all ${
                            isActive
                              ? "border-red-600 bg-red-50 text-red-700"
                              : "border-gray-200 bg-white text-gray-600 hover:border-red-300"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {lang === "en" ? labelEn : labelBn}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Place Order */}
              <button
                type="button"
                onClick={handleOrder}
                disabled={submitting || !selectedLicense}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-indigo-600 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-red-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    {t.processing}
                  </>
                ) : (
                  <>
                    <Box />
                    {t.placeOrder}
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500">{t.terms}</p>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-5 text-center">
                {[
                  {
                    d: "M5 13l4 4L19 7",
                    bg: "bg-red-100",
                    color: "text-red-600",
                    title: t.securePayment,
                    desc: t.securePaymentDesc,
                  },
                  {
                    d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
                    bg: "bg-green-100",
                    color: "text-green-600",
                    title: t.fastDelivery,
                    desc: t.fastDeliveryDesc,
                  },
                  {
                    d: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
                    bg: "bg-purple-100",
                    color: "text-purple-600",
                    title: t.support,
                    desc: t.supportDesc,
                  },
                ].map((b, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full ${b.bg}`}
                    >
                      <svg
                        className={`h-4 w-4 ${b.color}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={b.d}
                        />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-gray-900">
                      {b.title}
                    </p>
                    <p className="text-xs text-gray-500">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
