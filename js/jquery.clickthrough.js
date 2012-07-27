 /**
 * jQuery Clickthrough Plugin v1.0
 * https://github.com/nubz/jquery-clickthrough
 *
 * Copyright 2011, Alistair Macdonald
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 *
 * Creates a 'click-through' presentation from a collection of slides
 * configurable options include 'control_lis' which, if set to true,
 * will reveal <li> elements one by one with each click until all are showing
 * then the next click will show the next slide
 *
 * call the plugin on the collection of slides to create a default slideshow e.g.  
 *  $('div.slide').clickthrough();
 * or with configuration:
 *  $('div.slide').clickthrough({
 *     'control_lis' : false,
 *     'slide_width' : '700px',
 *     'slide_height' : '550px'
 *    });
 *
 */

(function($) {
    $.fn.clickthrough = function(options) {
        //private vars
        var number_of_slides = this.length,
            slides = this;
        //configurable settings
        var settings = $.extend({
            'control_lis': true,
            'slide_width': '600px',
            'slide_height': '550px',
            'back_button': true
        }, options);
        return this.each(function(i, slide) {
            //private vars per slide
            var next_slide = (i + 1 < number_of_slides) ? i + 1 : 0,
                prev_slide = (i - 1 > 0) ? i - 1 : 0,
                $lis = (settings.control_lis) ? $(this).find('li').hide() : [],
                li_tracker = 0,
                $this_slide = $(slide);

            //wrap the slide content into a central box
//wrap the slide content into a central box to suit our 
            //resolution and make the clickable slide full width and height
            $(this)
              .wrapInner('<div class="slide-content" />')
              .css('width', '100%')
              .css('min-height', window.innerHeight + 'px');
            $('div.slide-content')
              .css('width', settings.slide_width)
              .css('min-height', settings.slide_height)
              .css('margin', '0 auto');

            if (settings.back_button && next_slide != 1) {
                $this_slide
                  .append('<button name="prev" id="prev">&lt;</button>')
                  .find('#prev')
                  .bind('click.prev', function(e) {
                    e.stopPropagation();
                    $(this)
                      .parent()
                      .fadeOut('slow', function() {
                        if (settings.control_lis) {
                            li_tracker = 0;
                            $lis.hide();
                        }
                        $(slides.eq(prev_slide)).fadeIn();
                    });
                });
            }
            if (i > 0) 
                $(this).hide();
            $(this).bind('click.clickthrough', function() {
                if (li_tracker < $lis.length) {
                    $lis.eq(li_tracker).fadeIn();
                    li_tracker++;
                } else {
                    $(this).fadeOut('slow', function() {
                        if (settings.control_lis) {
                            li_tracker = 0;
                            $lis.hide();
                        }
                        $(slides.eq(next_slide)).fadeIn();
                    });
                }
            })
            //stop all hyperlink clicks from propagating through to parent
              .find("a")
              .attr("target","_blank")
              .bind('click', function(e){
                e.stopPropagation();
               });  
        });
    };
})(jQuery);
