import http from "./http-common";

class InvoiceService {
  getAll(params) {
    return http.get("/getInvoices", { params });
  }

}

export default new InvoiceService();
