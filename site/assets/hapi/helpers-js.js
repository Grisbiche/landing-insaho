/* ---- /navHighlightOnScroll/index.js -------------------------------------------------------- */

!(function(){
	window.navHighlightOnScroll_mostInViewport = function(elements) {
		var els = [];
		$(elements).each(function(index){ els.push({el:this,size:navHighlightOnScroll_isInViewport(this,index)}); })
		els = els.sort(function(a,b){ return b.size - a.size; })
		if(els[0] && els[0].size>0)
			return $(els[0].el).index();
		return null
	}
	window.navHighlightOnScroll_isInViewport = function(element,index) {
		var elementHeight = $(element).outerHeight();
		var elementTop = $(element).offset().top;
	    var elementBottom = elementTop + elementHeight;
	    var viewportTop = $(window).scrollTop();
	    var viewportBottom = viewportTop + $(window).height();
	    var top = elementTop>viewportTop ? elementTop : viewportTop
	    var bottom = elementBottom<viewportBottom ? elementBottom : viewportBottom
		// console.log(element,bottom-top);
	    return 10000 * ((bottom-top) / elementHeight) - index;
	}
	window.navHighlightOnScroll = function(buttons,items,poolingSpeed=100) {
		setInterval(function(buttons,items) {
			var current = navHighlightOnScroll_mostInViewport(items)
			if(current!==null)
			{
				$(buttons).not(':eq('+current+')').removeClass('highlight')
				$(buttons).eq(current).addClass('highlight')
			}
			else
			{
				$(buttons).removeClass('highlight')
			}
		}.bind(null, buttons,items),poolingSpeed)
	}
})();

//navHighlightOnScroll('#mod_chambres--liste-des-chambres .quick-access-menu-wrap > button','#mod_chambres--liste-des-chambres .items > div');



/* ---- /quickBxSlider/index.js -------------------------------------------------------- */

!(function(){
	window.quickBxSlider = function(container,param=null) {
		param = {
			pager:        param.pager        ? param.pager        : true,
			controls:     param.controls     ? param.controls     : true,
			speed:        param.speed        ? param.speed        : 500,
			auto:         param.auto         ? param.auto         : 0,
			items:        param.items        ? param.items        : ">div",
			noBreakAfter: param.noBreakAfter ? param.noBreakAfter : true,
		}

		setTimeout(function(){
			var el = $(container);
			
			if(param.noBreakAfter)
				el.find('>div[style*=break-after]').remove()

			var items = el.find(param.items);
			if(items.length>0)
			{
				el.bxSlider({
					pager:items > 1 ? param.pager : false,
					controls:param.controls,
					speed:param.speed,
					auto:param.auto,
				})
			}
		}.bind(null,container,param),500)
	}
})();