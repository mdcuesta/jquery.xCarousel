(function( $ ) {
	
	var _carouselItems = new Array();
	
	var _settings = {
		'scroll_duration'       :800,
		'fall_duration'			:300,
		'reverse_fall_duration'	:300,
		'bounce_duration'		:300,
		'bouce_times'			:300
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
		if(index >= _carouselItems.length)
			index = index % _carouselItems.length;
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
						if(children.length == 0)
						{
							currentChild.effect('bounce', {times: _settings.bounce_times}, _settings.bounce_duration,
								function(){
									if(children.length < 1)
									{
										if (typeof callback == "function")
										{
											callback();
										}
									}
								}
							);
						}
						else
						{
							currentChild.effect('bounce', {times: _settings.bounce_times}, _settings.bounce_duration);
						}
						
						putDown(children, callback);
					}
			);
        }
	}
	
	function elementsUp(item, callback){
		var children = [];
		var itemchildren = item.children();		
		for(i = itemchildren.length - 1; i >= 0; i--)
		{
			children.push(itemchildren[i]);
		}	
		hideUp(children, callback);
	}
	
	function hideUp(children, callback){
		
		if (children.length > 0) 
		{			
			var currentChild = children.shift();			
			$(currentChild).animate(
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

	function scrollItemsToLeft(items, callback){
		if (items.length > 1) 
		{
			var currentItem = items.shift();			
			currentItem.animate(
					{left: -item.outerWidth() + "px"}
					, _settings.scroll_duration);
			
			if(items.length == 0)
			{
				if (typeof callback == "function")
					callback();
				return;
			}
			nextItem = items[0];			
			nextItem.animate(
				{left: ((getCarouselParent().width() - nextItem.outerWidth()) / 2) + getCarouselParent().scrollLeft() + "px"}
				, _settings.scroll_duration, 
				function(){
					scrollItemsToLeft(items, callback);
				}
			);
        }	
		else
		{
			if (typeof callback == "function")
					callback();
		}
	}
	
	function scrollItemsToRight(items, callback){
		if(items.length > 1)
		{			
			var currentItem = items.shift();			
			currentItem.animate(
					{left: getCarouselParent().width()+ "px"}
					, _settings.scroll_duration);
			if(items.length == 0)
			{
				if (typeof callback == "function")
					callback();
				return;
			}
			nextItem = items[0];			
			nextItem.animate(
				{left: ((getCarouselParent().width() - nextItem.outerWidth()) / 2) + getCarouselParent().scrollLeft() + "px"}
				, _settings.scroll_duration, 
				function(){
					scrollItemsToRight(items, callback);
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
							elementsFall(getCarouselCurrentItem(), 
							function(){
								_isAnimating = 0;
								if (typeof callback == "function")
									callback();
							});							
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
							elementsFall(getCarouselCurrentItem(), 
								function(){
									_isAnimating = 0;
									if (typeof callback == "function")
										callback();
								}
							);							
						}
					);
				}
			);		
		},
		
		scrollToIndex: function(index, callback) { 
		
			if(_isAnimating == 1)
				return;
			
			_isAnimating = 1;
			
			index = index % _carouselItems.length;
			if(_currentItem < index)
			{
				//go right
				var carouselItems = [];
				carouselItems.push(getCarouselCurrentItem());
				
				for(i = _currentItem + 1; i <= index; i++)
				{					
					item = getCarouselItem(i);
					item.css("left",  getCarouselParent().width()  + "px");		
					carouselItems.push(item);
				}				
				
				elementsUp(getCarouselCurrentItem(), 
					function(){
						_currentItem = index;
						scrollItemsToLeft(carouselItems, 
							function(){
								elementsFall(getCarouselCurrentItem(), 
									function(){
										_isAnimating = 0;
										if (typeof callback == "function")
											callback();
									}
								);						
							}
						);
					}				
				);
				
			}
			else
			{				
				//go left
				var carouselItems = [];
				carouselItems.push(getCarouselCurrentItem());
				
				for(i = _currentItem - 1; i >= index; i--)
				{					
					item = getCarouselItem(i);
					item.css("left",   -item.outerWidth() + "px");		
					carouselItems.push(item);
				}
								
				elementsUp(getCarouselCurrentItem(), 
					function(){
						_currentItem = index;
						scrollItemsToRight(carouselItems, 
							function(){
								elementsFall(getCarouselCurrentItem(), 
									function(){
										_isAnimating = 0;
										if (typeof callback == "function")
											callback();
									}
								);						
							}
						);
					}				
				);
			}
		},
		
		getCurrentSlideIndex: function(){
			return _currentItem;
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
