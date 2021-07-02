<template>
  <div id="app">

    <qrelation
      v-if="jsonData!==null"
      v-bind:init-width="'1000'"
      v-bind:init-height="'1000'"
      v-bind:json-data="jsonData"
      v-bind:save-fun="save"
      ></qrelation>

  </div>
</template>

<script>
import {Qcanvas} from 'qcanvas';
window.Qcanvas = Qcanvas;

import qrelation from "./qrelation.vue";

export default {
  name: "App",
  components: {
    qrelation,
  },
  data() {
    return { 
      jsonData:[{
          node:[],
          link:[]
        }]
    }
  },
  methods: { 
    save:function(json){

      console.log(json);

    }
  },
};
</script>

<style>
</style>
