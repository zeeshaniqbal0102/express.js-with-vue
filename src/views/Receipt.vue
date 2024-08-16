<template>
  <div id='receipt-container' >
      <div id='receipt-body'>
         <div id='store-logo'></div>
      <div id='store-address' style='text-align:center'>{{addressLine1}}<br/>{{addressLine2}}<br/>Location: {{Location.id}}</div>
      <div id='invoice-info'>
        <table style='width:100%;'>
          <tr style=''>
            <td>Invoice </td>
            <td style='text-align: right'>{{invoice.localId}}</td>
          </tr>
           <tr style=''>
            <td>Time</td>
            <td style='text-align: right'>Missing</td>
          </tr>
        </table>
      </div>
      <div id='shift-info'>
        <table style='width:100%;'>
          <tr style=''>
            <td>ShiftId</td>
            <td style='text-align: right'>{{invoice.ShiftId}}</td>
          </tr>
           <tr style=''>
            <td>Employee</td>
            <td style='text-align: right'>{{invoice.EmployeeId}}</td>
          </tr>
        </table>
      </div>
      <br/>
      <div id='invoice-details'>
        <table style='width:100%'>
          <tr>
            <th style='text-align: left'>Qty</th>
            <th style='text-align: left,width:70%'>Item name</th>
            <th style='text-align: right'>U/Price</th>

          </tr>
          <tr v-for='details in invoice.InvoiceDetails' :key=details.id>
            <td style='text-align: left'>{{details.quantity}}</td>
            <td style='text-align: left'>{{details.name}}<span v-if='details.serialNumber!=null'><br/>Serial: {{details.serialNumber}}</span> </td>
            <td style='text-align: right'>{{details.subTotal}}</td>
            <td><span v-if='details.InvoiceDetailTaxes.length>0'>T</span></td>
          </tr>
        </table>
      </div>
      <hr>
      <div id='totals'>
        <table style='width:100%'>
          <tr>
            <td style='text-align: right'>SubTotal:</td>
            <td style='text-align: right'>{{invoice.subTotal}}</td>
          </tr>
          <tr v-if='invoice.discountTotal!=0'>
            <td style='text-align: right'>Discount:</td>
            <td style='text-align: right'>{{invoice.discountTotal}}</td>
          </tr>
          <tr>
            <td style='text-align: right'>Tax:</td>
            <td style='text-align: right'>{{invoice.taxTotal}}</td>
          </tr>
          <tr>
            <td style='text-align: right'>Total:</td>
            <td style='text-align: right'>{{invoice.grandTotal}}</td>
          </tr>
        </table>
      </div>
      <br/>
      <div id='payment-info'>
        <table style='width:100%'>
          <th style='text-align: left'></th>
          <th style='text-align: right'>Amount</th>
          <th style='text-align: right'>Tender</th>
          <th style='text-align: right'>Change</th>
          <tr v-for='payment in invoice.Payments' :key='payment.id'>
            <td style='text-align: left'>{{payment.PaymentMethod.name}}</td>
            <td style='text-align: right'>{{payment.amount}}</td>
            <td style='text-align: right'>{{payment.tender}}</td>
            <td style='text-align: right'>{{payment.change}}</td>
          </tr>
        </table>
      </div>
      <div id='due-amount'>
        <table style='width:100%;border-top: 1px solid black;'>
          <tr>
            <td style='text-align: center'>Due Amount:</td>
            <td style='text-align: left'>${{invoice.dueAmount.toFixed(2)}}</td>
          </tr>
        </table>
      </div>

      <div id='dicount-note' v-if='invoice.discountTotal!=0' style='text-align:center;margin:10px'>
        <h3>Total Savings Today ${{invoice.discountTotal}}</h3>
      </div>
      <br/>


      <br/>
      <div id='policy'><p style='text-align:center'>{{policy}}</p></div>
      </div>


    </div>
</template>
<script>
export default {
  name: 'receipt',
  data() {
    return {
      x: 0,
      y: 0,
      addressLine1: '31A W Burnside AVE',
      addressLine2: 'New York, NY 10453',
      Location: { id: 'CSP1001' },
      policy: 'Thank you for shopping at Boost Mobile. Come again! Have a nice day!',
      invoice: {
        dueAmount: 0,
        id: 41,
        localId: 100027,
        type: 'sale',
        subTotal: '9.63',
        taxTotal: '0.32',
        discountTotal: '2.00',
        surchargeTotal: '0.00',
        paymentTotal: '7.95',
        grandTotal: '7.95',
        closed: true,
        referenceNumber: '3234',
        description: 'This is a test invoice, there are the notes',
        createdAt: '2018-03-06T17:30:31.000Z',
        updatedAt: '2018-03-06T17:30:31.000Z',
        deletedAt: null,
        OrganizationId: 1,
        CustomerId: null,
        LocationId: 1,
        ShiftId: 1,
        EmployeeId: 2,
        Payments: [
          {
            change: 2.05,
            id: 72,
            amount: '7.95',
            tender: '10.00',
            surcharge: '0.00',
            input: null,
            note: null,
            referenceNumber: null,
            createdAt: '2018-03-06T17:30:31.000Z',
            updatedAt: '2018-03-06T17:30:31.000Z',
            InvoiceId: 41,
            PaymentMethodId: 1,
            LocationId: 1,
            CustomerId: null,
            EmployeeId: 2,
            ShiftId: 1,
            PaymentMethod: {
              id: 1,
              name: 'Cash',
              capAmount: false,
              locked: true,
              active: true,
              webHook: null,
              createdAt: '2018-03-02T22:01:57.000Z',
              updatedAt: '2018-03-02T22:01:57.000Z',
              LocationId: null,
            },
          },
        ],
        InvoiceDetails: [
          {
            id: 56,
            name: 'Iphone 5 with really really really really really long name ',
            quantity: 1,
            cost: '1.00',
            subTotal: '3.63',
            taxTotal: '0.32',
            discount: '2.00',
            surcharge: '0.00',
            serialNumber: 123122231221233,
            refunded: null,
            lockedReason: null,
            LocalInvoiceId: 100027,
            createdAt: '2018-03-06T17:30:31.000Z',
            updatedAt: '2018-03-06T17:30:31.000Z',
            deletedAt: null,
            InvoiceId: 41,
            ProductId: 33,
            LocationId: 1,
            EmployeeId: 2,
            InvoiceDetailTypeId: 1,
            ParentId: null,
            InvoiceDetailTaxes: [
              {
                id: 27,
                symbol: 'ST',
                type: 'percentage',
                percentage: '8.875',
                amount: null,
                apply: true,
                createdAt: '2018-03-06T17:30:31.000Z',
                updatedAt: '2018-03-06T17:30:31.000Z',
                deletedAt: null,
                InvoiceDetailId: 56,
                LocationId: 1,
                TaxTemplateId: 1,
              },
            ],
            InvoiceDetailType: {
              id: 1,
              name: 'Product Sale',
              createdAt: '2018-03-02T22:01:56.000Z',
              updatedAt: '2018-03-02T22:01:56.000Z',
              deletedAt: null,
            },
          },
          {
            id: 57,
            name: 'Case5',
            quantity: 3,
            cost: '1.00',
            subTotal: '2.00',
            taxTotal: '0.00',
            discount: '0.00',
            surcharge: '0.00',
            serialNumber: null,
            refunded: null,
            lockedReason: null,
            LocalInvoiceId: 100027,
            createdAt: '2018-03-06T17:30:31.000Z',
            updatedAt: '2018-03-06T17:30:31.000Z',
            deletedAt: null,
            InvoiceId: 41,
            ProductId: 33,
            LocationId: 1,
            EmployeeId: 2,
            InvoiceDetailTypeId: 1,
            ParentId: null,
            InvoiceDetailTaxes: [],
            InvoiceDetailType: {
              id: 1,
              name: 'Product Sale',
              createdAt: '2018-03-02T22:01:56.000Z',
              updatedAt: '2018-03-02T22:01:56.000Z',
              deletedAt: null,
            },
          },
        ],
        InvoiceSurcharges: [],
      },
    }
  },
  mounted() {
    this.x = window.screenX
    this.y = window.screenY
  },
  methods: {
    printReceipt() {
      const printPreview = window.open('', 'Receipt', `height=800,width=500,top=${this.y},left=${this.x}`)
      printPreview.document.write(document.getElementById('receipt-container').innerHTML)
      printPreview.document.write(
        `<style>
          #receipt-body{
            font-size:13px;
          }
          table {
            font-size:13px;
            color:blue
          }
      </style>`,
      )
      printPreview.document.close()
      printPreview.focus()
      printPreview.print()
      return true
    },
  },
}
</script>
<style scoped>
</style>
