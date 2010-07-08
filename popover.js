jQuery.fn.popover = function(a){
	
	openedPO = null;
	header = $(a.header).detach();
	content = $(a.content).detach();
	openEvent = a.open;
	closeEvent = a.close;
	
	hidePopover = function(content){
		content.removeClass("active");
		content.attr("style", "");
		if($.isFunction(closeEvent)) closeEvent();
		openedPO = null;
		$(document).unbind("click");
		return false;
	}
	
	this.each(function(){
		$(this).addClass("popover");
		$(this).append('<div class="floater"><div class="triangle"></div><div class="header"></div><div class="content"></div></div>');
		$(".header", this).append(header);
		$(".content", this).append(content);
		
		$(this).click(function(){
			button = $(this);
			content = $(".floater", this);
			//already opened
			if(openedPO === this){
				return true;
			}else if(openedPO != null){
				//Close the previous one
				openedContent = $(".floater", openedPO);
				hidePopover(openedContent);
			}
			
			triangle = $(".floater > .triangle", this);
			leftOff = 0;
			topOff = 0;
			docWidth = $(document).width();
			docHeight = $(document).height();
			triangleSize = parseInt(triangle.css("border-bottom-width"));
			contentWidth = content.outerWidth();
			contentHeight = content.outerHeight();
			buttonWidth = button.outerWidth();
			buttonHeight = button.outerHeight()
			offset = button.offset();
			
			//Calculate topOff
			topOff = offset.top + buttonHeight + triangleSize;
			diffHeight = docHeight - (topOff + contentHeight + triangleSize );
			if(diffHeight < 0){
				//resize the content
				content.height(content.height() + diffHeight);
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
			
			//position content
			triangle.css("left", contentWidth/2 - triangleSize + diffWidth);
			
			//resize the content for overflow
			content.children(".content").css("max-height", content.height() -parseInt(content.children(".header").css("height")) - 7);
			
			content.offset({
				top: topOff,
				left: leftOff - diffWidth
			});
			
			$(document).click(function(event){
				if ($(event.target).parents(".popover").length === 0){
					return hidePopover(content);
				}
			});
			content.show();
			//Timeout for webkit transitions to take effect
			window.setTimeout(function(){content.addClass("active");}, 0)
			if($.isFunction(openEvent)) openEvent();
			openedPO = this;
			return false;
		});
	});
};
