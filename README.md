#### 调用示例
示例地址：https://zhicheng99.github.io/qrelation/
```
<template>
	<div>
		<div class="lay">
			<qrelation
			v-bind:init-width="'1000'"
			v-bind:init-height="'1000'"
			v-bind:json-data="jsonData"
			v-bind:save-fun="save"
			></qrelation>
		</div>
	
	</div>
</template>
<script>
	import qrelation from 'qrelation';
	export default{
		components:{
			qrelation
		},
		props:[],
		data(){
			return {
				jsonData:[
						{
							node:[
								{	
									id:1,     //节点的唯一标识 也有于连线的起终点标识
									nodeId:1, //初始化生成后对应相应的节点对象id 每次都会变
									nodeType:'container',  //容器类型
									x:100,
									y:200,
									text:'容器标题',
									width:230,
									height:160,
									grid:[2,2], //行 列
									child:[

										//容器里的节点不需要坐标  根据grid自动生成
										{	
											id:2,
											nodeType:'node',
											text:'我是容器里的1',
											attr:{
												color:'red'
											}
										},
										{	
											id:3,
											nodeType:'node',
											text:'我是容器里的2',
											attr:{
												color:'red'
											}
										},
										{	
											id:5,
											nodeType:'node',
											text:'我是容器里的3',
											attr:{
												color:'red'
											}

										}

									],
									attr:{
										 titlePosition:'top-center',
										 color:'red', //标题文字的颜色
										 borderColor:'red', 
										 fillColor:'',
										 dashed:false, 
									}
								},
								{	
									id:4,
									nodeType:'node', //普通节点
									x:200,
									y:50,
									text:'标题1',
									attr:{
										 borderColor:'red', 
										 color:'red', 
										 fillColor:'',
										 dashed:true, 
									}
								},
								{	
									id:6,
									nodeType:'node', //普通节点
									x:350,
									y:50,
									text:'标题2',
									attr:{
										 borderColor:'red', 
										 color:'red', 
										 fillColor:'',
										 dashed:true, 
									}
								}

							],
							link:[	 //连线关系  
								{
									fromId:1,
									toId:4,
									attr:{
										text:'连线关系1',
										like:'->'
									}
								},
								{
									fromId:4,
									toId:5,
									attr:{
										text:'连线关系2',
										like:'->'
									}
								}
							] 
						}
				]
			}
		},
		methods:{

			save:function(v){
				console.log(v);
			}

		},
		mounted(){

		},
		created(){
			
		},
		computed:{

		},
		watch:{

		}
	}

</script>
<style scoped>
.lay{
	width: 1000px;
	margin:0 auto;
}

</style>
```