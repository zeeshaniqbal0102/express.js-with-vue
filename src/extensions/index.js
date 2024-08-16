import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import PDFJS from 'pdfjs-dist'
import html2canvas from 'html2canvas'
// Add fonts to PDF make according to the doc
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  printer: {
    printPDF: async (pdf, options = {}) => {
      /**
       * What we want to do is guess where the user is printing from and what is availabe
       * and chose the best option for printing their file
       */
      if (options.Star) {
        const pdfDocument = pdfMake.createPdf(pdf).getStream()
        return html2canvas(document.querySelector('#section-to-print'), {
          scale: 2,
          width: pdfDocument.page.width / 0.76723, // For some reason no wide enough alone. Something with DPI
          height: pdfDocument.page.height / 0.66723,
        }).then(async (canvas) => {
          const trader = new StarWebPrintTrader({
            url: `http://${options.host}/StarWebPRNT/SendMessage`,
            checkedblock: false,
          })
          const builder = new StarWebPrintBuilder();

          let request = builder.createInitializationElement()
          request += builder.createBitImageElement({
            context: canvas.getContext('2d'),
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
          });
          request += builder.createCutPaperElement({
            feed: false,
            type: 'partial',
          });

          trader.onError = (response) => {
            alert('Error printing on Star Printer.', response.responseText);
          }
          return trader.sendMessage({
            request,
          })
        });
      }
      if (typeof pdf === 'object') {
        // we can assume that if the pdf is an object, it is a pdfmake object so lets convert it
        // if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
        //   return pdfMake.createPdf(pdf).print({}, window)
        // }
        // if ((!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) && (!!window.navigator.standalone)) {
        //   alert('Print not supported on this device yet when installed. Please use your browser.')
        // } else {
        //   // pdfMake.createPdf(pdf).getBuffer((buffer) => {
        //   //   const blob = new Blob([buffer], {
        //   //     type: 'application/pdf'
        //   //   });
        //   //   var fileURL = URL.createObjectURL(blob);
        //   //   const tempWin = window.open(fileURL);
        //   //   tempWin.onload = function () {
        //   //     tempWin.print()
        //   //     // tempWin.onfocus = function () { setTimeout(function () { tempWin.close(); }, 10000); }
        //   //   }
        //   //   // tempWin.close()
        //   // });

        // }

        // Its required that the module that calls window. print handle the css for printing in case we don't have custom printing
        window.print()
      }
    },
    openDrawer: async (options = {}) => {
      window.print()
    },
    printToPDF: async (pdf) => {
      if (typeof pdf === 'object') {
        // we can assume that if the pdf is an object, it is a pdfmake object so lets convert it
        if ((!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) && (!!window
          .navigator.standalone)) {
          alert(
            'Download not supported on this device yet when installed. Please use your browser. ',
          )
        } else {
          pdfMake.createPdf(pdf).download()
        }
      }
    },
  },
}
