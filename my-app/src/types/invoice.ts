import { z } from "zod";

export type InvoiceStatus = "paid" | "pending" | "draft";

// Item schema and inferred type
export const InvoiceItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0.01, "Price must be at least 0.01"),
  total: z.number(),
});

export type InvoiceItem = z.infer<typeof InvoiceItemSchema> & {
  id?: string;
};

export type Address = {
  streetAddress: string;
  city: string;
  postCode: string;
  country: string;
};

export type BillTo = Address & {
  clientName: string;
  clientEmail: string;
};

// Invoice form schema
export const InvoiceSchema = z.object({
  address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  postal: z.string().min(1, "Post code is required"),
  country: z.string().min(1, "Country is required"),
  clientName: z.string().min(1, "Client's name is required"),
  clientEmail: z.string().email("Invalid email address"),
  clientAddress: z.string().min(1, "Street address is required"),
  clientCity: z.string().min(1, "City is required"),
  clientPost: z.string().min(1, "Post code is required"),
  clientCountry: z.string().min(1, "Country is required"),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  paymentTerms: z.enum(
    ["Net 7 Days", "Net 14 Days", "Net 30 Days"],
    "Payment terms are required",
  ),
  projectDescription: z.string().min(1, "Project description is required"),
  items: z.array(InvoiceItemSchema).min(1, "At least one item is required"),
});

export type InvoiceFormValues = z.infer<typeof InvoiceSchema>;

export type InvoiceType = {
  id: string;
  status: InvoiceStatus;
  billFrom: Address;
  billTo: BillTo;
  invoiceDate: InvoiceFormValues["invoiceDate"];
  paymentTerms: InvoiceFormValues["paymentTerms"];
  dueDate: string;
  projectDescription: InvoiceFormValues["projectDescription"];
  items: InvoiceItem[];
  totalAmount: number;
};
