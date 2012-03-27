(function( $ ) {
	
	var _carouselItems = new Array();
	
	var _settings = {
		'scroll_duration'         	: 800,
		'fall_duration'					: 300,
		'reverse_fall_duration'	: 300		
		};
	
	var _carousel = null;
	var _currentItem = 0;
	var _isAnimating = 0;
	
	function getCarousel(){
		return _carousel;
	}
	
	function getCarouselParent(){
		return _carousel.parent();
	}
	
	function getCarouselPreviousItem(){
		item_index =  (_carouselItems.length + (_currentItem - 2)) % _carouselItems.length;	
		return getCarouselItem(item_index);
	}
	
	function getCarouselCurrentItem(){
		return _carouselItems[_currentItem];
	}
	
	function getCarouselNextItem(){
		item_index =  (_carouselItems.length + (_currentItem +2)) % _carouselItems.length;	
		return getCarouselItem(item_index);
	}
	
	function getCarouselItem(index){
		return _carouselItems[index];
	}
	
	function incrementCurrent(){
		_currentItem++;
		if(_currentItem == _carouselItems.length)
			_currentItem = 0;
	}
	
	function decrementCurrent(){
		_currentItem--;
		if(_currentItem < 0)
			_currentItem = _carouselItems.length - 1;
	}
	
	/*Caroursel Items initialization*/
	function addItem(item){
		if(_carouselItems.length == 0)
			firstItem(item);
		else
			initItem(item);
	}
	
	function initItem(item){
		_carouselItems.push(item);
		item.css("left", "+=" + getCarouselParent().width() + "px");				
		item.children().css('top', '-=' + getCarouselParent().height() + 'px');
	}
	
	function firstItem(item){
		item.css("left", ((getCarouselParent().width() - item.outerWidth()) / 2) + 
        getCarouselParent().scrollLeft() + "px");
		_carouselItems.push(item);
	}
	/*End of Carousel Items initialization*/
	
	/* Scrolling Functions */
	function hideToLeft(item){
		item.animate({
			left: -item.outerWidth() + "px"
		}, _settings.scroll_duration);
	}
	
	function hideToRight(item){
		item.animate({
			left: getCarouselParent().width()+ "px"
		}, _settings.scroll_duration);
	}
	
	function showFromLeft(item, callback){
		item.css("left", -item.outerWidth() + "px");
		showCenter(item, callback);
	}
	
	function showFromRight(item, callback){
		item.css("left",  getCarouselParent().width() + "px");		
		showCenter(item, callback);
	}
	
	function showCenter(item, callback){
		item.animate(
			{left: ((getCarouselParent().width() - item.outerWidth()) / 2) + getCarouselParent().scrollLeft() + "px"}
			, _settings.scroll_duration, 
				function(){
					if (typeof callback == "function")
						callback();
				}
			);	
	}
	
	function elementsFall(item, callback){
		var children = [];		
		item.children().each(
			function(){
				children.push($(this));
			}
		);		
		putDown(children, callback);
	}
	
	function putDown(children, callback){
		if (children.length > 0) 
		{
			var currentChild = children.shift();			
			currentChild.animate(
				{top: '+=' + getCarouselParent().height() + 'px'},
				_settings.fall_duration, 
					function(){
						putDown(children, callback);
					}
			);
        }
		else
		{
			if (typeof callback == "function")
				callback();
		}
	}
	
	function elementsUp(item, callback){
		var children = [];
		item.children().each(
			function(){
				children.push($(this));
			}
		);
		hideUp(children, callback);
	}
	
	function hideUp(children, callback){
		if (children.length > 0) 
		{
			var currentChild = children.shift();			
			currentChild.animate(
				{top: '-=' + getCarouselParent().height() + 'px'},
				_settings.reverse_fall_duration, 
					function(){
						hideUp(children, callback);
					}
			);
        }
		else
		{
			if (typeof callback == "function")
				callback();
		}
    }

	
	
	/* End of Scrolling Functions */
	
	
	
	var methods = {
			
		init : function(options) { 
			_settings = $.extend( _settings, options);
			_carousel = $(this);
			$(this).children('li').each(function(index) {
				addItem($(this));
			});	
		},
		
		scrollLeft : function(callback) {		
			if(_isAnimating == 1)
				return;				
			_isAnimating = 1;
			
			elementsUp(getCarouselCurrentItem(), 
				function(){
					hideToRight(getCarouselCurrentItem());
					decrementCurrent();
					showFromLeft(getCarouselCurrentItem(),
						function(){
							elementsFall(getCarouselCurrentItem(), callback);
							_isAnimating = 0;
						}
					);
				}
			);
		},
		
		scrollRight: function(callback) { 
			if(_isAnimating == 1)
				return;				
			_isAnimating = 1;
			
			elementsUp(getCarouselCurrentItem(), 
				function(){
					hideToLeft(getCarouselCurrentItem());
					incrementCurrent();
					showFromRight(getCarouselCurrentItem(), 
						function(){
							elementsFall(getCarouselCurrentItem(), callback);
							_isAnimating = 0;
						}
					);
				}
			);		
		},
		
		scrollToIndex: function(index, callback) { 
			if (typeof callback == "function")
				callback();
		},
		
		fallDown: function(callback){
		},
		
		fallUp: function(callback){
		
		}
		
	};
  
	$.fn.xcarousel = function(method) {   
		if ( methods[method] ) {
		  return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.xCarousel' );
		}      
  };

	
})( jQuery );