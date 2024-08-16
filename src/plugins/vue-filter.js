import Vue from 'vue'
import VueCurrencyFilter from 'vue-currency-filter'

Vue.use(VueCurrencyFilter, {
  symbol: '$',
  thousandsSeparator: ',',
  fractionCount: 2,
  fractionSeparator: '.',
  symbolPosition: 'front',
  symbolSpacing: true,
})

Vue.filter('phone', (phone) => {
  if (!phone) return ''
  return phone.replace(/[^0-9]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
})


Vue.filter('highlight', (words, query) => {
    if (query) {
      var check = new RegExp(query.toLowerCase(), "ig");
      if (words) {
        return words.toString().replace(check, function (matchedText) {
          return '<span class="highlight">' + matchedText + "</span>";
        });
      } else {
        return words;
      }
    } else {
      return words;
    }
  }

)
