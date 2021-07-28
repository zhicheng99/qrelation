//
//目前普通node固定宽度(100*50)
//容器container的宽高随着它包含的child的数量而变化 暂不支持手动缩放
//
//
function Qflow(options){
	this.options = options;
	this.toolLayer = null;
	this.menuLayer = null;
	this.qnodes = [];  //所有创建的对象
	this.baseNodesWithCoordinates = [];  //带有坐标的基础对象
	this.containerPadding = 10;     //容器内边距
	this.containerChildMargin = 10; //子项外边距
	this.containerTitleHeight = 20; //容器标题文本占的高度

	//初始普通节点大小
	this.childNodeWidth = 100;
	this.childNodeHeight = 30;


	this.tipNodeWidth = 150;
	this.tipContext = null;


	//初始容器大小
	this.containerNodeWidth = 120;
	this.containerNodeHeight = 70;


	this.draging = false;

	this.contextSettingNode = null; //设置菜单的对象
	this.contextAimAttr = '';    //右键tab指向的属性


	this.modiTitleObj = null;

	//17种基本颜色
	this.colorRect = { 
		"red":"#FF0000",
		"orange":"#FFA500",
		"yellow":"#FFFF00",
		"green":"#008000",
		"blue":"#0000FF",
		"white":"#FFFFFF",
		"black":"#000000",
		"aqua":"#00FFFF",
		"fuchsia":"#FF00FF",
		"gray":"#808080",
		"lime":"#00FF00",
		"maroon":"#800000",
		"navy":"#000080",
		"olive":"#808000",
		"purple":"#800080",
		"silver":"#C0C0C0",
		"teal":"#008080",
	};

	this.lineColor = '#FF912D';
	this.childNodeFillColor = '#eee';
	this.childNodeBorderColor = '#3c3c3c';
	this.containerFillColor = "#ddd";
	this.containerBorderColor = '#3c3c3c';
	this.textColor="#333"



	//折线的配置项
	this.line1Like = {
		'-':'-',
		'--':'--',
		'->':'-',
		'-->':'--',
		'<-':'<-',
		'<--':'<--',
		'<->':'<-',
		'<-->':'<--'
	}
	this.line2Like = {
		'-':'-',
		'--':'--',
		'->':'-',
		'-->':'--',
		'<-':'-',
		'<--':'--',
		'<->':'-',
		'<-->':'--'
	}
	this.line3Like = {
		'-':'-',
		'--':'--',
		'->':'->',
		'-->':'-->',
		'<-':'-',
		'<--':'--',
		'<->':'->',
		'<-->':'-->'
	}

	this.init();

	// console.log(this.qcanvas.elements);
 
}
Qflow.prototype.init = function() {
	//加工初始数据 重置画布size
	this.reSizeByInitData();

	//初始化子项的的位置
	this.initChildPosition();

	//初始画布
	this.initCanvas();

	//初始节点
	this.initNode();


	//初始连线
	this.lineLayer = this.qcanvas.qlayer.layer();
	this.lineCache = {};
	this.solveLink();
	this.initLink();


	//点击设置按钮出现菜单layer对象
	this.contextSettingLayer = this.qcanvas.qlayer.layer();
	this.contextSettingLayer.setDisplay('none');

	//点击设置按钮显示半透明覆盖层
	// this.initContextCover();


	//初始化设置按钮（鼠标划过元素时显示）
	this.settingIco = null;
	this.initSettingIco();


	//节点右键菜单
	this.contextMenuLayer = this.qcanvas.qlayer.layer();
	this.contextMenuLayer.setDisplay('none');
	this.contextMenuNode = null; //右键菜单对象

	this.initMenu();

	this.tmpLine = null;   //创建临时的连接线


	//线的右键菜单
	this.contextLineMenuLayer = this.qcanvas.qlayer.layer();
	this.contextLineMenuLayer.setDisplay('none');
	this.contextLineMenuNode = null; //右键菜单对象

	// this.initLineMenu();
	// console.log(this.qcanvas);
	
	this.createFps();
};
Qflow.prototype.createFps = function() {
	var _this = this;
	this.qcanvas.qtext.text({
		// text:function(){
		// 	return 'FPS:'+_this.qcanvas.currFps+'';
		// },
		text:'qrelation Version v1.0.108',
		color:'#dcdcdc',
		fontSize:'10px',
		textAlign:'left',
		start:[5,50],
		pointerEvent:'none'
	})
};
Qflow.prototype.returnSaveData = function() {
	var tmp = JSON.parse(JSON.stringify(this.options.initData));

	tmp.node && tmp.node.forEach(function(item){
		delete item.childNodes
	})

	tmp.link && tmp.link.forEach(function(item){
		delete item.fromNode;
		delete item.toNode;
	})

	return tmp;
};
Qflow.prototype.initContextLineMenuArea = function(pos) {
	var _this = this; 

	//右击显示的菜单块
	var tmp = this.qcanvas.qrect.rect({
		start:[pos.x,pos.y],
		width:150,
		height:150,
		borderColor:'',
		fillColor:'yellow',
		drag:false
	})

	this.contextLineMenuLayer.push(tmp);
};
Qflow.prototype.resetPosOfLineModiTitleNode = function() {
	var ele = this.contextLineMenuLayer.elements[0];
	var x = ele.start[0]+5;
	var y = ele.start[1]+5; 
	var w = (ele.width - 10)*0.5;
	var h = 30;

	var d = document.getElementById('lineTitleInput');
	d.style.left = x+'px';
	d.style.top = y+'px';
	d.style.width = w+'px';
	d.style.height = h+'px';
	d.style.display = 'block';
};
Qflow.prototype.modiLineTitle = function(v) {
	if(this.modiTitleObj !== null){
		this.modiTitleObj.setText(v);
	}

	var json = this.getLineJsonByNodeId(this.contextLineMenuNode.id);
  	json.attr.text = v;

};
Qflow.prototype.modiLineLike = function(v) { 


	if(this.contextLineMenuNode.relationLineId){  //折线


		var l1 = this.lineLayer.getEleById(this.contextLineMenuNode.relationLineId[0]);
		var l3 = this.lineLayer.getEleById(this.contextLineMenuNode.relationLineId[1]);
 

		l1.setLike(this.line1Like[v]);
		l3.setLike(this.line3Like[v]);
		this.contextLineMenuNode.setLike(this.line2Like[v]);

	}else{
		this.contextLineMenuNode.setLike(v);
	}


	var json = this.getLineJsonByNodeId(this.contextLineMenuNode.id);
  	json.attr.like = v;
};

Qflow.prototype.modiLineType = function(v) {
 
	var json = this.getLineJsonByNodeId(this.contextLineMenuNode.id);

	if((typeof json.attr.type !='undefined') && 
	(v != json.attr.type) || (typeof json.attr.type =='undefined')
	){ //线的类型不一样


	  	json.attr.type = v;

	  	//删除原来的线及文本
	  	// typeof this.contextLineMenuNode.withTextId !='undefined' &&  
	  	// this.lineLayer.removeEle(this.lineLayer.getEleById(this.contextLineMenuNode.withTextId));
	  	// this.lineLayer.removeEle(this.contextLineMenuNode)


	  	//全部清除 重新画一次
	  	this.lineLayer.destroy();
	  	this.initLink();

	  	//清除右击菜单
	  	this.lineMenuLayerHide();

	}
}



Qflow.prototype.initLineModiTitleNode = function() {

	var ele = this.contextLineMenuLayer.elements[0];
	var x = ele.start[0]+5;
	var y = ele.start[1]+5;
	var w = (ele.width - 10)*0.5;
	var h = 30;
 

	var d = document.getElementById('lineTitleInput');
	d.style.left = x+'px';
	d.style.top = y+'px';
	d.style.width = w+'px';
	d.style.height = h+'px';
	d.style.display = 'block';
 
	// console.log(this.contextLineMenuNode);
	this.modiTitleObj = this.lineLayer.getEleById(this.contextLineMenuNode.withTextId);
	// console.log(this.modiTitleObj);
	d.value = this.modiTitleObj.text;
 


}; 
Qflow.prototype.initLineLikeNode = function() {
	var ele = this.contextLineMenuLayer.elements[0];
	var x = ele.start[0]+ele.width*0.5;
	var y = ele.start[1]+5;
	var w = (ele.width - 10)*0.5;
	var h = 30;

	var d = document.getElementById('lineLike');
	d.style.left = x+'px';
	d.style.top = y+'px';
	d.style.width = w+'px';
	d.style.height = h+'px';
	d.style.display = 'block';

	d.value = this.contextLineMenuNode.like;



};
Qflow.prototype.initLineTypeNode = function() {

	var ele = this.contextLineMenuLayer.elements[0];
	var x = ele.start[0]+5;
	var y = ele.start[1]+ele.height-40;
	var w = (ele.width - 10)*0.5;
	var h = 30;

	var d = document.getElementById('lineType');
	d.style.left = x+'px';
	d.style.top = y+'px';
	d.style.width = w+'px';
	d.style.height = h+'px';
	d.style.display = 'block';

	d.value = '';




}



Qflow.prototype.initLineColorRect = function() {
	var _this = this;
	var disTop = 10;
	var padding = 10;
	var rectW = 13;
	var rectH = 13;

	var tmp = this.contextLineMenuLayer.elements[0];


	//暂时排4行5列 
	var areaPosition = [
		{
			x:tmp.start[0]+10,
			y:tmp.start[1]+30+disTop
		},
		{
			x:tmp.start[0]+tmp.width-10,
			y:tmp.start[1]+tmp.height+30-10
		}
	];

	var pos = this.childPositionByRow(4,6,areaPosition, rectW,rectH);

	var color = [];
	for(var i in this.colorRect){
		color.push(this.colorRect[i]);
	}

	for (var i = 0; i < color.length; i++) {
		this.contextLineMenuLayer.push(this.qcanvas.qrect.rect({
			start:[pos[i].x,pos[i].y],
			width:rectW,
			height:rectH,
			fillColor:color[i],
			drag:false,
			mouseup:function(){

				_this.contextLineMenuNode.setColor(this.fillColor);

				var json = _this.getLineJsonByNodeId(_this.contextLineMenuNode.id);
			  	json.attr.color = this.fillColor;


			  	var textObj = _this.lineLayer.getEleById(_this.contextLineMenuNode.withTextId);
				textObj.setColor(this.fillColor);

				// if(_this.contextAimAttr == 'color'){
				// 	//设置节点标题颜色
				// 	_this.updateNodeTitleColor(this.fillColor);


				// }else{

				// 	_this.contextSettingNode[_this.contextAimAttr] = this.fillColor;
					 
				// }

				// 	//更新json数据相关属性值
				// 	_this.updateInitDataAttr(this.fillColor);


			}
		}))
	}
};
Qflow.prototype.delLineNode = function() {
	var _this = this;
	//更新json数据
	var tmp = this.options.initData.link.filter(function(item){
		return item.lineId != _this.contextLineMenuNode.id;
	})
	this.options.initData.link = tmp;


	//如果有通过withText生成的文字对象 先删除文字
	if(typeof this.contextLineMenuNode.withTextId != 'undefined'){
		var textObj = this.lineLayer.getEleById(this.contextLineMenuNode.withTextId);
		this.lineLayer.removeEle(textObj);

		this.lineLayer.removeEleById(this.contextLineMenuNode.withTextId);

	}

	//如果是折线 需要把关联线也一并删除
	if(typeof this.contextLineMenuNode.relationLineId != 'undefined'){

		this.contextLineMenuNode.relationLineId.forEach(function(item){
			_this.lineLayer.removeEleById(item);
		})
	}

	
	this.lineLayer.removeEle(this.contextLineMenuNode);

};
Qflow.prototype.initLineDelBtn = function() {
	var _this = this;
	var ele = this.contextLineMenuLayer.elements[0];

	this.contextLineMenuLayer.push(
		this.qcanvas.qrect.rect({
			start:[ele.start[0]+ele.width-70,ele.start[1]+ele.height-40],
			width:60,
			height:30,
			fillColor:'#fff',
			drag:false,  
			mouseup:function(){
				console.log('del');
				//删除操作
				_this.delLineNode();
 				
 				_this.lineMenuLayerHide();
			}
		}),
		this.qcanvas.qtext.text({
			text:'删除',
			start:[ele.start[0]+ele.width-40,ele.start[1]+ele.height-25],
			fontSize:'12px',
			color:'#000',
			pointerEvent:'none'
		})
	);

};
Qflow.prototype.initLineMenu = function(pos) {

	this.lineMenuLayerHide();

	//初始化contextLineMenu右键菜单区rect
	this.initContextLineMenuArea(pos);

	//修改标题框(用于定位一个input框)
	this.initLineModiTitleNode();

	//修改样式select框定位
	this.initLineLikeNode();


	this.initLineTypeNode();


	//17颜色块画到右击菜单区
	this.initLineColorRect();

	//删除按钮
	this.initLineDelBtn();
 



	// this.contextLineMenuLayer.setDisplay('block');

};
Qflow.prototype.download = function() {
	var obj = document.getElementById(this.options.id); 

	var tmp = document.createElement('canvas');
	var context = tmp.getContext('2d');
	tmp.width = this.options.width;
	tmp.height = this.options.height; 
	context.fillStyle="#fff"
	context.fillRect(0, 0,parseInt(obj.style.width),parseInt(obj.style.height));
	context.drawImage(obj,0,-40,parseInt(obj.style.width),parseInt(obj.style.height));


	var oA = document.createElement("a");
    oA.download = '';// 设置下载的文件名，默认是'下载'
    oA.href = tmp.toDataURL("image/png",1.0);
    document.body.appendChild(oA);
    oA.click();
    oA.remove(); // 下载之后把创建的元素删除
	
};
Qflow.prototype.destroy = function() {

	this.qcanvas.elements.forEach(function(item){
		if(item.TYPE == 'layer'){
			item.destroy();
		}
	})

	this.qcanvas.destroy();
	
};
Qflow.prototype.lineMenuLayerShow = function(pos) { 


	this.contextLineMenuLayer.setDisplay('block'); 
};
Qflow.prototype.lineMenuLayerHide = function() {
	this.contextLineMenuLayer.setDisplay('none');
	this.contextLineMenuLayer.destroy();
	// this.modiTitleObj = null;

	var d1 = document.getElementById('lineTitleInput'); 
	var d2 = document.getElementById('lineLike');
	var d3 = document.getElementById('lineType'); 


	
	d1.style.display = 'none';
	d2.style.display = 'none';
	d3.style.display = 'none';




};
Qflow.prototype.updateTmpLineEndPos = function(pos) {

	if(this.tmpLine !== null){
		this.tmpLine.setEnd([pos.x,pos.y]);
	}
	
};
Qflow.prototype.delTmpLine = function() {
	if(this.tmpLine !== null){
		// console.log(this.tmpLine);
		 
		 
		 //同时删除线上所带的文字
		 var text = this.qcanvas.getEleById(this.tmpLine.withTextId);
		 this.qcanvas.removeEle(this.tmpLine);
		 this.qcanvas.removeEle(text);

		 this.tmpLine =null;
	}
};
/**
 * [createNewLine description]
 * @param  {[type]} node    [目标对象]
 * @param  {[type]} jsonObj [目标对象json]
 * @return {[type]}         [description]
 */
Qflow.prototype.createNewLine = function(node,jsonObj) {
	var _this = this;
	//开始创建新的连线
	if(this.contextMenuNode!== null){  

		var fromJSON = this.getJsonObj(this.contextMenuNode.id); 
 
		if(fromJSON.id == jsonObj.id){ //指向自已的连线 后期再实现
			this.contextMenuNode = null;

			return false;
		}

		this.options.initData.link.push({
			fromId:fromJSON.id,
			toId:jsonObj.id,
			attr:{
				like:'->',
				color:this.lineColor,
				text:'连线关系'
			}
		})
		this.solveLink();


		var json = this.options.initData.link[this.options.initData.link.length -1];
		var tmp = this.qcanvas.qline.line({
			start:function(){return _this.calcLineStartPos(json.fromNode,json.toNode,this.id)},
			end:function(){return _this.calcLineEndPos(json.fromNode,json.toNode,this.id)}, 
			width:1,
			// pointerEvent:'none',
			drag:false,
			like:json.attr.like,
			color:json.attr.color,
			withText:'连接关系',
			mouseup:function(e,pos) {
				//右击显示菜单
				if(e.button == '2'){ 

					_this.contextLineMenuNode = this;

					_this.qcanvas.raiseToTop(_this.contextLineMenuLayer);
					_this.initLineMenu(pos);
					_this.lineMenuLayerShow();



					_this.contextSettingHide();


				}
			}
		})
		this.lineLayer.push(tmp);

		json.lineId = tmp.id;


		this.contextMenuNode = null;
	}
};
Qflow.prototype.createTmpLine = function(pos) {

	//start:this.contextMenuNode的中心点
	//end:[pos.x,pos.y]
	var centerPos = this.contextMenuNode.centerPoints();
	this.tmpLine = this.qcanvas.qline.line({
	    start:[centerPos.x,centerPos.y],
	    end:[pos.x,pos.y],
	    width:1,
	    like:'->',
	    color:this.lineColor,
	    withText:'连接关系',
	    withTextAlign:'left',
	    pointerEvent:'none'
	});

};
Qflow.prototype.getLineObj = function(nodeId) {
	var tmp = this.lineLayer.elements.filter(function(item){
 		return item.id == nodeId;
 	})

 	if(tmp.length>0){
 		return tmp[0];
 	}else{
 		return null;
 	}
};

Qflow.prototype.getLineJsonByNodeId = function(nodeId) {
	var tmp = this.options.initData.link.filter(function(item){
		return item.lineId == nodeId;
	})

	if(tmp.length>0){
 		return tmp[0];
 	}else{
 		return null;
 	}
};
Qflow.prototype.getDelLineObj = function(nodeObj) {
	var _this = this;
	//在this.options.initData.link中找到与nodeObj节点有关系的线
	var lineObj = [];

	nodeObj.forEach(function(item){

		_this.options.initData.link.forEach(function(l){

			if(l.fromNode.id == item.id || 
				l.toNode.id == item.id 
				){

				lineObj.push(_this.getLineObj(l.lineId));

				// //如果是折线 需要把关联的线也一并返回
				// if(typeof l.relationLineId != 'undefined'){
				// 	l.relationLineId.forEach(function(r){
				// 		console.log(r);
				// 		lineObj.push(_this.lineLayer.getEleById(r));
				// 	})
				// }
			}
		})

	})

	return lineObj;

};
Qflow.prototype.getDelTextObj = function(nodeObj) {
	var _this = this;
	//在this.qcanvas.elements里找到与nodeObj节点有关联的标题节点
	var textObj = [];

	var allTextObj = this.qcanvas.elements.filter(function(item){
		return item.TYPE == 'text'
	})

	nodeObj.forEach(function(item){

		allTextObj.forEach(function(t){

			if(typeof t.ownerId !== 'undefined' && t.ownerId == item.id){
				textObj.push(t);
			}

		})

	})

	return textObj;
};
Qflow.prototype.getWithTextObj = function(nodeObj) {
	var _this = this;
	var textObj = [];
	nodeObj.forEach(function(item){

		_this.lineLayer.elements.forEach(function(t){

			if(typeof item.withTextId !== 'undefined' && t.id == item.withTextId){
				textObj.push(t);
			}
		})

	})

	return textObj;
	
};
Qflow.prototype.updateNodeJsonAfterDelNode = function(nodeObj) {
	var _this = this;


	nodeObj.forEach(function(item){
		var node = _this.getJsonObj(item.id);
		node.isDel = true;
	})
 	
 	var tmp =[];
	//搜索父 子项
	for (var i = 0; i < this.options.initData.node.length; i++) {

		if(typeof this.options.initData.node[i].isDel !='undefined' &&  
			this.options.initData.node[i].isDel){
			continue;
		}else{
			tmp.push(this.options.initData.node[i]);

			if(typeof tmp[tmp.length-1].child !='undefined'){
				tmp[tmp.length-1].child = tmp[tmp.length-1].child.filter(function(item){

					return  typeof item.isDel == 'undefined' || !item.isDel;
				})
			}
		}
		
	}


	this.options.initData.node = tmp;
};
Qflow.prototype.updatelinkJsonAfterDelNode = function(nodeObj) {
	var _this = this;
	nodeObj.forEach(function(l){

		_this.options.initData.link.forEach(function(item){
			if(item.lineId == l.id){
				item.isDel = true;
			}
		})
	})

	this.options.initData.link = this.options.initData.link.filter(function(item){
		return typeof item.isDel == 'undefined' || !item.isDel;
	})
	
};
Qflow.prototype.delNode = function() {
	var _this = this;
	//通过this.contextMenuNode找出需要删除的元素（与它联系的所有元素）
	//如果是container 标题及它的子项也一并删除（在主画布上）
	//如果有连线关系(指向它的或是它指向别的节点的) 需要把线也一并删除（在lineLayer上）
	var nodeId = this.contextMenuNode.id;
	this.contextMenuNode = null;
	var nodeJson = this.getJsonObj(nodeId);


	var delNodeObj = [];
	if(nodeJson.nodeType == 'container'){
		delNodeObj = delNodeObj.concat(nodeJson.childNodes);
		delNodeObj.push(this.getNodeObj(nodeJson.nodeId));
	}else{

		delNodeObj.push(this.getNodeObj(nodeJson.nodeId));

	}
	// console.log('需要删除的node');
	// console.log(delNodeObj);

	var delLineObj = this.getDelLineObj(delNodeObj); //连线对象(在this.lineLayer上)
	// var delWithTextObj = this.getWithTextObj(delLineObj); //连线上的文字对象（在this.lineLayer上）
	// var delTextObj = this.getDelTextObj(delNodeObj); //节点上的文字对象


	// console.log('需要删除的line');
	// console.log(delLineObj);

	// console.log('需要删除的text');
	// console.log(delTextObj);

	// console.log('需要删除的line上withText');
	// console.log(delWithTextObj);



	//同步json对象
	this.updateNodeJsonAfterDelNode(delNodeObj);
	this.updatelinkJsonAfterDelNode(delLineObj);


	//删除对象 （顺序：连线上的文字->连线->node上的标题文字->node）
	// delWithTextObj.forEach(function(item){
	// 	_this.lineLayer.removeEleById(item.id);
	// })

	delLineObj.forEach(function(item){

		//先删线上的文字
		if(typeof item.withTextId != 'undefined'){
			_this.lineLayer.removeEleById(item.withTextId);
		}

		//先删除关联的线
		if(typeof item.relationLineId != 'undefined'){
			item.relationLineId.forEach(function(r){
				_this.lineLayer.removeEleById(r);
			})
		}

		_this.lineLayer.removeEleById(item.id);
	})
	// delTextObj.forEach(function(item){
	// 	_this.qcanvas.removeEleById(item.id);
	// })

	// console.log(delNodeObj)  
	delNodeObj.forEach(function(item){
		if(typeof item.ownerId !='undefined'){ 
		//删除的是容器里的节点 
		//需要更新json对象中的childNodes数组
		//更新容器的高度
			var jsonObj = _this.getJsonObj(item.ownerId);

			if(jsonObj !== null){

				jsonObj.childNodes.forEach(function(c){
					if(c.id == item.id ){
						c.isDel = true;
					}
				})
				jsonObj.childNodes = jsonObj.childNodes.filter(function(item){
					return typeof item.isDel == 'undefined' || !item.isDel;
				})

				jsonObj.childNodes.forEach(function(item,index){
					item.sort = index;
				})

				//更新高度
				if(jsonObj.attr.titlePosition == 'top-center'){
					var startPlaceHolderY = (_this.containerTitleHeight+_this.containerPadding);
					var row = Math.ceil((jsonObj.child.length == 0?1:jsonObj.child.length)/jsonObj.grid[1]);
					jsonObj.height = startPlaceHolderY + _this.childNodeHeight*row+(row)*_this.containerChildMargin;
					jsonObj.grid[0] = row;
					var containerObj = _this.getNodeObj(item.ownerId);
					containerObj.setHeight(jsonObj.height); 
				}

				//更新gridPostion--------
					//可以摆放子项的区域位置[左上角开始位置，右下角结束位置]
					var childAreaPosition = _this.getChildAreaPosition(jsonObj);

					//可以摆放子项的区域位置 计算出各个格子的坐标
					var childPosition = _this.getChildPosition(jsonObj,childAreaPosition);

					//把格子坐标添加到attr里
					jsonObj.attr.gridPosition = childPosition;

				//----------------


			}
		}

		//先删除node上的文字
		if(typeof item.ownerId !== 'undefined'){
			_this.lineLayer.removeEleById(item.ownerId);
		} 

		//tip类型删除
		if(typeof item.withTextId !=='undefined'){
			_this.qcanvas.removeEleById(item.withTextId);
		}


		_this.qcanvas.removeEle(item);
	})


	_this.contextMenuNode = null;

	
};
Qflow.prototype.cloneNode = function() {
	var _this = this;
	var nodeObj = this.contextMenuNode;
	var nodeJsonObj = this.getJsonObj(nodeObj.id);
	// console.log(nodeObj);
	// console.log(nodeJsonObj);

	if(nodeJsonObj.nodeType =='node'){

		if(typeof nodeObj.ownerId =='undefined'){//复制节点

			this.addNode({x:nodeJsonObj.x+20,y:nodeJsonObj.y+20},nodeJsonObj.text);

		}else{ //复制容器里的节点

			this.inSertToContainer({},{id:nodeObj.ownerId},nodeJsonObj.text);

		}


	}


	if(nodeJsonObj.nodeType == 'container'){
		var id = this.addContainer(
				{x:nodeJsonObj.x+20,y:nodeJsonObj.y+20},
				{
					text:nodeJsonObj.text,
					grid:nodeJsonObj.grid,
					width:nodeJsonObj.width,
					height:nodeJsonObj.height
				}
			);
		// console.log(id);

		nodeJsonObj.child.forEach(function(item){
			_this.inSertToContainer({},{id:id},item.text);
			// inSertToContainer = function(obj,aim,text)
		})
	}


	if(nodeJsonObj.nodeType == 'tip'){
		console.log('clone tip');
		this.cloneTipNode();
	}




	this.contextMenuNode = null;
};
Qflow.prototype.initMenu = function() { 
	var _this = this;
	var area = this.qcanvas.qrect.rect({
			 start:[0,0],  
			 width:100,
			 height:75,
			 borderColor:'', 
			 fillColor:'#fff',  
			 drag:false, 
			})
    var linkRect = this.qcanvas.qrect.rect({
			 start:function(){

			 	return area.start
			 },
			 width:100,
			 height:25,
			 borderColor:'', 
			 fillColor:'#fff',   
			 drag:false, 
			 mouseup:function(e,pos){ 
			 	_this.menuLayerHide();
			 	_this.createTmpLine(pos);
			 }
			})
    var linkTxt = this.qcanvas.qtext.text({
			text:'连接到',
			start:function(){
				return [_this.contextMenuLayer.elements[0].start[0]+_this.contextMenuLayer.elements[0].width*0.5,_this.contextMenuLayer.elements[0].start[1]+25*0.5];
			},
			fontSize:'12px',
			color:'#000',
			pointerEvent:'none'
		})
    var cloneRect = this.qcanvas.qrect.rect({
			 start:function(){

			 	return [area.start[0],area.start[1]+25];
			 },
			 width:100,
			 height:25,
			 borderColor:'', 
			 fillColor:'#fff',   
			 drag:false, 
			 mouseup:function(e,pos){ 
			 	console.log('clone');
			 	_this.menuLayerHide();

			 	_this.cloneNode();
			 }
			})
    var cloneText = this.qcanvas.qtext.text({
			text:'克隆',
			start:function(){
				return [
				_this.contextMenuLayer.elements[0].start[0]+_this.contextMenuLayer.elements[0].width*0.5,
				_this.contextMenuLayer.elements[0].start[1]+25+25*0.5
				];
			},
			fontSize:'12px',
			color:'#000',
			pointerEvent:'none'
		})

    var delRect = this.qcanvas.qrect.rect({
			 start:function(){

			 	return [area.start[0],area.start[1]+50];
			 },
			 width:100,
			 height:25,
			 borderColor:'', 
			 fillColor:'#fff',   
			 drag:false, 
			 mouseup:function(e,pos){ 
			 	console.log('删除');
			 	_this.menuLayerHide();
			 	// _this.contextMenuNode = null;


			 	_this.delNode();
			 }
			})
    var delTxt = this.qcanvas.qtext.text({
			text:'删除',
			start:function(){
				return [
				_this.contextMenuLayer.elements[0].start[0]+_this.contextMenuLayer.elements[0].width*0.5,
				_this.contextMenuLayer.elements[0].start[1]+50+25*0.5
				];
			},
			fontSize:'12px',
			color:'#000',
			pointerEvent:'none'
		})

    this.contextMenuLayer.push(area,linkRect,linkTxt,cloneRect,cloneText,delRect,delTxt);

};
Qflow.prototype.menuLayerShow = function(pos) {

	// var start = this.qcanvas.isFun(node.start)?node.start():node.start;
 // 	var x = start[0]+node.width - 15;
	// var y = start[1]+5; 

	// this.contextMenuNode = node; 
	
	this.contextMenuLayer.elements[0].setStart([pos.x,pos.y]);
	this.contextMenuLayer.setDisplay('block');
	this.qcanvas.raiseToTop(this.contextMenuLayer);
 
};

Qflow.prototype.menuLayerHide = function() {
	// this.contextMenuNode = null;
	this.contextMenuLayer.setDisplay('none');

};
Qflow.prototype.initSettingIco = function() {
	var _this = this; 

	this.settingIco = this.qcanvas.qarc.arc({
		start:[0,0],
		sAngle:0,
		eAngle:360,
		borderColor:'red',
		fillColor:'red',
		opacity:0.5,
		r:5,
		display:'none',
		drag:false,
		mousemove:function(){
			this.setDisplay('block');
		},
		mouseup:function(e,pos){ 
			_this.contextSettingHide();

			//如果取消连线关系
			_this.delTmpLine();
			_this.contextMenuNode = null;

			_this.contextSettingNode = this.contextSettingNode;
 

			_this.qcanvas.raiseToTop(_this.contextSettingLayer);
			// _this.contextSettingShow.call(_this.contextSettingNode,{x:this.sStart[0],y:this.sStart[1]});
			// _this.contextSettingShow({x:this.sStart[0],y:this.sStart[1]});
			_this.contextSettingShow(pos);


			_this.lineMenuLayerHide();

		}
	});	



};
Qflow.prototype.settingIcoShow = function(node) {
	// console.log('settingIcoShow');
	var start = this.qcanvas.isFun(node.start)?node.start():node.start;
 	var x = start[0]+node.width - 8;
	var y = start[1]+8; 


	this.settingIco.contextSettingNode = node;
	// this.settingIco.setTStart([x,y]);
	this.settingIco.setStart([x,y]);

	this.settingIco.setDisplay('block');
	this.qcanvas.raiseToTop(this.settingIco);
};
Qflow.prototype.settingIcoHide = function() {
	this.settingIco.setDisplay('none');
};


Qflow.prototype.initContextCover = function() {
	var _this = this;
	//半透明层覆盖整个画布
	this.contextSettingLayer.push(this.qcanvas.qrect.rect({
			 start:[0,0],  
			 width:this.qcanvas.stage.width,
			 height:this.qcanvas.stage.height,
			 borderColor:'', 
			 fillColor:'#000', 
			 opacity:0.1,
			 drag:false, 
			 mouseup:function(){
			 	_this.contextSettingHide();
			 }
			}))
};
Qflow.prototype.contextSettingShow = function(pos) {
 
 

	//初始化contextMenu右键菜单区rect
	this.initContextMenuArea(pos);

	//修改标题框(用于定位一个input框)
	this.initModiTitleNode();

	//初始化contextMenu中的tab项
	this.initContextMenuTab();

	//17颜色块画到右击菜单区
	this.initColorRect();

	//删除按钮
	// this.initDelBtn();

	this.contextSettingLayer.setDisplay('block');

	// console.log(this.contextSettingLayer);
	// console.log(this.qcanvas);
 
}; 
Qflow.prototype.initDelBtn = function() {
	var _this = this;
	var ele = this.contextSettingLayer.elements[1];

	this.contextSettingLayer.push(
		this.qcanvas.qrect.rect({
			start:[ele.start[0]+ele.width-70,ele.start[1]+ele.height-40],
			width:60,
			height:30,
			fillColor:'#fff',
			drag:false,  
			mouseup:function(){
				//删除操作
				_this.delNode();

				_this.contextSettingHide();
			}
		}),
		this.qcanvas.qtext.text({
			text:'删除',
			start:[ele.start[0]+ele.width-40,ele.start[1]+ele.height-25],
			fontSize:'12px',
			color:'#000',
			pointerEvent:'none'
		})
	);

};
Qflow.prototype.modiTitle = function(v) {
	// console.log(this.modiTitleObj);
	if(this.modiTitleObj){
		this.modiTitleObj.setText(v);
	}
 

	var jsonObj = this.getJsonObj(this.contextSettingNode.nodeId);
	jsonObj.text = v;

 	var bgRect = this.getNodeObj(this.contextSettingNode.nodeId);



 	//根据内容 动态改变input位置和宽度
 	var textPolyPoints = this.modiTitleObj.polyPoints();
 	// console.log(textPolyPoints);
 	var tmp = this.modiTitleObj.formatText.call(this,this.modiTitleObj);

 	var w = Math.max.apply(null,tmp.width);
 	w = w>bgRect.width?w:bgRect.width;
	var start = this.qcanvas.isFun(bgRect.start)?bgRect.start():bgRect.start;


 	var x = w > bgRect.width?(start[0]-(w - bgRect.width)*0.5):start[0];
 

 	var d = document.getElementById('titleInput');
 	d.style.width = w+'px';
 	d.style.left = x+'px';


     

};
Qflow.prototype.initModiTitleNode = function() {


	var rectJsonObj = this.getJsonObj(this.contextSettingNode.id);
	// console.log(rectJsonObj);

	var ele = this.contextSettingLayer.elements[0];
	var x = ele.start[0]+10;
	var y = ele.start[1]+10;
	var w = ele.width - 20;
	var h = 30;

	// this.contextSettingLayer.push(this.qcanvas.qrect.rect({
	// 		start:[x,y],
	// 		width:w,
	// 		height:h,
	// 		fillColor:'#fff',
	// 		drag:false,
	// 		pointerEvent:'none'
	// 	}));

	

	// var d = document.getElementById('titleInput');
	// d.style.left = x+'px';
	// d.style.top = y+'px';
	// d.style.width = rectJsonObj.nodeType =='container'? w * 0.5+'px':w+'px';

	// d.style.height = h+'px';
	// d.style.display = 'block';
 

	// if(rectJsonObj.attr && rectJsonObj.attr.titleId){
	// 	this.modiTitleObj = this.getNodeObj(rectJsonObj.attr.titleId);

	// 	d.value = this.modiTitleObj.text;
	// }	

	//显示容器列的input框
	if(rectJsonObj.nodeType == 'container'){

		this.contextSettingLayer.push(this.qcanvas.qtext.text({
			start:[x+10,y+120],
			text:'列:',
			color:'#000'
		}))


		var c = document.getElementById('containerGridColumn');
		c.style.left = x+30+'px';
		c.style.top = y+105+'px';
		c.style.width = w-30+'px';
		c.style.height = h+'px';
		c.style.display = 'block';

		c.value = rectJsonObj.grid[1];

	}
};
Qflow.prototype.contextSettingHide = function() {
	var _this = this;

	this.contextSettingNode = null;
	// this.modiTitleObj = null;
	this.contextSettingLayer.setDisplay('none'); 

	var d = document.getElementById('titleInput'); 
	var c = document.getElementById('containerGridColumn');
	d.style.display = 'none';
	c.style.display = 'none';




	//保留每一个半透明覆盖层对象 下次弹出右键菜单 内容重新初始化
	// this.contextSettingLayer.elements.length == 1;
	// var tmp = [];
	// for (var i = 1; i < this.contextSettingLayer.elements.length; i++) {
	// 	tmp.push(this.contextSettingLayer.elements[i]);
	// }
	// tmp.forEach(function(item){
	// 	_this.contextSettingLayer.removeEle(item);
	// })

	this.contextSettingLayer.destroy();


	// console.log(this.contextSettingLayer);
	// console.log(this.qcanvas);

	
};

Qflow.prototype.initColorRect = function() {
	var _this = this;
	var disTop = 30;
	var padding = 10;
	var rectW = 20;
	var rectH = 20;

	var tmp = this.contextSettingLayer.elements[0];


	//暂时排4行5列 
	var areaPosition = [
		{
			x:tmp.start[0]+10,
			y:tmp.start[1]+disTop
		},
		{
			x:tmp.start[0]+tmp.width-10,
			y:tmp.start[1]+tmp.height-10
		}
	];

	var pos = this.childPositionByRow(4,6,areaPosition, rectW,rectH);

	var color = [];
	for(var i in this.colorRect){
		color.push(this.colorRect[i]);
	}

	for (var i = 0; i < color.length; i++) {
		this.contextSettingLayer.push(this.qcanvas.qrect.rect({
			start:[pos[i].x,pos[i].y],
			width:rectW,
			height:rectH,
			fillColor:color[i],
			drag:false,
			mouseup:function(){

				if(_this.contextAimAttr == 'color'){
					//设置节点标题颜色
					_this.updateNodeTitleColor(this.fillColor);


				}else{

					_this.contextSettingNode[_this.contextAimAttr] = this.fillColor;
					 
				}

					//更新json数据相关属性值
					_this.updateInitDataAttr(this.fillColor);


			}
		}))
	}
};
Qflow.prototype.updateNodeTitleColor = function(v) {

	var _this = this;

	//第一步 找到标题的id
	var getTitleNodeJSON = function(){ 

		var tmp = _this.options.initData.node.filter(function(item){
			return item.nodeId == _this.contextSettingNode.id;
		})

		if(tmp.length>0){
			return tmp[0];
		}else{
			console.log('没有找到');
			//如果没有取到  那就是在子项里
			var tmp;
			_this.options.initData.node.forEach(function(item){
				if(item.nodeType == 'container'){
					for (var i = 0; i < item.child.length; i++) {
						if(item.child[i].nodeId == _this.contextSettingNode.id){
							tmp = item.child[i];
							break;
						}
					}
				}
			})

			return tmp;
		}
	} 
 	
 	var titleJSON = getTitleNodeJSON();

	var tmp = this.qnodes.filter(function(item){
		return item.id == titleJSON.attr.titleId;
	})
 
	if(tmp.length>0){
		tmp[0][_this.contextAimAttr] = v;
	}
	 
};


Qflow.prototype.updateInitDataAttr = function(v) {

	var _this = this;
	var getTitleNodeJSON = function(){ 

		var tmp = _this.options.initData.node.filter(function(item){
			return item.nodeId == _this.contextSettingNode.id;
		})

		if(tmp.length>0){
			return tmp[0];
		}else{
			console.log('没有找到');
			//如果没有取到  那就是在子项里
			var tmp;
			_this.options.initData.node.forEach(function(item){
				if(item.nodeType == 'container'){
					for (var i = 0; i < item.child.length; i++) {
						if(item.child[i].nodeId == _this.contextSettingNode.id){
							tmp = item.child[i];
							break;
						}
					}
				}
			})

			return tmp;
		}
	} 


	var titleNodeJSON = getTitleNodeJSON();
	titleNodeJSON.attr[_this.contextAimAttr] = v;		


};

Qflow.prototype.initContextMenuTab = function() {
	var _this = this;
	var tmp = this.contextSettingLayer.elements[0];

	var textArr = [
		{text:'边框颜色', aimAttr:'borderColor'},
		{text:'背景颜色', aimAttr:'fillColor'},
		{text:'文字颜色', aimAttr:'color'},
	];



	textArr.forEach(function(item,index){
		var x = tmp.start[0]+index*(200/(textArr.length)) + 200/(textArr.length)*0.5;

		if(index==0){
			_this.contextAimAttr = item.aimAttr
		}


		var c = _this.qcanvas.qtext.text({
			text:item.text,
			start:[x,tmp.start[1]+15],

			color:index==0?'#000':'#ccc',
			aimAttr:item.aimAttr,
			drag:false,
			mouseup:function(){   
				var _self = this; 
				_this.contextSettingLayer.elements.forEach(function(item){

					if(item.TYPE == "text"){
						item.color = '#ccc';

						if(item.id == _self.id){ 
							_this.contextAimAttr = item.aimAttr;
							item.color = '#000';
						}
					}

				}) 
			}
		});


		_this.contextSettingLayer.push(c);
	})
	
};
Qflow.prototype.initContextMenuArea = function(pos) {
	var _this = this; 

	//右击显示的菜单块 
	this.contextSettingLayer.push(this.qcanvas.qrect.rect({
		start:[pos.x,pos.y],
		width:200,
		height:200,
		borderColor:'',
		fillColor:'yellow',
		drag:false
	}));
	
};
Qflow.prototype.getContainerNodes = function() {
	var containerNode = [];
	if(this.options.initData.node !== null &&
 		this.options.initData.node.length>0
 		){
		containerNode = this.options.initData.node.filter(function(item){
			return item.nodeType == 'container';
		})
	}

	return containerNode;
};
Qflow.prototype.getChildAreaPosition = function(containerNode) {
	var titlePosition = containerNode.attr.titlePosition;

	var startPlaceHolderX = 0;
	var startPlaceHolderY = 0;
	var endPlaceHolderX = 0;
	var endPlaceHolderY = 0;
	if(titlePosition == 'top-center'){
		startPlaceHolderY += (this.containerTitleHeight+this.containerPadding);
	}


	return [
		{
			x:containerNode.x + startPlaceHolderX + this.containerChildMargin,
			y:containerNode.y + startPlaceHolderY
		},
		{
			x:containerNode.x + containerNode.width - endPlaceHolderX,
			y:containerNode.y + containerNode.height - endPlaceHolderY
		}
	]


};

Qflow.prototype.childPositionByRow = function(row,column,areaPosition,w,h) {
	var tmp = [];

	for (var i = 0; i < row; i++) {
		for (var j = 0; j < column; j++) {
			if(tmp[i]){
				tmp[i].push({
					x:areaPosition[0].x+j*w+j*this.containerChildMargin,
					y:areaPosition[0].y+i*h+i*this.containerChildMargin
				})
			}else{
				tmp[i]=[{
					x:areaPosition[0].x+j*w+j*this.containerChildMargin,
					y:areaPosition[0].y+i*h+i*this.containerChildMargin
				}];
			}
		}
	}

	var t = [];
	tmp.forEach(function(item){
		t = t.concat(item);
	}) 

	return t;
};

Qflow.prototype.getChildPosition = function(containerNode,areaPosition) {
	var _this = this;

	//子项要分多少个行列方式画到container中
	var grid = containerNode.grid;
	var child = containerNode.child;
	var childNum = containerNode.child.length;
	var row = grid[0];
	var column = grid[1];
	var areaWidth  = areaPosition[1].x - areaPosition[0].x;
	var areaHeight = areaPosition[1].y - areaPosition[0].y

	//先行后列
	// var childNodeWidth = (areaWidth - (column-1)*this.containerChildMargin)/column;
	// var childNodeHeight = (areaHeight - (row-1)*this.containerChildMargin)/row;

	// console.log(childNodeWidth);

	// //限制一下最小高度
	// childNodeHeight = childNodeHeight<this.childNodeHeight?this.childNodeHeight:childNodeHeight;

	// console.log(row,column,areaPosition,childNodeWidth,childNodeHeight);

	//先把child按行 进行分组 计算坐标
	// return this.childPositionByRow(row,column,areaPosition,childNodeWidth,childNodeHeight);
	return this.childPositionByRow(row,column,areaPosition,this.childNodeWidth,this.childNodeHeight);


	
};
Qflow.prototype.initChildPosition = function() {
	//所有nodeType == 'container'的节点的子项生成x,y
	if(this.options.initData === null){
		return;
	}

	var containerNodes = this.getContainerNodes();
	

	//通过container的grid的属性计算子项位置 
	//注意容器有标题时 标题也需要占一定空间
	//标题位置:
	//top-left top-center top-right
	//left-top left-center left-bottom
	//right-top right-center right-bottom
	//bottom-left bottom-center bottom-right
	for (var i = 0; i < containerNodes.length; i++) {

		//先实现top-center
		//可以摆放子项的区域位置[左上角开始位置，右下角结束位置]
		var childAreaPosition = this.getChildAreaPosition(containerNodes[i]);

		//可以摆放子项的区域位置 计算出各个格子的坐标
		var childPosition = this.getChildPosition(containerNodes[i],childAreaPosition);

		//把格子坐标添加到ettr里
		containerNodes[i].attr.gridPosition = childPosition;
	}


	
};
Qflow.prototype.reSizeByInitData = function() {

	if(this.options.initData === null){
		return;
	}
 	
 	//找出横纵坐标最大值 判断画布是否可以放得下 
 	if(this.options.initData.node !== null &&
 		this.options.initData.node.length>0
 		){

	    //取以下两个组的最大值
	    //x+元素宽
	    //y+元素高
	    var _this = this,x=[],y=[];
		this.options.initData.node.map(function(item){

			if(item.nodeType == 'container'){
				x.push(item.x+item.width);
				y.push(item.y+item.height);
			}else{

				x.push(item.x+_this.childNodeWidth);
				y.push(item.y+_this.childNodeHeight);
			}
		})

		var maxX = Math.max.apply(null,x);
		var maxY = Math.max.apply(null,y); 

	 	this.options.width = maxX>=this.options.width?maxX:this.options.width;
	 	this.options.height = maxY>=this.options.height?maxY:this.options.height; 
 	}
};
Qflow.prototype.getNodeIdFromJsonById = function(id) {

	var tmp = null;
	//搜索父 子项
	for (var i = 0; i < this.options.initData.node.length; i++) {

		if(this.options.initData.node[i].id == id){
			tmp = this.options.initData.node[i].nodeId;
			break;
		}
		if(this.options.initData.node[i].child){
			for (var j = 0; j < this.options.initData.node[i].child.length; j++) {
				if(this.options.initData.node[i].child[j].id == id){
					tmp = this.options.initData.node[i].child[j].nodeId;
					break;
				}
			} 
		}
		
	}

	return tmp;
};
Qflow.prototype.calcLineStartPos = function(A,B,nodeId) {
	var _this = this;
	// console.log(startNode.getRangePoints()); //8个边界点
	// 8个点的示意图
	// 0__1__2    0__1__2
	// |     |	  |     |
	// 7 节点 3	  7 节点 3
	// |     |    |     |
	// 6__5__4	  6__5__4
	


	var F = function(){

		var A_center = A.centerPoints();
		var B_center = B.centerPoints();
		var A_rangePos = A.getRangePoints(); 
		var B_rangePos = B.getRangePoints(); 
 
 
		var startPos = [0,0];
	    var endPos = [0,0];


	    //第一种情况（A在下 B在上）
	    // 0__1__2    
	    // |     |	  
	    // 7  B	 3	 
	    // |     |    
	    // 6__5__4	  
	    //	  ↑
	    // 0__1__2    
	    // |     |	  
	    // 7  A  3	 
	    // |     |    
	    // 6__5__4	  
	    if(A_center.y >= B_center.y){

	        //两点节点上下没有间距
	        if(A_rangePos[0][1] <= B_rangePos[6][1]){ 

	            //A点在B的右侧
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){

	                startPos = A_rangePos[7];
	                // endPos = B_rangePos[3];

	                
	            }else if(A_rangePos[2][0] <= B_rangePos[0][0]){
	                //A点在B的左侧
	                startPos = A_rangePos[3];
	                // endPos = B_rangePos[7];

	            }else{

	                startPos = A_rangePos[1];
	                // endPos = B_rangePos[1];
	            }

	        }else{ //上下没有叠加（上下有间距）
 

	             //A点在B的右下侧
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){

	                startPos = A_rangePos[1];
	                // endPos = B_rangePos[4];

	                
	            }else if(A_rangePos[2][0] <= B_rangePos[2][0]){
	                //A点在B的左下侧
	                startPos = A_rangePos[1];
	                // endPos = B_rangePos[6];

	            }else{

	                startPos = A_rangePos[1];
	                // endPos = B_rangePos[5];
	            }
	        }
	    }else{
	        //第二种情况 （A在上 B在下）
	        // 0__1__2    
			// |     |	  
			// 7  A	 3	 
			// |     |    
			// 6__5__4	  
			//	  ↓
			// 0__1__2    
			// |     |	  
			// 7  B  3	 
			// |     |    
			// 6__5__4

	        //两点节点上下没有间距
	        if(B_rangePos[0][1]<=A_rangePos[6][1]){ 
	            //A在B的右侧
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){
	                startPos = A_rangePos[7];
	                // endPos = B_rangePos[3];

	            }else if(A_rangePos[2][0] <= B_rangePos[0][0]){
	                //A在B的左侧
	                startPos = A_rangePos[3];
	                // endPos = B_rangePos[7];

	            }else{
	                startPos = A_rangePos[5];
	                // endPos = B_center[5];
	            }

	        }else{ //上下没有叠加（上下有间距）
 

	            //A在B的右上方
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){
	                startPos = A_rangePos[5];
	                // endPos = B_rangePos[2];
	            }else if(A_rangePos[2][0] <= B_rangePos[0][0]){
	                //A在B的左上方
	                startPos = A_rangePos[5];
	                // endPos = B_rangePos[0];
	            }else{
	                startPos = A_rangePos[5];
	                // endPos = B_rangePos[1];
	            }



	        }
	    }

	    return startPos;
	}
	
	if(typeof this.lineCache['"'+nodeId+'"'] !=='undefined' &&
		typeof this.lineCache['"'+nodeId+'"'].oldStart !=='undefined'){

		if(((new Date()).getTime() - _this.lineCache['"'+nodeId+'"'].startCallTime) >300){
			_this.lineCache['"'+nodeId+'"'].startCallTime = (new Date()).getTime();
			_this.lineCache['"'+nodeId+'"'].oldStart = F();	

		}


	}else{

		if(typeof _this.lineCache['"'+nodeId+'"'] == 'undefined'){

			_this.lineCache['"'+nodeId+'"'] = {};
		}

		_this.lineCache['"'+nodeId+'"'].startCallTime = (new Date()).getTime();
		_this.lineCache['"'+nodeId+'"'].oldStart = F();

		

	}

	return _this.lineCache['"'+nodeId+'"'].oldStart; 

	
};
Qflow.prototype.calcLineEndPos = function(A,B,nodeId) {
	var _this = this; 

	// console.log(nodeId);
	
	var F = function(){

		var A_center = A.centerPoints();
		var B_center = B.centerPoints();
		var A_rangePos = A.getRangePoints(); 
		var B_rangePos = B.getRangePoints();  


		var startPos = [0,0];
	    var endPos = [0,0];


	    //第一种情况（A在下 B在上）
	    // 0__1__2    
	    // |     |	  
	    // 7  B	 3	 
	    // |     |    
	    // 6__5__4	  
	    //	  ↑
	    // 0__1__2    
	    // |     |	  
	    // 7  A  3	 
	    // |     |    
	    // 6__5__4	  
	    if(A_center.y >= B_center.y){

	        //两点节点上下没有间距
	        if(A_rangePos[0][1] <= B_rangePos[6][1]){ 

	            //A点在B的右侧
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){

	                // startPos = A_rangePos[7];
	                endPos = B_rangePos[3];

	                
	            }else if(A_rangePos[2][0] <= B_rangePos[0][0]){
	                //A点在B的左侧
	                // startPos = A_rangePos[3];
	                endPos = B_rangePos[7];

	            }else{

	                // startPos = A_rangePos[1];
	                endPos = B_rangePos[1];
	            }

	        }else{ //上下没有叠加（上下有间距） 

	             //A点在B的右下侧
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){

	                // startPos = A_rangePos[0];
	                endPos = B_rangePos[5];

	                
	            }else if(A_rangePos[2][0] <= B_rangePos[2][0]){
	                //A点在B的左下侧
	                // startPos = A_rangePos[2];
	                endPos = B_rangePos[5];

	            }else{

	                // startPos = A_rangePos[1];
	                endPos = B_rangePos[5];
	            }
	        }
	    }else{
	        //第二种情况 （A在上 B在下）
	        // 0__1__2    
			// |     |	  
			// 7  A	 3	 
			// |     |    
			// 6__5__4	  
			//	  ↓
			// 0__1__2    
			// |     |	  
			// 7  B  3	 
			// |     |    
			// 6__5__4

	        //两点节点上下没有间距
	        if(B_rangePos[0][1]<=A_rangePos[6][1]){
 

	            //A在B的右侧
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){
	                // startPos = A_rangePos[7];
	                endPos = B_rangePos[3];

	            }else if(A_rangePos[2][0] <= B_rangePos[0][0]){
	                //A在B的左侧
	                // startPos = A_rangePos[3];
	                endPos = B_rangePos[7];

	            }else{
	                // startPos = A_rangePos[5];
	                endPos = B_rangePos[5];
	            }

	        }else{ //上下没有叠加（上下有间距）


	            //A在B的右上方
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){
	                // startPos = A_rangePos[6];
	                endPos = B_rangePos[1];
	            }else if(A_rangePos[2][0] <= B_rangePos[0][0]){
	                //A在B的左上方
	                // startPos = A_rangePos[4];
	                endPos = B_rangePos[1];
	            }else{
	                // startPos = A_rangePos[5];
	                endPos = B_rangePos[1];
	            }



	        }
	    }

	    return endPos;

	}



	if(typeof this.lineCache['"'+nodeId+'"'] !=='undefined' &&
		typeof this.lineCache['"'+nodeId+'"'].oldEnd !=='undefined'){

		if(((new Date()).getTime() - _this.lineCache['"'+nodeId+'"'].endCallTime) >300){
			_this.lineCache['"'+nodeId+'"'].endCallTime = (new Date()).getTime();
			_this.lineCache['"'+nodeId+'"'].oldEnd = F();	
		}


	}else{

		if(typeof _this.lineCache['"'+nodeId+'"'] == 'undefined'){

			_this.lineCache['"'+nodeId+'"'] = {};
		}
		_this.lineCache['"'+nodeId+'"'].endCallTime = (new Date()).getTime();
		_this.lineCache['"'+nodeId+'"'].oldEnd = F();
 

	}


	return _this.lineCache['"'+nodeId+'"'].oldEnd; 
};
Qflow.prototype.calcLinePos = function(A,B,nodeId) {


	var F = function(){
		var A_center = A.centerPoints();
		var B_center = B.centerPoints();
		var A_rangePos = A.getRangePoints(); 
		var B_rangePos = B.getRangePoints();  


		var startPos = [0,0];
	    var endPos = [0,0];


	    //第一种情况（A在下 B在上）
	    // 0__1__2    
	    // |     |	  
	    // 7  B	 3	 
	    // |     |    
	    // 6__5__4	  
	    //	  ↑
	    // 0__1__2    
	    // |     |	  
	    // 7  A  3	 
	    // |     |    
	    // 6__5__4	  
	    if(A_center.y >= B_center.y){

	        //两点节点上下没有间距
	        if(A_rangePos[0][1] <= B_rangePos[6][1]){ 

	            //A点在B的右侧
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){

	                startPos = A_rangePos[7];
	                endPos = B_rangePos[3];

	                
	            }else if(A_rangePos[2][0] <= B_rangePos[0][0]){
	                //A点在B的左侧
	                startPos = A_rangePos[3];
	                endPos = B_rangePos[7];

	            }else{

	                startPos = A_rangePos[1];
	                endPos = B_rangePos[1];
	            }

	        }else{ //上下没有叠加（上下有间距） 

	             //A点在B的右下侧
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){

	                startPos = A_rangePos[1];
	                endPos = B_rangePos[5];

	                
	            }else if(A_rangePos[2][0] <= B_rangePos[2][0]){
	                //A点在B的左下侧
	                startPos = A_rangePos[1];
	                endPos = B_rangePos[5];

	            }else{

	                startPos = A_rangePos[1];
	                endPos = B_rangePos[5];
	            }
	        }
	    }else{
	        //第二种情况 （A在上 B在下）
	        // 0__1__2    
			// |     |	  
			// 7  A	 3	 
			// |     |    
			// 6__5__4	  
			//	  ↓
			// 0__1__2    
			// |     |	  
			// 7  B  3	 
			// |     |    
			// 6__5__4

	        //两点节点上下没有间距
	        if(B_rangePos[0][1]<=A_rangePos[6][1]){
 

	            //A在B的右侧
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){
	                startPos = A_rangePos[7];
	                endPos = B_rangePos[3];

	            }else if(A_rangePos[2][0] <= B_rangePos[0][0]){
	                //A在B的左侧
	                startPos = A_rangePos[3];
	                endPos = B_rangePos[7];

	            }else{
	                startPos = A_rangePos[5];
	                endPos = B_rangePos[5];
	            }

	        }else{ //上下没有叠加（上下有间距）


	            //A在B的右上方
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){
	                startPos = A_rangePos[5];
	                endPos = B_rangePos[1];
	            }else if(A_rangePos[2][0] <= B_rangePos[0][0]){
	                //A在B的左上方
	                startPos = A_rangePos[5];
	                endPos = B_rangePos[1];
	            }else{
	                startPos = A_rangePos[5];
	                endPos = B_rangePos[1];
	            }



	        }
	    }

	    return {
	    	start:startPos,
	    	end:endPos
	    }

		
	}

	if(typeof this.lineCache['"'+nodeId+'"'] !=='undefined'){

		if(((new Date()).getTime() - this.lineCache['"'+nodeId+'"'].callTime) >300){

			this.lineCache['"'+nodeId+'"'].callTime = (new Date()).getTime();
			this.lineCache['"'+nodeId+'"'].position = F();
		}


	}else{

		this.lineCache['"'+nodeId+'"'] = {
			callTime:(new Date()).getTime(),
			position:F()
		}

	}

	return this.lineCache['"'+nodeId+'"'].position;
	// return F();

};
Qflow.prototype.solveLink = function() {
	var _this = this;
	this.options.initData.link.forEach(function(item){

		item.fromNode =  _this.getNodeObj(_this.getNodeIdFromJsonById(item.fromId));
		item.toNode = _this.getNodeObj(_this.getNodeIdFromJsonById(item.toId));

		if(typeof item.attr.color == 'undefined'){

			item.attr.color = _this.lineColor;
		}

	})
};
Qflow.prototype.caleHandler1 = function() {
	 if(typeof this.caleTime1 == 'undefined' ||
            (typeof this.caleTime1 !=='undefined') && 
            ((new Date()).getTime()-this.caleTime1>1000)
        ){


            var start = this.start();
            var end = this.end();
            var returnHandler1 = (function(){
                //A
                // |
                //h1 \ h2
                //   ↓
                //   B
                if(start[0]<end[0] && start[1]<=end[1]){
                    //h1: [Math.abs(start[0] - end[0])*0.25+start[0],Math.abs(start[1] - end[1])*0.75+start[1]];
                    //h2: [Math.abs(start[0] - end[0])*0.75+start[0],Math.abs(start[1] - end[1])*0.25+start[1]];

                    return [Math.abs(start[0] - end[0])*0.25+start[0],Math.abs(start[1] - end[1])*0.75+start[1]];
                }
                //  A
                //  |
                //h2/h1
                // ↓
                // B
                if(start[0]>=end[0] && start[1]<=end[1]){
                    //h1:[Math.abs(start[0] - end[0])*0.75+end[0],Math.abs(start[1] - end[1])*0.75+start[1]]
                    //h2:[Math.abs(start[0] - end[0])*0.25+end[0],Math.abs(start[1] - end[1])*0.25+start[1]]
                    return [Math.abs(start[0] - end[0])*0.75+end[0],Math.abs(start[1] - end[1])*0.75+start[1]]
                }

                // B
                // ↑
                //h1\h2
                //  |
                //  A
                if(start[0]>end[0] && start[1]>=end[1]){
                    //h1:[Math.abs(start[0] - end[0])*0.25+end[0],Math.abs(start[1] - end[1])*0.75+end[1]];
                    //h2:[Math.abs(start[0] - end[0])*0.75+end[0],Math.abs(start[1] - end[1])*0.25+end[1]];
                    return [Math.abs(start[0] - end[0])*0.25+end[0],Math.abs(start[1] - end[1])*0.75+end[1]];
                }

                //   B
                //   ↑
                // h2/h1
                //  |
                //  A
                if(start[0]<=end[0] && start[1]>=end[1]){
                    //h1:[Math.abs(start[0] - end[0])*0.75+start[0],Math.abs(start[1] - end[1])*0.75+end[1]];
                    //h2:[Math.abs(start[0] - end[0])*0.25+start[0],Math.abs(start[1] - end[1])*0.25+end[1]];
                    return [Math.abs(start[0] - end[0])*0.75+start[0],Math.abs(start[1] - end[1])*0.75+end[1]];
                }

                
            })()


            // var x = Math.abs(start[0] - end[0])*(start[0] > end[0]?0.75:0.25)+Math.min.call(null,start[0],end[0]);
            // var y = Math.abs(start[1] - end[1])*0.75+Math.min.call(null,start[1],end[1]);
            // console.log(x,y);
            this.oldHandler1 = returnHandler1;

            this.caleTime1 = (new Date()).getTime();

            // console.log('1隔段时间再执行 降低执行频率')

            return this.oldHandler1;

        }else{ 

            return this.oldHandler1;
        }
};
Qflow.prototype.caleHandler2 = function() {
	if(typeof this.caleTime2 == 'undefined' ||
            (typeof this.caleTime2 !=='undefined') && 
            ((new Date()).getTime()-this.caleTime2>1000)
        ){


            var start = this.start();
            var end = this.end();
             var returnHandler2 = (function(){
                //A
                // |
                //h1 \ h2
                //   ↓
                //   B
                if(start[0]<end[0] && start[1]<=end[1]){
                    //h1: [Math.abs(start[0] - end[0])*0.25+start[0],Math.abs(start[1] - end[1])*0.75+start[1]];
                    //h2: [Math.abs(start[0] - end[0])*0.75+start[0],Math.abs(start[1] - end[1])*0.25+start[1]];

                    return [Math.abs(start[0] - end[0])*0.75+start[0],Math.abs(start[1] - end[1])*0.25+start[1]];
                }
                //  A
                //  |
                //h2/h1
                // ↓
                // B
                if(start[0]>=end[0] && start[1]<=end[1]){
                    //h1:[Math.abs(start[0] - end[0])*0.75+end[0],Math.abs(start[1] - end[1])*0.75+start[1]]
                    //h2:[Math.abs(start[0] - end[0])*0.25+end[0],Math.abs(start[1] - end[1])*0.25+start[1]]
                    return [Math.abs(start[0] - end[0])*0.25+end[0],Math.abs(start[1] - end[1])*0.25+start[1]]
                }

                // B
                // ↑
                //h1\h2
                //  |
                //  A
                if(start[0]>end[0] && start[1]>end[1]){
                    //h1:[Math.abs(start[0] - end[0])*0.25+end[0],Math.abs(start[1] - end[1])*0.75+end[1]];
                    //h2:[Math.abs(start[0] - end[0])*0.75+end[0],Math.abs(start[1] - end[1])*0.25+end[1]];
                    return [Math.abs(start[0] - end[0])*0.75+end[0],Math.abs(start[1] - end[1])*0.25+end[1]];
                }

                //   B
                //   ↑
                // h2/h1
                //  |
                //  A
                if(start[0]<=end[0] && start[1]>end[1]){
                    //h1:[Math.abs(start[0] - end[0])*0.75+start[0],Math.abs(start[1] - end[1])*0.75+end[1]];
                    //h2:[Math.abs(start[0] - end[0])*0.25+start[0],Math.abs(start[1] - end[1])*0.25+end[1]];
                    return [Math.abs(start[0] - end[0])*0.25+start[0],Math.abs(start[1] - end[1])*0.25+end[1]];
                }

                
            })()




           // var x = Math.abs(start[0] - end[0])*(start[0] > end[0]?0.25:0.75)+Math.min.call(null,start[0],end[0]);
           // var y = Math.abs(start[1] - end[1])*0.25+Math.min.call(null,start[1],end[1]);
            // console.log(x,y);
            this.oldHandler2 = returnHandler2;

            this.caleTime2 = (new Date()).getTime();

            // console.log('隔段时间再执行 降低执行频率')

            return this.oldHandler2;

        }else{

            return this.oldHandler2;
        } 
};
Qflow.prototype.caleQuadraticCurveHandler = function() {
	if(typeof this.caleTime1 == 'undefined' ||
            (typeof this.caleTime1 !=='undefined') && 
            ((new Date()).getTime()-this.caleTime1>1000)
        ){


            var start = this.start();
            var end = this.end();
            var returnHandler1 = (function(){
                //A
                // |
                //h1 \ h2
                //   ↓
                //   B
                if(start[0]<end[0] && start[1]<=end[1]){
                    //h1: [Math.abs(start[0] - end[0])*0.25+start[0],Math.abs(start[1] - end[1])*0.75+start[1]];
                    //h2: [Math.abs(start[0] - end[0])*0.75+start[0],Math.abs(start[1] - end[1])*0.25+start[1]];

                    return [Math.abs(start[0] - end[0])*0.25+start[0],Math.abs(start[1] - end[1])*0.75+start[1]];
                }
                //  A
                //  |
                //h2/h1
                // ↓
                // B
                if(start[0]>=end[0] && start[1]<=end[1]){
                    //h1:[Math.abs(start[0] - end[0])*0.75+end[0],Math.abs(start[1] - end[1])*0.75+start[1]]
                    //h2:[Math.abs(start[0] - end[0])*0.25+end[0],Math.abs(start[1] - end[1])*0.25+start[1]]
                    return [Math.abs(start[0] - end[0])*0.75+end[0],Math.abs(start[1] - end[1])*0.75+start[1]]
                }

                // B
                // ↑
                //h1\h2
                //  |
                //  A
                if(start[0]>end[0] && start[1]>=end[1]){
                    //h1:[Math.abs(start[0] - end[0])*0.25+end[0],Math.abs(start[1] - end[1])*0.75+end[1]];
                    //h2:[Math.abs(start[0] - end[0])*0.75+end[0],Math.abs(start[1] - end[1])*0.25+end[1]];
                    return [Math.abs(start[0] - end[0])*0.75+end[0],Math.abs(start[1] - end[1])*0.25+end[1]];
                }

                //   B
                //   ↑
                // h2/h1
                //  |
                //  A
                if(start[0]<=end[0] && start[1]>=end[1]){
                    //h1:[Math.abs(start[0] - end[0])*0.75+start[0],Math.abs(start[1] - end[1])*0.75+end[1]];
                    //h2:[Math.abs(start[0] - end[0])*0.25+start[0],Math.abs(start[1] - end[1])*0.25+end[1]];
                    return [Math.abs(start[0] - end[0])*0.25+start[0],Math.abs(start[1] - end[1])*0.25+end[1]];
                }

                
            })()


            // var x = Math.abs(start[0] - end[0])*(start[0] > end[0]?0.75:0.25)+Math.min.call(null,start[0],end[0]);
            // var y = Math.abs(start[1] - end[1])*0.75+Math.min.call(null,start[1],end[1]);
            // console.log(x,y);
            this.oldQuadraticCurveHandler = returnHandler1;

            this.caleTime1 = (new Date()).getTime();

            // console.log('1隔段时间再执行 降低执行频率')

            return this.oldQuadraticCurveHandler;

        }else{ 

            return this.oldQuadraticCurveHandler;
        }
};
Qflow.prototype.initLink = function() {
	var _this = this;
	this.options.initData.link.forEach(function(item){

	if(typeof item.attr.type !='undefined'){  

		switch (item.attr.type){
			case 'bezierCurve': //三次曲线
				var tmp = _this.qcanvas.qbezierCurve.bezierCurve({
					start:function(){
						var tmp = _this.calcLinePos(item.fromNode,item.toNode,this.id);

						return tmp.start;
					},
					end:function(){
						var tmp = _this.calcLinePos(item.fromNode,item.toNode,this.id);

						return tmp.end;
					}, 
					handler1:_this.caleHandler1,
					handler2:_this.caleHandler2,
					width:1,
					// pointerEvent:'none',
					drag:false,
					like:item.attr.like,
					color:item.attr.color?item.attr.color:this.lineColor,
					withText:item.attr.text,
					mouseup:function(e,pos){
						//右击显示菜单
						if(e.button == '2'){ 

							_this.contextLineMenuNode = this;

							_this.qcanvas.raiseToTop(_this.contextLineMenuLayer);
							_this.initLineMenu(pos);
							_this.lineMenuLayerShow();
		 
							_this.contextSettingHide();

						}

					}
				});
			break;
			case 'quadraticCurve': //二次曲线
				var tmp = _this.qcanvas.qquadraticCurve.quadraticCurve({
					start:function(){
						var tmp = _this.calcLinePos(item.fromNode,item.toNode,this.id);

						return tmp.start;
					},
					end:function(){
						var tmp = _this.calcLinePos(item.fromNode,item.toNode,this.id);

						return tmp.end;
					}, 
					handler:_this.caleQuadraticCurveHandler, 
					width:1,
					// pointerEvent:'none',
					drag:false,
					like:item.attr.like,
					color:item.attr.color?item.attr.color:this.lineColor,
					withText:item.attr.text,
					mouseup:function(e,pos){
						//右击显示菜单
						if(e.button == '2'){ 

							_this.contextLineMenuNode = this;

							_this.qcanvas.raiseToTop(_this.contextLineMenuLayer);
							_this.initLineMenu(pos);
							_this.lineMenuLayerShow();
				
							_this.contextSettingHide();

						}

					}
				});
			break;
			case 'line':
				var tmp = _this.qcanvas.qline.line({  //直线
					start:function(){
						var tmp = _this.calcLinePos(item.fromNode,item.toNode,this.id);

						return tmp.start;
					},
					end:function(){
						var tmp = _this.calcLinePos(item.fromNode,item.toNode,this.id);

						return tmp.end;
					}, 
					width:1,
					// pointerEvent:'none',
					drag:false,
					like:item.attr.like,
					color:item.attr.color?item.attr.color:this.lineColor,
					withText:item.attr.text,
					mouseup:function(e,pos){
						//右击显示菜单
						if(e.button == '2'){ 

							_this.contextLineMenuNode = this;

							_this.qcanvas.raiseToTop(_this.contextLineMenuLayer);
							_this.initLineMenu(pos);
							_this.lineMenuLayerShow();
				
							_this.contextSettingHide();

						}

					}
				});

			break;
			case "foldLine1":  //横向折线
			case "foldLine2":  //竖向折线
				//折线是三条线 所以这里返回一个数组
				var tmp = _this.createFoldLine(item.fromNode,item.toNode,item.attr);
			break;
		}


		
		
	}else{

		var tmp = _this.qcanvas.qline.line({  //直线
			start:function(){
				var tmp = _this.calcLinePos(item.fromNode,item.toNode,this.id);

				return tmp.start;
			},
			end:function(){
				var tmp = _this.calcLinePos(item.fromNode,item.toNode,this.id);

				return tmp.end;
			}, 
			width:1,
			// pointerEvent:'none',
			drag:false,
			like:item.attr.like,
			color:item.attr.color?item.attr.color:this.lineColor,
			withText:item.attr.text,
			mouseup:function(e,pos){
				//右击显示菜单
				if(e.button == '2'){ 

					_this.contextLineMenuNode = this;

					_this.qcanvas.raiseToTop(_this.contextLineMenuLayer);
					_this.initLineMenu(pos);
					_this.lineMenuLayerShow();
 
					_this.contextSettingHide();

				}

			}
		});


	}


		if(_this.qcanvas.isArr(tmp)){
			item.lineId = tmp[1].id;
			_this.lineLayer.push(tmp[0],tmp[1],tmp[2]);

		}else{

			item.lineId = tmp.id;
			_this.lineLayer.push(tmp);
		}
		// _this.lineCache[tmp.id] = tmp;


	})
	
}; 

/**
 * 计算折线的位置
 * @return {[type]} [description]
 */
Qflow.prototype.caleFoldLinePosition = function(fromNode,toNode,attr,id){
		var tmp = this.calcLinePos(fromNode,toNode,id);
		var start = tmp.start;
        var end = tmp.end;  

        var percent = attr.disPercent?attr.disPercent:0.5;

        if(attr.type == 'foldLine1'){
			//模向模式
	        return {
	            'l1':function(){return [start,[start[0],(end[1]-start[1])*percent+start[1]]]},
	            'l2':function(){return [[start[0],(end[1]-start[1])*percent+start[1]],[end[0],(end[1]-start[1])*percent+start[1]]]},
	            'l3':function(){return [[end[0],(end[1]-start[1])*percent+start[1]],end]}
	        }
        }

        if(attr.type == 'foldLine2'){
        	//竖向模式
        	return {
                'l1':function(){return [start,[(end[0]-start[0])*percent+start[0],start[1]]]},
                'l2':function(){return [[(end[0]-start[0])*percent+start[0],start[1]],[(end[0]-start[0])*percent+start[0],end[1]]]},
                'l3':function(){return [[(end[0]-start[0])*percent+start[0],end[1]],end]}
            }
        }
 
       
}

/**
 * 创建折线
 * @param  {[type]} fromNode [description]
 * @param  {[type]} toNode   [description]
 * @param  {[type]} lineId   [description]
 * @return {[type]}          [description]
 */
Qflow.prototype.createFoldLine = function(fromNode,toNode,attr){
	// var foldLinePostions = this.caleFoldLinePosition(fromNode,toNode);

	// console.log(foldLinePostions.l1());
	// console.log(foldLinePostions.l2());
	// console.log(foldLinePostions.l3());
	var _this = this;
	var tmp = null;

	var l1 =  _this.qcanvas.qline.line({
	        start:function(){
	            var points = tmp === null?_this.caleFoldLinePosition(fromNode,toNode,attr,this.id):tmp;
	            // var points = _this.caleFoldLinePosition(fromNode,toNode,attr);

	            var t = points['l1']();
	            return t[0];
	        },
	        end:function(){
	            var points = tmp === null?_this.caleFoldLinePosition(fromNode,toNode,attr,this.id):tmp;
	            // var points = _this.caleFoldLinePosition(fromNode,toNode,attr);

	            var t = points['l1']();
	            return t[1];
	        },
	        pointerEvent:'none',
	        width:1,
			like:_this.line1Like[attr.like],
			color:attr.color?attr.color:_this.lineColor,
	    })
	var l3 = _this.qcanvas.qline.line({
	        start:function(){
	            var points = tmp === null?_this.caleFoldLinePosition(fromNode,toNode,attr,this.id):tmp;
	            // var points = _this.caleFoldLinePosition(fromNode,toNode,attr);

	            var t = points['l3']();
	            return t[0];
	        },
	        end:function(){
	            var points = tmp === null?_this.caleFoldLinePosition(fromNode,toNode,attr,this.id):tmp;
	            // var points = _this.caleFoldLinePosition(fromNode,toNode,attr);

	            var t = points['l3']();
	            return t[1];
	        },
	        pointerEvent:'none',
	        width:1,
	        like:_this.line3Like[attr.like],
			color:attr.color?attr.color:_this.lineColor,
	    })
	var l2 = _this.qcanvas.qline.line({
	        start:function(){
	            var points = tmp === null?_this.caleFoldLinePosition(fromNode,toNode,attr,this.id):tmp;
	            // var points = _this.caleFoldLinePosition(fromNode,toNode,attr);

	            var t = points['l2']();
	            return t[0];
	        },
	        end:function(){
	            var points = tmp === null?_this.caleFoldLinePosition(fromNode,toNode,attr,this.id):tmp;
	            // var points = _this.caleFoldLinePosition(fromNode,toNode,attr);

	            var t = points['l2']();
	            return t[1];
	        },
	        // pointerEvent:'none',
	        drag:false,
	        width:1,
			like:_this.line2Like[attr.like],
			color:attr.color?attr.color:_this.lineColor,
			withText:attr.text,

			//把l1和l2做个关联
			relationLineId:[l1.id,l3.id],
			mouseup:function(e,pos){
							//右击显示菜单
							if(e.button == '2'){ 

								_this.contextLineMenuNode = this;

								_this.qcanvas.raiseToTop(_this.contextLineMenuLayer);
								_this.initLineMenu(pos);
								_this.lineMenuLayerShow();
					
								_this.contextSettingHide();

							}

						}

	    })
   

    return [l1,l2,l3];

}
Qflow.prototype.updateInitData = function(obj,jsonObj) {
	jsonObj.x = obj.start[0];
	jsonObj.y = obj.start[1];


	if(jsonObj.nodeType == 'container'){

		//降低执行的频度
		// if((typeof jsonObj.attr.callTime != 'undefined' && 
		// 	((new Date()).getTime() - jsonObj.attr.callTime >200)) || 
		// 	typeof jsonObj.attr.callTime == 'undefined'
		// 	){

			//每一步 更新attr.gridPosition 
			//先实现top-center
			//可以摆放子项的区域位置[左上角开始位置，右下角结束位置]
			var childAreaPosition = this.getChildAreaPosition(jsonObj);

			//可以摆放子项的区域位置 计算出各个格子的坐标
			var childPosition = this.getChildPosition(jsonObj,childAreaPosition);

			//把格子坐标添加到ettr里
			jsonObj.attr.gridPosition = childPosition;

			// jsonObj.attr.callTime = (new Date()).getTime();
		// }

		

		//第二步 更新子项位置 
		// jsonObj.childNodes && jsonObj.childNodes.forEach(function(item,index){
		// 	item.start = [childPosition[index].x,childPosition[index].y]; 
		// })
	}
 



};
Qflow.prototype.initNodeTitle = function(jsonObj,nodeObj) {
	var _this = this;
	var t = this.qcanvas.qtext.text({
			start:function(){
				var start = _this.qcanvas.isFun(nodeObj.start)?nodeObj.start():nodeObj.start;
				return [start[0]+nodeObj.width*0.5,start[1]+nodeObj.height*0.5]
				// return [tmp[0].start[0]+tmp[0].width*0.5,tmp[0].start[1]+tmp[0].height*0.5];
			},
			text:jsonObj.text,
			pointerEvent:'none',
			color:jsonObj.attr && jsonObj.attr.color?jsonObj.attr.color:_this.textColor,
			fontSize:'12px',
			ownerId:jsonObj.nodeId

		})

	this.qnodes.push(t);
	jsonObj.attr.titleId = t.id;


 
};
/**
 * 给容器创建标题节点
 * @param  {[type]} obj  [json数据对象]
 * @param  {[type]} qobj [容器节点对象]
 * @return {[type]}      [description]
 */
Qflow.prototype.initContainerTitle = function(obj,qobj) {
	var _this = this;
	 

		var t = this.qcanvas.qtext.text({
				start:function(){
					return [qobj.start[0]+qobj.width*0.5,qobj.start[1]+_this.containerTitleHeight*0.5];
				},
				text:obj.text,
				pointerEvent:'none',
				color:obj.attr?obj.attr.color:'#000',
				fontSize:'12px',
				ownerId:obj.nodeId
			})

		this.qnodes.push(t);

		//标题节点的id记到container节点json数据上
		obj.attr.titleId = t.id;
 
};
Qflow.prototype.drawNode = function(parentNode,nodes) { 
 
	var _this = this;
	for (var i = 0; i < nodes.length; i++) {

		if(parentNode!== null){

			//创建某个容器里包含的节点
			_this.createChildsOfContainer(parentNode,nodes[i],i);
 
		}else{

			if(nodes[i].nodeType =='tip'){
				_this.createTipNode(nodes[i]);

			}else{

				//创建容器或节点（顶级的平行数据）
				_this.createContainerOrNode(nodes[i]); 

			}

		}
	}
};
/**
 * 创建container的子项
 * @param  {[type]} parentNode [description]
 * @param  {[type]} jsonObj    [子项json数据]
 * @param  {[type]} index      [子项在container里的索引]
 * @return {[type]}            [description]
 */
Qflow.prototype.createChildsOfContainer = function(parentNode,jsonObj,index) {
	var _this = this; 
	var tmp = this.qcanvas.qrect.rect({
				 // start:[parentNode.attr.gridPosition[index].x,parentNode.attr.gridPosition[index].y],

				 start:function(){
				 	return [parentNode.attr.gridPosition[this.sort].x,parentNode.attr.gridPosition[this.sort].y]
				 },
				 sort:index,
				 nodeType:jsonObj.nodeType,
				 width:jsonObj.width?jsonObj.width:this.childNodeWidth,
				 height:jsonObj.height?jsonObj.height:this.childNodeHeight,
				 borderColor:jsonObj.attr && jsonObj.attr.borderColor?jsonObj.attr.borderColor:this.childNodeBorderColor, 
				 fillColor:jsonObj.attr && jsonObj.attr.fillColor?jsonObj.attr.fillColor:this.childNodeFillColor, 
				 dashed:jsonObj.attr && jsonObj.attr.dashed?jsonObj.attr.dashed:false,  
				 drag:false,
				 ownerId:parentNode.nodeId,
				 lineWidth:1,
				 getRangePoints:function(){ //返回rect边上的8个点的坐标 
				 	return _this.createRangePoints(this.polyPoints());
				 },
				 mouseenter:function(){ 
					_this.settingIcoShow(this);

				 },
				 mousedown:function(){ 
				 		_this.delTmpLine();
				 		_this.createNewLine(this,jsonObj);

				 		_this.tipTextHide();
				 		
				 		_this.menuLayerHide();
					 	_this.draging = true;
				 },
				 mouseup:function(e,pos){
				 	_this.settingIcoHide(); 
				 	_this.menuLayerHide();
					

				 	_this.draging = false;
				 	//右击显示菜单
				 	if(e.button == '2'){
				 		_this.contextMenuNode = this;
				 		_this.menuLayerShow(pos);
				 		// _this.contextSettingNode = this;

				 		// //右键菜单层级放到最高
				 		// _this.qcanvas.raiseToTop(_this.contextSettingLayer);

				 		// _this.contextSettingShow.call(_this,pos);

				 	}


				 },
				 mousemove:function(e,pos){ 

				 	_this.updateTmpLineEndPos(pos);

					_this.settingIcoShow(this);


				 	_this.draging && 
				 	_this.updateInitData.call(_this,this,jsonObj);

				 },
				 mouseout:function(){
				 	_this.settingIcoHide(); 
				 },
				 dblclick:function(e,pos){

				 	console.log('dbl')
				 	_this.settingIcoHide(); 
				 	_this.menuLayerHide();

				 	_this.containerDblclick.call(_this,this,e,pos,jsonObj); 

				 }
				})
	//qcanvas和数据作关联 
	if(typeof jsonObj.id == 'undefined'){
		jsonObj.id = tmp.id
	}
	jsonObj.nodeId = tmp.id;
	parentNode.childNodes?parentNode.childNodes.push(tmp):(parentNode.childNodes = [tmp]);

	this.qnodes.push(tmp);


	this.initNodeTitle(jsonObj,tmp);
 


};
Qflow.prototype.getNodeObj = function(nodeId) {
	var tmp = this.qnodes.filter(function(item){
 		return item.id == nodeId;
 	})

 	if(tmp.length>0){
 		return tmp[0];
 	}else{
 		return null;
 	}
};

Qflow.prototype.getJsonObj = function(nodeId) {

	var tmp = null;
	//搜索父 子项
	for (var i = 0; i < this.options.initData.node.length; i++) {

		if(this.options.initData.node[i].nodeId == nodeId){
			tmp = this.options.initData.node[i];
			break;
		}
		if(this.options.initData.node[i].child){
			for (var j = 0; j < this.options.initData.node[i].child.length; j++) {
				if(this.options.initData.node[i].child[j].nodeId == nodeId){
					tmp = this.options.initData.node[i].child[j];
					break;
				}
			} 
		}
		
	}

	return tmp;

};

Qflow.prototype.containerMouseDown = function(container,jsonObj) {
	var _this = this;
	//提高元素层级
 	this.qcanvas.raiseToTop(container);

 	//保证连线layer在最高层
 	this.qcanvas.raiseToTop(this.lineLayer);

 	//同时提高标题节点层级 
 	var titleNode = _this.getNodeObj(jsonObj.attr.titleId);
 	titleNode !==null && _this.qcanvas.raiseToTop(titleNode);

 	//如果是container 同时提高它的子项节点及标题节点 取消事件响应
 	if(jsonObj.nodeType == 'container'){

 		jsonObj.childNodes && jsonObj.childNodes.forEach(function(item){
		 	_this.qcanvas.raiseToTop(item);
		 	item.setPointerEvent('none');
 		})

 		jsonObj.child && jsonObj.child.forEach(function(item){
 			var titleNode = _this.getNodeObj(item.attr.titleId);
		 	if(titleNode !==null ){
		 		_this.qcanvas.raiseToTop(titleNode);
			 	titleNode.setPointerEvent('none');

		 	} 
 		})

 		//保证连线layer在最高层
	 	this.qcanvas.raiseToTop(this.lineLayer);

 	}
 	

 	_this.draging = true;
};
Qflow.prototype.containerMouseUp = function(container,e,pos,jsonObj) {
	var _this = this;
	_this.draging = false;

 	//如果是container 恢复事件响应
 	if(jsonObj.nodeType == 'container'){

 		jsonObj.childNodes && jsonObj.childNodes.forEach(function(item){
		 	item.setPointerEvent('auto');
 		})

 		// jsonObj.child && jsonObj.child.forEach(function(item){
 		// 	var titleNode = _this.getNodeObj(item.attr.titleId);
		 // 	if(titleNode !==null ){
			//  	titleNode.setPointerEvent('auto');

		 // 	} 
 		// })

 	}

	 	this.isResizeCanvas(jsonObj.nodeId);

 	//右击显示菜单
 	if(e.button == '2'){ 
 		_this.contextMenuNode = container;
 		_this.menuLayerShow(pos);

 		// _this.contextSettingNode = container;

 		// //右键菜单层级放到最高
 		// _this.qcanvas.raiseToTop(_this.contextSettingLayer);

 		// _this.contextSettingShow(pos);

 	}
};
Qflow.prototype.containerDblclick = function(node,e,pos,jsonObj) {
	console.log(jsonObj);
	console.log(node)
	if(jsonObj.nodeType == 'node'){

		this.contextSettingNode = jsonObj;

		//双击节点后 计算input的位置及宽度
		var titleObj = this.getNodeObj(jsonObj.attr.titleId); 
		console.log(titleObj);
		this.modiTitleObj = titleObj; 

		var tmp = titleObj.formatText.call(this,titleObj);

	 	var w = Math.max.apply(null,tmp.width);
	 	w = w>node.width?w:node.width;
	 	var start = this.qcanvas.isFun(node.start)?node.start():node.start;

	 	var x = w > node.width?(start[0]-(w - node.width)*0.5):start[0];


		var h = this.childNodeHeight;
		var y = start[1];







		var d = document.getElementById('titleInput');
		d.style.left = x+'px';
		d.style.top = y+'px';
		d.style.width = w+'px';
		d.style.height = h+'px';
		d.style.display = 'block';
		d.style.textAlign = 'center';
		d.value = titleObj.text;
		d.focus();

	}


	if(jsonObj.nodeType == 'container'){  //双击容器

		//如果点击到标题区域 则出现标题input
		var titleAreaHeight = 16;
		var start = this.qcanvas.isFun(node.start)?node.start():node.start;
		if(this.rayCasting(pos,[
			{
				x:start[0],
				y:start[1],

			},
			{
				x:start[0]+node.width,
				y:start[1],

			},
			{
				x:start[0]+node.width,
				y:start[1]+titleAreaHeight,

			},
			{
				x:start[0],
				y:start[1]+titleAreaHeight,

			},
			]) == 'in'){

			console.log('开始编辑容器标题');

			this.contextSettingNode = jsonObj;

			//双击节点后 计算input的位置及宽度
			var titleObj = this.getNodeObj(jsonObj.attr.titleId); 
			console.log(titleObj);
			this.modiTitleObj = titleObj; 

			var tmp = titleObj.formatText.call(this,titleObj);

		 	var w = Math.max.apply(null,tmp.width);
		 	w = w>node.width?w:node.width;
		 	var start = this.qcanvas.isFun(node.start)?node.start():node.start;

		 	var x = w > node.width?(start[0]-(w - node.width)*0.5):start[0];


			var h = this.childNodeHeight;
			var y = start[1];







			var d = document.getElementById('titleInput');
			d.style.left = x+'px';
			d.style.top = y+'px';
			d.style.width = w+'px';
			d.style.height = h+'px';
			d.style.display = 'block';
			d.style.textAlign = 'center';
			d.value = titleObj.text;
			d.focus();


		}
 

	}



	
};
Qflow.prototype.resizeCanvas = function(width,height) {
	var dpr = window.devicePixelRatio; // 假设dpr为2

	var c_obj = this.qcanvas.stage.canvas;
	c_obj.width = width*dpr;
	c_obj.height = height*dpr;
	c_obj.style.width = width+'px';
	c_obj.style.height = height+'px';


	var context = c_obj.getContext('2d');
	// 需要将绘制比例放大
    context.scale(dpr,dpr);



    //layer的元素的临时canvas也得同步缩放
    this.qcanvas.elements.forEach(function(item){
    	if(item.TYPE == 'layer'){

    		// console.log(item.canvasEle);
    		var layer_canvas = item.canvasEle;
    		layer_canvas.width = width*dpr;
			layer_canvas.height = height*dpr;
			var context = layer_canvas.getContext('2d');
			// 需要将绘制比例放大
		    context.scale(dpr,dpr);

    	}
    })

    this.options.width = width;
    this.options.height = height;

	this.qcanvas.stage.width = width;
	this.qcanvas.stage.height = height;



};
Qflow.prototype.isResizeCanvas = function(nodeId) {
	var _this = this;
	var F = function(){ 
	
		var obj = _this.getNodeObj(nodeId);
		if(obj !== null){
			var start = _this.qcanvas.isFun(obj.start)?obj.start():obj.start;

			var maxX = start[0] + obj.width;
			var maxY = start[1] + obj.height;

			if(maxX > _this.options.width || 
				maxY > _this.options.height){

				console.log('需要重置canvas尺寸');

				_this.resizeCanvas(maxX>_this.options.width?maxX:_this.options.width,maxY>_this.options.height?maxY:_this.options.height);

			}


		}



	}
	setTimeout(F,200);


	
};

Qflow.prototype.containerMouseMove = function(container,jsonObj) {

	// this.settingIcoShow(container);


	this.draging && 
 	this.updateInitData(container,jsonObj);
};
Qflow.prototype.getMiddleCoordinate = function(s,e) {
 
	var start=[s.x,s.y],end=[e.x,e.y];

	// return {
	// 	x:(start[0] < end[0] ? start[0]:end[0])+Math.abs(start[0]-end[0]) * 0.5,
	// 	y:(start[1] < end[1] ? start[1]:end[1])+Math.abs(start[1]-end[1]) * 0.5,
	// };
	return [
		(start[0] < end[0] ? start[0]:end[0])+Math.abs(start[0]-end[0]) * 0.5,
		(start[1] < end[1] ? start[1]:end[1])+Math.abs(start[1]-end[1]) * 0.5,
	]
};
Qflow.prototype.createRangePoints = function(polyPoints) {
	var tmp = [];
	for (var i = 0; i < polyPoints.length; i++) {
		tmp.push([polyPoints[i].x,polyPoints[i].y]);
		tmp.push(this.getMiddleCoordinate(polyPoints[i],polyPoints[i+1==polyPoints.length?0:i+1]));
	}

	return tmp;
};

Qflow.prototype.tipTextHide = function() {
	if(this.tipContext !== null){
      this.tipContext.setColor('#B58105'); 
      var jsonObj = this.getJsonObj(this.tipContext.ownerId);
 

      // if(this.tipContext.text.indexOf('\n') > -1){
      // 	var tmp = this.tipContext.text.split('\n');
      // 	jsonObj.text = tmp.join('\n');

      // }else{

	      jsonObj.text = this.tipContext.text;
      // }



      jsonObj.width  = this.tipNodeWidth;
      jsonObj.height = this.tipContext.range.height;


      this.tipContext =null;
	}
	document.getElementById('tip').style.display = 'none';
	
};
Qflow.prototype.updateTipText = function(v,h) {

	if(this.tipContext !== null){

		v = this.formatTipText(v);
		this.tipContext.setText(v); 



		var tipRect = this.getNodeObj(this.tipContext.ownerId);
		tipRect.setHeight(h);

	}
};
Qflow.prototype.measureTextWidth = function(v) {
	return this.qcanvas.context.measureText(v).width;

};
Qflow.prototype.formatTipText = function(str) {
	var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    var c = [];
    for (let i = 0; i < str.length; i++) {
      lineWidth += this.measureTextWidth(str[i]); 
      
      //有换行 重新计算
      if(str[i] == '\n'){
          lineWidth = 0;
      }

      if (lineWidth > this.tipNodeWidth) {
        c.push(str.substring(lastSubStrIndex, i));//绘制截取部分
        // initHeight += 70;//60为字体的高度
        lineWidth = this.measureTextWidth(str[i]);
        lastSubStrIndex = i;
      }
      if (i == str.length - 1) {//绘制剩余部分
        c.push(str.substring(lastSubStrIndex, i + 1))
       }
    }

    return c.join('\n');

    // text1.setText(c.join('\n')); 
};
Qflow.prototype.cloneTipNode = function() {
	console.log(this.contextMenuNode);
	var jsonObj = this.getJsonObj(this.contextMenuNode.id);
	var json = {
			nodeType:'tip', //备注文本节点
			x:this.contextMenuNode.start[0]+20,
			y:this.contextMenuNode.start[1]+20,
			width:this.tipNodeWidth,
			height:this.contextMenuNode.height,
			text:jsonObj.text,
			attr:{
				 borderColor:'#7EC8CE', 
				 color:'#fff', 
				 fillColor:'#585DCB',
				 dashed:false, 
			}
	}


	this.createTipNode(json);


	this.options.initData.node.push(json);

};
Qflow.prototype.addTipNode = function(obj) {

	var json = {
			nodeType:'tip', //备注文本节点
			x:obj.x,
			y:obj.y,
			width:this.tipNodeWidth, 
			text:'备注',
			attr:{
				 borderColor:'#7EC8CE', 
				 color:'#fff', 
				 fillColor:'#585DCB',
				 dashed:false, 
			}
	}


	this.createTipNode(json);


	this.options.initData.node.push(json);
	
};
Qflow.prototype.createTipNode = function(jsonObj) {
	var _this = this;
	var tmp = this.qcanvas.qrect.rect({
		 start:[jsonObj.x,jsonObj.y], 
		 nodeType:jsonObj.nodeType,
		 width:jsonObj.width?jsonObj.width:this.tipNodeWidth,
		 height:jsonObj.height?jsonObj.height:this.childNodeHeight,
		 borderColor:'orange',
		 fillColor:'#FEF8DE', 
		 dashed:jsonObj.attr.dashed,
		  getRangePoints:function(){ //返回rect边上的8个点的坐标 
		 	return _this.createRangePoints(this.polyPoints());
		 },
		 dblclick:function(e,pos){ 
		 	var x = this.start[0],y = this.start[1];
	        var doc = document.getElementById('tip');
	        doc.style.top = y+'px';
	        doc.style.left = x+'px';
	        doc.style.width = this.width +'px';
	        doc.style.height = this.height+'px';
	        doc.style.fontSize="12px";
	        doc.style.lineHeight="14px";
	        doc.style.display = 'block';

	        _this.tipContext =  _this.getNodeObj(jsonObj.attr.titleId);
            _this.tipContext.setColor('#FEF8DE');

	        doc.value = _this.tipContext.text;

	        doc.focus();
		 },
		 mousedown:function(){ 

		 	_this.delTmpLine();
	 		_this.createNewLine(this,jsonObj); 

	 		_this.menuLayerHide();
		 	_this.containerMouseDown.call(_this,this,jsonObj); 
		 },
		 mouseup:function(e,pos){
		 	_this.settingIcoHide(); 
		 	_this.menuLayerHide();
		 	
		 	_this.containerMouseUp.call(_this,this,e,pos,jsonObj); 

		 },
		  mousemove:function(e,pos){
		 	_this.updateTmpLineEndPos(pos); 

		 	_this.containerMouseMove.call(_this,this,jsonObj); 


		        if(_this.qcanvas.dragAim === null){
		            return false;
		        }
	            // var title =  _this.getNodeObj(jsonObj.attr.titleId); 

		        // title.setStart([this.start[0],this.start[1]+3]); 

		        // title.setColor('#eee');

		    }
		})
	//qcanvas和数据作关联
	if(typeof jsonObj.id == 'undefined'){
		jsonObj.id = tmp.id;
	}  
	jsonObj.nodeId = tmp.id;

	this.qnodes.push(tmp);
	this.baseNodesWithCoordinates.push(tmp);

	this.initTipText(jsonObj,tmp);
};
Qflow.prototype.initTipText = function(obj,qobj) {

		var _this = this;
		var t = this.qcanvas.qtext.text({
				start:function(){
					return [qobj.start[0],qobj.start[1]+3];
				},
				// start:[qobj.start[0],qobj.start[1]+3],
				text:obj.text,
				fontSize:'12px', 
			    lineHeight:'14px',
			    color:'#B58105',
			    textAlign:'left',
			    textBaseline:'top',
			    pointerEvent:'none',
				ownerId:obj.nodeId
			})
		qobj.withTextId = t.id;

		this.qnodes.push(t);

		//标题节点的id记到container节点json数据上
		obj.attr.titleId = t.id;
 
};
Qflow.prototype.createContainerOrNode = function(jsonObj) {
	var _this = this;
	var tmp = this.qcanvas.qrect.rect({
		 start:[jsonObj.x,jsonObj.y], 
		 nodeType:jsonObj.nodeType,
		 width:jsonObj.width?jsonObj.width:this.childNodeWidth,
		 height:jsonObj.height?jsonObj.height:this.childNodeHeight,
		 borderColor:jsonObj.attr.borderColor, 
		 fillColor:jsonObj.attr.fillColor, 
		 dashed:jsonObj.attr.dashed,  
		 getRangePoints:function(){ //返回rect边上的8个点的坐标 
		 	return _this.createRangePoints(this.polyPoints());
		 },
		 mouseenter:function(){ 
		 	_this.settingIcoShow(this);
		 },
		 mousedown:function(){ 

		 	_this.delTmpLine();
	 		_this.createNewLine(this,jsonObj);

	 		_this.tipTextHide();
		 	_this.menuLayerHide();
		 	_this.containerMouseDown.call(_this,this,jsonObj); 

		 	_this.contextMenuNode = null;
		 	_this.contextSettingHide();

		 },
		 mouseup:function(e,pos){
		 	_this.settingIcoHide(); 
		 	_this.menuLayerHide();


		 	_this.containerMouseUp.call(_this,this,e,pos,jsonObj); 

		 },
		 mousemove:function(e,pos){
		 	_this.updateTmpLineEndPos(pos);
		 	_this.settingIcoShow(this);

		 	_this.containerMouseMove.call(_this,this,jsonObj); 

		 },
		 mouseout:function(){
		 	_this.settingIcoHide(); 
		 },
		 dblclick:function(e,pos){
		 	_this.settingIcoHide(); 
		 	_this.menuLayerHide();

		 	_this.containerDblclick.call(_this,this,e,pos,jsonObj); 


		 }
	})


	//qcanvas和数据作关联
	jsonObj.nodeId = tmp.id;

	this.qnodes.push(tmp);
	this.baseNodesWithCoordinates.push(tmp);

	//初始化容器的标题
	jsonObj.nodeType == 'container' &&
	this.initContainerTitle(jsonObj,tmp);

	//初始化节点标题
	jsonObj.nodeType == 'node' &&
	this.initNodeTitle(jsonObj,tmp);



	jsonObj.nodeType == 'container' && 
	typeof jsonObj.child !='undefined' && 
	this.initNode(jsonObj);
};
Qflow.prototype.initNode = function(parentNode) { 

	if(parentNode){
		//开始画子项
		this.drawNode(parentNode,parentNode.child);
	}else{

		this.drawNode(null,this.options.initData.node);
	}

	
};
Qflow.prototype.initCanvas = function() {
 
	this.qcanvas = new Qcanvas({
		id:this.options.id,
		width:this.options.width,
		height:this.options.height,
		mousedown:this.canvasDownFun.bind(this),
		mousemove:this.canvasMoveFun.bind(this),
		mouseup:this.canvasUpFun.bind(this),
		delayRender:true

	});
	// this.toolLayer = this.qcanvas.qlayer.layer();

	// this.initTool();

};
Qflow.prototype.addContainer = function(obj,attrObj) {

	var _this = this;

	//添加容器
	var tmp = this.qcanvas.qrect.rect({
		 start:[obj.x,obj.y],
		 // width:this.containerNodeWidth,
		 // height:this.containerNodeHeight,
		 width:(attrObj && attrObj.width)?attrObj.width:this.containerNodeWidth,
		height:(attrObj && attrObj.height)?attrObj.height:this.containerNodeHeight,
		 borderColor:this.containerBorderColor, 
		 fillColor:this.containerFillColor,
		 dashed:false,  


		 ///
		 getRangePoints:function(){ //返回rect边上的8个点的坐标 
		 	return _this.createRangePoints(this.polyPoints());
		 },
		 mouseenter:function(){ 
		 	_this.settingIcoShow(this);
		 },
		 mousedown:function(){ 

		 	_this.delTmpLine();
	 		_this.createNewLine(this,jsonObj);


		 	_this.menuLayerHide();
		 	_this.containerMouseDown.call(_this,this,jsonObj); 

			_this.contextMenuNode = null;
		 	_this.contextSettingHide();

		 },
		 mouseup:function(e,pos){
		 	_this.settingIcoHide(); 
		 	_this.menuLayerHide();
		 	
		 	_this.containerMouseUp.call(_this,this,e,pos,jsonObj); 

		 },
		 mousemove:function(e,pos){
		 	_this.updateTmpLineEndPos(pos);
		 	_this.settingIcoShow(this);

		 	_this.containerMouseMove.call(_this,this,jsonObj); 

		 },
		 mouseout:function(){
		 	_this.settingIcoHide(); 
		 },
		 dblclick:function(e,pos){
		 	_this.settingIcoHide(); 
		 	_this.menuLayerHide();

		 	_this.containerDblclick.call(_this,this,e,pos,jsonObj); 


		 }

	})

	this.qnodes.push(tmp);
	this.baseNodesWithCoordinates.push(tmp);


	//this.options.initData.node需要添加一项
	var jsonObj = {
		id:tmp.id,
		nodeId:tmp.id,
		nodeType:'container',  //容器类型
		x:obj.x,
		y:obj.y,
		text:(attrObj && attrObj.text)?attrObj.text:'容器标题',
		width:(attrObj && attrObj.width)?attrObj.width:this.containerNodeWidth,
		height:(attrObj && attrObj.height)?attrObj.height:this.containerNodeHeight,
		grid:(attrObj && attrObj.grid)?attrObj.grid:[1,1], //行 列
		child:[],
		childNodes:[], //qcanvas元素对象
		attr:{
			 titlePosition:'top-center',
			 color:this.textColor, //标题文字的颜色
			 borderColor:this.containerBorderColor,
			 fillColor:this.containerFillColor,
			 dashed:false, 
		}
	}
	this.options.initData.node.push(jsonObj);

	this.updateInitData(tmp,jsonObj);


	//添加容器的标题
	this.initContainerTitle(jsonObj,tmp);
	

	return tmp.id;
	
};
Qflow.prototype.modiContainerGridColumn = function(column) { 
	var containerNode = this.getNodeObj(this.contextSettingNode.id);
	var parentJsonNode = this.getJsonObj(this.contextSettingNode.id);

	parentJsonNode.width = this.childNodeWidth*column+(column+1)*this.containerChildMargin;

	// parentJsonNode.grid[1] = column;

	if(parentJsonNode.attr.titlePosition == 'top-center'){
		var startPlaceHolderY = (this.containerTitleHeight+this.containerPadding);
		var row = Math.ceil((parentJsonNode.child.length==0?1:parentJsonNode.child.length)/column);
		parentJsonNode.height = startPlaceHolderY + this.childNodeHeight*row+(row)*this.containerChildMargin;
		parentJsonNode.grid = [row,column];

	}
 
	containerNode.setWidth(parentJsonNode.width);
	containerNode.setHeight(parentJsonNode.height);


	//可以摆放子项的区域位置[左上角开始位置，右下角结束位置]
	var childAreaPosition = this.getChildAreaPosition(parentJsonNode); 



	// //可以摆放子项的区域位置 计算出各个格子的坐标
	var childPosition = this.getChildPosition(parentJsonNode,childAreaPosition);


	// //把格子坐标添加到attr里
	parentJsonNode.attr.gridPosition = childPosition;


};
Qflow.prototype.inSertToContainer = function(obj,aim,text) {
	//添加节点到container
	//根据container里的位置 初始化节点位置
	console.log('创建的节点需要初始到容器里');

	var parentJsonNode = this.getJsonObj(aim.id);
	var parentNode = this.getNodeObj(aim.id);

	//是否需要放大容器
	//attr.gridPosition
	if(parentJsonNode.attr.gridPosition.length <= parentJsonNode.child.length){ //需要放大

		//放大container的一行子节点的高度 同时重新生成JSON数据中的gridPostion
		parentJsonNode.height += (this.childNodeHeight+this.containerChildMargin);
		parentJsonNode.grid[0] += 1;


		// var startPlaceHolderY = (this.containerTitleHeight+this.containerPadding);
		// var row = Math.ceil((parentJsonNode.child.length==0?1:parentJsonNode.child.length)/column);
		// parentJsonNode.height = startPlaceHolderY + this.childNodeHeight*row+(row)*this.containerChildMargin;
		// parentJsonNode.grid = [row,column];

		parentNode.setHeight(parentJsonNode.height);
		
		//可以摆放子项的区域位置[左上角开始位置，右下角结束位置]
		var childAreaPosition = this.getChildAreaPosition(parentJsonNode);

		//可以摆放子项的区域位置 计算出各个格子的坐标
		var childPosition = this.getChildPosition(parentJsonNode,childAreaPosition);

		//把格子坐标添加到attr里
		parentJsonNode.attr.gridPosition = childPosition;

	}


	var jsonObj = {
			nodeType:'node',
			text:text?text:'我是新来的',
			attr:{
				color:this.textColor
			}
	}

	this.createChildsOfContainer(parentJsonNode,jsonObj,parentJsonNode.child.length);
	
	parentJsonNode.child.push(jsonObj); 


};
Qflow.prototype.addNode = function(obj,title) {

	var _this = this;

	//添加节点
	var tmp = this.qcanvas.qrect.rect({
		 start:[obj.x,obj.y],
		 width:this.childNodeWidth,
		 height:this.childNodeHeight,
		 borderColor:this.childNodeBorderColor, 
		 fillColor:this.childNodeFillColor, 
		 dashed:false,  
		 getRangePoints:function(){ //返回rect边上的8个点的坐标 
		 	return _this.createRangePoints(this.polyPoints());
		 },
		 mouseenter:function(){ 
		 	_this.settingIcoShow(this);
		 },
		 mousedown:function(){ 

		 	_this.delTmpLine();
	 		_this.createNewLine(this,jsonObj);


		 	_this.menuLayerHide();
		 	_this.containerMouseDown.call(_this,this,jsonObj); 
		 },
		 mouseup:function(e,pos){
		 	_this.settingIcoHide(); 
		 	_this.menuLayerHide();
		 	
		 	_this.containerMouseUp.call(_this,this,e,pos,jsonObj); 

		 },
		 mousemove:function(e,pos){
		 	_this.updateTmpLineEndPos(pos);
		 	_this.settingIcoShow(this);

		 	_this.containerMouseMove.call(_this,this,jsonObj); 

		 },
		 mouseout:function(){
		 	_this.settingIcoHide(); 
		 },
		 dblclick:function(e,pos){

		 	console.log('dbl')
		 	_this.settingIcoHide(); 
		 	_this.menuLayerHide();

		 	_this.containerDblclick.call(_this,this,e,pos,jsonObj); 

		 }
	})

	this.qnodes.push(tmp);
	this.baseNodesWithCoordinates.push(tmp);


	//添加节点到画布上
	var jsonObj = {	 
			id:tmp.id,
			nodeId:tmp.id,
			nodeType:'node', //普通节点
			x:obj.x,
			y:obj.y,
			text:title?title:'标题',
			attr:{
				 borderColor:this.childNodeBorderColor, 
				 color:this.textColor,
				 fillColor:this.childNodeFillColor,
				 dashed:false, 
			}
	}

	this.options.initData.node.push(jsonObj);

	//初始化节点标题
	this.initNodeTitle(jsonObj,tmp);

};
/**
   * @description 射线法判断点是否在多边形内部
   * @param {Object} p 待判断的点，格式：{ x: X坐标, y: Y坐标 }
   * @param {Array} poly 多边形顶点，数组成员的格式同 p
   * @return {String} 点 p 和多边形 poly 的几何关系
   */
Qflow.prototype.rayCasting = function(p, poly) {
    var px = p.x,
        py = p.y,
        flag = false

    for(var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
      var sx = poly[i].x,
          sy = poly[i].y,
          tx = poly[j].x,
          ty = poly[j].y

      // 点与多边形顶点重合
      if((sx === px && sy === py) || (tx === px && ty === py)) {
        return 'on'
      }

      // 判断线段两端点是否在射线两侧
      if((sy < py && ty >= py) || (sy >= py && ty < py)) {
        // 线段上与射线 Y 坐标相同的点的 X 坐标
        var x = sx + (py - sy) * (tx - sx) / (ty - sy)

        // 点在多边形的边上
        if(x === px) {
          return 'on'
        }

        // 射线穿过多边形的边界
        if(x > px) {
          flag = !flag
        }
      }
    }

    // 射线穿过多边形边界的次数为奇数时点在多边形内
    return flag ? 'in' : 'out'
};
Qflow.prototype.inContainer = function(obj) {   

	var ele = this.qcanvas.elements; 
	// console.log(ele);
	var aim = null;
	for (var i = ele.length - 1; i >= 0; i--) {
		if(ele[i].display !='none' && ele[i].TYPE !='layer' && this.rayCasting({x:obj.x,y:obj.y},ele[i].polyPoints()) == 'in'){
			console.log('找到了');
			aim = ele[i];
			break;
		}
	}

	var sign = false;
	if(aim !== null){

		if(typeof aim.ownerId !='undefined'){ //目标在某个容器里的某个节点上

			var ownerObj = this.getJsonObj(aim.ownerId);
			aim = this.getNodeObj(aim.ownerId);
			if(ownerObj.nodeType == 'container'){
				sign = true;
			}

		}else{

			var tmp = this.getJsonObj(aim.id);
			if(tmp !== null && tmp.nodeType == 'container'){
				sign = true;

			}
		}

		
	}

	return {
		sign:sign,
		aim:aim
	}


};

Qflow.prototype.addEle = function(obj) {
	switch(obj.id){
		case '-1':
			var id = this.addContainer(obj);

			//默认加一个节点进容器
			this.inSertToContainer({},{id:id},'标题');

		break;
		case '1':
			var tmp = this.inContainer(obj);//判断是否拖动到某了个容器里
			// console.log(tmp);
			if(tmp.sign){
				this.inSertToContainer(obj,tmp.aim);
			}else{
				this.addNode(obj);
			} 
		break;
		case '2': //多行文体节点
			this.addTipNode(obj);
		break;

	}
	




};
Qflow.prototype.canvasUpFun = function() {
	console.log('canvasUpFun');


	//如果是拖动完后 需要把this.baseNodesWithCoordinates中的对象的坐标数据同步到静态json数据中
	

};
Qflow.prototype.canvasMoveFun = function(e,pos) { 
	var _this = this;
	this.updateTmpLineEndPos(pos);

	if(this.qcanvas.dragAim !== null &&
		this.qcanvas.dragAim.id == this.qcanvas.id
		){

		if(this.qnodes.length == 0){
			return false;
		}
 

		//移动画布上所有元素
		this.baseNodesWithCoordinates.forEach(function(item){

			item.start = [pos.x-item.dis.x,pos.y-item.dis.y];
 
		 	(_this.getJsonObj(item.id) !== null) && _this.updateInitData(item,_this.getJsonObj(item.id));

		}) 


	}
};
Qflow.prototype.canvasDownFun = function(e,pos) {
	// console.log('canvasDownFun');
	this.delTmpLine();
	this.contextMenuNode = null;

	this.menuLayerHide();
	this.lineMenuLayerHide();

	this.contextSettingHide();

	this.tipTextHide();

	//生成画布点击位置距this.baseNodesWithCoordinates中每个对象坐标值的距离
	this.baseNodesWithCoordinates.forEach(function(item){

		item.dis = {
			x:pos.x - item.start[0],
			y:pos.y - item.start[1]
		}
	}) 



};

Qflow.prototype.rectDown = function(pos) {
	// console.log(pos);
	// console.log(this);
};


Qflow.prototype.initTool = function() {

	var h = this.options[2];
	var tool = this.qcanvas.qrect.rect({  //工具栏外边框
				start:[0,0],
				width:200,
				lineWidth:0.5,
				height:h,
				drag:false
			});
	var rect = this.qcanvas.qrect.rect({  //矩形元素
			start:function(){return [tool.start[0]+20,tool.start[1]+20]},
			width:70,
			height:50,
			drag:false,
			mousedown:this.rectDown
		})
	var diamond = this.qcanvas.qshape.shape({

		// points:[[80,10],[80,50],[150,70],[160,20]],
		fillColor:'',
		points:function(){
			return [
				[tool.start[0]+rect.width+30,tool.start[1]+45],
				[tool.start[0]+rect.width+70,tool.start[1]+20],
				[tool.start[0]+rect.width+110,tool.start[1]+45], 
				[tool.start[0]+rect.width+70,tool.start[1]+70],  
			]
		},
		drag:false
	})

	var arc = this.qcanvas.qarc.arc({
		start:[300,100],
		sAngle:0,
		eAngle:200,
		fillColor:'',
		r:10
	})

	this.toolLayer.push(tool,rect,diamond,arc);
	



};

module.exports.Qflow = Qflow; 