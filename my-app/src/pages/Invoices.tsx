// import React from "react";
// import Invoice from "../components/Invoice"
import { Plus } from "lucide-react";
import DATA from "../data/data.json";
import Invoice from "../components/Invoice";
import type { InvoiceStatus, InvoiceType } from "../types/invoice";

// function isInvoiceStatus(value: string): value is InvoiceStatus {
//   return value === "paid" || value === "pending" || value === "draft";
// }

// function isInvoiceType(item: (typeof DATA)[number]): item is InvoiceType {
//   return isInvoiceStatus(item.status);
// }

function Invoices() {
  // const invoices: InvoiceType[] = DATA.filter(isInvoiceType);
  const invoices: InvoiceType[] = DATA as InvoiceType[];

  return (
    <div className="py-6 px-2 mb-10">
      <nav className="flex items-center justify-between mb-10">
        <div>
          <h2 className="lg:text-4xl text-3xl font-bold">Invoices</h2>
          <p className="text-light-text text-sm">7 invoices</p>
        </div>
        <div className="flex items-center gap-15">
          <p>Filter </p>

          <button className="bg-button text-sm p-1 pe-2 rounded-3xl flex items-center text-white gap-3">
            <div className="bg-white p-2 flex items-center justify-center rounded-full">
              <Plus className=" text-icon h-4 w-4  " />
            </div>
            New
          </button>
        </div>
      </nav>
      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <Invoice key={invoice.id} invoice={invoice} />
        ))}
      </div>
    </div>
  );
}

export default Invoices;
