import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { zodResolver } from "@hookform/resolvers/zod";
import DATA from "../data/data.json";
import type { InvoiceType, InvoiceFormValues } from "../types/invoice";
import { InvoiceSchema } from "../types/invoice";
import { ChevronLeft } from "lucide-react";
const STORAGE_KEY = "invoices";

const parseStoredInvoices = (): InvoiceType[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as InvoiceType[]) : [];
  } catch {
    return [];
  }
};

const getInvoiceSeed = (): InvoiceType[] => {
  const stored = parseStoredInvoices();
  if (stored.length > 0) {
    return stored;
  }

  return DATA as InvoiceType[];
};

const getPaymentDays = (terms: InvoiceFormValues["paymentTerms"]) => {
  const match = terms.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const getDueDate = (
  invoiceDate: string,
  terms: InvoiceFormValues["paymentTerms"],
) => {
  const base = new Date(invoiceDate);
  if (Number.isNaN(base.getTime())) {
    return invoiceDate;
  }

  base.setDate(base.getDate() + getPaymentDays(terms));
  return base.toISOString().slice(0, 10);
};

const getItemId = (index: number) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `item-${Date.now()}-${index}`;
};

const generateInvoiceId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";

  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const random = new Uint32Array(6);
    crypto.getRandomValues(random);

    const first = letters[random[0] % letters.length];
    const second = letters[random[1] % letters.length];
    const third = digits[random[2] % digits.length];
    const fourth = digits[random[3] % digits.length];
    const fifth = digits[random[4] % digits.length];
    const sixth = digits[random[5] % digits.length];

    return `${first}${second}${third}${fourth}${fifth}${sixth}`;
  }

  const first = letters[Math.floor(Math.random() * letters.length)];
  const second = letters[Math.floor(Math.random() * letters.length)];
  const third = digits[Math.floor(Math.random() * digits.length)];
  const fourth = digits[Math.floor(Math.random() * digits.length)];
  const fifth = digits[Math.floor(Math.random() * digits.length)];
  const sixth = digits[Math.floor(Math.random() * digits.length)];

  return `${first}${second}${third}${fourth}${fifth}${sixth}`;
};

function Form() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: {
      items: [{ name: "", quantity: 1, price: 0, total: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control, //This connects the useFielsArray to the useForm
    name: "items",
  });

  const saveInvoice = (
    values: InvoiceFormValues,
    status: InvoiceType["status"],
  ) => {
    const items = values.items.map((item, index) => {
      const total = Number(item.quantity) * Number(item.price);

      return {
        ...item,
        id: getItemId(index),
        total,
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    const invoice: InvoiceType = {
      id: generateInvoiceId(),
      status,
      billFrom: {
        streetAddress: values.address,
        city: values.city,
        postCode: values.postal,
        country: values.country,
      },
      billTo: {
        clientName: values.clientName,
        clientEmail: values.clientEmail,
        streetAddress: values.clientAddress,
        city: values.clientCity,
        postCode: values.clientPost,
        country: values.clientCountry,
      },
      invoiceDate: values.invoiceDate,
      paymentTerms: values.paymentTerms,
      dueDate: getDueDate(values.invoiceDate, values.paymentTerms),
      projectDescription: values.projectDescription,
      items,
      totalAmount,
    };

    const existing = getInvoiceSeed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([invoice, ...existing]));
  };

  const handleSaveAsDraft = handleSubmit((values) => {
    saveInvoice(values, "draft");
  });

  const handleSend = handleSubmit((values) => {
    saveInvoice(values, "pending");
  });

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-dark-bg px-6 py-8 shadow-sm lg:mx-0 lg:max-w-none lg:rounded-none lg:shadow-none ">
      <p
        className="text-sm font-bold text-slate-600 dark:text-text-primary cursor-pointer flex items-center gap-3"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="w-4 h-4 mb-1 text-light-text" />
        Go Back
      </p>

      <h2 className="mt-6 text-2xl font-bold text-slate-800 dark:text-text-primary">
        New Invoice
      </h2>

      <form className="mt-8 space-y-8" onSubmit={handleSend}>
        <section className="space-y-4">
          <p className="text-sm font-bold text-button">Bill From</p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="address"
                className="text-sm font-semibold text-icon"
              >
                Street Address
              </label>
              {errors.address && (
                <p className="text-[13px] text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>
            <input
              id="address"
              type="text"
              {...register("address")}
              className={clsx(
                "w-full rounded-lg border border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple",
                errors.address ? "border-red-500 " : "border-gray-200",
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="city"
                  className="text-sm font-semibold text-icon"
                >
                  City
                </label>
                {errors.city && (
                  <p className="text-[13px] text-red-500">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <input
                id="city"
                type="text"
                {...register("city")}
                className={clsx(
                  "rounded-lg border border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple",
                  errors.city ? "border-red-500" : "border-gray-200",
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="postal"
                  className="text-sm font-semibold text-icon"
                >
                  Post Code
                </label>
                {errors.postal && (
                  <p className="text-[13px] text-red-500">
                    {errors.postal.message}
                  </p>
                )}
              </div>

              <input
                id="postal"
                type="text"
                {...register("postal")}
                className={clsx(
                  "rounded-lg border border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple",
                  errors.postal ? "border-red-500" : "border-gray-200",
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="country"
                className="text-sm font-semibold text-icon"
              >
                Country
              </label>
              {errors.country && (
                <p className="text-[13px] text-red-500">
                  {errors.country.message}
                </p>
              )}
            </div>

            <input
              id="country"
              type="text"
              {...register("country")}
              className={clsx(
                "w-full rounded-lg border border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple",
                errors.country ? "border-red-500" : "border-gray-200",
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <p className="text-sm font-bold text-button">Bill To</p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="clientName"
                className="text-sm font-semibold text-icon"
              >
                Client's Name
              </label>
              {errors.clientName && (
                <p className="text-[13px] text-red-500">
                  {errors.clientName.message}
                </p>
              )}
            </div>

            <input
              id="clientName"
              type="text"
              {...register("clientName")}
              className={clsx(
                "w-full rounded-lg border border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple",
                errors.clientName ? "border-red-500" : "border-gray-200",
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="clientEmail"
                className="text-sm font-semibold text-icon"
              >
                Client's Email
              </label>
              {errors.clientEmail && (
                <p className="text-[13px] text-red-500">
                  {errors.clientEmail.message}
                </p>
              )}
            </div>

            <input
              id="clientEmail"
              type="email"
              {...register("clientEmail")}
              className={clsx(
                "w-full rounded-lg border border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple",
                errors.clientEmail ? "border-red-500" : "border-gray-200",
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="clientAddress"
                className="text-sm font-semibold text-icon"
              >
                Street Address
              </label>
              {errors.clientAddress && (
                <p className="text-[13px] text-red-500">
                  {errors.clientAddress.message}
                </p>
              )}
            </div>

            <input
              id="clientAddress"
              type="text"
              {...register("clientAddress")}
              className={clsx(
                "w-full rounded-lg border border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple",
                errors.clientAddress ? "border-red-500" : "border-gray-200",
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="clientCity"
                  className="text-sm font-semibold text-icon"
                >
                  City
                </label>
                {errors.clientCity && (
                  <p className="text-[13px] text-red-500">
                    {errors.clientCity.message}
                  </p>
                )}
              </div>

              <input
                id="clientCity"
                type="text"
                {...register("clientCity")}
                className={clsx(
                  "rounded-lg border border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple",
                  errors.clientCity ? "border-red-500" : "border-gray-200",
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="clientPost"
                  className="text-sm font-semibold text-icon"
                >
                  Post Code
                </label>
                {errors.clientPost && (
                  <p className="text-[13px] text-red-500">
                    {errors.clientPost.message}
                  </p>
                )}
              </div>

              <input
                id="clientPost"
                type="text"
                {...register("clientPost")}
                className={clsx(
                  "rounded-lg border border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple",
                  errors.clientPost ? "border-red-500" : "border-gray-200",
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="clientCountry"
                className="text-sm font-semibold text-icon"
              >
                Country
              </label>
              {errors.clientCountry && (
                <p className="text-[13px] text-red-500">
                  {errors.clientCountry.message}
                </p>
              )}
            </div>

            <input
              id="clientCountry"
              type="text"
              {...register("clientCountry")}
              className={clsx(
                "w-full rounded-lg border border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple",
                errors.clientCountry ? "border-red-500" : "border-gray-200",
              )}
            />
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="invoiceDate"
              className="text-sm font-semibold text-icon"
            >
              Invoice Date
            </label>
            <input
              id="invoiceDate"
              type="date"
              {...register("invoiceDate")}
              className="rounded-lg border-2 border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="paymentTerms"
              className="text-sm font-semibold text-icon"
            >
              Payment Terms
            </label>
            <select
              id="paymentTerms"
              {...register("paymentTerms")}
              className="rounded-lg border-2 border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple"
            >
              <option value="">Select payment terms</option>
              <option value="Net 7 Days">Net 7 Days</option>
              <option value="Net 14 Days">Net 14 Days</option>
              <option value="Net 30 Days">Net 30 Days</option>
            </select>
          </div>

          <div className="col-span-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="projectDescription"
                className="text-sm font-semibold text-icon"
              >
                Project Description
              </label>
              {errors.projectDescription && (
                <p className="text-[13px] text-red-500">
                  {errors.projectDescription.message}
                </p>
              )}
            </div>

            <input
              id="projectDescription"
              type="text"
              {...register("projectDescription")}
              className={clsx(
                "w-full rounded-lg border border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple",
                errors.projectDescription
                  ? "border-red-500"
                  : "border-gray-200",
              )}
            />
          </div>
        </section>

        {/* Item List Div */}
        <section className="space-y-4">
          <p className="text-lg font-bold text-slate-400 dark:text-light-text">
            Item List
          </p>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-3 rounded-xl border border-gray-100 dark:border-dark-bg2 p-4"
            >
              <div className="flex flex-col gap-2">
                <div>
                  <label
                    htmlFor={`itemName${index}`}
                    className="text-sm font-semibold text-icon"
                  >
                    Item Name
                  </label>

                  {errors.items?.[index]?.name && (
                    <p className="text-[13px] text-red-500">
                      {errors.items[index].name.message}
                    </p>
                  )}
                </div>

                <input
                  id={`itemName${index}`}
                  type="text"
                  {...register(`items.${index}.name`)}
                  className={clsx(
                    "w-full rounded-lg border border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple",
                    errors?.items?.[index]?.name
                      ? "border-red-500"
                      : "border-gray-200",
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={`itemQty${index}`}
                    className="text-sm font-semibold text-icon"
                  >
                    Qty.
                  </label>
                  <input
                    id={`itemQty${index}`}
                    type="number"
                    min="1"
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    className="rounded-lg border-2 border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={`itemPrice${index}`}
                    className="text-sm font-semibold text-icon"
                  >
                    Price
                  </label>
                  <input
                    id={`itemPrice${index}`}
                    type="number"
                    step="0.01"
                    {...register(`items.${index}.price`, {
                      valueAsNumber: true,
                    })}
                    className="rounded-lg border-2 border-gray-200 dark:border-dark-bg2 bg-white dark:bg-dark-bg2 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-text-primary outline-none focus:border-light-purple"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-icon">
                    Total
                  </label>
                  <div className="flex h-12 items-center rounded-lg bg-gray-100 dark:bg-dark-bg2 px-4 text-sm font-bold text-icon">
                    {(
                      (watch(`items.${index}.quantity`) || 0) *
                      (watch(`items.${index}.price`) || 0)
                    ).toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="self-end text-sm font-semibold text-slate-400 dark:text-light-text hover:text-slate-600"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              append({ name: "", quantity: 1, price: 0, total: 0 })
            }
            className="w-full rounded-full bg-slate-100 dark:bg-dark-bg2 px-6 py-3 text-sm font-bold text-icon"
          >
            + Add New Item
          </button>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-dark-bg2 p-6 bg-white dark:bg-dark-bg fixed bottom-0 left-0 right-0 rounded-tr-lg rounded-tl-lg shadow-[0_-10px_20px_rgba(0,0,0,0.05)] lg:sticky">
          <button
            type="button"
            className="rounded-full bg-slate-100 dark:bg-dark-bg2 px-6 py-3 text-sm font-bold text-slate-500 dark:text-light-text cursor-pointer"
            onClick={() => navigate(-1)}
          >
            Discard
          </button>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-slate-800 dark:bg-dark-bg2 px-6 py-3 text-sm font-bold text-white cursor-pointer"
              onClick={handleSaveAsDraft}
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="rounded-full bg-button px-6 py-3 text-sm font-bold bg-light-purple text-white cursor-pointer"
            >
              Save & Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Form;
