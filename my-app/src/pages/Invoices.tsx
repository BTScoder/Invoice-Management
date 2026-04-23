import { useMemo, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import DATA from "../data/data.json";
import Invoice from "../components/Invoice";
import type { InvoiceType } from "../types/invoice";

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

function Invoices() {
  // const invoices: InvoiceType[] = DATA.filter(isInvoiceType);
  const storedInvoices = getStoredInvoices();
  const invoices: InvoiceType[] =
    storedInvoices.length > 0 ? storedInvoices : (DATA as InvoiceType[]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<
    InvoiceType["status"][]
  >([]);

  const filteredInvoices = useMemo(() => {
    if (selectedStatuses.length === 0) {
      return invoices;
    }

    return invoices.filter((invoice) =>
      selectedStatuses.includes(invoice.status),
    );
  }, [invoices, selectedStatuses]);

  const toggleStatus = (status: InvoiceType["status"]) => {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((item) => item !== status)
        : [...current, status],
    );
  };

  return (
    <div className="py-6 px-2 mb-10">
      <nav className="flex items-center justify-between mb-10">
        <div>
          <h2 className="lg:text-4xl text-3xl font-bold dark:text-text-primary">
            Invoices
          </h2>
          <p className="text-light-text text-sm lg:hidden">
            {filteredInvoices.length} invoice
            {filteredInvoices.length === 1 ? "" : "s"}
          </p>
          <p className="hidden lg:inline text-light-text text-sm">
            There are a total of {filteredInvoices.length} invoice
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen((open) => !open)}
              className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-text-primary"
            >
              <span className="lg:inline-block hidden">Filter by status</span>
              <span className="lg:hidden">Filter</span>
              <ChevronDown
                className={`h-4 w-4 text-button transition-transform ${
                  isFilterOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <div
              className={`absolute right-0 z-20 mt-3 w-44 space-y-2 rounded-xl border border-gray-100 bg-white p-4 shadow-lg dark:border-dark-bg dark:bg-dark-bg2 ${
                isFilterOpen ? "block" : "hidden"
              }`}
            >
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-text-primary">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes("draft")}
                  onChange={() => toggleStatus("draft")}
                  className="h-4 w-4 rounded border-gray-300 text-button focus:ring-button"
                />
                Draft
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-text-primary">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes("pending")}
                  onChange={() => toggleStatus("pending")}
                  className="h-4 w-4 rounded border-gray-300 text-button focus:ring-button"
                />
                Pending
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-text-primary">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes("paid")}
                  onChange={() => toggleStatus("paid")}
                  className="h-4 w-4 rounded border-gray-300 text-button focus:ring-button"
                />
                Paid
              </label>
            </div>
          </div>

          <Link to="/new">
            <button className="bg-dark-purple cursor-pointer hover:bg-light-purple text-sm p-1 pe-2 rounded-3xl flex items-center text-white gap-3">
              <div className="bg-white p-2 flex items-center justify-center rounded-full">
                <Plus className=" text-icon h-4 w-4  " />
              </div>
              <span className="lg:hidden font-semibold">New</span>
              <span className="hidden lg:block font-semibold">New Invoice</span>
            </button>
          </Link>
        </div>
      </nav>
      <div className="grid gap-4">
        {filteredInvoices.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-dark-bg2 px-6 py-12 text-center shadow-sm">
            <p className="text-lg font-bold text-slate-700 dark:text-text-primary">
              No invoices found
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-light-text">
              Try selecting a different status.
            </p>
          </div>
        ) : (
          filteredInvoices.map((invoice) => (
            <Invoice key={invoice.id} invoice={invoice} />
          ))
        )}
      </div>
    </div>
  );
}

export default Invoices;
