<template>
<v-card height="100%" width="100%">
  <v-layout column fill-height overflow-hidden>
    <v-layout fill-height column >
      <v-layout style="overflow: auto;background-color:gray" justify-center="">
        <pdf-viewer height  v-if="pdf" :src="pdf" :page="currentPage" @numpages="setPages"></pdf-viewer>
      </v-layout>
      <v-flex v-if="pages > 1">
        <v-layout row >
          <v-layout column="" class="pdfButton">
            <v-btn :disabled="currentPage === 1" @click="currentPage = currentPage - 1">Previous</v-btn>
          </v-layout>
          <v-flex shrink>
            {{currentPage}} / {{pages}}
          </v-flex>
          <v-layout column="">
            <v-btn class="pdfButton" :disabled="currentPage === pages" @click="currentPage = currentPage + 1">Next</v-btn>
          </v-layout>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout row shrink wrap v-if="actions">
        <v-flex>
          <v-btn v-if="!hideclose" color="primary" @click="$emit('close')" flat>{{ $t('buttons.close') }}</v-btn>
        </v-flex>
        <v-spacer hidden-xs-only></v-spacer>
        <!-- <v-btn color="gray" outline>{{ $t('buttons.email') }}</v-btn> -->
        <v-btn color="gray" @click="download" outline>{{ $t('buttons.saveAsPDF') }}</v-btn>
        <v-btn color="primary" @click="print" >{{ $t('buttons.print') }}</v-btn>
      </v-layout>
  </v-layout>
</v-card>

</template>
<style scoped>
.pdfButton > .v-btn {
  margin: 0,;
  padding: 0;
  color: blue
}
</style>
<script>
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import pdfViewer from 'pdfvuer';
import { mapGetters } from 'vuex'

export default {
  name: 'receipts-mvno-activation',
  components: {
    pdfViewer,
  },
  props: ['mvnoInfo', 'activation', 'actions', 'hideclose', 'qrcode'],
  data() {
    return {
      currentPage: 1,
      pages: 0,
      pdf: null,
      contentHeader: [],
      contentStart: [],
      contentMiddle: [],
      contentEnd: [],
      doc: {
        info: {
          title: 'Activation Preview',
        },
        content: [],
        styles: {
          locationInfo: {
            alignment: 'center',
            fontSize: 8,
          },
          heading: {
            alignment: 'center',
            fontSize: 10,
          },
          topDetails: {
            margin: [0, 0],
            fontSize: 8,
          },
        },
        pageBreakBefore(
          currentNode,
          followingNodesOnPage,
          nodesOnNextPage,
          previousNodesOnPage,
        ) {
          return (
            currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
          );
        },
      },
    };
  },
  computed: {
    ...mapGetters('settings', ['receiptPageSize']),
    ...mapGetters('global', ['location']),
    width() {
      const size = (this.receiptPageSize) ? (parseInt(this.receiptPageSize.replace('[^0-9]', ''), 10)) : 80
      const base = size / 0.35277
      const adjusted = base - (200 / base * 20)
      return adjusted
    },
    height() {
      return 257 / 0.35277
    },
    date() {
      return this.$moment().format('MM/DD/YY h:mm a');
    },
  },
  async created() {
    let planTotal = 0
    this.doc.pageSize = { width: this.width, height: this.height };
    this.doc.pageMargins = [10, 10, 10, 10];
    this.doc.pageOrientation = 'horizontal';
    // Logo
    if (this.location.logoURL) {
      const toDataURL = url => fetch(url, { mode: 'cors' })
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        }))
      const base64 = await toDataURL(this.location.logoURL)
        .then(dataUrl => dataUrl)
      this.doc.content.push({
        image: base64,
        width: this.width * 0.9,
        alignment: 'center',
      })
    }
    // Location info
    this.doc.content.push({
      text: this.location.name,
      style: 'locationInfo',
    });
    this.doc.content.push({
      text: this.location.Address.addressLine1,
      style: 'locationInfo',
    });
    this.doc.content.push({
      text: this.location.Address.addressLine2,
      style: 'locationInfo',
    });
    this.doc.content.push({
      text: this.location.Address.addressLine2,
      style: 'locationInfo',
    });
    this.doc.content.push({
      text: `${this.location.Address.city}, ${this.location.Address.State.code.substr(this.location.Address.State.code.indexOf('-') + 1)} ${this.location.Address.postalCode}`,
      style: 'locationInfo',
    });
    this.doc.content.push({
      text: this.$options.filters.phone(this.location.Address.phoneNumber),
      style: 'locationInfo',
    });
    if (this.location.website) {
      this.doc.content.push({
        text: this.location.website,
        style: 'locationInfo',
      });
    }
    if (this.location.DCALicense) {
      this.doc.content.push({
        text: `DCA ${this.location.DCALicense}`,
        style: 'locationInfo',
      });
    }
    this.doc.content.push({
      columns: [
        { text: 'Date', alignment: 'left' },
        { text: this.$moment().format('MM/DD/YY hh:mm:ss'), alignment: 'right' },
      ],
      margin: [0, 10, 0, 0],
      style: 'locationInfo',
    })
    this.doc.content.push({
      columns: [
        {
          text: `${this.mvnoInfo.name} Activation`,
          alignment: 'center',
          margin: [0, 10, 0, 0],
          bold: true,
          fontSize: this.width * 0.08,
        },
      ],
    })
    if (this.activation.MVNOPortIn && this.activation.MVNOPortIn.phoneNumber) {
      this.doc.content.push({
        columns: [
          {
            text: this.$options.filters.phone(this.activation.MVNOPortIn.phoneNumber),
            alignment: 'center',
            margin: [0, 10, 0, 0],
            bold: true,
            fontSize: this.width * 0.12,
          },
        ],
      })
      this.doc.content.push({
        columns: [
          {
            text: `${this.activation.MVNOPortIn.carrierName} Portin`,
            alignment: 'center',
            margin: [0, 10, 0, 0],
            bold: true,
            fontSize: this.width * 0.04,
          },
        ],
      })
    } else {
      this.doc.content.push({
        columns: [
          {
            text: this.activation.MVNOPhoneNumber.full.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'),
            alignment: 'center',
            margin: [0, 10, 0, 0],
            bold: true,
            fontSize: this.width * 0.12,
          },
        ],
      })
    }

    this.doc.content.push({
      columns: [
        { text: 'Name', alignment: 'left' },
        { text: this.activation.fullName, alignment: 'right' },
      ],
      margin: [0, 10, 0, 0],
    })
    this.doc.content.push({
      columns: [
        { text: 'Next Due Date', alignment: 'left' },
        { text: this.$moment(this.activation.dueDate).add(30, 'days').format('MM/DD/YY'), alignment: 'right' },
      ],
    })
    this.doc.content.push({
      columns: [
        { text: 'Employee', alignment: 'left' },
        { text: this.activation.Employee.firstName, alignment: 'right' },
      ],
    })
    this.doc.content.push({
      text: 'Plan Details',
      alignment: 'center',
      margin: [0, 10, 0, 10],
    })
    await Promise.all(this.activation.CSPCarrierPlans.map((plan) => {
      this.doc.content.push({
        text: plan.name,
        alignment: 'left',
      })
      this.doc.content.push({
        text: plan.description,
        alignment: 'left',
        fontSize: this.width * 0.04,
      })
      planTotal += plan.amount
    }))
    this.doc.content.push({
      columns: [
        {
          text: 'Monthly Total',
          alignment: 'right',
        },
        {
          text: this.$options.filters.currency(planTotal),
          alignment: 'right',
        },
      ],
      margin: [0, 5, 0, 10],
    })
    this.doc.content.push({
      text: 'Policy',
      style: 'heading',
      bold: true,
      margin: [0, 20, 0, 5],
      fontSize: this.width * 0.07,
    });
    this.doc.content.push({
      text: this.mvnoInfo.activationPolicy,
      style: 'locationInfo',
    });

    this.setPDF()
  },
  methods: {
    setPDF() {
      pdfMake.createPdf(this.doc).getDataUrl((data) => {
        this.pdf = data;
      })
    },
    setPages(val) {
      this.pages = val
    },
    print() {
      pdfMake.createPdf(this.doc).print();
      this.$emit('close')
    },
    download() {
      pdfMake.createPdf(this.doc).download();
    },
  },
}
</script>
