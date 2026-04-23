import Form from "../components/Form";
import Invoices from "./Invoices";

function NewInvoiceForm() {
  return (
    <div className="relative">
      <div className="hidden lg:block">
        <Invoices />
      </div>

      <div className="relative lg:fixed lg:inset-0 lg:z-40">
        <div className="hidden lg:block lg:fixed lg:inset-0 lg:bg-black/50" />

        <article className="relative z-10 h-full w-full lg:ml-[103px] lg:h-screen lg:w-[720px]">
          <div className="h-full overflow-y-auto bg-white dark:bg-dark-bg lg:rounded-r-3xl lg:shadow-2xl">
            <Form />
          </div>
        </article>
      </div>
    </div>
  );
}

export default NewInvoiceForm;
