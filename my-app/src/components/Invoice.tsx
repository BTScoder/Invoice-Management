// import React from "react";
// import { Circle } from "lucide-react";
import type { InvoiceType } from "../types/invoice";
import { Link } from "react-router-dom";
type InvoiceProps = {
  invoice: InvoiceType;
};

function Invoice({ invoice }: InvoiceProps) {
  const statusStyles: Record<InvoiceType["status"], string> = {
    paid: "bg-green-100 text-green-500 dark:bg-emerald-900/30 dark:text-emerald-300",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-amber-900/30 dark:text-amber-300",
    draft: "bg-gray-100 text-gray-700 dark:bg-slate-700/40 dark:text-slate-200",
  };

  const statusDotStyles: Record<InvoiceType["status"], string> = {
    paid: "bg-green-800 dark:bg-emerald-300",
    pending: "bg-yellow-800 dark:bg-amber-300  ",
    draft: "bg-gray-700 dark:bg-slate-200",
  };

  const statusLabel =
    invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1);

  return (
    <Link to={`/details/${invoice.id}`}>
      <div className="p-5 rounded-lg bg-white dark:bg-dark-bg2 space-y-4 lg:hidden border border-transparent hover:border-dark-border hover:cursor-pointer transition-all duration-300 ease-in-out hover:border-light-purple">
        <div className="flex items-center justify-between">
          <p className="font-bold dark:text-text-primary">
            <span className="text-light-text">#</span>
            {invoice.id}
          </p>
          <p className="text-sm text-light-text">{invoice.billTo.clientName}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <p className="text-text-primary text-sm">Due {invoice.dueDate}</p>
            <p className="font-bold dark:text-text-primary">
              £{invoice.totalAmount}
            </p>
          </div>

          <p
            className={` px-6 py-2 rounded-xl flex items-center gap-3 ${statusStyles[invoice.status]}} `}
          >
            <span
              className={`inline-block h-2 w-2 rounded-full ${statusDotStyles[invoice.status]}`}
            />
            <span className="ml-2">{statusLabel}</span>
          </p>
        </div>
      </div>

      {/* FOr desktop */}
      <div className="hidden lg:flex lg:items-center lg:justify-between py-8 px-6 rounded-lg bg-white dark:bg-dark-bg2 border border-transparent hover:border-dark-purple hover:cursor-pointer transition-all duration-300 ease-in-out hover:dark:border-light-purple">
        <p className="font-bold dark:text-text-primary">
          <span className="text-light-text">#</span>
          {invoice.id}
        </p>

        <p className="text-text-primary text-sm">
          Due on {new Date(invoice.dueDate).toDateString()}
        </p>

        <p className="text-sm text-light-text">{invoice.billTo.clientName}</p>

        <p className="font-bold dark:text-text-primary">
          £{invoice.totalAmount}
        </p>

        <p
          className={` px-6 py-2 rounded-xl flex items-center gap-3 ${statusStyles[invoice.status]}} `}
        >
          <span
            className={`inline-block h-2 w-2 rounded-full ${statusDotStyles[invoice.status]}`}
          />
          <span className="ml-2">{statusLabel}</span>
        </p>
      </div>
    </Link>
  );
}

export default Invoice;
