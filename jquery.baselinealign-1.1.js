/*
  JQUERY.BASELINEALIGN-1.1.0.JS
  
  1.1   Allows use on any element, not just images.
  1.0.1 Gives compatibility with box-sizing: border-box;
  
  This plugin operates on a given set of elements, it:
    * detects the docuemnt baseline
    * applies the margin needed onto given elmeents, to ensure the baseline is maintained
  
  --------------------------------------------------------------------------------------------------------------------------
  FILE INFO
  Last updated:     2012/06/21
  Last updated by:  Matt Wilcox
  ----------------------------------------------------------------------------------------------------------------------- */

(function($) {

  var methods = {
    baselineAlign : function(options) {

      // Create some configuration options, and give sensible defaults
      var settings = $.extend({
        'container' : false // specify a container to apply the margin to rather than the image itself (if an image)
      }, options);
  
      return this.each(function() {
        var this_elm = $(this);

        // abort now if it's not an image set as display block
        if(this_elm.css('display') === 'inline') { return; }

        // reset JS applied margins on the image
        this_elm.attr('style','');

        var elm_height = Math.floor(this_elm.height());

        if(this_elm.is("img")){
          // shrink the image height to a whole pixel value to avoid rounding errors in the layout engine
          this_elm.css("height",elm_height);
        }

        /* setup variables */
        var baseline        = parseFloat($("html").css("line-height").replace("px",""));
        var total_footprint = elm_height;

        if(this_elm.is("img")){
          // IF: the image is inside a container box
          if(settings.container !== false &&
             this_elm.parents(settings.container).length > 0
            ){
              var container = this_elm.parents(settings.container);

              // reset JS applied margins on the container
              container.attr('style','');

              // shrink the image height to a whole pixel value to avoid rounding errors in the layout engine
              // NOTE, this introduces a very very slight difference in aspect ratio. You'll never see it.
              var container_height = Math.ceil(container.outerHeight());
              container.css("height",container_height);

              total_footprint = Math.floor(container.outerHeight(false));
          }
        }

        var remainder = parseFloat(total_footprint%baseline);
        var offset    = parseFloat(baseline-remainder);
        
        // avoid the text wrapping directly underneath, there needs to be at least 1/4 line-height gap
        if(offset<(baseline/2)) { offset = offset+baseline; }

        if(settings.container === false) { // apply directly to the image
          this_elm.css("margin-bottom",offset+"px");
          return; // stop processing this loop
        } else if(this_elm.parents(settings.container).length > 0) { /* apply margin to specified container box, if it exists */
          this_elm.parents(settings.container).css("margin-bottom",offset+"px");
          return;
        }
        /* apply margin to image itself */
        this_elm.css("margin-bottom",offset+"px");
      });
    },

    init : function() {
      var didResize = false;
      var didLoad   = false;
      var a         = this;
      var b         = arguments;

      $(window).resize(function(){
        didResize = true;
      });

      $(window).load(methods.baselineAlign.apply(a,b));

      setInterval(function(){
        if(didResize){
          didResize = false;
          return methods.baselineAlign.apply(a, b);
        }
      }, 500);
    }
  };

  $.fn.baselineAlign = function( method ) {
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.baselineAlign' );
    }
  };
})( jQuery );