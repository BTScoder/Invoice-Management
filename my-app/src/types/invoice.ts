export type InvoiceStatus = "paid" | "pending" | "draft";

export type InvoiceAddress = {
  streetAddress: string;
  city: string;
  postCode: string;
  country: string;
};

export type InvoiceBillTo = InvoiceAddress & {
  clientName: string;
  clientEmail: string;
};

export type InvoiceItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
};

export type InvoiceType = {
  id: string;
  status: InvoiceStatus;
  billFrom: InvoiceAddress;
  billTo: InvoiceBillTo;
  invoiceDate: string;
  paymentTerms: string;
  dueDate: string;
  projectDescription: string;
  items: InvoiceItem[];
  totalAmount: number;
};
