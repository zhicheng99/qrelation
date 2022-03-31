import babelpolyfill from 'babel-polyfill'

import Vue from 'vue';
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css';
// import './theme/theme-next/index.css'


import App from './App';
 

new Vue({ 
  render: h => h(App), 
}).$mount('#app')

