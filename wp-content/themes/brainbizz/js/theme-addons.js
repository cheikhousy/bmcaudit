"use strict";
( function ($){

  jQuery(document).ready(function (){ 
    brainbizz_ajax_load();
  });
  
  function brainbizz_ajax_load (){
    var i, section;
    var sections = document.getElementsByClassName( 'wgl_cpt_section' );
    for ( i = 0; i < sections.length; i++ ){
      section = sections[i];
      brainbizz_ajax_init ( section );
    }
  }
  var wait_load = false;
  function brainbizz_ajax_init ( section ){

    var grid, form, data_field, data, request_data, load_more;

    var offset_items = 0;
    //if Section CPT return
    if ( section == undefined ) return;
    
    //Get grid CPT
    grid = section.getElementsByClassName( 'container-grid' );  
    if ( !grid.length ) return;
    grid = grid[0];
    
    //Get form CPT
    form = section.getElementsByClassName( 'posts_grid_ajax' );
    if ( !form.length ) return;
    form = form[0];

    //Get field form ajax
    data_field = form.getElementsByClassName( 'ajax_data' );
    if ( !data_field.length ) return;
    data_field = data_field[0];
    
    data = data_field.value;
    data = JSON.parse( data );
    request_data =  data;

    //Add pagination
    offset_items += request_data.post_count;

    load_more = section.getElementsByClassName( 'load_more_item' );
    if ( load_more.length ){
      load_more = load_more[0];
      load_more.addEventListener( 'click', function ( e ){
        if ( wait_load ) return;
        wait_load = true;
        jQuery(this).addClass('loading');
        e.preventDefault();
        request_data['offset_items'] = offset_items;
        request_data['items_load'] = request_data.items_load;
        
        $.post( wgl_core.ajaxurl, {
          'action'    : 'wgl_ajax',
          'data'      : request_data

        }, function ( response, status ){
          var response_container, new_items, load_more_hidden;
          response_container = document.createElement( "div" );
          response_container.innerHTML = response;
          new_items = $( ".item", response_container );
          load_more_hidden = $( ".hidden_load_more", response_container );

          if(load_more_hidden.length){
            jQuery(section).find('.load_more_wrapper').fadeOut(300, function() { $(this).remove(); });
          }else{
            jQuery(section).find('.load_more_wrapper .load_more_item').removeClass('loading');
          }
          
          if($( grid ).hasClass('carousel')){
            $( grid ).find('.slick-track').append( new_items );
            $( grid ).find('.slick-dots').remove();
            $( grid ).find('.brainbizz_carousel_slick').slick('reinit');            
          }
          else if($( grid ).hasClass('grid')){
            new_items = new_items.hide();
            $( grid ).append( new_items );
            new_items.fadeIn('slow');
            updateCategory(grid, false);             
          }else{
            var items = jQuery(new_items);
            jQuery(grid).isotope( 'insert', items );
            jQuery(grid).imagesLoaded().always(function(){
              jQuery(grid).isotope( 'layout' );
              updateFilter();
              updateCategory(grid, 700);
            });                       
          }

          //Call vc waypoint settings
          if(typeof jQuery.fn.waypoint === "function"){
            jQuery(grid).find(".wpb_animate_when_almost_visible:not(.wpb_start_animation)").waypoint(function() {
                  jQuery(this).addClass("wpb_start_animation animated")
              }, { offset: "100%"});            
          }

          //Call video background settings
          if(typeof jarallax === 'function'){
            brainbizz_parallax_video();
          }else{
            jQuery.getScript(wgl_core.JarallaxPluginVideo, function()
            {
             jQuery.getScript(wgl_core.JarallaxPlugin, function(){}).always(function( s, Status ) {
              jQuery(grid).find('.parallax-video').each(function() {
                jQuery( this ).jarallax( {
                  loop: true,
                  speed: 1,
                  videoSrc: jQuery( this ).data( 'video' ),
                  videoStartTime: jQuery( this ).data( 'start' ),
                  videoEndTime: jQuery( this ).data( 'end' ),
                } );    
              });
            });
           });         
          }         

          //Call slick settings
          if (jQuery(grid).find('.brainbizz_carousel_slick').size() > 0) {
            jQuery.getScript(wgl_core.slickSlider).always(function( s, Status ) {
              jQuery(grid).find('.brainbizz_carousel_slick').each(function() {
                destroyCarousel(jQuery(this));
                slickCarousel(jQuery(this));
                if(jQuery(grid).hasClass('blog_masonry')){
                  jQuery(grid).isotope( 'layout' );
                }     
              });
            });
          }

          //Update Items
          offset_items += parseInt(request_data.items_load);
          
          wait_load = false;
        });
      }, false );
    }     
  }
  
  function slickCarousel(grid) {
    jQuery(grid).slick({
      draggable: true,
      fade: true,
      speed: 900,
      cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
      touchThreshold: 100
    });
  }
  function destroyCarousel(grid) {
    if (jQuery(grid).hasClass('slick-initialized')) {
      jQuery(grid).slick('destroy');
    }      
  }


  function updateCategory(grid, timeout){
    timeout = timeout || 0;
    var category = jQuery(grid).find('.blog-post_meta-categories');
    if (category.length !== 0) {
      category.each(function(){
       var $this = jQuery(this);
       setTimeout(function(){
         $this.lavalamp({
           easing: 'easeInOut',
           duration: 500,
         });         
       }, timeout)         

     })
    }
  }

  function updateFilter(){
    jQuery(".isotope-filter a").each(function(){
      var data_filter = this.getAttribute("data-filter");
      var num = jQuery(this).closest('.wgl_portfolio_list').find('.wgl_portfolio_list-item').filter( data_filter ).length;
      jQuery(this).find('.number_filter').text( num );
    });
      
  }

}(jQuery));
// Scroll Up button
function brainbizz_scroll_up() {
	(function($) {
		$.fn.goBack = function (options) {
			var defaults = {
				scrollTop: jQuery(window).height(),
				scrollSpeed: 600,
				fadeInSpeed: 1000,
				fadeOutSpeed: 500
			};
			var options = $.extend(defaults, options);
			var $this = $(this);
			$(window).on('scroll', function () {
				if ($(window).scrollTop() > options.scrollTop) {
					$this.addClass('active');
				} else {
					$this.removeClass('active');
				}
			})
			$this.on('click', function () {
				$('html,body').animate({
					'scrollTop': 0
				}, options.scrollSpeed)
			})
		}
	})(jQuery);

	jQuery('#scroll_up').goBack();
};
function brainbizz_blog_masonry_init () {
  if (jQuery(".blog_masonry").length) {
    var blog_dom = jQuery(".blog_masonry").get(0);
    var $grid = imagesLoaded( blog_dom, function() {
      // initialize masonry
      jQuery(".blog_masonry").isotope({
            layoutMode: 'masonry',
            masonry: {
                columnWidth: '.item',
            },
        itemSelector: '.item',
        percentPosition: true
      });
      jQuery(window).trigger('resize');
    
    });
  }
}
// wgl Carousel List
function brainbizz_carousel_slick () {
  var carousel = jQuery('.brainbizz_carousel_slick');
  if (carousel.length !== 0 ) {
    carousel.each(function(item, value){      
      var blog_slider = jQuery(this).closest('.blog-style-slider');
      if(blog_slider.length !== 0 ){
        jQuery(this).on('init', function(event, slick){
          jQuery(this).find('.content-container > *').addClass('activate fadeInUp');
        });        
        jQuery(this).on('afterChange', function(event, slick, currentSlide) {
          jQuery(this).find('.content-container > *').removeClass('off');
          jQuery(this).find('.content-container > *').addClass('activate fadeInUp');
        });      
        jQuery(this).on('beforeChange', function(event, slick, currentSlide) {
          jQuery(this).find('.content-container > *').removeClass('activate fadeInUp');
          jQuery(this).find('.content-container > *').addClass('off');
        });  
      }
      if(jQuery(this).closest('.blog-style-hero-image_type2').length > 0){
        carousel_resize(value);
        jQuery( window ).resize(function() {
          carousel_resize(value);
        });        
      }
      if(jQuery(this).hasClass('fade_slick')){
        jQuery(this).slick({
          draggable: true,
          fade: true,
          speed: 900,
          cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
          touchThreshold: 100
        });
      }else{
        jQuery(this).slick({});
      }

    });
  }  
}

function carousel_resize($row){

    $row = jQuery($row);

    var data = $row.data('slick'),
    item_col = 3,
    col_count = 1,
    col, 
    $return = true;
    
    if(!data)
      return;

    for(var i = 0; i < data.responsive.length; i++){
      if(jQuery(window).width() < data.responsive[i].breakpoint){
        if(data.responsive[i].settings.slidesToShow != 3){
          $return = false;
        }
        item_col = data.responsive[i].settings.slidesToShow;
      }
    }

    var width = $row.width(); 
    var col_width = width/item_col;

    $row.find('.item').each(function() {
      var th = jQuery(this);
      if($return){
        if(jQuery(this).hasClass('span6')){
          col_count = 1.5; 
        }else{
          col_count = .75;
        }        
      }

      col = Math.ceil(col_width*col_count);
      th.css('width', col + 'px');
    });
}

// wgl Countdown function init
function brainbizz_countdown_init () {
    var countdown = jQuery('.brainbizz_module_countdown');
    if (countdown.length !== 0 ) {
        countdown.each(function () {
            var data_atts = jQuery(this).data('atts');
            var time = new Date(+data_atts.year, +data_atts.month-1, +data_atts.day, +data_atts.hours, +data_atts.minutes);
            jQuery(this).countdown({
                until: time,
                padZeroes: true,
                format: data_atts.format ? data_atts.format : 'yowdHMS',
                labels: [data_atts.labels[0],data_atts.labels[1],data_atts.labels[2],data_atts.labels[3],data_atts.labels[4],data_atts.labels[5], data_atts.labels[6], data_atts.labels[7]],
                labels1: [data_atts.labels[0],data_atts.labels[1],data_atts.labels[2], data_atts.labels[3], data_atts.labels[4], data_atts.labels[5], data_atts.labels[6], data_atts.labels[7]]
            });
        });
    }
}
// wgl Counter
function brainbizz_counter_init() {
	var counters = jQuery('.brainbizz_module_counter');
	if ( counters.length ) {
		counters.each(function() {
			var counter = jQuery(this).find('.counter_value_wrap .counter_value');
			counter.appear(function() {
				var max = parseFloat(counter.text());
				counter.countTo({
					from: 0,
					to: max,
					speed: 2000,
					refreshInterval: 100
				});
			});
		});
	}
}

//https://gist.github.com/chriswrightdesign/7955464
function mobilecheck() {
    var check = false;
    (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

//Add Click event for the mobile device
var click = mobilecheck() ? ('ontouchstart' in document.documentElement ? 'touchstart' : 'click') : 'click';

function initClickEvent(){
    click =  mobilecheck() ? ('ontouchstart' in document.documentElement ? 'touchstart' : 'click') : 'click';
}
jQuery(window).on('resize', initClickEvent);

/*
 ** Plugin for counter shortcode
 */
(function($) {
    "use strict";

    $.fn.countTo = function(options) {
        // merge the default plugin settings with the custom options
        options = $.extend({}, $.fn.countTo.defaults, options || {});

        // how many times to update the value, and how much to increment the value on each update
        var loops = Math.ceil(options.speed / options.refreshInterval),
            increment = (options.to - options.from) / loops;

        return $(this).each(function() {
            var _this = this,
                loopCount = 0,
                value = options.from,
                interval = setInterval(updateTimer, options.refreshInterval);

            function updateTimer() {
                value += increment;
                loopCount++;
                $(_this).html(value.toFixed(options.decimals));

                if (typeof(options.onUpdate) === 'function') {
                    options.onUpdate.call(_this, value);
                }

                if (loopCount >= loops) {
                    clearInterval(interval);
                    value = options.to;

                    if (typeof(options.onComplete) === 'function') {
                        options.onComplete.call(_this, value);
                    }
                }
            }
        });
    };

    $.fn.countTo.defaults = {
        from: 0,  // the number the element should start at
        to: 100,  // the number the element should end at
        speed: 1000,  // how long it should take to count between the target numbers
        refreshInterval: 100,  // how often the element should be updated
        decimals: 0,  // the number of decimal places to show
        onUpdate: null,  // callback method for every time the element is updated,
        onComplete: null  // callback method for when the element finishes updating
    };
})(jQuery);

/*
 ** Plugin for slick Slider
 */
function brainbizz_slick_navigation_init (){
  jQuery.fn.brainbizz_slick_navigation = function (){
    jQuery(this).each( function (){
      var el = jQuery(this);
      jQuery(this).find('span.left_slick_arrow').on("click", function() {
        jQuery(this).closest('.wgl_cpt_section').find('.slick-prev').trigger('click');
      });
      jQuery(this).find('span.right_slick_arrow').on("click", function() {
        jQuery(this).closest('.wgl_cpt_section').find('.slick-next').trigger('click');
      });
    });
  }
}

/*
 ** Plugin IF visible element
 */
function is_visible_init (){
  jQuery.fn.is_visible = function (){
    var elementTop = jQuery(this).offset().top;
    var elementBottom = elementTop + jQuery(this).outerHeight();
    var viewportTop = jQuery(window).scrollTop();
    var viewportBottom = viewportTop + jQuery(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
  }
}

/*
 ** Preloader
 */
jQuery(window).load(function(){
    jQuery('#preloader-wrapper').fadeOut();
});
// wgl Image Layers
function brainbizz_img_layers() {
	jQuery('.brainbizz_module_img_layer').each(function() {
		var container = jQuery(this);
		var initImageLayers = function(){
			container.appear(function() {
				container.addClass('img_layer_animate');
            },{done:true})
		}
		jQuery(window).on('resize', initImageLayers);
		jQuery(window).on('load', initImageLayers);
	});
}
function brainbizz_instagram_init() {
    var instagram = jQuery('#sb_instagram');
    var insta = function () {
        if (instagram.length !== 0 ) {
            var item_length = jQuery('.sbi_item').size();
            if(item_length % 2 !== 0){
                var center_item = Math.floor(item_length/2);
                jQuery('.sbi_item:eq( '+center_item+' )').addClass('hover-active');
            } else{
                var center_item = Math.floor(item_length/2);
                jQuery('.sbi_item:eq('+(center_item-2)+'), .sbi_item:eq('+(center_item+1)+')').addClass('hover-active');
            }
        }
    }
    setTimeout(insta, 1200);
}
function brainbizz_isotope () {
  if (jQuery(".isotope").length) {

    var portfolio_dom = jQuery(".isotope").get(0);
    var $grid = imagesLoaded( portfolio_dom, function() {
      // initialize masonry
      jQuery(".isotope").isotope({
            layoutMode: 'masonry',
        percentPosition: true,
        itemSelector: '.wgl_portfolio_list-item, .item',
            masonry: {
                columnWidth: '.wgl_portfolio_list-item-size, .wgl_portfolio_list-item, .item',
            },
      });
      jQuery(window).trigger('resize');
    
    });
  
    jQuery(".isotope-filter a").each(function(){
      var data_filter = this.getAttribute("data-filter");
      var num = jQuery(this).closest('.wgl_portfolio_list').find('.wgl_portfolio_list-item').filter( data_filter ).length;
      jQuery(this).find('.number_filter').text( num );
    });  

    var $filter = jQuery(".isotope-filter a");
    $filter.on("click", function (e){
      e.preventDefault();
      jQuery(this).addClass("active").siblings().removeClass("active");
      
      var filterValue = jQuery(this).attr('data-filter');
      jQuery($grid.elements).isotope({ filter: filterValue });
    });
  }
}

function brainbizz_menu_lavalamp(){
  var lavalamp = jQuery('.lavalamp_on > ul');
  if (lavalamp.length !== 0) {
    lavalamp.each(function(){
      var $this = jQuery(this);
      setTimeout(function(){
     $this.lavalamp({
       easing: 'easeInOutCubic',
       duration: 400,
     });
    }, 500);
   })
  }
  var category = jQuery('.blog-post_meta-categories');
  if (category.length !== 0) {
    category.each(function(){
     var $this = jQuery(this);
     setTimeout(function(){
       $this.lavalamp({
         easing: 'easeInOut',
         duration: 500,
       });
     }, 500);
   })
  }
}

//Lava Lamp Plugin
!function(a) {
    var t = {
        init: function(t) {
            var o = {
                easing: "ease",
                duration: 700,
                margins: !1,
                setOnClick: !1,
                activeObj: ".current-menu-ancestor,.current-menu-item,.current-category-ancestor",
                autoUpdate: !1,
                updateTime: 100,
                enableHover: !0,
                delayOn: 0,
                delayOff: 0,
                enableFocus: !1,
                deepFocus: !1
            };
            return t = a.extend({}, o, t),
            this.each(function() {
                var o = t.margins
                  , s = t.setOnClick
                  , m = t.activeObj
                  , r = t.autoUpdate
                  , p = t.updateTime
                  , u = t.enableHover
                  , v = t.delayOn
                  , c = t.delayOff
                  , d = t.enableFocus
                  , f = t.deepFocus
                  , h = t.duration
                  , g = t.easing
                  , b = a(this)
                  , T = b.children()
                  , y = b.children(m);
                0 === y.length && (y = T.eq(0)),
                b.addClass("lavalamp").data({
                    lavalampActive: y,
                    isAnim: !1,
                    settings: t
                });
                var A = a('<div class="lavalamp-object ' + g + '" />').prependTo(b);
                T.addClass("lavalamp-item");

                if(jQuery(this).hasClass('menu')){
                  A.css({
                      WebkitTransitionDuration: h / 1e3 + "s",
                      msTransitionDuration: h / 1e3 + "s",
                      MozTransitionDuration: h / 1e3 + "s",
                      OTransitionDuration: h / 1e3 + "s",
                      transitionDuration: h / 1e3 + "s"
                  });                  
                }

                var j = jQuery(this).hasClass('menu') ? y.outerWidth(o) - 40 : y.outerWidth(o)
                  , I = y.outerHeight(o)
                  , O = Math.round(y.position().top)
                  , C = jQuery(this).hasClass('menu') ? y.position().left + 20 : Math.round(y.position().left)
                  , x = y.css("marginTop")
                  , D = y.css("marginLeft");
                o || (D = parseInt(D),
                x = parseInt(x),
                C += D,
                O += x),
                A.css({
                    width: jQuery(this).hasClass('menu') ? j : 0,
                    opacity: jQuery(this).hasClass('menu') ? 1 : 0,
                    transform: "translate(" + C + "px," + O + "px)"
                });

                if(!jQuery(this).hasClass('menu')){
                  A.animate({ width: j, opacity: 1 }, 'slow');
                }      
                
                var F = !1
                  , H = !0;
                if (e = function() {
                    var t = a(this);
                    F = !0,
                    setTimeout(function() {
                        F && H && b.lavalamp("anim", t, O)
                    }, v)
                }
                ,
                i = function(a) {
                    a = b.data("lavalampActive"),
                    F = !1,
                    setTimeout(function() {
                        !F && H && b.lavalamp("anim", a, false)
                    }, c)
                }
                ,
                n = function() {
                    var t = a(this);
                    t.hasClass("lavalamp-item") || (t = t.parents(".lavalamp-item")),
                    H = !1,
                    setTimeout(function() {
                        b.lavalamp("anim", t, O)
                    }, v)
                }
                ,
                l = function() {
                    H = !0;
                    var a = b.data("lavalampActive");
                    setTimeout(function() {
                        b.lavalamp("anim", a, O)
                    }, c)
                }
                ,
                u && (b.on("mouseenter", ".lavalamp-item", e),
                b.on("mouseleave", ".lavalamp-item", i)),
                d && (b.on("focusin", ".lavalamp-item", n),
                b.on("focusout", ".lavalamp-item", l)),
                f && (b.on("focusin", ".lavalamp-item *", n),
                b.on("focusout", ".lavalamp-item *", l)),
                s && T.on('click', function () {
                    y = a(this),
                    b.data("lavalampActive", y).lavalamp("update")
                }),
                r) {
                    var k = setInterval(function() {
                        var a = b.data("isAnim");
                        F || a || b.lavalamp("update")
                    }, p);
                    b.data("updateInterval", k)
                }
            })
        }, 
        destroy: function() {
            return this.each(function() {
                var t = a(this)
                  , o = t.data("settings")
                  , s = t.children(".lavalamp-item")
                  , m = o.enableHover
                  , r = o.enableFocus
                  , p = o.deepFocus
                  , u = o.autoUpdate;
                if (m && (t.off("mouseenter", ".lavalamp-item", e),
                t.off("mouseleave", ".lavalamp-item", i)),
                r && (t.off("focusin", ".lavalamp-item", n),
                t.off("focusout", ".lavalamp-item", l)),
                p && (t.off("focusin", ".lavalamp-item *", n),
                t.off("focusout", ".lavalamp-item *", l)),
                t.removeClass("lavalamp"),
                s.removeClass("lavalamp-item"),
                u) {
                    var v = t.data("updateInterval");
                    clearInterval(v)
                }
                t.children(".lavalamp-object").remove(),
                t.removeData()
            })
        },
        update: function() {
            return this.each(function() {
                var t = a(this)
                  , e = t.children(":not(.lavalamp-object)")
                  , i = t.data("lavalampActive");
                e.addClass("lavalamp-item").css({
                    zIndex: 5,
                    position: "relative"
                }),
                t.lavalamp("anim", i, false)
            })
        },
        anim: function(a, lavaPosition) {
            var t = this
              , e = t.data("settings")
              , i = e.duration
              , n = e.margins
              , l = t.children(".lavalamp-object")
              , o = jQuery(this).hasClass('menu') ? a.outerWidth(n) -40 : a.outerWidth(n)
              , s = a.outerHeight(n)
              , m = Math.round(a.position().top)
              , r = jQuery(this).hasClass('menu') ? a.position().left + 20 : Math.round(a.position().left)
              , p = a.css("marginTop")
              , u = a.css("marginLeft");
            n || (u = parseInt(u),
            p = parseInt(p),
            r += u,
            m += p),
            t.data("isAnim", !0),
            l.css({
                width: o,
                transform: "translate(" + r + "px," + (jQuery(this).hasClass('menu') ? m : lavaPosition ? m + 14 : m) + "px)"
            });
            if(!jQuery(this).hasClass('menu')){
              l.css({
                WebkitTransitionDuration: i / 1e3 + "s",
                msTransitionDuration: i / 1e3 + "s",
                MozTransitionDuration: i / 1e3 + "s",
                OTransitionDuration: i / 1e3 + "s",
                transitionDuration: i / 1e3 + "s"
              });              
            }
            setTimeout(function() {
                t.data("isAnim", !1)
            }, i)
        }
    };
    a.fn.lavalamp = function(e) {
        return t[e] ? t[e].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof e && e ? void a.error("Method " + e + " does not exist on jQuery.lavalamp") : t.init.apply(this, arguments)
    }
    ;
    var e, i, n, l
}(jQuery);

(function( $ ) {

  $(document).on('click', '.sl-button', function() {
    var button = $(this);
    var post_id = button.attr('data-post-id');
    var security = button.attr('data-nonce');
    var iscomment = button.attr('data-iscomment');
    var allbuttons;
    if ( iscomment === '1' ) { /* Comments can have same id */
      allbuttons = $('.sl-comment-button-'+post_id);
    } else {
      allbuttons = $('.sl-button-'+post_id);
    }
    var loader = allbuttons.next('#sl-loader');
    if (post_id !== '') {
      $.ajax({
        type: 'POST',
        url: wgl_core.ajaxurl,
        data : {
          action : 'brainbizz_like',
          post_id : post_id,
          nonce : security,
          is_comment : iscomment,
        },
        beforeSend:function(){
          loader.html('&nbsp;<div class="loader">Loading...</div>');
        },  
        success: function(response){
          var icon = response.icon;
          var count = response.count;
          allbuttons.html(icon+count);
          if(response.status === 'unliked') {
            var like_text = wgl_core.like;
            allbuttons.prop('title', like_text);
            allbuttons.removeClass('liked');
          } else {
            var unlike_text = wgl_core.unlike;
            allbuttons.prop('title', unlike_text);
            allbuttons.addClass('liked');
          }
          loader.empty();         
        }
      });

    }
    return false;
  });

})( jQuery );
function brainbizz_link_scroll () {
    jQuery('a.smooth-scroll, .smooth-scroll').on('click', function(event){
    	var href;
    	if(this.tagName == 'A') {
    		href = jQuery.attr(this, 'href');
    	} else {
    		var that = jQuery(this).find('a');
    		href = jQuery(that).attr('href');
    	}
        jQuery('html, body').animate({
            scrollTop: jQuery( href ).offset().top
        }, 500);
        event.preventDefault();
    });
}
//WGL MEGA MENUS GET AJAX POSTS
( function ($){

  jQuery(document).ready(function (){ 
    
    brainbizz_ajax_mega_menu_init();
  
  });
  
  var megaMenuAjax = false;
  var node_str = '<div class="mega_menu_wrapper_overlay">'; 
  node_str  += '<div class="preloader_type preloader_dot">';
  node_str  += '<div class="mega_menu_wrapper_preloader wgl_preloader dot">';
  node_str  += '<span></span>';
  node_str  += '<span></span>';
  node_str  += '<span></span>'; 
  node_str  += '</div>';
  node_str  += '</div>';
  node_str  += '</div>';

  function brainbizz_ajax_mega_menu_init ( ){

    var grid, mega_menu_item, mega_menu_item_parent;
 
    mega_menu_item = document.querySelectorAll('li.mega-menu ul.mega-menu.sub-menu.mega-cat-sub-categories li');
    mega_menu_item_parent = document.querySelectorAll('li.mega-menu');

    if ( mega_menu_item.length ){

      for (var i = 0; i < mega_menu_item.length; i++) {

        // Define an anonymous function here, to make it possible to use the i variable.
        (function (i) {
          var grid = mega_menu_item[i].closest('.mega-menu-container').getElementsByClassName( 'mega-ajax-content' );
          brainbizz_ajax_mega_menu_event(mega_menu_item[i], grid);
        }(i));
      }
    }     

    if ( mega_menu_item_parent.length ){

      for (var i = 0; i < mega_menu_item_parent.length; i++) {

        // Define an anonymous function here, to make it possible to use the i variable.
        (function (i) {
          var grid = mega_menu_item_parent[i].getElementsByClassName( 'mega-ajax-content' );
          brainbizz_ajax_mega_menu_event(mega_menu_item_parent[i], grid);
        }(i));
      }
    }     
  }

  function brainbizz_ajax_mega_menu_event(item, grid){
    var request_data = {};


    item.addEventListener( 'mouseenter', function ( e ){
      var not_uploaded = true;
      if(!this.classList.contains("mega-menu")){

        if( this.classList.contains("is-active") && this.classList.contains("is-uploaded")){
          return;
        } 

        var item_el = this.closest('ul.mega-menu').querySelectorAll( 'li.menu-item' );    
        for (var i = 0; i < item_el.length; i++){
          item_el[i].classList.remove('is-active');
        }

        this.classList.add("is-active");

        $( grid ).find('.ajax_menu').removeClass('fadeIn-menu').hide();
        
        if( ! $(grid).find('.loader-overlay').length ){
          $(grid).addClass('is-loading').append( node_str );
        }

        $( grid ).find("[data-url='" + this.getAttribute('data-id') + "']").show(400, function(){
          jQuery(this).addClass('fadeIn-menu');
          if($(grid).hasClass('is-loading')){
            $(grid).removeClass('is-loading').find('.mega_menu_wrapper_overlay').remove();
          }
        });           

      }else{
        var item_el = this.querySelectorAll( 'ul.mega-menu li.menu-item' );     
        for (var i = 0; i < item_el.length; i++){
          if(item_el[i].classList.contains('is-active')){
            $( grid ).find("[data-url='" + item_el[i].getAttribute('data-id') + "']").show().addClass('fadeIn-menu');               
            if($( grid ).find("[data-url='" + item_el[i].getAttribute('data-id') + "']").length == 0){
              not_uploaded = true;
            }else{
              not_uploaded = false;
            }
            
          }
        }
      }

      var item_menu = this;

      if(!this.classList.contains("is-uploaded") && not_uploaded){

            // Create request
            request_data.id = parseInt(this.getAttribute('data-id'));
            request_data.posts_count = parseInt(this.getAttribute('data-posts-count'));
            request_data.action = 'wgl_mega_menu_load_ajax';

            e.preventDefault(); 

            if( megaMenuAjax && megaMenuAjax.readyState != 4 ){
              megaMenuAjax.abort();
            }

            megaMenuAjax = $.ajax({
              url : wgl_core.ajaxurl,
              type: 'post',
              data: request_data,
              beforeSend: function(response){
                if( ! $(grid).find('.loader-overlay').length ){
                  $(grid).addClass('is-loading').append( node_str );
                }
              },
              success: function( response, status ){
                item_menu.classList.add('is-uploaded');

                var response_container, new_items, identifier, response_wrapper;
                response_container = document.createElement( "div" );
                response_wrapper = document.createElement( "div" );
                response_wrapper.classList.add("ajax_menu");

                response_container.innerHTML = response;            
                identifier = $( ".items_id", response_container );

                response_wrapper.setAttribute('data-url', $(identifier).data('identifier'));

                new_items = $( response_wrapper ).append($('.item', response_container ));

                $('.ajax_menu').removeClass('fadeIn-menu').hide();
                new_items = new_items.hide();
                $( grid ).append( new_items );
                new_items.show().addClass('fadeIn-menu');
                if(typeof jarallax === 'function'){
                  brainbizz_parallax_video();
                }else{
                  jQuery.getScript(wgl_core.JarallaxPluginVideo, function()
                  {
                   jQuery.getScript(wgl_core.JarallaxPlugin, function()
                   {
                   }).always(function( s, Status ) {
                    jQuery(grid).find('.parallax-video').each(function() {
                      jQuery( this ).jarallax( {
                        loop: true,
                        speed: 1,
                        videoSrc: jQuery( this ).data( 'video' ),
                        videoStartTime: jQuery( this ).data( 'start' ),
                        videoEndTime: jQuery( this ).data( 'end' ),
                      } );    
                    });
                  });
                 });         
                }            
              },
              error: function( response ){
                item_menu.classList.remove('is-uploaded');
              },
              complete: function( response ){
                $(grid).removeClass('is-loading').find('.mega_menu_wrapper_overlay').remove();
              },
            });
          }


        }, false );       
}

}(jQuery));
function brainbizz_message_anim_init(){
    jQuery('.message_close_button').on('click',function(){
       jQuery(this).closest('.brainbizz_module_message_box.closable').slideUp(350);
    })
}

function brainbizz_mobile_header(){
	var menu = jQuery('.mobile_nav_wrapper .primary-nav > ul');

	//Create plugin Mobile Menu
	(function($) {

		$.fn.wglMobileMenu = function(options) {		
			var defaults = {  
				"toggleID"   	: ".mobile-hamburger-toggle",
				"switcher"      : ".button_switcher",
				"back"      	: ".back",
				"anchor"		: ".menu-item-has-children > a[href*=#]"
	    	};
		    
		    if (this.length === 0) { return this; }
		    
		    return this.each(function () {
		    	var wglMenu = {}, ds = $(this);
			    var sub_menu = jQuery('.mobile_nav_wrapper .primary-nav > ul ul');
			    var m_width = jQuery('.mobile_nav_wrapper').data( "mobileWidth" );
			    var m_toggle = jQuery('.mobile-hamburger-toggle');
			    var body = jQuery('body');

			    //Helper Menu
				var open = "is-active",
			    openSubMenu = "show_sub_menu",
			    mobile_on = "mobile_switch_on",
			    mobile_switcher = "button_switcher";
			    
			    var init = function() {
			    	wglMenu.settings = $.extend({}, defaults, options);
			    	createButton();
			    	showMenu();
			    },
			    showMenu = function(){			    	
			    	if (jQuery(window).width() <= m_width) {
			    		if (!m_toggle.hasClass( open )) {
			    			create_nav_mobile_menu();
			    		}
					}else{
						reset_nav_mobile_menu();
					}
			    },
			    create_nav_mobile_menu = function() {
			    	sub_menu.removeClass(openSubMenu);
					ds.hide().addClass(mobile_on);
					body.removeClass(mobile_on);
			    },
			    reset_nav_mobile_menu = function() {
					sub_menu.removeClass(openSubMenu);
					body.removeClass(mobile_on);
					ds.show().removeClass(mobile_on);
					m_toggle.removeClass(open);
					jQuery('.' + mobile_switcher) .removeClass('is-active');
			    },
			    createButton = function() {
		  			ds.find('.menu-item-has-children').each(function() {
		  				jQuery(this).find('> a').append('<span class="'+ mobile_switcher +'"></span>');
		  			});
		  			ds.find("ul.sub-menu").each(function() {
			  			var dis     = jQuery(this),
				        disPar  = dis.closest("li"),
				        disfA   = disPar.find("> a"),
				        disBack = jQuery("<li/>",{ "class" : "back menu-item","html"  : "<a href='#'>"+disfA.text()+"</a>" })
				        disBack.prependTo(dis);		  			
		  			});
		        },
			    toggleMobileMenu = function(e) {
			    	jQuery(this).toggleClass(open);
			    	ds.toggleClass(openSubMenu).slideToggle();
			    	body.toggleClass(mobile_on);
			    },
			    showSubMenu = function(e) {
			    	e.preventDefault();
			    	jQuery(this).parent().prev('.sub-menu').toggleClass(openSubMenu);
			    	jQuery(this).parent().next('.sub-menu').toggleClass(openSubMenu);
			    	jQuery(this).toggleClass(open);
			    },
			    goBack = function(e) {
			    	e.preventDefault();
			    	jQuery(this).closest( '.sub-menu' ).removeClass(openSubMenu);
			    	jQuery(this).closest( '.sub-menu' ).prev( 'a' ).removeClass(open);
			    	jQuery(this).closest( '.sub-menu' ).prev( 'a' ).find('.' + mobile_switcher).removeClass(open);
			    };
			    
			    /*Init*/
			    init();
			    
			    jQuery(wglMenu.settings.toggleID).on(click, toggleMobileMenu);
			    
			    //switcher menu
			    jQuery(wglMenu.settings.switcher).on(click, showSubMenu);
			    jQuery(wglMenu.settings.anchor).on(click, showSubMenu);

			    //Go back menu
			    jQuery(wglMenu.settings.back).on(click, goBack);

		    	jQuery( window ).resize(
		    		function() {
		    			showMenu();
		    		}
		    	);
		    });

		};
	})(jQuery);

	menu.wglMobileMenu();
    
} 
// wgl Page Title Parallax
function brainbizz_page_title_parallax() {
    var page_title = jQuery('.page-header.page_title_parallax')
    if (page_title.length !== 0 ) {
        page_title.paroller();
    }
}

function brainbizz_parallax_video () {
	jQuery( '.parallax-video' ).each( function() {
		jQuery( this ).jarallax( {
			loop: true,
			speed: 1,
			videoSrc: jQuery( this ).data( 'video' ),
			videoStartTime: jQuery( this ).data( 'start' ),
			videoEndTime: jQuery( this ).data( 'end' ),
		} );
	} );
}
function particles_custom () {
    jQuery('.particles-js').each(function () {
        var id = jQuery(this).attr('id');
        var color = jQuery(this).data('particles-color');
        var particle_type = jQuery(this).data('type');
        if (true == particle_type) {
            var numbers = 60;
            var lines = false;
        } else {
            var numbers = 110;
            var lines = true;
        }
        
        particlesJS(
            id, {
                "particles":{
                    "number":{
                        "value":numbers,
                        "density":{
                            "enable":true,
                            "value_area":800
                        }
                    },
                    "color":{
                        "value":color
                    },
                    "shape":{
                        "type":"circle",
                        "stroke":{
                            "width":0,
                            "color":"#000000"
                        },"polygon":{
                            "nb_sides":5
                        },
                        "image":{
                            "src":"img/github.svg",
                            "width":100,
                            "height":100
                        }
                    },
                    "opacity":{
                        "value":0.5,
                        "random":false,
                        "anim":{
                            "enable":false,
                            "speed":1,
                            "opacity_min":0.1,
                            "sync":false
                        }
                    },
                    "size":{
                        "value":3,
                        "random":true,
                        "anim":{
                            "enable":false,
                            "speed":33.56643356643357,
                            "size_min":0.1,
                            "sync":true
                        }
                    },
                    "line_linked":{
                        "enable":lines,
                        "distance":150,
                        "color":color,
                        "opacity":0.4,
                        "width":1
                    },
                    "move":{
                        "enable":true,
                        "speed":2,
                        "direction":"none",
                        "random":false,
                        "straight":false,
                        "out_mode":"out",
                        "bounce":false,
                        "attract":{
                            "enable":false,
                            "rotateX":600,
                            "rotateY":1200
                        }
                    }
                },
                "interactivity":{
                    "detect_on":"canvas",
                    "events":{
                        "onhover":{
                            "enable":true,
                            "mode":"grab"
                        },
                        "onclick":{
                            "enable":true,
                            "mode":"push"
                        },
                        "resize":true
                    },
                    "modes":{
                        "grab":{
                            "distance":158.35505639876231,
                            "line_linked":{
                                "opacity":1
                            }
                        },
                        "bubble":{
                            "distance":400,
                            "size":40,
                            "duration":2,
                            "opacity":8,
                            "speed":3
                        },
                        "repulse":{
                            "distance":200,
                            "duration":0.4
                        },
                        "push":{"particles_nb":4},
                        "remove":{"particles_nb":2}
                    }
                },
                "retina_detect":true
            });
        var count_particles, stats, update;
        update = function() {
            requestAnimationFrame(update); 
        }; 
        requestAnimationFrame(update);
    })
}
//http://brutaldesign.github.io/swipebox/
function brainbizz_videobox_init () {
	if (jQuery(".videobox, .swipebox").length !== 0 ) {
		jQuery( '.videobox, .swipebox' ).swipebox({autoplayVideos: true});
	}
}
function brainbizz_search_init(){

    //Create plugin Search
    (function($) {

        $.fn.wglSearch = function(options) {        
            var defaults = {
                "toggleID"      : ".header_search-button",
                "closeID"      : ".header_search-close",
                "searchField"   : ".header_search-field",
                "body"          : "body > *:not(header)",
            };
            
            if (this.length === 0) { return this; }
            
            return this.each(function () {
                var wglSearch = {}, s = $(this);
                var openClass = 'header_search-open',
                searchClass = '.header_search';

                var init = function() {
                    wglSearch.settings = $.extend({}, defaults, options);
                },
                open = function () {
                    $(s).addClass(openClass);
                    setTimeout(function(){
                        $(s).find('input.search-field').focus();
                    }, 100);
                    return false;
                },                
                close = function () {
                    jQuery(s).removeClass(openClass);
                },
                toggleSearch = function(e) {
                    if (!$(s).closest(searchClass).hasClass(openClass)) {
                        open();
                    }else{
                        close();
                    }
                },
                eventClose = function(e) {
                    var element = jQuery(searchClass);
                    if(!$(e.target).closest('.search-form').length){
                        if ($(element).hasClass(openClass)) {
                            close();
                        }                        
                    }
                };

                /*Init*/
                init();

                if(jQuery(this).hasClass('search_standard')){
                    jQuery(this).find(wglSearch.settings.toggleID).on(click, toggleSearch);
                }else{
                    jQuery(wglSearch.settings.toggleID).on(click, toggleSearch);
                    jQuery(wglSearch.settings.searchField).on(click, eventClose);
                }
            
                jQuery(wglSearch.settings.body).on(click, eventClose);
                
            });

        };

    })(jQuery);

    jQuery('.header_search').wglSearch();

}
// Select Wrapper
function brainbizz_select_wrap() {
	jQuery( '.widget select' ).each( function() {
		jQuery( this ).wrap( "<div class='select__field'></div>" );
	} );
}
		
function brainbizz_skrollr_init(){
    var blog_scroll = jQuery('.blog_skrollr_init');
    if (blog_scroll.length) {
   		if(!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)){ 
	      // wgl Skrollr
	      skrollr.init({
	        smoothScrolling: false,
	        forceHeight: false
	      });  
  		}
    }
}


function brainbizz_sticky_init(){

	var section = '.wgl-sticky-header';
	var top = jQuery(section).height();
	var data = jQuery(section).data('style');

	//For Follow In up
	var previousScroll = 0;

	function init(element){        
		if(!element){
			return;
		}

		var y = jQuery(window).scrollTop();
		if(data == 'standard'){
	        if ( y >= top ) {   
	            jQuery(section).addClass( 'sticky_active' );
	        } else {
	            jQuery(section).removeClass('sticky_active');
	        }   			
		}else{
	        if(y > top) {
	            if (y > previousScroll) {
	                jQuery(section).removeClass('sticky_active');
	            } else {
	                jQuery(section).addClass( 'sticky_active' );
	            }
	        } else {
	             jQuery(section).removeClass('sticky_active');
	        }
	        previousScroll = y;
		}
    };   

    if ( jQuery( '.wgl-sticky-header' ).length !== 0 ) {
    	jQuery( window ).scroll(
    		function() {
    			init(jQuery(this));
    		}
    	);

    	jQuery( window ).resize(
    		function() {
    			init(jQuery(this));
    		}
    	);
    }
} 
function brainbizz_sticky_sidebar() {
  if (jQuery('.sticky-sidebar').length) {
    jQuery('.sticky-sidebar').each(function(){
      jQuery(this).theiaStickySidebar({
        additionalMarginTop: 30,
        additionalMarginBottom: 30
      });
    });
  }
}
// wgl TimetabsImage Layers
function wgl_timeTabs() {
	if (jQuery('.wgl_timetabs').length) {
		jQuery('.wgl_timetabs').each(function(){
			var $this = jQuery(this);
		
			var tab = $this.find('.timetabs_headings .wgl_tab');
			var	data = $this.find('.timetabs_data .timetab_container');
			
			tab.filter(':first').addClass('active');
			data.filter(':not(:first)').hide();
			tab.each(function(){
				var currentTab = jQuery(this);

				currentTab.on('click tap', function(){
					var id = currentTab.data('tab-id');
				
					currentTab.addClass('active').siblings().removeClass('active');
					if(jQuery(window).width() > 1200){
						jQuery('.wgl_timetabs .timetab_container[data-tab-id='+id+']').slideDown({start: function () {jQuery(this).css({display: "block"})}})
							.siblings().slideUp();
					} else {
						jQuery('.wgl_timetabs .timetab_container[data-tab-id='+id+']').slideDown({start: function () {jQuery(this).css({display: "flex"})}})
							.siblings().slideUp();
					};				
				});
			});
			jQuery(window).on('resize', function(){
				if(jQuery(window).width() > 1200){
					$this.find('.timetab_container[style*="flex"]').css('display', 'block');
				} else {
					$this.find('.timetab_container[style*="block"]').css('display', 'flex');
				};
			});
		})
	}
}
		
// wgl Time Line Appear
function brainbizz_init_timeline_appear() {

    var item = jQuery('.brainbizz_module_time_line_vertical.appear_anim .time_line-item');

    if (item.length) {
        item.each(function() {
            var item = jQuery(this);
            item.appear(function() {
                item.addClass('item_show');
            });
        });
    }

}

// wgl Time Line Horizontal Appear
function brainbizz_init_timeline_horizontal_appear() {

    var item = jQuery('.brainbizz_module_time_line_horizontal.appear_anim');
    var duration = 250;
    if (item.length) {
        item.each(function() {
            var item = jQuery(this);
            item.appear(function() {
        item.find('.time_line-item').each(function(index){
          jQuery(this).delay(duration * index).animate({
            opacity:1
          },duration);
        })
            });
        });
    }

}

// wgl Time Line Appear
function brainbizz_init_progress_appear() {

    var item = jQuery('.progress_bar_wrap');

    if (item.length) {
        item.each(function() {
            var item = jQuery(this),
              item_bar = item.find('.progress_bar'),
              data_width = item_bar.data('width'),
              counter = item.find('.progress_value')
            item.appear(function() {
                item_bar.css('width',data_width+'%');
                var max = parseFloat(counter.text());
                counter.countTo({
                    from: 0,
                    to: max,
                    speed: 1000,
                    refreshInterval: 10
                });
            });
        });
    }

}
function brainbizz_woocommerce_qty(){
    jQuery('.quantity.number-input span.minus').on( "click", function() {
        this.parentNode.querySelector('input[type=number]').stepDown();
        if(document.querySelector('.woocommerce-cart-form [name=update_cart]')){
            document.querySelector('.woocommerce-cart-form [name=update_cart]').disabled = false;
        }
    }); 

    jQuery('.quantity.number-input span.plus').on( "click", function() {
        this.parentNode.querySelector('input[type=number]').stepUp();
        if(document.querySelector('.woocommerce-cart-form [name=update_cart]')){
            document.querySelector('.woocommerce-cart-form [name=update_cart]').disabled = false;
        }
    });
}
