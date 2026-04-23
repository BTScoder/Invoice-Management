import SideBar from "./components/SideBar";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import { Route, Routes } from "react-router-dom";
import NewInvoiceForm from "./pages/NewInvoiceForm";
import EditInvoiceForm from "./pages/EditInvoiceForm";
function App() {
  return (
    <>
      <div className="flex flex-col lg:grid lg:grid-cols-[103px_1fr] lg:h-screen dark:bg-dark-bg">
        <SideBar />

        <main className="py-10 px-5 md:ml-24 md:px-10 md:py-12 lg:ml-0 lg:py-19.25 lg:px-63 lg:h-screen lg:overflow-y-auto">
          <Routes>
            <Route path="/" element={<Invoices />} />
            <Route path="/details/:id" element={<InvoiceDetails />} />
            <Route path="/new" element={<NewInvoiceForm />} />
            <Route path="/edit/:id" element={<EditInvoiceForm />} />
          </Routes>

          {/* <article>
            <Invoices />
          </article> */}
        </main>
      </div>
    </>
  );
}

export default App;
