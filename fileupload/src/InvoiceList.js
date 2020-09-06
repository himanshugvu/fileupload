import React, { Component } from "react";
import InvoiceService from "./InvoiceService";
import Pagination from "@material-ui/lab/Pagination";
import { Table } from "semantic-ui-react";
import './App.css';
import UploadFiles from "./UploadFiles";

export default class InvoiceList extends Component {
  constructor(props) {
    super(props);
    this.onChangesearchInvoice = this.onChangesearchInvoice.bind(this);
    this.retrieveInvoices = this.retrieveInvoices.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveTutorial = this.setActiveTutorial.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

    this.state = {
      invoices: [],
      currentTutorial: null,
      currentIndex: -1,
      searchInvoice: "",

      page: 1,
      count: 0,
      pageSize: 3,
    };

    this.pageSizes = [3, 5, 10, 15];
  }

  componentDidMount() {
    this.retrieveInvoices();
  }

  onChangesearchInvoice(e) {
    const searchInvoice = e.target.value;

    this.setState({
      searchInvoice: searchInvoice,
    });
  }

  getRequestParams(searchInvoice, page, pageSize) {
    let params = {};

    if (searchInvoice) {
      params["invoiceNo"] = searchInvoice;
    }

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  }

  retrieveInvoices() {
    const { searchInvoice, page, pageSize } = this.state;
    const params = this.getRequestParams(searchInvoice, page, pageSize);

    InvoiceService.getAll(params)
      .then((response) => {
        const { invoices, totalPages } = response.data;

        this.setState({
          invoices: invoices,
          count: totalPages,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveInvoices();
    this.setState({
      currentTutorial: null,
      currentIndex: -1,
    });
  }

  setActiveTutorial(tutorial, index) {
    this.setState({
      currentTutorial: tutorial,
      currentIndex: index,
    });
  }

  handlePageChange(event, value) {
    this.setState(
      {
        page: value,
      },
      () => {
        this.retrieveInvoices();
      }
    );
  }

  handlePageSizeChange(event) {
    this.setState(
      {
        pageSize: event.target.value,
        page: 1
      },
      () => {
        this.retrieveInvoices();
      }
    );
  }

  render() {
    const {
      searchInvoice,
      invoices,
      currentTutorial,
      currentIndex,
      page,
      count,
      pageSize,
    } = this.state;

    return (
      <div className="list">
        <div className="col-md-8">
          <UploadFiles parentMethod={this.retrieveInvoices} />
          <div className="input-group mb-3">

            <input
              type="text"
              className="form-control"
              placeholder="Search by invoiceNo"
              value={searchInvoice}
              onChange={this.onChangesearchInvoice}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.retrieveInvoices}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <h4><center>Invoices List</center></h4>



        </div>
        <div className="left-half">
          {"Items per Page: "}
          <select onChange={this.handlePageSizeChange} value={pageSize}>
            {this.pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="right-half">
          <Pagination
            className="my-4"
            count={count}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={this.handlePageChange}
          />
        </div>


        <Table singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>InvoiceNo</Table.HeaderCell>
              <Table.HeaderCell>StockCode</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>CustomerId</Table.HeaderCell>
              <Table.HeaderCell>Country</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {invoices !== undefined && invoices.map(invoice => {
              return (
                <Table.Row key={invoice.invoiceNo}>
                  <Table.Cell>{invoice.invoiceNo}</Table.Cell>
                  <Table.Cell>{invoice.stockCode}</Table.Cell>
                  <Table.Cell>{invoice.description}</Table.Cell>
                  <Table.Cell>{invoice.quantity}</Table.Cell>
                  <Table.Cell>{invoice.invoiceDate}</Table.Cell>
                  <Table.Cell>{invoice.unitPrice}</Table.Cell>
                  <Table.Cell>{invoice.customerId}</Table.Cell>
                  <Table.Cell>{invoice.country}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>

      </div>
    );
  }
}
