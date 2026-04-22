// import React from "react";
// import { Circle } from "lucide-react";
import type { InvoiceType } from "../types/invoice";
import { Link } from "react-router-dom";
type InvoiceProps = {
  invoice: InvoiceType;
};

function Invoice({ invoice }: InvoiceProps) {
  const statusStyles: Record<InvoiceType["status"], string> = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    draft: "bg-gray-100 text-gray-700",
  };

  const statusDotStyles: Record<InvoiceType["status"], string> = {
    paid: "bg-green-800",
    pending: "bg-yellow-800",
    draft: "bg-gray-700",
  };

  const statusLabel =
    invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1);

  return (
    <Link to={`/details/${invoice.id}`}>
      <div className="bg-white py-4 px-5 shadow-xl rounded-xl">
        <div className="flex items-center justify-between">
          <p className="font-bold text-xl">#{invoice.id}</p>
          <p className="text-gray-500 font-semibold text-sm">
            {invoice.billTo.clientName}
          </p>
        </div>
        <div className="flex mt-6 items-center justify-between">
          <div className="flex flex-col items-start gap-3">
            <p className="text-gray-500 font-semibold text-sm">
              {invoice.dueDate}
            </p>
            <p className="font-bold text-xl font-mono tracking-wider">
              ${invoice.totalAmount.toFixed(2)}
            </p>
          </div>
          <p
            className={`${statusStyles[invoice.status]} flex items-center gap-3 font-semibold text-sm py-1 px-3 rounded-full`}
          >
            <span
              className={`h-2 w-2 rounded-full mb-0.5 ${statusDotStyles[invoice.status]}`}
            ></span>
            {statusLabel}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default Invoice;
