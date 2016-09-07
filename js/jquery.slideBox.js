/*
 * jQuery图片轮播(焦点图)插件
 * ADD.JENA.201206291027
 * EDIT.JENA.201206300904
 * EDIT.JENA.201207051027
 * EDIT.JENA.201208090849
 * EDIT.JENA.201303141312
 * Version: 1.2.0314
 * Author: jena
 * Demo: http://ishere.cn/demo/jquery.slidebox/
 */
(function($) {
	$.fn.slideBox = function(options) {
		//默认参数
		var defaults = {

			//方向:left\top
			direction : 'left',//left,top
			//持续时间:0.6
			duration : 0.6,//unit:seconds
			//滚动特效
			easing : 'swing',//swing,linear
			//延迟时间:3
			delay : 3,//unit:seconds
			//开始的下标
			startIndex : 0,
			//隐藏点击栏:true
			hideClickBar : true,
			//点击栏圆角:5
			clickBarRadius : 5,//unit:px
			//隐藏底部的栏:false
			hideBottomBar : false,
			//宽:空
			width : null,
			//高:空
			height : null
		};

		//对象合并,传的参数同名的会把默认的替换掉
		var settings = $.extend(defaults, options || {});
		//计算相关数据
		//获取当前元素的id
		var wrapper = $(this),
			//获取wrapper的ul
			ul = wrapper.children('ul.items'),
			//找到ul里的li
			lis = ul.find('li'),
			//找到第一个li里的img
			firstPic = lis.first().find('img');
		//li_num= li的长度,高为0,宽为0
		var li_num = lis.size(), li_height = 0, li_width = 0;
		//定义滚动顺序:ASC/DESC.ADD.JENA.201208081718
		//var order_by = 'ASC';
		//初始化
		var init = function(){
			//如果wrapper值为0,返回false,不能执行下面的代码
			if(!wrapper.size()) return false;
			//手动设定值优先.ADD.JENA.201303141309
			//li的高度为lis.first().height()  三目运算:问号前面的值不成立,则返回冒号后面的值
			li_height = settings.height ? settings.height : lis.first().height();
			//li的宽度为lis.first().width()
			li_width = settings.width ? settings.width : lis.first().width();
			//设置wrapper的宽高
			wrapper.css({width: li_width+'px', height:li_height+'px'});
			//设置li的宽高
			lis.css({width: li_width+'px', height:li_height+'px'});//ADD.JENA.201207051027

			//如果settings的方向为left
			if (settings.direction == 'left') {
				//ul的宽为li_num*li_width
				ul.css('width', li_num * li_width + 'px');
			} else {
				//ul的高为li_num * li_height
				ul.css('height', li_num * li_height + 'px');
			}
			//找到ul地下第0个li添加class "active"
			ul.find('li:eq('+settings.startIndex+')').addClass('active');
			//如果settings.hideBottomBar为false
			if(!settings.hideBottomBar){//ADD.JENA.201208090859
				//给wrapper添加一个class名为tips的div,设置透明度为0.6
				var tips = $('<div class="tips"></div>').css('opacity', 0.6).appendTo(wrapper);

				var title = $('<div class="title"></div>').html(function(){
					//找到ul底下的名为active的li底下的a
					var active = ul.find('li.active').find('a'),
						//获取title
						text = active.attr('title'),
						//获取href
						href = active.attr('href');
					//添加一个a标签设置属性href,添加text(title的值)
					return $('<a>').attr('href', href).text(text);
					//添加到tips里
				}).appendTo(tips);
				//添加class名为nums的div,默认隐藏,同时添加到tips
				var nums = $('<div class="nums"></div>').hide().appendTo(tips);
				//i是下标值,n是第某个元素
				lis.each(function(i, n) {
					//找到每个li底下的a标签,text为a标签的title,href为a标签的href,css为空
					var a = $(n).find('a'), text = a.attr('title'), href = a.attr('href'), css = '';
					//i== settings.startIndex 或 css="active"
					i == settings.startIndex && (css = 'active');
					//创建一个a标签,设置属性href,获取text,添加class
					$('<a>').attr('href', href).text(text).addClass(css).css
					//设置borderRadius大小,获取settings.clickBarRadius值,添加mouseover事件
					('borderRadius', settings.clickBarRadius+'px').mouseover(function(){
						//当前元素添加class名为active,再找到同辈上有active的,再移除掉active
						$(this).addClass('active').siblings().removeClass('active');
						//找到ul底下的li,添加active,再找到同辈上有active的,再移除掉active
						ul.find('li:eq('+$(this).index()+')').addClass('active').siblings().removeClass('active');

						start(); 
						stop();
						//添加到nums
					}).appendTo(nums);
				});

				//如果隐藏点击栏为true
				if(settings.hideClickBar){//ADD.JENA.201206300847

					tips.hover(function(){
						//top为0
						nums.animate({top: '0px'}, 'fast');
					}, function(){
						//设置top的高度
						nums.animate({top: tips.height()+'px'}, 'fast');
					});
					//显示为2秒,top为tips.height
					nums.show().delay(2000).animate({top: tips.height()+'px'}, 'fast');
				}else{
					//nums显示
					nums.show();
				}
			}
			//lis的长度大于1 并且开始轮播
			lis.size()>1 && start();
		};
		//开始轮播
		var start = function() {
			//找到ul底下的class为active的li,再找到啊
			var active = ul.find('li.active'), active_a = active.find('a');
			//当前index的位置
			var index = active.index();
			//如果settings.direction为left
			if(settings.direction == 'left'){
				//left值:index*li的宽度*-1
				offset = index * li_width * -1;
				param = {'left':offset + 'px' };
			}else{
				//top值:index*li的高度*-1
				offset = index * li_height * -1;
				param = {'top':offset + 'px' };
			}
			//找到wrapper底下class名为.nums,再找到a标签第0个,添加class"active",再找到同辈上有active的,再移除掉active
			wrapper.find('.nums').find('a:eq('+index+')').addClass('active').siblings().removeClass('active');
			//找到wrapper底下class名为.title,再找到a标签,设置href,设置text
			wrapper.find('.title').find('a').attr('href', active_a.attr('href')).text(active_a.attr('title'));

			//ul停止时,设置param,持续时间为600,滚动特效
			ul.stop().animate(param, settings.duration*1000, settings.easing, function() {
				//先移除active
				active.removeClass('active');
				//if(order_by=='ASC'){

					if (active.next().size()){
						active.next().addClass('active');
					}else{
						//order_by = 'DESC';
						active.prev().addClass('active');
					}
				//}else if(order_by=='DESC'){
					if (active.prev().size()){
						active.prev().addClass('active');
					}else{
						//order_by = 'ASC';
						active.next().addClass('active');
					}
				//}
			});
			//添加定时器
			wrapper.data('timeid', window.setTimeout(start, settings.delay*1000));
		};
		//停止轮播
		var stop = function() {
			window.clearTimeout(wrapper.data('timeid'));
		};
		//鼠标经过事件
		wrapper.hover(function(){
			stop();
		}, function(){
			wrapper.data('timeid', window.setTimeout(start, settings.delay*1000));//ADD.JENA.201303141309
		});	
		//首张图片加载完毕后执行初始化
		var imgLoader = new Image();
		imgLoader.onload = function(){
			imgLoader.onload = null;
			init();
		};
		imgLoader.src = firstPic.attr('src');
			
	};
})(jQuery);
