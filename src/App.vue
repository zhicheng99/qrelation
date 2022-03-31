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
          // { 
          //   id:1,     //节点的唯一标识 也有于连线的起终点标识
          //   nodeId:1, //初始化生成后对应相应的节点对象id 每次都会变
          //   nodeType:'container',  //容器类型
          //   x:100,
          //   y:200,
          //   text:'容器标题',
          //   width:230,
          //   height:160,
          //   grid:[2,2], //行 列
          //   child:[

          //     //容器里的节点不需要坐标  根据grid自动生成
          //     { 
          //       id:2,
          //       nodeType:'node',
          //       text:'我是容器里的1',
          //       attr:{
          //         color:'#fff'
          //       }
          //     },
          //     { 
          //       id:3,
          //       nodeType:'node',
          //       text:'我是容器里的2',
          //       attr:{
          //         color:'#fff'
          //       }
          //     },
          //     { 
          //       id:5,
          //       nodeType:'node',
          //       text:'我是容器里的3',
          //       attr:{
          //         color:'#fff'
          //       }

          //     }

          //   ],
          //   attr:{
          //      titlePosition:'top-center',
          //      color:'#fff', //标题文字的颜色
          //      borderColor:'#9093DC', 
          //      fillColor:'#9093DC',
          //      dashed:false, 
          //   }
          // },
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
              type:'foldLine1', //三线曲线

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
