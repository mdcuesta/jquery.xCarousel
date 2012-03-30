/*******************************************************
*          JQuery xCarousel Plugin                     *
* Author: Michael Dela Cuesta                          *
* Email: michael.dcuesta@gmail.com                     *
* Source: https://github.com/mdcuesta/jquery.xCarousel *
********************************************************/


(function( $ ) {
	
	var methods = {
			
		init : function(options) { 
			_settings = $.extend( _settings, options);
			_carousel = $(this);
			$(this).children().each(function(index) {
				addItem($(this));
			});	
		},
		
		scrollLeft : function(callback) {		
			if(_isAnimating == 1)
				return;				
			_isAnimating = 1;
			
			if(getCarouselFirstItem().get(0) == getCarouselCurrentItem().get(0))
			{
				getCarouselFirstItem().before(getCarouselLastItem());
				getCarousel().css("left", "-=" + getCarouselParent().width() + "px");
			}
			
			getCarouselFirstItem().before(getCarouselLastItem());
			getCarousel().css("left", "-=" + getCarouselParent().width() + "px");
			elementsUp(getCarouselCurrentItem().children(),
				function(){					
					getCarousel().animate({left: "+=" +getCarouselParent().width() + "px"}, _settings.scroll_duration,
						function(){						
							decrementCurrent();
							elementsFall(getCarouselCurrentItem().children(), 
								function(){								
									_isAnimating = 0;
									if (typeof callback == "function")
										callback();
								}
							);	
						}
					);
				}
			)
		},
		
		scrollRight: function(callback) { 
			if(_isAnimating == 1)
				return;				
			_isAnimating = 1;
			
			if(getCarouselLastItem().get(0) == getCarouselCurrentItem().get(0))
			{
				getCarouselLastItem().after(getCarouselFirstItem());
				getCarousel().css("left", "+=" + getCarouselParent().width() + "px");
			}
			
			elementsUp(getCarouselCurrentItem().children(), 
				function(){
					getCarousel().animate({left: "-=" +getCarouselParent().width() + "px"}, _settings.scroll_duration,
						function(){							
							incrementCurrent();
							elementsFall(getCarouselCurrentItem().children(), 
								function(){
									getCarouselLastItem().after(getCarouselFirstItem());
									getCarousel().css("left", "+=" + getCarouselParent().width() + "px");
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
				while(getCarouselFirstItem().get(0) != getCarouselCurrentItem().get(0))
				{
					getCarouselLastItem().after(getCarouselFirstItem());
					getCarousel().css("left", "+=" + getCarouselParent().width() + "px");
				}
				elementsUp(getCarouselCurrentItem().children(), 
					function(){
						gap = index - _currentItem;
						getCarousel().animate({left: "-=" + (getCarouselParent().width() * gap)+ "px"}, _settings.scroll_duration,
							function(){
								_currentItem = index;
								elementsFall(getCarouselCurrentItem().children(), 
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
				while(getCarouselLastItem().get(0) != getCarouselCurrentItem().get(0))
				{
					getCarouselFirstItem().before(getCarouselLastItem());
					getCarousel().css("left", "-=" + getCarouselParent().width() + "px");
				}	
				elementsUp(getCarouselCurrentItem().children(),
					function(){
						gap = _currentItem - index;
						getCarousel().animate({left: "+=" + (getCarouselParent().width() * gap)+ "px"}, _settings.scroll_duration,
							function(){
								_currentItem = index;								
								elementsFall(getCarouselCurrentItem().children(), 
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
		},
		
		getCarouselItemCount: function(){
			return _carouselItems.length;
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
  
	var _carouselItems = new Array();
	
	var _settings = {
		'scroll_duration'       :600,
		'fall_duration'			:500,
		'reverse_fall_duration'	:500
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
		
	function getCarouselCurrentItem(){
		return _carouselItems[_currentItem];
	}
		
	function getCarouselFirstItem(){
		return getCarousel().children().first();
	}
	
	function getCarouselLastItem(){
		return getCarousel().children().last();
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
		item.css("width", getCarouselParent().width() + "px");
		item.css("left", "+=" + getCarouselParent().width() + "px");				
		item.children().each(
			function(){
				$(this).children().each(
					function(){
						$(this).css('top', '-=' + getCarouselParent().height() + 'px');
						$(this).css('opacity', '0');
					}
				);
			}
		);
	}
	
	function firstItem(item){
		item.css("width", getCarouselParent().width() + "px");
		item.css("left", ((getCarouselParent().width() - item.outerWidth()) / 2) + 
        getCarouselParent().scrollLeft() + "px");
		_carouselItems.push(item);
	}
	/*End of Carousel Items initialization*/
	
	/* Scrolling Functions */
	function elementsFall(item, callback){
		var children = [];
		var itemchildren = item.children();		
		var timeout = 500;
		for(i = 0; i < itemchildren.length; i++)
		{			
			itemToAnimate = itemchildren[i];
			if(i == itemchildren.length - 1)
			{
				$(itemToAnimate).delay(timeout).animate(
					{top: '+=' + getCarouselParent().height() + 'px',
					opacity: 1},
					_settings.fall_duration,
					function(){
						if (typeof callback == "function")
								callback();
					}
				);
			}
			else
			{
				$(itemToAnimate).delay(timeout).animate(
					{top: '+=' + getCarouselParent().height() + 'px',
					opacity: 1},
					_settings.fall_duration
				);
			}
			timeout = timeout + 100;
		}
	}
	
	function elementsUp(item, callback){
		var children = [];
		var itemchildren = item.children();		
		var timeout = 500;
		
		for(i = itemchildren.length - 1; i >= 0; i--)
		{			
			itemToAnimate = itemchildren[i];
			
			if(i == 0)
			{				
				$(itemToAnimate).delay(timeout).animate(
					{top: '-=' + getCarouselParent().height() + 'px',
					opacity: 0},
					_settings.reverse_fall_duration,
						function(){
							if (typeof callback == "function")
								callback();
						}
				);					
			}
			else
			{	
				$(itemToAnimate).delay(timeout).animate(
					{top: '-=' + getCarouselParent().height() + 'px',
					opacity: 0},
					_settings.reverse_fall_duration
				);											
			}		
			timeout = timeout + 100;
		}	
	}
	/* End of Scrolling Functions */
})( jQuery );
