(function($) {
$.fn.popover = function(options) {
  var defaults = {
    openEvent: null,
    closeEvent: null
  };
  var options = $.extend(defaults, options);

  var openedPO = null;
  var button = $(this);
  var header = $(options.header).detach();
  var content = $(options.content).detach();
  var floater;

  var hidePopover = function(content) {
    content.removeClass("active");
    content.attr("style", "");
    if ($.isFunction(options.closeEvent)) options.closeEvent();
    openedPO = null;
    $(document).unbind("click");
    return false;
  }

  var showPopover = function() {
    //already opened
    if (openedPO === this){
      return true;
    } else if(openedPO != null){
      // Close the previous one
      hidePopover($(".floater", openedPO));
    }
    
    triangle = $(".floater > .triangle", this);
    leftOff = 0;
    topOff = 0;
    docWidth = $(document).width();
    docHeight = $(document).height();
    triangleSize = parseInt(triangle.css("border-bottom-width"));
    contentWidth = floater.outerWidth();
    contentHeight = floater.outerHeight();
    buttonWidth = button.outerWidth();
    buttonHeight = button.outerHeight()
    offset = button.offset();
    
    //Calculate topOff
    topOff = offset.top + buttonHeight + triangleSize;
    diffHeight = docHeight - (topOff + contentHeight + triangleSize );
    if(diffHeight < 0){
      //resize the floater
      floater.height(floater.height() + diffHeight);
    }
    
    //Calculate leftOff
    leftOff = offset.left + ( buttonWidth - contentWidth)/2;
    diffWidth = 0
    if(leftOff < 0){
      //out of the document at left
      diffWidth = -leftOff;
    }else if ( leftOff + contentWidth > docWidth){
      //left of the screen right
      
      diffWidth = leftOff + contentWidth - docWidth;
    }
    
    //position floater
    triangle.css("left", contentWidth/2 - triangleSize + diffWidth);
    
    //resize the floater for overflow
    floater.children(".content").css("max-height", floater.height() -parseInt(floater.children(".header").css("height")) - 7);
    
    floater.offset({
      top: topOff,
      left: leftOff - diffWidth
    });
    
    $(document).click(function(event){
      if ($(event.target).parents(".popover").length === 0){
        return hidePopover(floater);
      }
    });
    floater.show();
    //Timeout for webkit transitions to take effect
    window.setTimeout(function(){floater.addClass("active");}, 0)
    if($.isFunction(options.openEvent)) options.openEvent();
    openedPO = this;
    return false;
  }

  this.each(function(){
    $(this).addClass("popover");
    floater = $('<div class="floater"><div class="triangle"></div>'
        + '<div class="header"></div><div class="content"></div>'
        + '</div>').appendTo(this);
    $(".header", floater).append(header);
    $(".content", floater).append(content);
    $(this).click(showPopover);
  });
}
})(jQuery);
