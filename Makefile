SASS=`which sass`

CSS_TARGETS=popover.css

all: $(CSS_TARGETS)

clean:
	@rm $(CSS_TARGETS)

%.css: lib/%.sass
	@if test -z $(SASS) ; \
	then \
		echo "Couldn't find sass compiler. (http://sass-lang.com/)" ; \
		exit 1 ; \
	fi
	@$(SASS) lib/$(*F).sass $(*F).css

