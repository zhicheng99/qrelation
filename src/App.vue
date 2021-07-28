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
      // jsonData:[{
      //     node:[],
      //     link:[]
      //   }],
      jsonData:[

        {
          node:[ 
          { 
            id:4,
            nodeType:'node', //普通节点
            x:200,
            y:50,
            text:'标题1',
            attr:{
               borderColor:'#3c3c3c', 
               color:'#333', 
               fillColor:'#eee',
               dashed:false, 
            }
          },
          { 
            id:5,
            nodeType:'node', //普通节点
            x:400,
            y:200,
            text:'标题2',
            attr:{
               borderColor:'#7EC8CE', 
               color:'#fff', 
               fillColor:'#585DCB',
               dashed:false, 
            }
          }

        ],
        link:[   //连线关系   
          {
            fromId:4,
            toId:5,
            attr:{
              // type:'bezierCurve', //三线曲线
              type:'foldLine2', //三线曲线

              text:'连线关系2',
              like:'<-->'
            }
          }
        ]
        }

      ]
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
