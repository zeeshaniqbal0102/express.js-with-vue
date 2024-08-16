import Vue from 'vue';
import CSPLoader from '@/components/LoadingDialog.vue';
import BackBtn from '@/components/BackBtn.vue';
import CardToolbar from '@/components/Controls/Card-Toolbar.vue';
import TitleBar from '@/components/TitleBar.vue';
import SearchBar from '@/components/SearchBar.vue';
import CardActions from '@/components/Controls/Card-Action.vue';
import ListTitle from '@/components/ListTitle.vue';



Vue.component('CSPLoader', CSPLoader)
Vue.component('BackBtn', BackBtn)
Vue.component('TitleBar', TitleBar)
Vue.component('ListTitle', ListTitle);
Vue.component('SearchBar', SearchBar)
Vue.component('CardToolbar', CardToolbar)
Vue.component('CardActions', CardActions)
