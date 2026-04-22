import SideBar from "./components/SideBar";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <div className="lg:grid lg:grid-cols-[103px_1fr] flex flex-col">
        <SideBar />

        <main className=" lg:py-19.25 lg:px-63 py-10 px-5">
          <Routes>
            <Route path="/" element={<Invoices />} />
            <Route path="/details/:id" element={<InvoiceDetails />} />
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
