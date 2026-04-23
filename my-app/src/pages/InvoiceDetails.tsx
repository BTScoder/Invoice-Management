import { useState } from "react";
import DATA from "../data/data.json";
import type { InvoiceType } from "../types/invoice";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const STORAGE_KEY = "invoices";

const getStoredInvoices = (): InvoiceType[] => {
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
function InvoiceDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const storedInvoices = getStoredInvoices();
  const [invoices, setInvoices] = useState<InvoiceType[]>(
    storedInvoices.length > 0 ? storedInvoices : (DATA as InvoiceType[]),
  );
  const invoice = invoices.find((inv) => inv.id === id);
  console.log(invoice);

  const statusStyles: Record<InvoiceType["status"], string> = {
    draft: "bg-gray-100 text-gray-700 dark:bg-slate-700/40 dark:text-slate-200",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-amber-900/30 dark:text-amber-300",
    paid: "bg-green-100 text-green-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  };

  const statusDots: Record<InvoiceType["status"], string> = {
    draft: "bg-gray-700 dark:bg-slate-200",
    pending: "bg-yellow-800 dark:bg-amber-300",
    paid: "bg-green-800 dark:bg-emerald-300",
  };
  if (!invoice) {
    return <p>Invoice not found</p>;
  }

  const isPending = invoice.status === "pending";
  const isPaid = invoice.status === "paid";
  const formatCurrency = (value: number) => `£${value.toFixed(2)}`;
  const grandTotal = invoice.items.reduce((sum, item) => sum + item.total, 0);

  const handleMarkAsPaid = () => {
    if (!isPending) {
      return;
    }

    const updated = invoices.map((entry) =>
      entry.id === invoice.id ? { ...entry, status: "paid" } : entry,
    );
    setInvoices(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div>
      <p
        className="font-semibold text-sm mb-10 dark:text-text-primary"
        onClick={() => navigate(-1)}
      >
        Go Back
      </p>

      <article>
        <div className="flex items-center justify-between py-10 gap-6 px-6 bg-white dark:bg-dark-bg2 rounded-2xl">
          <div className="flex items-center gap-6 ">
            <p className="font-semibold text-sm dark:text-text-primary">
              Status
            </p>
            <p
              className={`${statusStyles[invoice.status]} px-6 py-2 rounded-xl flex items-center gap-3`}
            >
              <span
                className={`${statusDots[invoice.status]} h-2 w-2 rounded-full`}
              ></span>
              {invoice.status}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to={`/edit/${invoice.id}`}>
              <button
                type="button"
                className="bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-text-primary font-semibold text-sm px-6 py-3 rounded-full"
              >
                Edit
              </button>
            </Link>
            <button
              type="button"
              className="bg-red-500 hover:bg-red-500/80 text-white font-semibold text-sm px-6 py-3 rounded-full"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={handleMarkAsPaid}
              disabled={!isPending}
              className={`px-6 py-3 rounded-full text-sm font-semibold text-white ${
                isPending ? "bg-button" : "bg-slate-300"
              }`}
            >
              {isPaid ? "Paid" : "Mark as Paid"}
            </button>
          </div>
        </div>

        {/* Main Bill Content */}
        <div className="p-3 bg-white dark:bg-dark-bg2 rounded-2xl mt-4 grid gap-6 px-6">
          <div className="lg:flex grid lg:items-center lg:justify-between">
            {/* ID and Desc */}
            <div className="space-y-1">
              <p className="font-bold dark:text-text-primary">{invoice.id}</p>
              <p className="text-gray-600 dark:text-light-text">
                {invoice.projectDescription}
              </p>
            </div>

            {/* Payers Address */}
            <div className="space-y-1 mt-5 text-gray-500 dark:text-light-text text-sm">
              <p>{invoice.billFrom.streetAddress}</p>
              <p>{invoice.billFrom.city}</p>
              <p>{invoice.billFrom.postCode}</p>
              <p>{invoice.billFrom.country}</p>
            </div>
          </div>

          {/* Invoice details */}
          <div className="grid grid-cols-2 gap-5">
            {/* Invoice date */}
            <div className="text-sm space-y-1">
              <p className=" text-gray-600 dark:text-light-text font-semibold">
                Invoice Date
              </p>
              <p className="font-bold text-xl dark:text-text-primary">
                {new Date(invoice.dueDate).toDateString()}
              </p>
            </div>

            {/* Bill To */}
            <div className="text-sm space-y-1">
              <p className=" text-gray-600 dark:text-light-text font-semibold">
                Bill To
              </p>
              <p className="font-bold text-xl dark:text-text-primary">
                {invoice.billTo.clientName}
              </p>
            </div>

            {/* Payment Due */}
            <div className="text-sm space-y-1 flex flex-col justify-end ">
              <p className=" text-gray-600 dark:text-light-text font-semibold">
                Payment Due
              </p>
              <p className="font-bold text-xl dark:text-text-primary">
                21, Aug 2023
              </p>
            </div>

            {/* Payee Address */}
            <div className="space-y-1 text-gray-500 dark:text-light-text text-sm">
              <p>{invoice.billTo.streetAddress}</p>
              <p>{invoice.billTo.city}</p>
              <p>{invoice.billTo.postCode}</p>
              <p>{invoice.billTo.country}</p>
            </div>
          </div>

          {/* Email */}
          <div>
            <p className="text-gray-600 dark:text-light-text font-semibold">
              Sent to
            </p>
            <p className="font-bold text-xl dark:text-text-primary">
              {invoice.billTo.clientEmail}
            </p>
          </div>

          {/* Calculation */}
          <div className="bg-background dark:bg-dark-bg2 rounded-2xl">
            <ul className="p-4 space-y-6">
              {invoice.items.map((item) => (
                <li
                  key={item.id ?? item.name}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-2">
                    <p className=" text-base font-bold dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-gray-600 dark:text-light-text font-semibold text-sm">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="text-xl font-bold dark:text-text-primary">
                    {formatCurrency(item.total)}
                  </p>
                </li>
              ))}
            </ul>
            {/* Total Div */}
            <div className="text-white bg-dark-bg2 dark:bg-dark-bg py-6 px-6 rounded-2xl mt-6 flex items-center justify-between dark:text-white">
              <p className="text-sm font-semibold">Grand Total</p>
              <p className="text-2xl font-semibold tracking-widest font-mono">
                {formatCurrency(grandTotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-dark-bg2 rounded-2xl py-5 px-4 sm:px-6 md:hidden">
          <div className="flex items-center justify-center gap-3">
            <Link to={`/edit/${invoice.id}`}>
              <button
                type="button"
                className="bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-text-primary font-semibold text-sm px-6 py-3 rounded-full"
              >
                Edit
              </button>
            </Link>
            <button
              type="button"
              className="bg-red-500 text-white font-semibold text-sm px-6 py-3 rounded-full"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={handleMarkAsPaid}
              disabled={!isPending}
              className={`px-7 py-3 rounded-full text-sm font-semibold text-white ${
                isPending ? "bg-button" : "bg-slate-300"
              }`}
            >
              {isPaid ? "Paid" : "Mark as Paid"}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export default InvoiceDetails;
