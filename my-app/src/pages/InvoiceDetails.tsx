import DATA from "../data/data.json";
import type { InvoiceType } from "../types/invoice";
import { useParams, useNavigate } from "react-router-dom";

function InvoiceDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const invoices: InvoiceType[] = DATA as InvoiceType[];
  const invoice = invoices.find((inv) => inv.id === id);
  console.log(invoice);

  const statusStyles: Record<InvoiceType["status"], string> = {
    draft: "bg-gray-100 text-gray-700",
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
  };

  const statusDots: Record<InvoiceType["status"], string> = {
    draft: "bg-gray-700",
    pending: "bg-yellow-800",
    paid: "bg-green-800",
  };
  if (!invoice) {
    return <p>Invoice not found</p>;
  }
  return (
    <div>
      <p className="font-semibold text-sm mb-10" onClick={() => navigate(-1)}>
        Go Back
      </p>

      <article>
        <div className="flex items-center justify-between py-10 px-6 bg-white rounded-2xl">
          <div className="flex items-center w-full justify-between gap-4">
            <p className="font-semibold text-sm">Status</p>
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
            <button
              type="button"
              className="bg-gray-100 text-gray-600 font-semibold text-sm px-6 py-3 rounded-full"
            >
              Edit
            </button>
            <button
              type="button"
              className="bg-red-500 text-white font-semibold text-sm px-6 py-3 rounded-full"
            >
              Delete
            </button>
            <button
              type="button"
              className="bg-button text-white font-semibold text-sm px-7 py-3 rounded-full"
            >
              Mark as Paid
            </button>
          </div>
        </div>

        {/* Main Bill Content */}
        <div className="p-3 bg-white rounded-2xl mt-4 grid gap-6 px-6">
          {/* ID and Desc */}
          <div className="space-y-1">
            <p className="font-bold">#RE4356</p>
            <p className="text-gray-600">Graphic Design</p>
          </div>

          {/* Payers Address */}
          <div className="space-y-1 text-gray-500 text-sm">
            <p>2 Garfield Terrace</p>
            <p>London</p>
            <p>E1 8EB</p>
            <p>United Kingdom</p>
          </div>

          {/* Invoice details */}
          <div className="grid grid-cols-2 gap-5">
            {/* Invoice date */}
            <div className="text-sm space-y-1">
              <p className=" text-gray-600 font-semibold">Invoice Date</p>
              <p className="font-bold text-xl">21, Aug 2023</p>
            </div>

            {/* Bill To */}
            <div className="text-sm space-y-1">
              <p className=" text-gray-600 font-semibold">Bill To</p>
              <p className="font-bold text-xl">Alex Gram</p>
            </div>

            {/* Payment Due */}
            <div className="text-sm space-y-1 flex flex-col justify-end ">
              <p className=" text-gray-600 font-semibold">Payment Due</p>
              <p className="font-bold text-xl">21, Aug 2023</p>
            </div>

            {/* Payee Address */}
            <div className="space-y-1 text-gray-500 text-sm">
              <p>2 Garfield Terrace</p>
              <p>London</p>
              <p>E1 8EB</p>
              <p>United Kingdom</p>
            </div>
          </div>

          {/* Email */}
          <div>
            <p className="text-gray-600 font-semibold">Sent to</p>
            <p className="font-bold text-xl">emeka.obi@techsolutions.ng</p>
          </div>

          {/* Calculation */}
          <div className="bg-background  rounded-2xl">
            <ul className="p-4">
              <li className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className=" text-xl font-bold">Banner Design</p>
                  <p className="text-gray-600 font-semibold text-sm">
                    1 x $200.00
                  </p>
                </div>
                <p className="text-xl font-bold">$145</p>
              </li>
            </ul>
            {/* Total Div */}
            <div className="text-white bg-dark-bg py-6 px-3 rounded-2xl mt-6 flex items-center justify-between">
              <p className="text-sm font-semibold">Grand Total</p>
              <p className="text-2xl font-semibold tracking-widest font-mono">
                $556.00
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl py-5 px-4 sm:px-6 md:hidden">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              className="bg-gray-100 text-gray-600 font-semibold text-sm px-6 py-3 rounded-full"
            >
              Edit
            </button>
            <button
              type="button"
              className="bg-red-500 text-white font-semibold text-sm px-6 py-3 rounded-full"
            >
              Delete
            </button>
            <button
              type="button"
              className="bg-button text-white font-semibold text-sm px-7 py-3 rounded-full"
            >
              Mark as Paid
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export default InvoiceDetails;
