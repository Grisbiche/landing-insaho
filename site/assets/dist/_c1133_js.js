//generation time: 1795523031
HAPI_PageCycle.onLoad(function(){
        window.custom_ckeditor_colorButton_colors = null;
        
;


;
//scope protection
!(function(){
// ----------------------------------------------------------------------------------
// Module : _TEMPLATE
// modules/_template/script_pagination.js
// ----------------------------------------------------------------------------------
/*
<ul class="pagination" id="#mod9f92a26a">
	<li class="first"><a href="#first">◄</a></li>
	<li class="prev"><a href="#prev">&lt;</a></li>
	<li class="disabled"><a href="#" onclick="return false;">...</a></li>
	<li><a href="#2">2</a></li>
	<li><a href="#3">3</a></li>
	<li class="active"><a href="#4">4</a></li>
	<li><a href="#4">5</a></li>
	<li><a href="#6">6</a></li>
	<li class="disabled"><a href="#" onclick="return false;">...</a></li>
	<li class="next"><a href="#next">&gt;</a></li>
	<li class="last"><a href="#last">►</a></li>
</ul>
*/

window.module_tpl_default_pagination_insert_wrapper = function(tpl)
{
	$(tpl).find('.items').after(`<ul class="pagination"></ul>`);
	$(tpl).find('.items').before(`<ul class="pagination"></ul>`);
}

window.module_tpl_default_pagination_add_btn_dummy = function(tpl) {
	li = $(`<li class="dummy"><a href="#">&nbsp;</a></li>`)
	tpl.find('.pagination').append(li);
}

window.module_tpl_default_pagination_set_page = function(tpl,index,event) {
	if(event)
	{
		event.preventDefault();
		event.stopPropagation();
	}

	tpl.data('pagination-index',index);
	var els = tpl.find('.item:not(.filtered)');
	var pages = Math.ceil(els.length / (tpl.data('pagination') || 999));

	// update pagination list
	tpl.find('.pagination').empty();
	tpl.find('.pagination').show();
	var li = null;
	var limit = 2;

	if(pages>limit*2+1)
	{
		if(index>1)
		{
			li = $(`<li class="first"><a href="#">◄</a></li>`);
			li.on('click',module_tpl_default_pagination_set_page.bind(null,tpl,0));
			tpl.find('.pagination').append(li);
		}
		else
			module_tpl_default_pagination_add_btn_dummy(tpl)

		if(index>0)
		{
			li = $(`<li class="prev"><a href="#">&lt;</a></li>`);
			li.on('click',module_tpl_default_pagination_set_page.bind(null,tpl,index-1));
			tpl.find('.pagination').append(li);
		}
		else
			module_tpl_default_pagination_add_btn_dummy(tpl)
	}

	for(var i=index-limit; i<=index+limit; i++)
	{
		if(i > pages-1 || i < 0)
		{
			if(pages>limit*2+1)
				module_tpl_default_pagination_add_btn_dummy(tpl)
		}
		else
		{
			li = $(`<li class="link ${index==i ? 'active':''}"><a href="#">${i+1}</a></li>`)
			li.on('click',module_tpl_default_pagination_set_page.bind(null,tpl,i));
			tpl.find('.pagination').append(li);
		}
	}

	if(pages>limit*2+1)
	{
		if(index<pages-1)
		{
			li = $(`<li class="next"><a href="#">&gt;</a></li>`);
			li.on('click',module_tpl_default_pagination_set_page.bind(null,tpl,index+1));
			tpl.find('.pagination').append(li);
		}
		else
			module_tpl_default_pagination_add_btn_dummy(tpl)

		if(index<pages-2)
		{
			li = $(`<li class="last"><a href="#">►</a></li>`);
			li.on('click',module_tpl_default_pagination_set_page.bind(null,tpl,pages-1));
			tpl.find('.pagination').append(li);
		}
		else
			module_tpl_default_pagination_add_btn_dummy(tpl)
	}

	tpl.find('.pagination a').on('click',function(event) { event.preventDefault(); });

	// update items visibility
	// tag filter was already apply so we just hide or reveal the unfiltered items
	var els = tpl.find('.item:not(.filtered)');
	var p = tpl.data('pagination')
	els.show();
	els.slice(0, p*index).hide();
	els.slice(p*(index+1),99999).hide();
}

// call on startup and each time items filter change
window.module_tpl_default_pagination_update = function(tpl) {
	tpl = $(tpl);
	if(tpl.find('.pagination').length>0)
	{
		var els = tpl.find('.item:not(.filtered)');
		var pages = els.length / (tpl.data('pagination') || 999);
		if(pages>1)
		{
			module_tpl_default_pagination_set_page(tpl,0);
		}
		else
		{
			tpl.find('.pagination').hide();
		}
	}
}
;
// ----------------------------------------------------------------------------------
// Module : _TEMPLATE
// modules/_template/_default/script.js
// ----------------------------------------------------------------------------------
HAPI_PageCycle.onRefresh(function(container) {
	$(container ? container : 'body')
		.find('.bx-viewport .items')
			.each(function(){
				$(this).data('bxSlider').redrawSlider()
			})
});

var QUICK_ACCESS_MENU_HighlightOnScroll_delay = null;

class QUICK_ACCESS_MENU {
	static handler($module,options) {
		if(!$($module).data('qam-instance'))
			$($module).data('qam-instance',new QUICK_ACCESS_MENU($module,options));
		return $($module).data('qam-instance')
	}
	constructor($module,options) {
		this.$module = $($module)
		this.$ = this.$module.find('.quick-access-menu');
		this.onSelectCallbacks = []
		this.scrollTo = options && options.scrollTo!=undefined ? options.scrollTo : true;
	}
	init() {
		if(this.$.length>0)
		{
			this.toggle = this.$.data('toggle');

			if(this.toggle)
			{
				this.$module.find('.items > .item').hide();
				this.$module.find('.items > .item[data-i="0"]').show();
				this.$.find('button[data-idx="0"]').addClass('active');
			}

			this.$.find('button').data('qam',this)
			this.$.find('button').on('click',function(){
				var idx = $(this).data('idx');
				var qam = $(this).data('qam')
				qam.select(idx)
			});
			this.$.find('select').data('qam',this)
			this.$.find('select').on('change',function(){
				var idx = $(this).val();
				var qam = $(this).data('qam')
				qam.select(idx)
			});
		}
	}
	onSelect(callback) {
		// registering callback
		this.onSelectCallbacks.push(callback)
	}
	select(idx,options={}) {
		if(this.$.length>0)
		{
			scrollTo = options && options.scrollTo!=undefined ? options.scrollTo : this.scrollTo;

			this.$.find('button').removeClass('active');
			this.$.find('button[data-idx="'+idx+'"]').addClass('active');
			this.$.find('select').val(idx);

			if(this.toggle)
			{
				this.$module.find('.items > .item').hide();
				this.$module.find('.items > .item[data-i="'+idx+'"]').show();
			}
			else
			{
				if(scrollTo)
					scrollToElement(this.$module.find('.items > .item[data-i="'+idx+'"]'))
			}

			// executing callbacks on QAM select
			this.onSelectCallbacks.forEach(function(_cb) { _cb(idx) })
		}
	}

	static HighlightOnScroll() {
		clearTimeout(QUICK_ACCESS_MENU_HighlightOnScroll_delay);
		QUICK_ACCESS_MENU_HighlightOnScroll_delay = setTimeout(QUICK_ACCESS_MENU.HighlightOnScroll_delayed, 100);
	}
	static HighlightOnScroll_delayed() {
		$('.quick-access-menu').each(function(){
			var qam_bottom = this.getBoundingClientRect().bottom;
			var moduleTemplate = $(this).parents('.moduleTemplate').eq(0);
			var els = [];
			$(this).find('button').each(function(){
				var idx = $(this).data('idx');
				$(this).removeClass('highlight');
				var el = moduleTemplate.find('.item[data-i="'+idx+'"');
				if(el)
					els.push({button:this,size:QUICK_ACCESS_MENU.HighlightOnScroll_isInViewport(el[0])});
			})
			els = els.sort(function(a,b){
				if(a.size!==null && b.size!==null)
					return b.size - a.size;
				if(a.size===null && b.size===null)
					return 0;
				if(a.size === null)
					return 1;
				if(b.size === null)
					return -1;
			})
			//console.log(els);
			if(els && els[0])
			{
				els[0].button.classList.add('highlight');
			}
		})
	}
	static HighlightOnScroll_isInViewport(element) {
		var elementTop = $(element).offset().top;
	    var elementBottom = elementTop + $(element).outerHeight();
	    var delta = -$(window).height()/4;
	    var viewportTop = $(window).scrollTop() + delta;
	    var viewportBottom = viewportTop + $(window).height() - delta;
	    var top = elementTop>viewportTop ? elementTop : viewportTop
	    var bottom = elementBottom<viewportBottom ? elementBottom : viewportBottom
		//console.log(element,bottom-top);
	    return bottom-top > 0 ? bottom-top : null;
	}
}

window.moduleTemplateGeneric = {
	sliders : [],

	init: function() {
		var generics = $('.moduleTemplate[type="generic"]:not(.module-init)');
		generics.each(function(index){
			// ------------------- START OF modules EACH loop

			$module = $(this);
			if($module.width()==0 || $module.height()==0)
				return;

			$module.addClass('module-init');

			$module.find('.item-media').on('mouseover',function(e){ $(this).parents('.item').eq(0).addClass('item-media-hover') });
			$module.find('.item-media').on('mouseout',function(e){ $(this).parents('.item').eq(0).removeClass('item-media-hover') });
			$module.find('.item-content').on('mouseover',function(e){ $(this).parents('.item').eq(0).addClass('item-content-hover') });
			$module.find('.item-content').on('mouseout',function(e){ $(this).parents('.item').eq(0).removeClass('item-content-hover') });
			$module.find('.item-top-title').on('mouseover',function(e){ $(this).parents('.item').eq(0).addClass('item-top-title-hover') });
			$module.find('.item-top-title').on('mouseout',function(e){ $(this).parents('.item').eq(0).removeClass('item-top-title-hover') });

			// mouse over media detection even when any additionnal content is placed over
			$module.find('.item').on('mousemove',function(e){
				var media = $(this).find('.item-media')
				if(media.length)
				{
					var bounds = media[0].getBoundingClientRect();
					var posX = e.pageX;
					var posY = e.pageY - window.scrollY;
					//console.log(posX,bounds.left,bounds.right)
					//console.log(posY,bounds.top,bounds.bottom)
					if(posX>=bounds.left && posX<=bounds.right && posY>=bounds.top && posY<=bounds.bottom)
						media.addClass("hover");
					else
						media.removeClass("hover");
				}
			})
			$module.find('.item').on('mouseleave',function(){
				$(this).find('.item-media').removeClass("hover");
			})

			// 	 /$$   /$$             /$$                           /$$$$$$$  /$$
			// 	| $$$ | $$            | $$                          | $$__  $$|__/
			// 	| $$$$| $$  /$$$$$$  /$$$$$$          /$$$$$$       | $$  \ $$ /$$  /$$$$$$   /$$$$$$   /$$$$$$
			// 	| $$ $$ $$ /$$__  $$|_  $$_/         |____  $$      | $$  | $$| $$ |____  $$ /$$__  $$ /$$__  $$
			// 	| $$  $$$$| $$  \ $$  | $$            /$$$$$$$      | $$  | $$| $$  /$$$$$$$| $$  \ $$| $$  \ $$
			// 	| $$\  $$$| $$  | $$  | $$ /$$       /$$__  $$      | $$  | $$| $$ /$$__  $$| $$  | $$| $$  | $$
			// 	| $$ \  $$|  $$$$$$/  |  $$$$/      |  $$$$$$$      | $$$$$$$/| $$|  $$$$$$$| $$$$$$$/|  $$$$$$/
			// 	|__/  \__/ \______/    \___/         \_______/      |_______/ |__/ \_______/| $$____/  \______/
			// 	                                                                            | $$
			// 	                                                                            | $$
			// 	                                                                            |__/

			if(!$module.is('[skin^="diaporama"]'))
			{
				// ----------------------------------------------------------------------
				// PAGINATION
				// ----------------------------------------------------------------------

				module_tpl_default_pagination_insert_wrapper(this)
				module_tpl_default_pagination_update($(this));

				// ----------------------------------------------------------------------
				// QUICK ACCESS MENU
				// ----------------------------------------------------------------------

				(QUICK_ACCESS_MENU.handler($module)).init()
			}

			// 	 /$$$$$$$  /$$
			// 	| $$__  $$|__/
			// 	| $$  \ $$ /$$  /$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$  /$$$$$$/$$$$   /$$$$$$
			// 	| $$  | $$| $$ |____  $$ /$$__  $$ /$$__  $$ /$$__  $$|____  $$| $$_  $$_  $$ |____  $$
			// 	| $$  | $$| $$  /$$$$$$$| $$  \ $$| $$  \ $$| $$  \__/ /$$$$$$$| $$ \ $$ \ $$  /$$$$$$$
			// 	| $$  | $$| $$ /$$__  $$| $$  | $$| $$  | $$| $$      /$$__  $$| $$ | $$ | $$ /$$__  $$
			// 	| $$$$$$$/| $$|  $$$$$$$| $$$$$$$/|  $$$$$$/| $$     |  $$$$$$$| $$ | $$ | $$|  $$$$$$$
			// 	|_______/ |__/ \_______/| $$____/  \______/ |__/      \_______/|__/ |__/ |__/ \_______/
			// 	                        | $$
			// 	                        | $$
			// 	                        |__/

			if($module.is('[skin^="diaporama"]'))
			{
				(QUICK_ACCESS_MENU.handler($module,{scrollTo:false})).init()

				$module.find('.items').each(function(){

					var $slider = null;

					var items = $(this).find('.item');

					var autoplay = $(this).data('autoplay');
					autoplay = items.length && autoplay ? true:false;
					//console.log('autoplay',autoplay);

					var startslide = $(this).data('startslide') || 0;
					var startslide_mobile = $(this).data('startslide-mobile') || 0;

					if(items.length>0)
					{
						startslide = (items.length + startslide%items.length) % items.length;
						startslide_mobile = (items.length + startslide_mobile%items.length) % items.length;
					}

					var speed = $(this).data('diapoSpeed');
					speed = typeof speed=='undefined' ? 1000 : parseFloat(speed)*1000;

					var timeout = $(this).data('diapoTimeout');
					timeout = typeof timeout=='undefined'  ? 4000 : speed + parseFloat(timeout)*1000 + 1;

					var pausehover = parseInt($(this).data('diapoPausehover'));

					// pas de carousel sur petit écran - pas responsive dynamiquement - nécéssite un reload
					var carousel = window.innerWidth >= 980 ? Math.max(1,parseInt($(this).data('diapoCarousel'))) : 0;
					var carousel_gutter = carousel ? Math.max(0,parseInt($(this).data('diapoCarouselGutter'))) : 0;
					var carousel_currslide = carousel ? Math.max(0,parseInt($(this).data('diapoCarouselCurrslide'))) : 0;

					var pager = parseInt($(this).data('diapoPager'))>0;
					var pager_thumbnail = parseInt($(this).data('diapoPagerThumbnail'))>0;

					var mode = $(this).data('diapoTransition');
					var autoDirection = 'next';

					switch(mode)
					{
						case 'slideLeft': mode = 'horizontal'; autoDirection = 'next'; break;
						case 'slideRight': mode = 'horizontal'; autoDirection = 'prev'; break;
						case 'slideUp': mode = 'vertical'; autoDirection = 'next'; break;
						case 'slideDown': mode = 'vertical'; autoDirection = 'prev'; break;
					}

					var ctrl = parseInt($(this).data('diapoCtrl'))>0;
					ctrl = ctrl && items.length>1 ? true:false;

					// gestion du mode mobile
					if($(this).data('diapoCtrl')=='mobile' && window.innerWidth <= 980)
						ctrl = true;

					var slideWidth = parseInt($(this).outerWidth())/(carousel>0 ? carousel:1);
					if(carousel>1)
						slideWidth = slideWidth - carousel_gutter + carousel_gutter/(carousel-1);

					var moduleTemplate = $(this).parents('.moduleTemplate').eq(0);

					(QUICK_ACCESS_MENU.handler($module)).onSelect((idx) => {
						$slider ? $slider.goToSlide(idx) : null;
					})

					moduleTemplate.find('.additional-column-content').each(function(){
						if($(this).data('diapoCtrl') && $(this).find('.additional-bx-control').length==0)
						{
							$(this).append('<div class="additional-bx-control"><span class="btn-prev"><i class="fas fa-arrow-left"></i></span><span class="counter"></span><span class="btn-next"><i class="fas fa-arrow-right"></i></span></div>');

							$(this).find('.btn-prev').on('click',function(e){
								e.stopPropagation();
								$slider.goToPrevSlide();
							})
							$(this).find('.btn-next').on('click',function(e){
								e.stopPropagation();
								$slider.goToNextSlide();
							})
						}
					});

					var replaceInAdditionnalColumn = function(slide)
					{
						var title = slide.find('.item-suptitle').html(); title = title ? title : '';
						var subtitle = slide.find('.item-subtitle').html(); subtitle = subtitle ? subtitle : '';
						var content = slide.find('.item-content > .item-text > blockquote').html(); content = content ? content : '';
						var links = slide.find('.item-links').html(); links = links ? links : '';
						var picture = slide.find('.item-media').css('background-image') || '';
						picture = typeof picture=="string" ? picture.replace('url("','').replace('")','') : '';
						if(picture=='none')
							picture = slide.find('.item-media').data('background-image');

						picture = typeof picture=="string" ? picture.replace('url("','').replace('")','').replace(/&h=[0-9]+/,'').replace(/\?w=[0-9]+/,'?w=1200') : '';

						var url_detail = slide.find('.link-detail').attr('href');
						var url_book = slide.find('.link-book').attr('href');

						moduleTemplate.find('.additional-column-content').each(function(){
							$this = $(this);
							var html = $this.data('original-html');
							if(!html)
							{
								html = $this.html()
								$this.data('original-html',html);
							}
							if(html.match(/{{slide\./))
							{
								html = html.replace('{{slide.title}}',title);
								html = html.replace('{{slide.suptitle}}',title); // alias for title
								html = html.replace('{{slide.subtitle}}',subtitle);
								html = html.replace('{{slide.content}}',content);
								html = html.replace('{{slide.links}}',links);
								html = html.replace('{{slide.picture}}',picture);
								html = html.replace('{{slide.url_detail}}',url_detail);
								html = html.replace('{{slide.url_book}}',url_book);

								$this.html(html);

								$this.find('.btn-prev').on('click',function(e){
									e.stopPropagation();
									$slider.goToPrevSlide();
								})
								$this.find('.btn-next').on('click',function(e){
									e.stopPropagation();
									$slider.goToNextSlide();
								})
							}
						});
					}

					var updateAdditionnalCounter = function(index)
					{
						var c = moduleTemplate.find('.item:not(.bx-clone)').length
						var i = index+1;

						//i = i<10 ? '0' + i : i;
						//c = c<10 ? '0' + c : c;

						moduleTemplate.find('.additional-bx-control .counter').html(i+'/'+c);
						//console.log(i+'/'+c)
						moduleTemplate.find('.bx-controls-direction .bx-counter span').html(i+'/'+c);

						(QUICK_ACCESS_MENU.handler($module)).select(index,{scrollTo:false})
					}

					var updateOverflowItem = function(slide)
					{
						$items = moduleTemplate.find('.item');
						$items.removeClass('overflow-item overflow-left overflow-right overflow-on-slidingNext, overflow-on-slidingPrev');

						if(moduleTemplate.data('diapoOverflow')>0)
						{
							var overflowPosition = moduleTemplate.data('diapoOverflowPosition');

							var left = slide;
							var right = slide.nextAll().eq(carousel-2);

							if(overflowPosition=='left' || overflowPosition=='both')
							{
								$items.filter('[data-i="'+left.data('i')+'"]').addClass('overflow-item').addClass('overflow-left');
								$items.filter('[data-i="'+left.next().data('i')+'"]').addClass('overflow-on-slidingNext');
							}
							if(overflowPosition=='right' || overflowPosition=='both')
							{
								$items.filter('[data-i="'+right.data('i')+'"]').addClass('overflow-item').addClass('overflow-right');
								$items.filter('[data-i="'+right.prev().data('i')+'"]').addClass('overflow-on-slidingPrev');
							}
						}
					}

					function addThumbnailPager(currentIndex)
					{
						var ctrlNode = moduleTemplate.find('.bx-controls')
						if(ctrlNode.length==0)
						{
							moduleTemplate.find('.bx-wrapper').append('<div class="bx-controls"></div>');
							ctrlNode = moduleTemplate.find('.bx-controls')
						}
						var thumbnailPagerNode = $('<div class="bx-thumbnail-pager"></div>');
						ctrlNode.append(thumbnailPagerNode)
						items.each(function(i,item){
							var media = $(item).find('.item-media[data-thumbnail]')
							if(media)
							{
								var idx = $(item).data('i');
								var button = $('<button data-idx="'+idx+'" type="button" style="background-image:url(\''+media.data('thumbnail')+'\');"><span>'+idx+'</span></button>');
								thumbnailPagerNode.append(button);
								if(idx==currentIndex)
									button.addClass('active');
								button.on('click',function(){
									$slider.goToSlide($(this).data('idx'));
								})
							}
						})
					}

					// on décale les slide pour avoir le premier slide à l'emplacement désiré
					if(carousel_currslide > 0 && carousel_currslide < carousel)
					{
						var quantity = carousel_currslide
						var items = moduleTemplate.find('.items');
						while(quantity>0) {
							items.find('> .item').eq(-1).prependTo(items);
							quantity--;
						}
						items.find('> .item').each(function(index){
							this.setAttribute('data-i',index);
						})
					}

					var applyBlankFrame = function(tpl,nb) {
						// mark iframe to be unloaded
						moduleTemplate.find('iframe').addClass('applyBlankFrameRequired')
						// load current ones
						var limit = nb+0;
						var curr = tpl.find('.curr-item')
						if(limit>1)
							limit++;
						for(var i=0; i<limit; i++)
						{
							var iframe = $(curr).find('iframe')
							// remove special classes
							iframe.removeClass('applyBlankFrameRequired')
							src = iframe.attr('diaporama-src');
							if(src && src!='about:blank')
								iframe.attr('src',src);
							curr = curr.next();
						}
						// blank page on all marked iframes
						moduleTemplate.find('iframe.applyBlankFrameRequired').attr('src','about:blank')
					}


					var bxSliderConfig = {
						touchEnabled:false, // no more touch support till swipe up capture break natural scroll in webpage
						preventDefaultSwipeY: false,
						mode: carousel>1 ? 'horizontal':mode,
						autoDirection:autoDirection,
						startSlide:window.innerWidth >= 980 ? startslide : startslide_mobile,
						speed: speed,
						pager: pager,
						controls: ctrl,
						prevText:'<span class="my-btn-prev"><i class="fas fa-angle-left"></i></span>',
						nextText:'<span class="my-btn-next"><i class="fas fa-angle-right"></i></span>',
						auto: autoplay, // autoplay is also conditionned by slider visibility on scroll
						responsive: true,
						moveSlides: 1,
						infiniteLoop: true,
						pause: timeout,
						autoHover:pausehover>0 ? true:false,
						onSliderLoad: function(currentIndex) {
							//console.log('onSliderLoad');
							moduleTemplate.find('.items > .item').removeClass('curr-item');
							$curr = moduleTemplate.find('.items > .item:not(.bx-clone)').eq(currentIndex)
							if(carousel_currslide)
								$curr = $curr.nextAll().eq(carousel_currslide-1);
							$curr.addClass('curr-item');

							if(ctrl)
							{
								moduleTemplate.find('.bx-controls-direction').append('<span class="bx-counter"><span>../..</span></span>');
							}
							updateOverflowItem($curr)
							replaceInAdditionnalColumn($curr);
							updateAdditionnalCounter(currentIndex);

							if(pager_thumbnail)
							{
								addThumbnailPager(currentIndex);
							}

							var swipeAction = function (e) {
								if(e && e.detail && e.detail.directions && e.detail.directions.left)
									$slider.goToNextSlide();
								else if(e && e.detail && e.detail.directions && e.detail.directions.right)
									$slider.goToPrevSlide();
								e.preventDefault();
								e.stopPropagation();
							}

							var container = moduleTemplate[0];
							if(container)
							{
								var listener = SwipeListener(container);
								container.addEventListener('swipe', swipeAction);
							}

							var container2 = moduleTemplate.find('.bx-controls-direction')[0];
							if(container2)
							{
								var listener2 = SwipeListener(container2);
								container2.addEventListener('swipe', swipeAction);
							}

							// build the real hapi-video node from the fake one
							moduleTemplate.find('.curr-item hapi-video-diaporama').each(function (o, elt) {
								var newElt = $("<hapi-video/>");
								Array.prototype.slice.call(elt.attributes).forEach(function(a) {
									newElt.attr(a.name, a.value);
								});
								$(elt).wrapInner(newElt).children(0).unwrap();
							});

							// autoplay current item video if needed
							moduleTemplate.find('.curr-item hapi-video[autoplay]').each(function() {
								setTimeout(function(){
									this.play();
								}.bind(this), 50);
							})

							// build real Iframe content instead of blank
							moduleTemplate.find(' iframe').each(function() {
								var src = $(this).attr('diaporama-src');
								if(!src)
								{
									src = $(this).attr('src');
									if(src=='about:blank')
										src = $(this).attr('src_org');
									$(this).attr('diaporama-src',src)
									$(this).attr('src_org','null')
								}
								src = $(this).attr('diaporama-src');
								if(src && src=='about:blank')
									$(this).attr('src',src);
							})

							applyBlankFrame(moduleTemplate,carousel)

							var els = moduleTemplate.find('[data-background-image-original]')
							els.each(function() { (window.hapiLazy_reset_background.bind(this,null))() })
							els.each(window.hapiLazy_build_background)

						},
						onSlideBefore: function($slideElement,oldIndex,newIndex) {
							if($slider.animationInProgress)
								return false;

							moduleTemplate.find('hapi-video').each(function() {
								this.pause();
							})

							//console.log('onSlideBefore');
							$slider.animationInProgress = true;
							moduleTemplate.find('.bx-wrapper').addClass('sliding')
							moduleTemplate.find('.additional-column-content').addClass('sliding');
							moduleTemplate.find('.bx-controls .bx-thumbnail-pager button').removeClass('active');
							moduleTemplate.find('.bx-controls .bx-thumbnail-pager bustton[data-idx="'+newIndex+'"]').addClass('active');
							updateAdditionnalCounter(newIndex);
						},
						onSlideNext:function($slideElement,oldIndex,newIndex) {
							//console.log('onSlideNext');
							moduleTemplate.find('.items > .item').removeClass('prev-item').removeClass('next-item');
							moduleTemplate.find('.items > .item[data-i="'+oldIndex+'"]').addClass('prev-item');
							moduleTemplate.find('.items > .item[data-i="'+newIndex+'"]').addClass('next-item');
							moduleTemplate.find('.bx-wrapper').addClass('slidingNext').removeClass('slidingPrev')
						},
						onSlidePrev:function($slideElement,oldIndex,newIndex) {
							//console.log('onSlidePrev');
							moduleTemplate.find('.items > .item').removeClass('prev-item').removeClass('next-item');
							moduleTemplate.find('.items > .item[data-i="'+oldIndex+'"]').addClass('prev-item');
							moduleTemplate.find('.items > .item[data-i="'+newIndex+'"]').addClass('next-item');
							moduleTemplate.find('.bx-wrapper').addClass('slidingPrev').removeClass('slidingNext')
						},
						onSlideAfter: function($slideElement,oldIndex,newIndex) {
							$slider.animationInProgress = false;
							//console.log('onSlideAfter');
							moduleTemplate.find('.items > .item').removeClass('prev-item').removeClass('next-item').removeClass('curr-item');
							moduleTemplate.find('.bx-wrapper').removeClass('sliding').removeClass('slidingPrev').removeClass('slidingNext')

							$curr = moduleTemplate.find('.items > .item:not(.bx-clone)').eq(newIndex)
							if(carousel_currslide)
								$curr = $curr.nextAll().eq(carousel_currslide-1);
							$curr.addClass('curr-item');

							// pause all videos
							moduleTemplate.find('hapi-video').each(function() {
								this.pause();
							})

							// build the real hapi-video node from the fake one
							moduleTemplate.find('.curr-item hapi-video-diaporama').each(function (o, elt) {
								var newElt = $("<hapi-video/>");
								Array.prototype.slice.call(elt.attributes).forEach(function(a) {
									newElt.attr(a.name, a.value);
								});
								$(elt).wrapInner(newElt).children(0).unwrap();
							});

							// autoplay current item video if needed
							moduleTemplate.find('.curr-item hapi-video[autoplay]').each(function() {
								setTimeout(function(){
									this.play();
								}.bind(this), 50);
							})

							applyBlankFrame(moduleTemplate,carousel)

							updateOverflowItem($slideElement)
							replaceInAdditionnalColumn($curr);
							updateAdditionnalCounter(newIndex);

							moduleTemplate.find('[data-background-image-original]').each(window.hapiLazy_check_background);

							setTimeout(function(moduleTemplate){
								moduleTemplate.find('.additional-column-content').removeClass('sliding');
							}.bind(null,moduleTemplate),1);
						},
					}

					if($(window).width()<980)
					{
						//console.log('module bxSlider init :: mobile');
						$slider = $(this).bxSlider(bxSliderConfig);
					}
					else
					{
						//console.log('module bxSlider init :: desktop');
						// desktop override - mainly for carousel mode
						bxSliderConfig.touchEnabled = false;
						bxSliderConfig.minSlides = 1;
						bxSliderConfig.maxSlides = carousel;
						bxSliderConfig.slideWidth = slideWidth;
						bxSliderConfig.slideMargin = carousel_gutter;
						//bxSliderConfig.shrinkItems = true;

						$slider = $(this).bxSlider(bxSliderConfig);
					}
					$(this).data('bxSliderConfig',bxSliderConfig);
					$(this).data('bxSlider',$slider);

					$(this).parents('.moduleTemplate').eq(0)[0].sliderHandler = $slider;

					moduleTemplateGeneric.sliders.push({
						$:$(this),
						slider:$slider,
						autoplay:autoplay,
					});
				})
			}

			// ------------------- END OF modules EACH loop
		});
	}
}
HAPI_PageCycle.onLoad(function(){
	moduleTemplateGeneric.init()

	var sliderAutomaticPlayOnScroll = function()
	{
		//console.log('sliderAutomaticPlayOnScroll');
		for(var i=0; i<moduleTemplateGeneric.sliders.length; i++)
		{
			var item = moduleTemplateGeneric.sliders[i];
			if(item.autoplay){
				var bxViewport = $(item.$[0]).parent()[0];
				if(sliderAutomaticPlayOnScroll_isHidden(bxViewport))
				{
					if(!bxViewport.getAttribute('sliderAutomaticPlayOnScroll_hidden'))
					{
						bxViewport.setAttribute('sliderAutomaticPlayOnScroll_hidden',1);
						item.slider.reloadSlider();
					}
				}
				else
				{
					if(sliderAutomaticPlayOnScroll_isInViewport(bxViewport))
					{
						if(bxViewport.getAttribute('sliderAutomaticPlayOnScroll_hidden'))
						{
							//console.log('sliderAutomaticPlayOnScroll full refresh',item.slider)
							bxViewport.setAttribute('sliderAutomaticPlayOnScroll_hidden',0);
							item.slider.redrawSlider();
							item.slider.reloadSlider();
						}
						//console.log('start',bxViewport);
						item.slider.startAuto(true);


					}
					else
					{
						//console.log('stop',bxViewport);
						item.slider.stopAuto(true);
					}
				}
			}
		}
	}

	function sliderAutomaticPlayOnScroll_isHidden(element) {
		if(window.getComputedStyle(element).display==='none')
			return true;
		if(element.parentElement)
			return sliderAutomaticPlayOnScroll_isHidden(element.parentElement);
		return false;
	}

	function sliderAutomaticPlayOnScroll_isInViewport(element) {
		var elementTop = $(element).offset().top;
	    var elementBottom = elementTop + $(element).outerHeight();
	    var delta = -$(window).height()/4;
	    var viewportTop = $(window).scrollTop() + delta;
	    var viewportBottom = viewportTop + $(window).height() - delta;
	    var top = elementTop>viewportTop ? elementTop : viewportTop
	    var bottom = elementBottom<viewportBottom ? elementBottom : viewportBottom
		//console.log(element,bottom-top);
	    return bottom-top > 0 ? bottom-top : null;
	}

	var sliderAutomaticPlayOnScroll_timeout = null;
	$(window).on('scroll',function(){
		clearTimeout(sliderAutomaticPlayOnScroll_timeout);
		sliderAutomaticPlayOnScroll_timeout = setTimeout(sliderAutomaticPlayOnScroll, 100);

		QUICK_ACCESS_MENU.HighlightOnScroll()
	});
	$(window).on('click',function(){
		clearTimeout(sliderAutomaticPlayOnScroll_timeout);
		sliderAutomaticPlayOnScroll_timeout = setTimeout(sliderAutomaticPlayOnScroll, 100);
	});
	sliderAutomaticPlayOnScroll();

	setInterval(moduleTemplateGeneric.init,1000)
});
;
// ----------------------------------------------------------------------------------
// Module : _TEMPLATE
// modules/_template/script.js
// ----------------------------------------------------------------------------------
HAPI_PageCycle.onLoad(function(){
	$('.module_wrapper[template="multitags"] .items-section--view-more').on('click',function(){
		$(this).parent().toggleClass('show-extra-items');
	})
	$('.module_wrapper[template="multitags"] .moduleTemplate-controls .control--prev').on('click',function(){
		multitags_carrousel_prev($(this).parents('.moduleTemplate').first().find('.sections-wrapper'))
	})
	$('.module_wrapper[template="multitags"] .moduleTemplate-controls .control--next').on('click',function(){
		multitags_carrousel_next($(this).parents('.moduleTemplate').first().find('.sections-wrapper'))
	})
})

function multitags_carrousel_next(element){
	if(!$(element).hasClass('carrousel-animate'))
	{
		$(element).addClass('carrousel-animate');
		$(element).addClass('carrousel-next-init');
		setTimeout(function(){
			$(element).addClass('carrousel-next-go');
			setTimeout(function(){
				$(element).append($(element).find('.items-section').first());
				$(element).removeClass('carrousel-animate');
				$(element).removeClass('carrousel-next-init');
				$(element).removeClass('carrousel-next-go');
			}.bind(null,element),1000)
		}.bind(null,element),50)
	}
}
function multitags_carrousel_prev(element){
	if(!$(element).hasClass('carrousel-animate'))
	{
		$(element).addClass('carrousel-animate');
		$(element).addClass('carrousel-prev-init');
		$(element).prepend($(element).find('.items-section').last());
		setTimeout(function(){
			$(element).addClass('carrousel-prev-go');
			setTimeout(function(){
				$(element).removeClass('carrousel-animate');
				$(element).removeClass('carrousel-prev-init');
				$(element).removeClass('carrousel-prev-go');
			}.bind(null,element),1000)
		}.bind(null,element),50)
	}
}
;
// ----------------------------------------------------------------------------------
// Module : _TEMPLATE
// modules/_template/verticalstripes/script.js
// ----------------------------------------------------------------------------------
HAPI_PageCycle.onLoad(function() {
	$('.moduleTemplate[type="verticalstripes"] .foreground-item').on('mouseover',function(e){
		var i = $(this).data('i')
		var mod = $(this).parents('.moduleTemplate')

		mod.find('.background-item').removeClass('on').removeClass('off').removeClass('iddle');
		mod.find('.background-item:not([data-i="'+i+'"])').addClass('off');
		mod.find('.background-item[data-i="'+i+'"]').addClass('on');

		mod.find('.foreground-item').removeClass('on').removeClass('off').removeClass('iddle');
		mod.find('.foreground-item:not([data-i="'+i+'"])').addClass('off');
		mod.find('.foreground-item[data-i="'+i+'"]').addClass('on');
	})

	$('.moduleTemplate[type="verticalstripes"]').on('mouseover',function(e){
		var mod = $(this);
		mod.addClass('active')
	});
	$('.moduleTemplate[type="verticalstripes"]').on('mouseout',function(e){
		var mod = $(this);
		mod.removeClass('active')
		mod.find('.background-item').removeClass('on').removeClass('off').addClass('iddle');
		mod.find('.foreground-item').removeClass('on').removeClass('off').addClass('iddle');
	});
});
;
// ----------------------------------------------------------------------------------
// Module : ACCORDEON
// modules/Accordeon/templates/script.js
// ----------------------------------------------------------------------------------
HAPI_PageCycle.onLoad(function() {
	$('[module="accordeon"] .accordion-title').on('click',function(){
		var current_active = $(this).parents('.module_wrapper').eq(0).find('.accordion-item.active');
		var new_active = $(this).parents('.accordion-item').eq(0);

		current_active.find('.accordion-content').slideUp(function(){
			// remove active class on old active section
			$(this).parents('.accordion-item').eq(0).removeClass('active');
		});
		new_active.addClass('active').find('.accordion-content').slideUp(0).slideDown();
	});
});
;
// ----------------------------------------------------------------------------------
// Module : AVIS
// modules/Avis/templates/script.js
// ----------------------------------------------------------------------------------
HAPI_PageCycle.onLoad(function() {
	$('.module_wrapper[module="avis"][template="_default"] .display-all-reviews-trigger button').click(function(event) {
		event.preventDefault();
		$(this).parents('.module_wrapper').eq(0).addClass("display-all-reviews");
	});
});

HAPI_PageCycle.onLoad(function(){
	$('.module_wrapper[module="avis"][template="slider"]').each(function(index){
		var slider = $(this).find('.slider');
		slider.bxSlider({
			mode: 'horizontal',
			speed: slider.data('pause') > 1200 ? 1000 : slider.data('pause')/2,
			pause: slider.data('pause') ? slider.data('pause') : 4000,
			pager: true,
			pagerCustom: $(this).find('.slider-pager'),
			controls: true,
			auto: true,
			nextSelector: $(this).find('.slider-next'),
			prevSelector: $(this).find('.slider-prev'),
			nextText: '<i class="fa fa-arrow-right"></i>',
			prevText: '<i class="fa fa-arrow-left"></i>'
		});
	})
});
;
// ----------------------------------------------------------------------------------
// Module : FAQ
// modules/Faq/templates/script.js
// ----------------------------------------------------------------------------------
HAPI_PageCycle.onLoad(function() {
	$('[module="faq"][skin="accordion"] .faq-question').on('click',function(){
		var current_active = $(this).parents('.module_wrapper').eq(0).find('.faq-item.active');
		var new_active = $(this).parents('.faq-item').eq(0);

		current_active.find('.faq-answer').slideUp(function(){
			// remove active class on old active section
			$(this).parents('.faq-item').eq(0).removeClass('active');
		});
		new_active.addClass('active').find('.faq-answer').slideUp(0).slideDown();
	});
});
;
// ----------------------------------------------------------------------------------
// Module : FORMS
// modules/Forms/templates/script.js
// ----------------------------------------------------------------------------------
HAPI_PageCycle.onLoad(function() {
	setInterval(function(){
		var els = $('[module="forms"] form:not(.ajax-ready)');
		if(els.length>0)
		{
			//console.log(els)
			els.addClass('ajax-ready');
			els.on('submit',function(event){
				$(this).find('.form-container > *').fadeTo(250,0.5);
				$(this).find('.form-container').prepend('<div class="form-submit-in-progress"><i class="fas fa-3x fa-spinner fa-spin"></i></div>');
				var btn = $(this).find('.form-container button[type="submit"]')
				btn.data('label', btn.html());
				btn.css('pointer-events', 'none');
				btn.html('<i class="fas fa-spin fa-spinner"></i>');
			});
			// échec d'un envoi ajax (cf. ajaxform.php) : on retire le spinner pour permettre un nouvel essai
			els.on('ajaxform:failure',function(){
				$(this).find('.form-submit-in-progress').remove();
				$(this).find('.form-container > *').stop().fadeTo(0,1);
				var btn = $(this).find('.form-container button[type="submit"]')
				btn.css('pointer-events', '');
				btn.html(btn.data('label'));
			});
		}
	},500)
});

;
// ----------------------------------------------------------------------------------
// Module : GALERIE
// modules/Galerie/templates/customizable/script.js
// ----------------------------------------------------------------------------------
(function(){
	HAPI_PageCycle.onLoad(function(){

		// init behavior
		module_init();

		// refresh ui on window resize
		$(window).on('resize', function(){
			$('.module_wrapper[module="galerie"][template="customizable"] .mod_gallery--feeds--wrapper').each(function(){
				el = $(this);
				itemCloneAdjustement(el)
			})
		});
	})

	function itemCloneAdjustement(el) {
		let feed = el.find('.mod_gallery--feeds')

		feed.find('.gallery-item.clone').remove()
		let items = feed.find('.gallery-item');

		let q = 1
		if($(window).innerWidth()>1400)
			q = feed.data('column') * feed.data('row');
		else if($(window).innerWidth()>980)
			q = feed.data('column-tablet') * feed.data('row-tablet');
		else
			q = feed.data('column-mobile') * feed.data('row-mobile');

		for(let i=0;i<q;i++)
		{
			items.each(function(){
				$(this).clone().addClass('clone').appendTo(feed);
			})
		}
	}

	function module_init() {

		$('.module_wrapper[module="galerie"][template="customizable"] .mod_gallery--feeds--wrapper').each(function(){
			el = $(this);

			itemCloneAdjustement(el)

			var mod = {
				autoplay_interval:false,
				animate_timeout:false,
				el: el,
				feed: el.find('.mod_gallery--feeds'),
				_prev: function()
				{
					var self = this;
					if(!self.animate_timeout)
					{
						self._autoplay_stop();
						self.feed.attr('data-animate','prev');
						clearTimeout(self.animate_timeout)
						self.animate_timeout = setTimeout(function(){
							self.animate_timeout = false;
							self.feed.attr('data-animate','');
							self.feed.find('.gallery-item:last-child').prependTo(self.feed);
							self._autoplay_start();
						},mod._get_speed()+1);
					}
				},
				_next: function()
				{
					var self = this;
					if(!self.animate_timeout)
					{
						self._autoplay_stop();
						self.feed.attr('data-animate','next');
						clearTimeout(this.animate_timeout)
						self.animate_timeout = setTimeout(function(){
							self.animate_timeout = false;
							self.feed.attr('data-animate','');
							self.feed.find('.gallery-item:first-child').appendTo(self.feed);
							self._autoplay_start();
						},mod._get_speed()+1);
					}
				},
				_autoplay_init: function()
				{
					clearTimeout(this.animate_timeout)
					this.animate_timeout = false;
					this._autoplay_stop();
					this._autoplay_start();
				},
				_autoplay_start: function()
				{
					var W = window.innerWidth;

					var c = parseInt(mod.feed.attr('data-carrousel'));
					var a = parseInt(mod.feed.attr('data-autoplay'));
					var t = parseInt(mod.feed.attr('data-autoplay-interval'));
					if(W<=980)
					{
						c = parseInt(mod.feed.attr('data-carrousel-mobile'));
						a = parseInt(mod.feed.attr('data-autoplay-mobile'));
						t = parseInt(mod.feed.attr('data-autoplay-interval-mobile'));
					}
					else if(W<=1400)
					{
						c = parseInt(mod.feed.attr('data-carrousel-tablet'));
						a = parseInt(mod.feed.attr('data-autoplay-tablet'));
						t = parseInt(mod.feed.attr('data-autoplay-interval-tablet'));
					}

					//console.log('_autoplay_start',t);

					if(c && a && t>=0)
					{
						this.autoplay_interval = setInterval(mod._autoplay, t);
					}
				},
				_autoplay_stop: function()
				{
					this.feed.attr('data-animate','');
					clearInterval(this.autoplay_interval)
				},
				_autoplay: function()
				{
					mod._next();
				},
				_get_speed: function()
				{
					var W = window.innerWidth;
					var s = parseInt(mod.feed.attr('data-carrousel-speed'));
					if(W<=980)
					{
						s = parseInt(mod.feed.attr('data-carrousel-speed-mobile'));
					}
					else if(W<=1400)
					{
						s = parseInt(mod.feed.attr('data-carrousel-speed-tablet'));
					}
					return s;
				}
			}

			var prev = $('<button type="buttton" class="gallery-prev"><i class="fas fa-angle-left"></i></button>');
			prev.on('click',mod._prev.bind(mod))
			el.parent().append(prev);

			var next = $('<button type="buttton" class="gallery-next"><i class="fas fa-angle-right"></i></button>');
			next.on('click',mod._next.bind(mod))
			el.parent().append(next);

			mod._autoplay_start();
			$(window).on('resize',mod._autoplay_init.bind(mod));
		});
	}
})()
;
// ----------------------------------------------------------------------------------
// Module : GALERIE
// modules/Galerie/templates/script.js
// ----------------------------------------------------------------------------------
HAPI_PageCycle.onLoad(async function() {
	
	$('.module_wrapper[module="galerie"][template="_default"][skin="_default"]').each(function(){
		// le skin "default" exploite un slider
		var items = $(this).find('.gallery-item-media');
		var autoplay = $(this).data('autoplay');
		$(this).find('.gallery-items').bxSlider({
			mode: 'fade',
			speed: 1000,
			pager: true,
			startSlide:1,
			touchEnabled:true,
			controls: items.length ? true : false,
			auto: items.length && autoplay ? true : false,
			pause: 4000,
			autoHover:true,
			prevText:'<span class="my-btn-prev"><i class="fas fa-angle-left"></i></span>',
			nextText:'<span class="my-btn-next"><i class="fas fa-angle-right"></i></span>',
			onSliderLoad: function() {
				// fix slide would not appear on page load
				this.goToSlide(0);
			},
			onSlideBefore: function(slideElement, oldIndex, newIndex) {
			}
		});
		$(this).find('.gallery-item').data('visible',true);

		// un clique sur un tag ouvre une fancybox limité au visuels associé au tag
		$(this).find('.gallery-tag').click(function(ev) {
			ev.preventDefault();
			$gallery = $(this).parents('.module_wrapper');
			var tag = ''+$(this).data('tag');
			var hrefs = []
			var items = $gallery.find('.gallery-item-media');
			for (var i = 0; i < items.length; i++)
			{
				var tags = eval(items.eq(i).data('tags'));
				if(tags && tags.length && tags.indexOf(tag)>=0)
					hrefs.push({ "src" : items.eq(i).data('backgroundImage'), opts : { "caption" : items.eq(i).data('title') } });
			}
			$.fancybox.open( hrefs, {
				padding: 0,
				transitionIn: 'none',
				transitionOut: 'none',
				type: 'image',
				changeFade: 0,
				touch: true,
				loop:true,
				btnTpl: {
					arrowLeft:
						'<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}">' +
							'<i class="fas fa-2x fa-angle-left"></i>' +
						"</button>",
					arrowRight:
						'<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}">' +
							'<i class="fas fa-2x fa-angle-right"></i>' +
						"</button>",
				},
			});
		})
	});

	// ouverture en fancybox d'une galerie plein écran au clique sur une image
	$('.module_wrapper[module="galerie"]').each(function(){

		// pour les skin autre que _default les tags permettre de filtrer les visuels
		if($(this).attr('template')!='_default' || $(this).attr('skin')!=='_default')
		{
			$(this).find('.gallery-tag').click(async function(ev) {
				ev.preventDefault();

				$gallery = $(this).parents('.module_wrapper');

				if($(this).attr('reset')=='true')
				{
					$gallery.find('.gallery-tag').removeClass('active');

					$gallery.find('.gallery-item').data('visible',true);
					$gallery.find('.gallery-item').removeClass('pushafter');
					setTimeout(function(){
						$gallery.find('.gallery-item').removeClass('highlighted');
						$gallery.find('.gallery-item').removeClass('filtered');
					},250)

					if($gallery.attr('template')=='masonry')
					{
						await HAPI_PageCycle.require(['jquery-masonry']);
						$gallery.find('.gallery-items').masonry('destroy').masonry({
							itemSelector: '.gallery-item',
							percentPosition:true,
						});
					}
				}
				else
				{
					$gallery.find('.gallery-tag').not(this).removeClass('active');
					$(this).toggleClass('active');

					if($(this).hasClass('active'))
					{

						var tag = ''+$(this).data('tag');
						var items = $gallery.find('.gallery-item-media');

						var highlighted = [];
						var filtered = [];
						for (var i = items.length -1 ; i >=0; i--)
						{
							var item = items.eq(i).parents('.gallery-item')
							var tags = eval(items.eq(i).data('tags'));
							if(tags && tags.length && tags.indexOf(tag)>=0)
							{
								highlighted.push(item[0]);
							}
							else
							{
								filtered.push(item[0]);
							}
						}
						//console.log({highlighted,filtered});

						$(filtered)
							.removeClass('highlighted')
							.addClass('filtered')
							.data('visible',false);

						setTimeout(function(){
							$(filtered).addClass('pushafter');

							$(highlighted)
								.removeClass('pushafter')
								.removeClass('filtered')
								.addClass('highlighted')
								.data('visible',true);
						},250)
					}
					else
					{
						$gallery.find('.gallery-item').data('visible',true);
						$gallery.find('.gallery-item').removeClass('pushafter');
						setTimeout(function(){
							$gallery.find('.gallery-item').removeClass('highlighted');
							$gallery.find('.gallery-item').removeClass('filtered');
						},250)
					}
					if($gallery.attr('template')=='masonry')
					{
						setTimeout(async function(){
							await HAPI_PageCycle.require(['jquery-masonry']);
							$gallery.find('.gallery-items').masonry('destroy').masonry({
								itemSelector: '.gallery-item.highlighted',
								percentPosition:true,
							});
						},300);
					}
				}
			})
		}

		$(this).find('.gallery-item a').on('click',function(e){
			e.stopPropagation();
		});

		$(this).find('.gallery-item').click(function(ev) {
			ev.preventDefault();
			$gallery = $(this).parents('.module_wrapper');
			var hrefs = []
			if($gallery.find('.gallery-item.highlighted').length>0)
			{
				var items = [
					$gallery.find('.gallery-item.highlighted'),
					$gallery.find('.gallery-item.filtered')
				];
			}
			else
			{
				var items = [$gallery.find('.gallery-item')];
			}
			var startAt = null;

			if(!$(this).data('visible'))
			{
				$gallery.find('.gallery-tag').removeClass('active');
				$gallery.find('.gallery-item').data('visible',true);
				$gallery.find('.gallery-item').animate({opacity:1},500);
			}

			for (var i = 0; i < items.length; i++)
			{
				for (var j = 0; j < items[i].length; j++)
				{
					if(items[i].eq(j)[0]==this)
						startAt = j;
					if(items[i].eq(j).data('visible'))
					{
						$media = items[i].eq(j).find('.gallery-item-media');
						if($media.find('img').length>0)
						{
							var src = $media.find('img').eq(0).data('fullscreen') || $media.find('img').eq(0).attr('src');
							hrefs.push({ "src" : src, opts : { "caption" : $media.data('title') } });
						}
						else
						{
							hrefs.push({ "src" : $media.data('backgroundImage'), opts : { "caption" : $media.data('title') } });
						}
					}
				}
			}
			if(startAt!==null)
			{
				//console.log(startAt);
				$.fancybox.open( hrefs, {
					index: startAt,
					padding: 0,
					transitionIn: 'none',
					transitionOut: 'none',
					type: 'image',
					changeFade: 0,
					touch: true,
					loop:true,
					btnTpl: {
						arrowLeft:
							'<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}">' +
								'<i class="fas fa-2x fa-angle-left"></i>' +
							"</button>",
						arrowRight:
							'<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}">' +
								'<i class="fas fa-2x fa-angle-right"></i>' +
							"</button>",
					},
				});
			}
		});
	});

	$('.module_wrapper[module="galerie"][template="masonry"]').each(async function(){
		await HAPI_PageCycle.require(['jquery-masonry']);

		$('.gallery-items').masonry({
            itemSelector: '.gallery-item',
            percentPosition:true,
        });

        $('.gallery-item img').on('load',function(){
        	$('.gallery-items').masonry({
	            itemSelector: '.gallery-item',
	            percentPosition:true,
	        });
        })
	});
});
;
// ----------------------------------------------------------------------------------
// Module : INSTAGRAM
// modules/Instagram/templates/script.js
// ----------------------------------------------------------------------------------
HAPI_PageCycle.onLoad(function(){
	mod_instagram_mosaic_init();
	$(window).on('resize',mod_instagram_mosaic_init);

	mod_instagram_customizable_init();
	mod_instagram_feedreader_init();
})

function mod_instagram_feedreader_init() {
	$(".mod_instagram--feeds a").off('click.instagram-feedreader');
	$(".mod_instagram--feeds[data-feedreader!=\"\"] a").on('click.instagram-feedreader',function(event){
		event.preventDefault();
		event.stopPropagation();
		var feed = eval('mod_instagram_feed_' + $(this).parents('.mod_instagram--feeds').eq(0).data('feedreader'));
		mod_instagram_feedreader_build(feed,$(this).attr('href'));
	})
}

var mod_instagram_feedreader_timeout = null;
function mod_instagram_feedreader_build(feed,target_url)
{
	$('#mod_instagram_feedreader').remove();
	var feedreader = $('<div id="mod_instagram_feedreader">'
			+'<div id="mod_instagram_feedreader-loader"><i class="fal fa-spinner-third fa-spin"></i></div>'
			+'<div id="mod_instagram_feedreader-close">&times;</div>'
		+'</div>');
	feedreader.on('click',function(event){
		feedreader.removeClass('loading')
		feedreader.removeClass('init')
		clearTimeout(mod_instagram_feedreader_timeout);
		mod_instagram_feedreader_timeout = setTimeout(function(){
			$('#mod_instagram_feedreader').remove();
		},500)
	})
	feedreader.find('#mod_instagram_feedreader-loader').on('click',function(event){
		event.stopPropagation();
		feedreader.removeClass('loading')
		feedreader.removeClass('init')
		clearTimeout(mod_instagram_feedreader_timeout);
		mod_instagram_feedreader_timeout = setTimeout(function(){
			$('#mod_instagram_feedreader').remove();
		},500)
	})

	$('body').append(feedreader);

	var wrapper = $('<div id="mod_instagram_feedreader-wrapper"></div>');
	wrapper.on('click',function(event){
		event.stopPropagation();
	})

	for(var i=0; i<feed.length; i++)
	{
		var item = feed[i];
		var age = Math.ceil((new Date().getTime() - 3600*12*1000 - new Date(item.date).getTime())/(3600*24*1000));
		if(age>0)
		{
			switch (ENV_LNG) {
				case 'fr':
					age = 'il y à '+age+(age>1 ? ' jours':' jour');
					break;
				default:
					age = 'since '+age+(age>1 ? ' days':' day');
					break;
			}
		}
		else
			age = false

		wrapper.append('<div class="mod_instagram_feedreader-item" data-target="'+item.link+'">'
			+'<div class="heading">'
				+'<dl class="heading-user">'
					+(item.profile.profilePicture ? '<dd class="heading-user-picture"><span style="background-image:url(\''+item.profile.profilePicture+'\');"></span></dd>' : '')
					+'<dd class="heading-user-name"><a href="https://www.instagram.com/'+item.profile.userName+'">'
						+'<strong>'+item.profile.userName+'</strong>'
						+(item.profile.fullName ? '<small>'+item.profile.fullName+'</small>' : '')
					+'</a></dd>'
				+'</dl>'
				+'<dl class="heading-action">'
					+'<dd class="heading-action-instagram"><a href="'+item.link+'" target="_blank"><i class="fab fa-instagram"></i></a></dd>'
				+'</dl>'
			+'</div>'
			+'<a href="'+item.link+'" target="_blank"><img src="'+item.src+'"></a>'
			+'<dl class="counter">'
				+(item.likes ? '<dd>'+item.likes.count+' <i class="far fa-heart"></i></dd>' : '')
				+(item.comments ? '<dd>'+item.comments.count+' <i class="far fa-comment"></i></dd>' : '')
			+'</dl>'
			+'<blockquote class="caption"><strong><a href="'+item.link+'" target="_blank">'+item.profile.userName+'</a></strong> '+(item.caption ? item.caption : '')+'</blockquote>'
			+(age
				? '<dl class="date"><dd>'+age+'</dd></dl>'
				: null
			)
		+'</div>');
	}

	clearTimeout(mod_instagram_feedreader_timeout);
	mod_instagram_feedreader_timeout = setTimeout(function(){
		feedreader.addClass('loading');
		feedreader.append(wrapper);

		clearTimeout(mod_instagram_feedreader_timeout);
		mod_instagram_feedreader_timeout = setTimeout(function(){
			feedreader.addClass('init');
			feedreader.removeClass('loading')

			var feedreader_scroll_function = function(expected_pos)
			{
				var relative_pos = $('.mod_instagram_feedreader-item[data-target="'+target_url+'"]').offset().top;
				var delta = $(feedreader).offset().top - $(feedreader).scrollTop();
				target_pos = relative_pos - delta;
				//console.log({expected_pos,relative_pos,delta,target_pos});
				//console.log(Math.ceil(target_pos/10),Math.ceil(expected_pos/10))
				if(Math.ceil(target_pos/10)!=Math.ceil(expected_pos/10))
				{
					$(feedreader).animate({
						scrollTop: target_pos
					}, 200,feedreader_scroll_function.bind(this,target_pos));
				}
			}
			feedreader_scroll_function(0);
		},1000)
	},10)
}

function mod_instagram_mosaic_init() {
	$('.module_wrapper[module="instagram"][template="mosaic"] .mod_instagram--feeds[data-translation-speed]').each(function(){
		el = $(this);
		var speed = 1000*parseFloat(el.data('translationSpeed'));
		if(speed && speed>0)
		{
			mod_instagram_mosaic_translation(el,speed);
		}
	});
}

function mod_instagram_mosaic_translation(el,speed)
{
	var cols = parseInt(el.data('cols'));
	if(cols>0 && speed>0)
	{
		var w = el.find('.instagram-item').width()*cols;
		el.find('.mod_instagram-feedrow').stop(true).css({marginLeft:'0'});
		el.find('.mod_instagram-feedrow').animate(
			{marginLeft:'-'+w+'px'},
			speed*cols,
			'linear',
			function(el,speed){
				mod_instagram_mosaic_translation(el,speed);
			}.bind(null,el,speed)
		);
	}
}

function mod_instagram_customizable_init() {
	$('.module_wrapper[module="instagram"][template="customizable"] .mod_instagram--feeds--wrapper').each(function(){
		el = $(this);
		var mod = {
			autoplay_interval:false,
			animate_timeout:false,
			el: el,
			feed: el.find('.mod_instagram--feeds'),
			_prev: function()
			{
				var self = this;
				if(!self.animate_timeout)
				{
					self._autoplay_stop();
					self.feed.attr('data-animate','prev');
					clearTimeout(self.animate_timeout)
					self.animate_timeout = setTimeout(function(){
						self.animate_timeout = false;
						self.feed.attr('data-animate','');
						self.feed.find('.instagram-item:last-child').prependTo(self.feed);
						self._autoplay_start();
					},mod._get_speed()+1);
				}
			},
			_next: function()
			{
				var self = this;
				if(!self.animate_timeout)
				{
					self._autoplay_stop();
					self.feed.attr('data-animate','next');
					clearTimeout(this.animate_timeout)
					self.animate_timeout = setTimeout(function(){
						self.animate_timeout = false;
						self.feed.attr('data-animate','');
						self.feed.find('.instagram-item:first-child').appendTo(self.feed);
						self._autoplay_start();
					},mod._get_speed()+1);
				}
			},
			_autoplay_init: function()
			{
				clearTimeout(this.animate_timeout)
				this.animate_timeout = false;
				this._autoplay_stop();
				this._autoplay_start();
			},
			_autoplay_start: function()
			{
				var W = window.innerWidth;

				var c = parseInt(mod.feed.attr('data-carrousel'));
				var a = parseInt(mod.feed.attr('data-autoplay'));
				var t = parseInt(mod.feed.attr('data-autoplay-interval'));
				if(W<=980)
				{
					c = parseInt(mod.feed.attr('data-carrousel-mobile'));
					a = parseInt(mod.feed.attr('data-autoplay-mobile'));
					t = parseInt(mod.feed.attr('data-autoplay-interval-mobile'));
				}
				else if(W<=1400)
				{
					c = parseInt(mod.feed.attr('data-carrousel-tablet'));
					a = parseInt(mod.feed.attr('data-autoplay-tablet'));
					t = parseInt(mod.feed.attr('data-autoplay-interval-tablet'));
				}

				//console.log('_autoplay_start',t);

				if(c && a && t>=0)
				{
					this.autoplay_interval = setInterval(mod._autoplay, t);
				}
			},
			_autoplay_stop: function()
			{
				this.feed.attr('data-animate','');
				clearInterval(this.autoplay_interval)
			},
			_autoplay: function()
			{
				mod._next();
			},
			_get_speed: function()
			{
				var W = window.innerWidth;
				var s = parseInt(mod.feed.attr('data-carrousel-speed'));
				if(W<=980)
				{
					s = parseInt(mod.feed.attr('data-carrousel-speed-mobile'));
				}
				else if(W<=1400)
				{
					s = parseInt(mod.feed.attr('data-carrousel-speed-tablet'));
				}
				return s;
			}
		}

		var prev = $('<button type="buttton" class="instagram-prev"><i class="fas fa-angle-left"></i></button>');
		prev.on('click',mod._prev.bind(mod))
		el.parent().append(prev);

		var next = $('<button type="buttton" class="instagram-next"><i class="fas fa-angle-right"></i></button>');
		next.on('click',mod._next.bind(mod))
		el.parent().append(next);

		mod._autoplay_start();
		$(window).on('resize',mod._autoplay_init.bind(mod));
	});
}
;
// ----------------------------------------------------------------------------------
// Module : ONGLET
// modules/Onglet/templates/script.js
// ----------------------------------------------------------------------------------
HAPI_PageCycle.onLoad(function() {
	$('.module_wrapper[module="onglet"][template="_default"] .tabs-container').tabs();
});
;
// ----------------------------------------------------------------------------------
// Module : RESERVATION
// modules/Reservation/templates/script.js
// ----------------------------------------------------------------------------------
HAPI_PageCycle.onLoad(function(){

	$('.reservation-container[data-booking-group="false"]').on('submit',function(event){
		if($(this).find('select.BookingInput').val()=='')
		{
			event.preventDefault();
			$(this).find('select.BookingInput').addClass("missing");
		}
		else
		{
			$(this).find('select.BookingInput').removeClass("missing");
		}
	});

	$('.reservation-formfield').find('input, select').on('change.populate-formfield-attribute',function(event){
		$(this).parents('.reservation-formfield').eq(0)[0].setAttribute('data-value',""+$(this).val());
	}).trigger('change.populate-formfield-attribute');

	$('.reservation-container[data-smartsearch="true"] .reservation-formfield select.BookingInput[name="HIDX"]')
		.not('.select2-ready')
		.addClass('select2-ready').each(function(){
			var options = {
				theme:'',
				dropdownParent:$(this).parents('.reservation-container').eq(0),
				dropdownAutoWidth : true,
				matcher: module_reservation_smartsearch_matcher,
				templateResult : module_reservation_smartsearch_format,
			};
			var $select2 = $(this).select2(options);
		});

	var module_reservation_smartsearch_term = null;

	function module_reservation_smartsearch_getAllIndexes(searchStr, str, caseSensitive) {
	    var searchStrLen = searchStr.length;
	    if (searchStrLen == 0) {
	        return [];
	    }
	    var startIndex = 0, index, indices = [];
	    if (!caseSensitive) {
	        str = str.toLowerCase();
	        searchStr = searchStr.toLowerCase();
	    }
	    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
	        indices.push(index);
	        startIndex = index + searchStrLen;
	    }
	    return indices;
	}

	function module_reservation_smartsearch_highlight_term(searchStr, str) {
		str = str;
		var indexes = module_reservation_smartsearch_getAllIndexes(searchStr, str, false);
		var length = searchStr.length;
		for(i=indexes.length-1;i>=0;i--)
		{
			index = indexes[i];
			var a = str.slice(0,index);
			var b = str.slice(index,index+length);
			var c = str.slice(index+length);
			str = a+'<em>'+b+'</em>'+c;
		};
		return str;
	}


	function module_reservation_smartsearch_format (state) {
		var enseigne = $(state.element).data('enseigne');
		var city = $(state.element).data('city');
		var country = $(state.element).data('country');

		enseigne = enseigne ? module_reservation_smartsearch_highlight_term(module_reservation_smartsearch_term, enseigne) : null;
		city     = city     ? module_reservation_smartsearch_highlight_term(module_reservation_smartsearch_term, city)     : null;
		country  = country  ? module_reservation_smartsearch_highlight_term(module_reservation_smartsearch_term, country)  : null;

		if(enseigne && city && country)
		{
			return $('<span><span class="enseigne">'+enseigne+'</span> <small class="extra"><span class="city">'+city+'</span> <span class="country">'+country+'</span></small></span>');
		}
		else if(enseigne && city)
		{
			return $('<span><span class="enseigne">'+enseigne+'</span> <small class="extra"><span class="city">'+city+'</span></small></span>');
		}
		else if(enseigne)
		{
			return $('<span><span class="enseigne">'+enseigne+'</span></span>');
		}
		else
		{
			return null;
		}
	};

	function module_reservation_smartsearch_matcher(params, data) {
		var term = $.trim(params.term).toLowerCase();
		module_reservation_smartsearch_term = term;

	    // If there are no search terms, full list
	    if (term === '') {
	      return data;
	    }
	    // Do not display the item if there is no 'text' property
	    if (typeof data.text === 'undefined') {
	      return null;
	    }

	    // `params.term` should be the term that is used for searching
	    // `data.text` is the text that is displayed for the data object
	    if (data.text.toLowerCase().indexOf(term) > -1) {
	      var modifiedData = $.extend({}, data, true);
	      return modifiedData;
	    }

	    // Return `null` if the term should not be displayed
	    return null;
	}
});
;
// ----------------------------------------------------------------------------------
// Module : SEARCH
// modules/Search/templates/script.js
// ----------------------------------------------------------------------------------
function module_search_smartsearch_getAllIndexes(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

function module_search_smartsearch_highlight_term(searchStr, str) {
	str = str;
	var indexes = module_search_smartsearch_getAllIndexes(searchStr, str, false);
	var length = searchStr.length;
	for(i=indexes.length-1;i>=0;i--)
	{
		index = indexes[i];
		var a = str.slice(0,index);
		var b = str.slice(index,index+length);
		var c = str.slice(index+length);
		str = a+'<em class="highlight">'+b+'</em>'+c;
	};
	return str;
}


function module_search_smartsearch_format (state) {
	var enseigne = $(state.element).data('enseigne');
	var baseline = $(state.element).data('baseline');
	var keywords = $(state.element).data('keywords');
	var city = $(state.element).data('city');
	var country = $(state.element).data('country');

	var image = $(state.element).data('img');
	image = image ? '<span class="option-img" style="background-image:url(\''+image+'\')"></span>':'';

	enseigne = enseigne ? module_search_smartsearch_highlight_term(module_search_smartsearch_term, enseigne) : null;
	baseline = baseline ? module_search_smartsearch_highlight_term(module_search_smartsearch_term, baseline) : null;
	keywords = keywords ? module_search_smartsearch_highlight_term(module_search_smartsearch_term, keywords) : null;
	city     = city     ? module_search_smartsearch_highlight_term(module_search_smartsearch_term, city)     : null;
	country  = country  ? module_search_smartsearch_highlight_term(module_search_smartsearch_term, country)  : null;

	var text = [];

	if(enseigne) text.push('<span class="enseigne">' + enseigne + '</span>');
	if(city)     text.push('<span class="city">'     + city     + '</span>');
	if(country)  text.push('<span class="country">'  + country  + '</span>');
	if(baseline) text.push('<span class="baseline">' + baseline + '</span>');
	if(keywords) text.push('<span class="keywords">' + keywords + '</span>');

	if(text.length>0)
	{
		return $('<span>'+image+'<span class="option-text">' + text.join(' ') + '</span></span>');
	}
	else
	{
		return null;
	}
};

function module_search_smartsearch_matcher(params, data) {
	var term = $.trim(params.term).toLowerCase();
	module_search_smartsearch_term = term;

    // If there are no search terms, full list
    if (term === '') {
      return data;
    }
    // Do not display the item if there is no 'text' property
    if (typeof data.text === 'undefined') {
      return null;
    }

    // `params.term` should be the term that is used for searching
    // `data.text` is the text that is displayed for the data object
    if (data.text.toLowerCase().indexOf(term) > -1) {
      var modifiedData = $.extend({}, data, true);
      return modifiedData;
    }

    // Return `null` if the term should not be displayed
    return null;
}


var HAPI_module_search_init = function(){
	$('.mod_search .mod_search--field select')
		.not('.select2-ready')
		.addClass('select2-ready').each(function(){
			var options = {
				theme:'',
				placeholder:$(this).data("placeholder"),
				dropdownParent:$(this).parents('.mod_search--field').eq(0),
				dropdownAutoWidth : true,
				matcher: module_search_smartsearch_matcher,
				templateResult : module_search_smartsearch_format,
			};
			var $select2 = $(this).select2(options);
		});
	var module_search_smartsearch_term = null;
};

HAPI_Add_RefreshJavascriptBehaviors(HAPI_module_search_init);
;
// ----------------------------------------------------------------------------------
// Module : TOGGLECONTENT
// modules/ToggleContent/templates/script.js
// ----------------------------------------------------------------------------------
HAPI_PageCycle.onLoad(function() {
	module_toogleContent_init()
	setInterval(module_toogleContent_init,1000);
});

function module_toogleContent_init()
{
	$('.module_wrapper[module="toogleContent"][template="_default"]:not(.toogleContent-ready)').each(function(){
		$(this).addClass('toogleContent-ready');
		// application des observateur
		$(this).find('button').on('click.module_toogleContent',module_toogleContent_button_click);
		$(this).find('select').on('change.module_toogleContent',module_toogleContent_select_change);

		// on masque toute les cibles des boutons ou select
		$(this).find('button').each(function(index){
			$($(this).data('target')).hide();
		});
		$(this).find('select option').each(function(index){
			$($(this).attr('value')).hide();
		});

		// on rend visible les éléments par défaut des modules visibles
		$(this).filter(':visible').each(function(){
			if($(this).find('button[data-selected="1"]').length>0)
			{
				// si on à un bouton actif on simule un click pour afficher le contenu
				$(this).find('button[data-selected="1"]').trigger('click.module_toogleContent');
				$(this).find('select').trigger('change.module_toogleContent');
			}
			else
			{
				// sinon, on masque tout
				$(module_toogleContent_get_all_target(this)).hide();
			}
		});
	});
}
window.module_toogleContent_init = module_toogleContent_init;

function module_toogleContent_get_all_target(module_wrapper,targets=[],deep=0)
{
	deep++;
	if(deep<4)
	{
		var buttons = $(module_wrapper).find('button');
		buttons.each(function(){
			$($(this).data('target')).each(function(){
				targets.push(this)
				var sub_modules = $(this).find('.module_wrapper[module="toogleContent"][template="_default"]')
				sub_modules.each(function(){
					module_toogleContent_get_all_target(this,targets,deep);
				})
			})
		})
	}
	return targets;
}

var module_toogleContent_reveal_in_progress = false;

function module_toogleContent_button_click()
{
	var $module = $(this).parents('.module_wrapper').eq(0);
	var target = $(this).data('target');

	var release_progress_lock = false;
	if(!module_toogleContent_reveal_in_progress)
	{
		release_progress_lock = true;
		module_toogleContent_reveal_in_progress = true;
		var elements_to_hide = module_toogleContent_get_all_target($module);
		$(elements_to_hide).hide();
	}

	$module.find('button').not(this).removeClass('active').attr('data-selected',0);
	$(this).addClass('active').attr('data-selected',1);
	$module.find('select').val(target);

	//console.log('to Reveal',target);
	$(target).fadeIn(release_progress_lock ? 150 : 10, function(){
		if(window.ScrollRevealInstance)
			window.ScrollRevealInstance.sync();
		// on initialise les sous module qui pourrait être révélé
		$(this).find('.module_wrapper[module="toogleContent"][template="_default"]:visible').each(function(){
			$(this).find('button[data-selected="1"]').trigger('click.module_toogleContent');
			$(this).find('select').trigger('change.module_toogleContent');
		});

		window.HAPI_RefreshJavascriptBehaviors(target);
	});

	if(release_progress_lock)
	{
		module_toogleContent_reveal_in_progress = false
	}
}
function module_toogleContent_select_change()
{
	var $module = $(this).parents('.module_wrapper').eq(0);
	var target = $(this).val();

	var release_progress_lock = false;
	if(!module_toogleContent_reveal_in_progress)
	{
		release_progress_lock = true;
		module_toogleContent_reveal_in_progress = true;
		var elements_to_hide = module_toogleContent_get_all_target($module);
		$(elements_to_hide).hide();
	}

	//console.log('to Reveal',target);
	$(target).fadeIn(release_progress_lock ? 150 : 10, function(){
		if(window.ScrollRevealInstance)
			window.ScrollRevealInstance.sync();
		// on initialise les sous module qui pourrait être révélé
		$(this).find('.module_wrapper[module="toogleContent"][template="_default"]:visible').each(function(){
			$(this).find('button[data-selected="1"]').trigger('click.module_toogleContent');
			$(this).find('select').trigger('change.module_toogleContent');
		});

		window.HAPI_RefreshJavascriptBehaviors(target);
	});

	if(release_progress_lock)
	{
		module_toogleContent_reveal_in_progress = false
	}
}
;
// ----------------------------------------------------------------------------------
// Module : VIDEO
// modules/Video/templates/script.js
// ----------------------------------------------------------------------------------
HAPI_PageCycle.onLoad(function(){
    $('.module_wrapper[module="video"]').each(function() {
        $(this).find('.video-wrapper').fancybox({
            'autoSize': true,
            'type' : 'iframe',
            'scrolling'   : 'no',
            'padding': '0',
            'title' : $(this).find('.titre').html()
        });
    });
});
;
// ----------------------------------------------------------------------------------
// Module : YOUTUBEPLAYLIST
// modules/YoutubePlaylist/templates/script.js
// ----------------------------------------------------------------------------------
HAPI_PageCycle.onLoad(function(){
	$('.module_wrapper[module="youtube_playlist"] a.item-media, .module_wrapper[module="youtube_playlist"] a.link-video-play').fancybox({
	    youtube : {
	        controls : 1,
	        showinfo : 0
	    },
	});
});
;
// ----------------------------------------------------------------------------------
// Module : _TEMPLATE
// modules/_template/_default/script.box2carrousel.js
// ----------------------------------------------------------------------------------
// TODO
// un attribut doit indiquer les module ou appliquer ce script
// => les paramètres COLS et ROWS doivent être présent sur le module

var Box2Carrousel = {
  build: function() {

    $movePrev = $('<button class="b2c-btn b2c-btn-prev" type="button"><span><i class="fas fa-angle-left"></i></span></button>');
    $movePrev.on('click',this.movePrev);
    this.$el.parent().append($movePrev)

    $moveNext = $('<button class="b2c-btn b2c-btn-next" type="button"><span><i class="fas fa-angle-right"></i></span></button>');
    $moveNext.on('click',this.moveNext);
    this.$el.parent().append($moveNext)

    this.swipeListener = SwipeListener(this.$el[0]);
    this.$el[0].addEventListener('swipe', this.swipeAction);

    this.rwdBuild();
  },

  swipeAction: function(e) {
      if(e && e.detail && e.detail.directions && e.detail.directions.left)
        this.moveNext();
      else if(e && e.detail && e.detail.directions && e.detail.directions.right)
        this.movePrev();
      e.preventDefault();
      e.stopPropagation();
  },

  rwdBuild: function() {
    var settings = this.getSettings();
    var hash = settings.cols+','+settings.rows;
    // rebuild only on hash change
    if(this.buildHash !== hash)
    {
      console.log('Box2Carrousel::rwdBuild instance('+this.instanceID+') '+settings.rwd);
      this.buildHash = hash;
      this.$el.find('.item.clone').remove();

      var wrapper = this.$el.find('.items')
      var items = this.$el.find('.item');
      var sc = settings.cols * settings.rows; // screen count

      if(items.length)
      {
        items.removeClass('curr-item');

        // reorder item by original index
        $(items).sort((a,b) => $(a).data("i") - $(b).data("i")).appendTo(wrapper);

        var needed_items_count = Box2CarrouselTools.lcm(items.length,settings.cols * settings.rows * 3);
        var need_clone = needed_items_count / items.length - 1
        for(var i=0; i < need_clone; i++)
        {
          items.clone().addClass('clone').appendTo(wrapper);
        }
        var full_items = this.$el.find('.item');

        // on marque les SC items de base comme étant les éléments actuellement visible
        for(var i=0; i < sc; i++)
        {
          full_items.eq(i).addClass('curr-item');
        }

        // on déplace ensuite les SC derniers pour les mettre au début (et ainsi gérer le débordement de gauche)
        for(var i=1; i <= sc; i++)
        {
          full_items.eq(-i).prependTo(wrapper);
        }
        this.applyCssReformat();
      }
    }
  },

  applyCssReformat: function () {
    var settings = this.getSettings();
    var items = this.$el.find('.item');
    var sc = settings.cols * settings.rows; // screen count
    var W = (100 * items.length / sc)+'%';
    var w = (100 / (items.length / settings.rows))+'%';
    //console.log(items.length,sc,rows,W,w)

    this.$el.find('.items').css({width:W})
    items.css({width:w})

    ci = 0;
    ri = 0;
    items.each(function(i,item){
      $(item).css({order:ri % settings.rows})
      ci++;
      if(ci % settings.cols==0)
        ri++;
    });

    /*
    .items {
      width: 300% !important; // 4 par écrans et 12 au total => 12/4 = 3
      .item {
        // 12 items au total sur 2 lignes
        // 12/2 = 6 colonnes
        width:calc(100% / 6) !important;
      }
      // 4 par écran => (4n+X)
      // 2 lignes => order:[1,2]
      .item:nth-child(4n+1) { order:1; }
      .item:nth-child(4n+2) { order:1; }
      .item:nth-child(4n+3) { order:2; }
      .item:nth-child(4n+4) { order:2; }
    }
    */
  },

  moveNext: function() {
    if(!this.moving)
    {
      this.moving = true;
      this.$el.find('.items').addClass('move moveNext');
      setTimeout(function(){
        var settings = this.getSettings();
        var wrapper = this.$el.find('.items')
        var items = this.$el.find('.item');
        var sc = settings.cols * settings.rows; // screen count
        for(var i=0; i < sc; i++)
        {
          items.eq(i).appendTo(wrapper);
        }
        this.$el.find('.items').removeClass('move').removeClass('moveNext');
        this.moving = false;
      }.bind(this),600)
    }
  },

  movePrev: function() {
    if(!this.moving)
    {
      this.moving = true;
      this.$el.find('.items').addClass('move movePrev');
      setTimeout(function(){
        var settings = this.getSettings();
        var wrapper = this.$el.find('.items')
        var items = this.$el.find('.item');
        var sc = settings.cols * settings.rows; // screen count
        for(var i=1; i <= sc; i++)
        {
          items.eq(-i).prependTo(wrapper);
        }
        this.$el.find('.items').removeClass('move').removeClass('movePrev');
        this.moving = false;
      }.bind(this),600)
    }
  },

  getSettings: function() {
    var settings = {
    };
    if($(window).width()>980)
    {
      settings.rwd = 'desktop';
      settings.cols = this.$el.data('b2cCols');
      settings.rows = this.$el.data('b2cRows');
    }
    else if($(window).width()>640)
    {
      settings.rwd = 'tablet';
      settings.cols = this.$el.data('b2cCols-t');
      settings.rows = this.$el.data('b2cRows-t');
    }
    else
    {
      settings.rwd = 'mobile';
      settings.cols = this.$el.data('b2cCols-m');
      settings.rows = this.$el.data('b2cRows-m');
    }
    return settings;
  }
}
var Box2CarrouselTools = {
  gcd: function(num1, num2) {
     //if num2 is 0 return num1;
     if(num2 === 0){
        return num1;
     }
     //call the same function recursively
     return Box2CarrouselTools.gcd(num2, num1 % num2);
  },

  lcm: function(n1, n2) {
    //Find the gcd first
    var _gcd = Box2CarrouselTools.gcd(n1, n2);
    //then calculate the lcm
    return (n1 * n2) / _gcd;
  }
}

Box2CarrouselInstance = [];
function Box2CarrouselInit(i,el){
  var $el = $(el);
  // build instance and bind reference
  var b2cInstance = {
    instanceID:Box2CarrouselInstance.length,
    buildHash:null,
    moving:false,
  };
  Box2CarrouselInstance[Box2CarrouselInstance.length] = b2cInstance;

  b2cInstance.$el               = $el;
  b2cInstance.build             = Box2Carrousel.build.bind(b2cInstance);
  b2cInstance.rwdBuild          = Box2Carrousel.rwdBuild.bind(b2cInstance);
  b2cInstance.swipeAction       = Box2Carrousel.swipeAction.bind(b2cInstance);
  b2cInstance.applyCssReformat  = Box2Carrousel.applyCssReformat.bind(b2cInstance);
  b2cInstance.moveNext          = Box2Carrousel.moveNext.bind(b2cInstance);
  b2cInstance.movePrev          = Box2Carrousel.movePrev.bind(b2cInstance);
  b2cInstance.getSettings       = Box2Carrousel.getSettings.bind(b2cInstance);
  // save instance into domElement, set readyClass and call initial build
  $el.data('box2carrousel',b2cInstance);
  $el.parent().addClass('box2carrousel')
  b2cInstance.build();
  // rebuild instance on resize (RWD)
  $(window).on('resize',b2cInstance.rwdBuild);
}

HAPI_PageCycle.onLoad(function(){
	$('.moduleTemplate[type="generic"][data-b2c="1"]').each(Box2CarrouselInit)
});
;
// ----------------------------------------------------------------------------------
// Module : _TEMPLATE
// modules/_template/script.tag-filter-menu.js
// ----------------------------------------------------------------------------------
window.skip_tfm_parse_hash = false;

var moduleTagFilterMenuInit = function () {
	$('.moduleTemplate:not(.tfm-ready)').each(moduleTagFilterMenuInit_apply)
}
var moduleTagFilterMenuInit_apply = function () {

	$(this).addClass('tfm-ready');

	// ----------------------------------------------------------------------
	// TAG FILTER MENU
	// ----------------------------------------------------------------------

	var tfm = $(this).find('.tag-filter-menu');
	if (tfm.length > 0) {
		var tpl = $(this);

		// **************************************************************************

		var tfm_parse_hash = function (tfm_ctx) {
			if (!window.skip_tfm_parse_hash) {
				// initialisation des champs à partir du hash présent dans l'url
				var tfm = tfm_ctx.tfm;

				var filter_hash = document.location.hash.replace(/^.*;filter=([^;]*)(;.*)?$/, '$1');
				//console.log(filter_hash)
				var url_hash = filter_hash.split(',');
				if (url_hash.length > 0) {
					for (var i = 0; i < url_hash.length; i++) {
						var t = url_hash[i].split(':');
						if (t.length == 2) {
							tfm.find('select[name="' + t[0] + '"]').val(t[1]);
						}
					}
				}
				tfm_filter_rebuild(tfm_ctx);
			}
			window.skip_tfm_parse_hash = false;
		}

		// **************************************************************************

		var tfm_filter_elements = function (tfm_ctx, tags, options) {
			// filter the module items based on received tag list
			// return items list that match
			var tpl = tfm_ctx.tpl;
			var tfm = tfm_ctx.tfm;
			var els_to_show = tpl.find('.items > .item, .items-section-body > .item');

			options = options || {};
			var ignoreType = options.ignoreType || null;

			for (var i = 0; i < tags.length; i++) {
				var tag = tags[i];
				if (tag !== '' && (ignoreType == null || tag.indexOf(ignoreType) !== 0)) {
					els_to_show = els_to_show.filter('[data-tags*="' + tag + ',"]');
				}
			}

			var rejectTags = options.rejectTags || []; // additionnal tag to reject (ignoreType will not apply to this list)
			for (var i = 0; i < rejectTags.length; i++) {
				var tag = rejectTags[i];
				if (tag !== '') {
					els_to_show = els_to_show.filter('[data-tags*="' + tag + ',"]');
				}
			}

			return els_to_show;
		}

		var tfm_filter_addapt_selection = function (tfm_ctx, extra_selects) {
			// recursively reset some extra select settings (the last one first)
			// trying to have some results to show

			var select = tfm_ctx.select;
			var tpl = tfm_ctx.tpl;
			var tfm = tfm_ctx.tfm;
			var tfm_filter_rebuild = tfm_ctx.tfm_filter_rebuild;
			var tfm_filter_addapt_selection = tfm_ctx.tfm_filter_addapt_selection;
			var tfm_filter_elements = tfm_ctx.tfm_filter_elements;

			if (extra_selects.length > 0) {
				var tags = [$(select).val()];
				for (var i = 0; i < extra_selects.length; i++) {
					var type = extra_selects.eq(i).attr('name');
					var tag = extra_selects.eq(i).val();
					if (tag !== '') {
						tags.push(type + '_' + tag);
					}
				}
				var els_to_show = tfm_filter_elements(tfm_ctx, tags);
				if (els_to_show.length == 0) {
					var last_select = extra_selects.last();
					last_select.val('')
					tfm_filter_addapt_selection(tfm_ctx, extra_selects.not(last_select));
				}
			}
		}

		var tfm_filter_rebuild = function (tfm_ctx, deep = false) {
			// update the item list based on current selection
			// may call selection addaptation methods and call a second rebuild pass if necessary
			var select = tfm_ctx.select;
			var tpl = tfm_ctx.tpl;
			var tfm = tfm_ctx.tfm;
			var tfm_filter_rebuild = tfm_ctx.tfm_filter_rebuild;
			var tfm_filter_addapt_selection = tfm_ctx.tfm_filter_addapt_selection;
			var tfm_filter_elements = tfm_ctx.tfm_filter_elements;
			var init = tfm_ctx.init || false;

			var selects = tfm.find('select');
			var tags = [];
			var url_hash = [];
			for (var i = 0; i < selects.length; i++) {
				var type = selects.eq(i).attr('name')
				var tag = selects.eq(i).val();
				if (tag !== '') {
					if (tag.match(/^cid[0-9]+$/))
						tags.push(tag);
					else
						tags.push(type + '_' + tag);
					url_hash.push(type + ':' + tag);
				}
			}
			console.log(tags)

			window.skip_tfm_parse_hash = true;
			if (url_hash.length > 0) {
				url_hash = url_hash.join(',');
				var current_hashg = document.location.hash.replace(/^(.*)(;filter=[^;]*)(;.*)?$/, '$1$3');
				document.location.hash = current_hashg + ';filter=' + url_hash;
			}
			else {
				document.location.hash = document.location.hash.replace(/;filter=[^;]*/, ';filter=');
			}

			var els_to_show = tfm_filter_elements(tfm_ctx, tags);
			var els_to_hide = tpl.find('.items > .item, .items-section-body > .item').not(els_to_show);

			els_to_hide.hide().addClass('filtered');
			els_to_show.show().removeClass('filtered');

			els_to_show.sort((a, b) => $(a).data("i") - $(b).data("i"));
			els_to_show.each(function () {
				$(this).appendTo($(this).parent());
			})
			els_to_hide.each(function () {
				$(this).appendTo($(this).parent());
			})

			if (tpl.find('.items-section').length > 0) {
				// multitags handle hide/reveal section bloc
				tpl.find('.items-section').each(function () {
					if ($(this).find('.item:not(.filtered)').length > 0)
						$(this).show().removeClass('filtered');
					else
						$(this).hide().addClass('filtered');
				})
			}

			if (!deep && !init)
				tfm_filter_addapt_selection(tfm_ctx, selects.not(select));

			if (els_to_show.length == 0 && !deep) {
				tfm_filter_rebuild(tfm_ctx, true);
			}

			if (!deep) {
				// ************************************************************
				// Calcul des tags visible et existants
				// ************************************************************

				var all_tags = {};
				tpl.find('.items > .item, .items-section-body > .item').not('.bx-clone').each(function () {
					$(this).data('tags').split(',').forEach(function (t) {
						all_tags[t] = all_tags[t] ? all_tags[t] + 1 : 1;
					});
				})

				var visible_tags = {};
				tfm_filter_elements(tfm_ctx, tags).not('.bx-clone').each(function () {
					console.log({ filterTags: tags, itemTags: $(this).data('tags').split(',') })
					$(this).data('tags').split(',').forEach(function (t) {
						visible_tags[t] = visible_tags[t] ? visible_tags[t] + 1 : 1;
					});
				})

				// ************************************************************
				// Injection de l'état actif sur les boutons
				// ************************************************************

				if (tfm.data('mode') == 'button') {
					for (var i = 0; i < selects.length; i++) {
						var s = selects.eq(i);
						var buttons = s.data('linked-button-wrapper').find('button');
						buttons.removeClass('active');
						buttons.filter('[data-value="' + s.val() + '"]').addClass('active')
					}
				}

				// ************************************************************
				// Mise à jour des compteurs de tags visibles
				// ************************************************************
				if (tfm.data('filter-counter')) {
					var counterType = tfm.data('filter-counter-type')
					var displayCounter = function (visible_count, all_count) {
						var counterTypes = {
							total: ` <small>(${all_count})</small>`,
							visible: ` <small>(${visible_count})</small>`,
							style2: ` <small>(${visible_count}-${all_count})</small>`
						}
						//console.log('counterType', counterType)
						if (!counterType) return ' <small>(' + visible_count + '/' + all_count + ')</small>'
						return counterTypes[counterType]
					}
					for (var i = 0; i < selects.length; i++) {
						var s = selects.eq(i);

						var type = s.attr('name');
						var options = s.find('option');
						options.each(function () {
							var t = $(this).attr('value');
							if (t) {
								var all_count = all_tags[type + '_' + t] || 0;
								var visible_count = visible_tags[type + '_' + t] || 0;

								visible_count = tfm_filter_elements(tfm_ctx, tags, { ignoreType: type, rejectTags: [type + '_' + t] }).length;
								$(this).find('small').remove()
								$(this).html($(this).html() + displayCounter(visible_count, all_count));
							}
						})

						if (tfm.data('mode') == 'button') {
							var buttons = s.data('linked-button-wrapper').find('button');
							buttons.each(function () {
								var t = $(this).data('value');
								if (t) {
									var all_count = all_tags[type + '_' + t] || 0;
									var visible_count = visible_tags[type + '_' + t] || 0;
									$(this).find('small').remove()
									$(this).html($(this).html() + displayCounter(visible_count, all_count));
								}
							})
						}
					}
				}
				module_tpl_default_pagination_update(tpl);

				// slider force full reload on non filtered element only
				tpl.find('.items').each(function () {
					//console.log('before',$(this).find('.item .item-media'));
					$(this).find('.item .item-media').css({ 'opacity': 0.1 })
					var slider = $(this).data('bxSlider');
					var sliderConfig = $(this).data('bxSliderConfig');
					//console.log(this,slider,sliderConfig);
					if (slider && sliderConfig) {
						sliderConfig.slideSelector = ":not(.filtered)";
						slider.reloadSlider(sliderConfig);
						$(this).find('.item:not(.filtered)').show();
						$(this).find('.item.filtered').hide();
						slider.redrawSlider();
					}
					$(this).find('.item .item-media').each(hapiLazy_build_background)
					setTimeout(function () {
						//console.log('after',$(this).find('.item .item-media'));
						$(this).find('.item .item-media').animate({ 'opacity': 1 })
					}.bind(this), 250)
				});
			}

			setTimeout(function () {
				// force css animation to be refresh after content change
				window.dispatchEvent(new Event('scroll'));
			}, 250)
		}

		// apply rebuild behavior when the filter selection change
		tfm.find('select').each(function () {
			var tfm_ctx = {
				select: this,
				tfm,
				tpl,
				tfm_filter_addapt_selection,
				tfm_filter_rebuild,
				tfm_filter_elements
			}
			$(this).on('change', function (tfm_ctx, event) { tfm_filter_rebuild(tfm_ctx) }.bind(null, tfm_ctx));
		});

		var display_btn_all = tfm.data('button-all') == 1;
		var display_btn_all_style = tfm.data('button-all-style');
		var display_btn_all_label = tfm.data('button-all-label');
		display_btn_all_label = display_btn_all_label ? display_btn_all_label : '*';

		if (tfm.data('mode') == 'button') {
			tfm.find('select').each(function () {
				var select = $(this);
				select.hide();

				var wrapper = $('<div class="tag-filter-buttons-wrapper"></div>');
				select.data('linked-button-wrapper', wrapper);
				select.find('option').each(function () {
					var btn_all = !$(this).attr('value')
					if (display_btn_all || !btn_all) {
						var label = $(this).html();
						var button = $('<button class="' + display_btn_all_style + ' ' + (btn_all ? 'tag-filter-btn-all' : 'tag-filter-btn-restrict') + '" data-value="' + $(this).attr('value') + '">' + (btn_all && !label ? display_btn_all_label : label) + '</button>')
						button.data('linked-select', select);
						select.data('linked-button', button);

						button.on('click', function (event) {
							var select = $(this).data('linked-select')
							if (!display_btn_all && $(this).hasClass('active'))
								select.val('');
							else
								select.val($(this).data('value'));
							select.trigger('change');
						})
						wrapper.append(button);
					}
				})
				select.parent().after(wrapper);
			})
		}
		else {
			if (display_btn_all) {
				var wrapper = $('<li class="tag-filter-element"></li>');
				var button = $('<button class="tag-filter-btn-all ' + display_btn_all_style + '">' + display_btn_all_label + '</button>')
				button.data('linked-tfm', tfm);

				button.on('click', function (event) {
					event.preventDefault();
					event.stopPropagation();
					var tfm = $(this).data('linked-tfm')
					tfm.find('select').val('');
					tfm.find('select').eq(0).trigger('change');
				})
				wrapper.append(button);
				tfm.find('.tag-filter-element').eq(0).before(wrapper);
			}
		}

		// **************************************************************************
		var tfm_ctx = {
			init: true,
			select: null,
			tfm,
			tpl,
			tfm_filter_addapt_selection,
			tfm_filter_rebuild,
			tfm_filter_elements
		}
		tfm_parse_hash(tfm_ctx);
		//console.log('tfm.length',tfm.length);
		if ($('.tag-filter-menu').length < 2) {
			// do not execute live refresh when multiple TFM is detected
			// it may introduce an execution loop
			window.addEventListener("hashchange", tfm_parse_hash.bind(null, tfm_ctx), false);
		}
	}
}

window.addEventListener('load', (event) => {
	moduleTagFilterMenuInit();
	setInterval(moduleTagFilterMenuInit, 500);
});
})();
;
// ----------------------------------------------------------------------------------
// ADDITIONNAL CUSTOM JAVASCRIPT
// ----------------------------------------------------------------------------------

// -------- ⬇️  Footer | Habillage & interactions --------
!(function(){try { 
/* Pour davantage de clarté, on récupère l'item avec la
classe css ".telephone" de la navigation et on modifie son
libellé pour le renommer */

// var linktoset = document.querySelector('#row-footer-content .module_wrapper[code="navigation-footer-partie-du-haut"] .telephone');
// linktoset.textContent = "Contactez-nous !";
 } catch(e) { console.warn(`footer-habillage-interactions`,e); } })();

// -------- 🧭 Navigation | Design & ajustements de la navigation --------
!(function(){try { 
/*
* Création d'un overlay qui apparaît lorsque l'on survole un
* des items de la navigation qui a un module de présentation des chamnbres
*/

document.addEventListener("DOMContentLoaded", () => {
	const customOverlay = document.querySelector(".custom-overlay");
	const ongletsNavTrigger = document.querySelectorAll("#row-navigation-principale .trigger-overlay");

	ongletsNavTrigger.forEach(trigger => {
		trigger.addEventListener("mouseenter", () => {
			customOverlay.classList.add("active");
		});

		trigger.addEventListener("mouseleave", () => {
			customOverlay.classList.remove("active");
		});
	});
});


/*
* Pour le panneau de navigation uniquement en mobile, lorsque l'utilisateur
* clique sur "Formations" ou "Accompagnement RH", alors ajouter une classe au
* panneau pour permettre un effet CSS de décalage vers la gauche
*/


// Capture des onglets de popin concernés & de la popin de navigation
var OngletTriggerMoving = document.querySelectorAll('.fsPanel[data-code="popin-de-navigation"] .formations, .fsPanel[data-code="popin-de-navigation"] .accompagnement-rh');
var fsPanels = document.querySelector('.fsPanel[data-code="popin-de-navigation"]');

// Add a click event listener to each "TabTriggerMoving" element
OngletTriggerMoving.forEach(function(tab) {
	tab.addEventListener('click', function(event) {
		// Prevent the default behavior of the "TabTriggerMoving" element
		event.preventDefault();

		// Stop event propagation to prevent other event handlers from interfering
		event.stopPropagation();

		// Remove the "moving" class from all ".fsPanel" elements
		fsPanels.classList.add("moving");
		fsPanels.classList.add("active");
		console.log("click triggered");

		// Add the "eheh" class to the <body> element
		document.body.classList.add("fspanel-active");

		// Select the <ul> element next to the clicked anchor element
		var ulElement = tab.nextElementSibling;

		// Add a CSS class to the selected <ul> element
		ulElement.classList.add("moved");
	});

	// Select the <ul> element next to the clicked anchor element
	var ulElement = tab.nextElementSibling;

	// Add a CSS class to the selected <ul> element
	if (ulElement) {
		ulElement.classList.add("moving-dropdown");

		// Create a new <div> element with the desired HTML code
		var divElement = document.createElement("div");
		divElement.classList.add("back");

		// Append the <div> element as a child of the <ul> element
		ulElement.appendChild(divElement);

		// Add a click event listener to the <div> element to remove "moving" class
		divElement.addEventListener('click', function() {
			fsPanels.classList.remove("moving");
			ulElement.classList.remove("moved");
		});

		// Clone the <a> element adjacent to the <ul>
		var anchorClone = tab.cloneNode(true);
		// Append the cloned <a> element as a child of the same <ul> element
		ulElement.appendChild(anchorClone);
		anchorClone.classList.add("clone");
	}
});

 } catch(e) { console.warn(`navigation-design-ajustements-de-la-navigation`,e); } })();

// -------- Page Formations | Design & ajustements --------
!(function(){try { 
// Select all <li> elements with the class "tag-filter-element"
const clickableFilterTabs = document.querySelectorAll('.module_wrapper[code="formations-presentation-tout-en-un-de-toutes-les-formations"] li.tag-filter-element');
console.log(clickableFilterTabs);

// Add a click event listener to each <li> element
clickableFilterTabs.forEach(clickableFilterTab => {
	clickableFilterTab.classList.add('inactive'); // Replace 'new-class' with the class you want to add

	// Add a click event listener to the <p> element inside the <li>
	const paragraphElement = clickableFilterTab.querySelector('p');
	console.log(paragraphElement);
	
	paragraphElement.addEventListener('click', (event) => {
		event.stopPropagation(); // Prevent the click event from bubbling up to the <li>

		// Toggle the "active" and "inactive" classes for the parent <li> element
		clickableFilterTab.classList.toggle('active');
		clickableFilterTab.classList.toggle('inactive');
	});
});

 } catch(e) { console.warn(`page-formations-design-ajustements`,e); } })();

// -------- Global | Uniformisation des design cards de formation & de la page dédiée --------
!(function(){try { 
/*
* En desktop et en mobile uniquement, sur la page "Formations", on va cloner le contenu de
* ".additional-column-left" et l'insérer dans ".tag-filter-menu"
*/

if (document.body.dataset.pageCode === "formations") {
	// Définir la variable pour l'élément à cloner
	const elementACloner = document.querySelector(".additional-column-left");

	// Définir la variable pour l'élément parent où insérer le clone
	const elementParent = document.querySelector(".tag-filter-menu");

	// Fonction pour cloner l'élément
	function clonerElement() {
		// Vérifier la largeur du navigateur
		// Créer un clone de l'élément
		const cloneElement = elementACloner.cloneNode(true);

		// Insérer le clone dans l'élément parent
		elementParent.insertBefore(cloneElement, elementParent.firstChild);
		console.log("élément cloné !");
	}

	// Ecouter l'événement 'resize' du navigateur
	// window.addEventListener("resize", clonerElement);

	// Appeler la fonction une première fois pour le cas où la page est déjà ouverte en dessous de 980px
	clonerElement();
}
 } catch(e) { console.warn(`global-uniformisation-des-design-cards-de-formation-de-la-page-dediee`,e); } })();

// -------- Template de formation | Design & ajustements --------
!(function(){try { 
/*
* Code JS qui permet d'initialiser un slider
*/

setTimeout(function(){
	// var el = les éléments qui composent le slider
	var el = $('body#page-collection #row-avis-clients .collection_html');
	// en initialisant ce script, ça créer des break-after, donc on les supprime (ne pas toucher cette ligne)
	el.find('div[style*=break-after]').remove()

	// si ne serait-ce qu'une "<div>" est détectée, alors on créé le slider
	// condition utile dans le cas où nous n'avons qu'un texte sans <div>
	if(el.find('>div').length>0)
	{
		el.bxSlider({
			pager:el.find('div').length > 1 ? true:false,
			controls:true, // contrôles gauche-droite du slider
			speed:1000, // vitesse de défilement
			auto:5000 // temps d'autoplay du slider
		})
	}
},500)


if (window.matchMedia("(max-width: 980px)").matches) {
	var mobileStickyCard = document.querySelector("body#page-collection #row-sticky-aside");

	mobileStickyCard.addEventListener('click', function(event) {
		this.classList.toggle("active");
		document.querySelector(".custom-overlay").classList.toggle("active");
		document.body.classList.toggle("mobile-card-active");
	});

	var learnMoreMobile = document.createElement("button");
	learnMoreMobile.classList.add("learn-more");
	learnMoreMobile.classList.add("button1");
	learnMoreMobile.textContent = "En savoir plus";
	document.querySelector("body#page-collection #row-sticky-aside .h4").appendChild(learnMoreMobile);
}


 } catch(e) { console.warn(`template-de-formation-design-ajustements`,e); } })();

// -------- Footer (v2) | Esthétique & ajustements --------
!(function(){try { 
/*
* On utilise du JS pour faire en sorte d'ajouter les
* classes CSS des <a> (saisies dans le back office dans
* "Composants > Menu") aux <li> parents
*/

// Get all the <li> elements within the specified container

console.log("début du script pour les liens du footer");
// Get all <a> elements within the specified <div> element
const anchorElements = document.querySelectorAll(".pied-de-page-v2 a");

// Iterate through each <a> element
anchorElements.forEach((aElement) => {
	// Get the class of the <a> element
	const anchorClass = aElement.classList[0];

	// Find the parent <li> element of the <a> element
	const parentLiElement = aElement.closest("li");

	// If a <li> element is found, add the same class to it
	if (parentLiElement) {
		parentLiElement.classList.add(anchorClass);
	}
});

// Get all <p> elements within the specified <div> element
const pElements = document.querySelectorAll(".pied-de-page-v2 p");

// Iterate through each <p> element
pElements.forEach((pElement) => {
	// Check if the <p> element is empty (contains no text content)
	if (pElement.textContent.trim() === "") {
		// Hide the empty <p> element
		pElement.classList.add('hidden');
	}
});


 } catch(e) { console.warn(`footer-v2-esthetique-ajustements`,e); } })();

// -------- 🎯 Cards rotatives | Design des cards qui se retournent --------
!(function(){try { 
$('.rotating-cards .module_wrapper:not([code="pedagogie-insaho-outils-et-dispositifs"]) .item').hover(function(){
	console.log("initialisation du script qui ajoute une classe Flipped à une rotating card");
	$(this).find('.item-wrapper').toggleClass('flipped');
});


/*
* Uniquement valable pour la page "Pédagogie Insaho" (effet de jeu de carte)
*/
// Get the anchor links in additional-column-left
// Get the anchor links in additional-column-left
const anchorLinks = document.querySelectorAll('body[data-page-code="la-pedagogie-insaho"] .additional-column-left a');

// Get the corresponding items in additional-column-center
const items = document.querySelectorAll('body[data-page-code="la-pedagogie-insaho"] .additional-column-center .item');

// Add click event listeners to anchor links
anchorLinks.forEach((link, index) => {
	/*
	* Lorsque le curseur entre ou sort d'un des <a>
	*/
	link.addEventListener('mouseenter', () => {
		// Remove the "hovered" class from all items
		items.forEach((item) => {
			item.classList.remove('hovered');
		});

		// Add the "hovered" class to the corresponding item
		items[index].classList.add('hovered');
	});
	link.addEventListener('mouseout', () => {
		// Remove the "hovered" class from all items
		items.forEach((item) => {
			item.classList.remove('hovered');
		});
	});

	/*
	* Lorsque l'on clique sur un des <a>
	*/
	link.addEventListener('click', (event) => {
		event.preventDefault(); // Prevent the default behavior of the anchor link

		// Check if the anchor link already has the "active" class
		const hasActiveClass = link.classList.contains('active');

		// Remove the "active" class from all anchor links
		anchorLinks.forEach((otherLink) => {
			otherLink.classList.remove('active');
		});

		// If it doesn't have the "active" class, add it; otherwise, remove it
		if (!hasActiveClass) {
			link.classList.add('active');

			// Remove the "displayed" class from all items
			items.forEach((item) => {
				item.classList.remove('displayed');
			});

			// Add the "displayed" class to the corresponding item
			items[index].classList.add('displayed');
		} else {
			link.classList.remove('active');

			// Remove the "displayed" class from the corresponding item
			items[index].classList.remove('displayed');
		}
	});
});


 } catch(e) { console.warn(`cards-rotatives-design-des-cards-qui-se-retournent`,e); } })();

// -------- Page financement | Modules accordéon --------
!(function(){try { 
/*
* Par défaut, on tente de rendre visible chaque premier item de chaque module de cette page
*/

// Sélectionnez tous les éléments avec la classe "module_wrapper"
const moduleWrappers = document.querySelectorAll('body[data-page-code="financement"] .module_wrapper');

// Parcourez chaque élément avec la classe "module_wrapper"
moduleWrappers.forEach(wrapper => {
  // Sélectionnez le premier enfant de l'élément actuel
  const firstChild = wrapper.querySelector('section:first-child');
  
  // Vérifiez si le premier enfant existe
  if (firstChild) {
    // Ajoutez la classe "active" au premier enfant
    firstChild.classList.add('active');
  }
});

document.addEventListener('click', function(e) {

    const button = e.target.closest('.accordion-title');
    if (!button) return;

    const wrapper = button.closest('.module_wrapper');
    const currentSection = button.closest('section');

    // Désactive uniquement les sections du même accordéon
    wrapper.querySelectorAll('section.active').forEach(section => {
        if (section !== currentSection) {
            section.classList.remove('active');
        }
    });

    currentSection.classList.add('active');
});
 } catch(e) { console.warn(`page-financement-modules-accordeon`,e); } })();

// -------- Ligne | Initialisation d'un slider --------
!(function(){try { 
quickBxSlider('.slider-initialization .collection_html', {
	pager: true,
	controls: true,
	speed: 1000,
	auto: 3000,
	items: '>div',
	noBreakAfter: true
});

/*
param = {
    pager:        [true|false]
    controls:     [true|false]
    speed:        (integer)
    auto:         (integer|false)
    items:        (null|string)
    noBreakAfter: [true|false]
}
*/
 } catch(e) { console.warn(`ligne-initialisation-dun-slider`,e); } })();

// -------- Pagination --------
!(function(){try { 
$(document).ready(function () {

    function updatePagination() {
        $('.pagination-styles .pagination').each(function () {
            var $pagination = $(this);

            $pagination.find('.prev, .next').remove();

            $pagination.prepend('<li class="prev"><a href="#">&lt;</a></li>');
            $pagination.append('<li class="next"><a href="#">&gt;</a></li>');

            if ($pagination.find('.link.active').prev('.link').length === 0) {
                $pagination.find('.prev').addClass('disabled');
            }

            if ($pagination.find('.link.active').next('.link').length === 0) {
                $pagination.find('.next').addClass('disabled');
            }
        });
    }

    function refreshPagination() {
        setTimeout(updatePagination, 100);
        setTimeout(updatePagination, 300);
        setTimeout(updatePagination, 600);
    }

    updatePagination();

    $(document).on('click', '.pagination-styles .pagination .prev:not(.disabled) a', function (e) {
        e.preventDefault();

        var $pagination = $(this).closest('.pagination');
        $pagination.find('.link.active').prev('.link').find('a').trigger('click');

        refreshPagination();
    });

    $(document).on('click', '.pagination-styles .pagination .next:not(.disabled) a', function (e) {
        e.preventDefault();

        var $pagination = $(this).closest('.pagination');
        $pagination.find('.link.active').next('.link').find('a').trigger('click');

        refreshPagination();
    });

    // Détecte les clics sur les numéros de page
    document.addEventListener('click', function (e) {
        if (e.target.closest('.pagination-styles .pagination .link a')) {
            refreshPagination();
        }
    }, true);

});
 } catch(e) { console.warn(`pagination`,e); } })();
});
