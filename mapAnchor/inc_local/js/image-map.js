(function(){
	//기획전만 실행
	var $document = $(document),
	 	pathName = window.location.pathname,
	 	docPlan = pathName.indexOf('planthema'),
	 	docEvent = pathName.indexOf('event');
	 	/*folder1 = pathName.substring(10), //고정 @root_v3
	 	folder2 = folder1.indexOf('/'), // @root_v3 바로 뒤경로
	 	useName = folder1.substring(0,folder2); // planthema , event*/

	 if(docPlan != '-1' || docEvent != '-1'){

	 	var script=document.createElement('script');
		script.src='//ajax.googleapis.com/ajax/libs/jqueryui/1.12.0/jquery-ui.js';
		document.head.appendChild(script);

		var style=document.createElement('link');
		style.rel='stylesheet';
		style.href='/common/css/image-map.css';
		document.head.appendChild(style);

	 	var  $codeWrap = $('.codeWrap').eq(0), // pc 기획전 및 pc 이벤트
	 		$img = $codeWrap.find('img');

	 	$(window).load(function(){
	 		function defaultSetting(ele){
	 			var $this = $(ele),
	 				useMap = $this.attr('usemap'),
	 				_thisTop = $this.position().top,
	 				_thisW = $this.width(),
	 				_thisH = $this.height();
 				if(useMap){
 					$this
 						.after('<div class="map-view" style="top:'+_thisTop+'px;width:'+_thisW+'px;height:'+_thisH+'px;"><div class="rect-view"></div><div class="item-info"><div class="rect-info"></div><div class="poly-info"></div></div><div class="poly-view"><div class="svg-group"></div><div class="svg-area"></div><div class="poly-area"></div></div><div class="result-view"><div class="view-header">이미지맵 (창 이동시 여기를 드래그 하세요.) <button class="map-view-close">X</button></div></div></div>')
 						.after('<button type="button" class="btn-imgMap" style="top:'+_thisTop+'px;left:'+_thisW+'px;">이미지맵 켜기</button>');
 				}
	 		}
	 		$img.each(function(){
	 			var $this = $(this);
	 			defaultSetting($this)
	 		});
	 		$('.btn-imgMap').on('click',function(){
		 		var $btn = $(this),
		 			$mapImg = $btn.prev('img'),
		 			mapWrap = '.map-wrap',
		 			mapView = '.map-view',
		 			mapCode = '.map-code',
		 			btnimgMap = '.btn-imgMap',
		 			resultView = '.result-view',
 					rectView = '.rect-view',
 					itemInfo = '.item-info',
 					rectInfo = '.rect-info',
 					rectBox = '.rect-box',
 					polyInfo = '.poly-info',
 					polyView = '.poly-view',
		 			polyArea = '.poly-area',
		 			pathArea = '.path-area',
		 			svgArea = '.svg-area',
		 			svgGroup = '.svg-group',
 					viewHeader = '.view-header',
 					mapViewOn = '.map-view.on',
 					$wrapImg = $btn.prev(mapWrap).find('img'),
		 			$dim = $('.map-dim');

	 			$(mapView).off('contextmenu.mouseMenu');

	 			$btn.toggleClass('on').siblings(btnimgMap).removeClass('on');
	 			$mapImg.wrap(function(){
	 				return "<div class='map-wrap'></div>";
	 			});

	 			if($btn.hasClass('on')){
	 				// 이미지맵 켰을때
	 				$btn.text('이미지맵 끄기').siblings(btnimgMap).text('이미지맵 켜기').next(mapView).removeClass('on');
	 				$btn.prev(mapWrap).siblings(mapWrap).find('img').unwrap();
	 				$btn.next(mapView).addClass('on');
	 				$dim.remove();
	 				$codeWrap.prepend('<div class="map-dim"></div>');
	 			}else{
	 				// 이미지맵 껏을때
	 				$btn
	 					.text('이미지맵 켜기')
	 					.next(mapView)
	 					.removeClass('on');
	 				$dim.remove();
	 				$wrapImg.unwrap();
	 			}

	 			//마우스 오른쪽 버튼 클릭시
	 			$(mapView).on('contextmenu.mouseMenu', function(event){
	 				event.preventDefault();
	 				event.stopPropagation();
	 				var $mapWrap = $(this),
	 					_mapTop = $mapWrap.offset().top,
	 					_mouseX = event.pageX - 15,
	 					_mouseY = event.pageY - _mapTop
			 			pathLine = '',
			 			svgHtml = $(mapViewOn).find(svgArea).html();

		 			$(mapView).css({'cursor':'default'});
	 				$('.contextMenu').remove();
	 				$(mapViewOn).find(svgGroup).append(svgHtml);
	 				$(mapViewOn).find(polyView).off('click.polyView');
	 				$(svgArea).children().remove();

 					$mapWrap
 						.append('<div class="contextMenu" style="left:'+_mouseX+'px;top:'+_mouseY+'px;"><a href="#none" class="rect">Rect</a><a href="#none" class="poly">Poly</a><a href="#none" class="result">소스보기</a><a href="#none" class="reset">Reset</a></div>');

 					//reset
 					$('.reset').on('click.reset', function(event){
 						event.preventDefault();
 						var $resetWrap = $(this).closest(mapView);
 						$resetWrap.find(rectBox).remove();
 						$resetWrap.find(mapCode).remove();
 						$resetWrap.find(svgGroup).children().remove();
 						$resetWrap.find(pathArea).children().remove();
 						$resetWrap.find(polyArea).children().remove();
 						$resetWrap.find(itemInfo).children().children().remove();
 						$(resultView)
 							.css({'display':'none'})
 							.find(viewHeader)
 							.siblings()
 							.remove();
 					});

 					//rect
				 	$('.rect').on('click.rect', function(event){
				 		event.preventDefault();
				 		var txtInputLength = $(mapViewOn).find(rectView).children().length + 1;
				 		$('<div/>')
				 			.addClass('rect-box')
				 			.attr({'data-num':txtInputLength})
				 			.appendTo($(mapViewOn).find(rectView))
				 			.css({
				 				'left' : _mouseX,
				 				'top' : _mouseY
				 			})
				 			.draggable()
				 			.resizable();
			 			$('<button type="button">X</button>')
			 				.addClass('box-remove')
			 				.appendTo(rectBox);
		 				$('<div><input type="text" class="url-txt" placeholder="'+txtInputLength+'. rect url"><input type="text" class="alt-txt" placeholder="'+txtInputLength+'. rect alt"></div>')
			 				.addClass('rect-info-box')
			 				.appendTo($(mapViewOn).find(rectInfo));

		 				$(mapViewOn).find(rectView).find('.box-remove').on('click', function(){
		 					var $removeBtn = $(this),
		 						$rectInfoBox = $('.rect-info-box'),
		 						rectIndex = $removeBtn.parent().index();
		 					$removeBtn.closest(rectBox).remove();
		 					$rectInfoBox.eq(rectIndex).remove();
		 					$(rectBox).each(function(){
		 						var $rectBox = $(this),
		 							rectBoxIndex = $rectBox.index()+1;
		 						$rectBox.attr({'data-num':rectBoxIndex});
		 					});
		 					$rectInfoBox.each(function(){
	 							var $itemInfoBox = $(this),
	 								itemInfoIndex = $itemInfoBox.index()+1;
 								$itemInfoBox.find('.url-txt').attr({'placeholder':itemInfoIndex+'. rect url'});
 								$itemInfoBox.find('.alt-txt').attr({'placeholder':itemInfoIndex+'. rect alt'});
	 						});
		 				});

		 				$(rectInfo).find('input').focus(function(){
		 					var objIndex = $(this).parent().index();
		 					$(rectBox).eq(objIndex).addClass('on').siblings().removeClass('on');
		 				}).blur(function(){
		 					$(rectBox).removeClass('on');
		 				});

				 	});

				 	//poly
				 	$('.poly').on('click.poly', function(event){
				 		event.preventDefault();
				 		var txtInputLength = $(mapViewOn).find(svgGroup).children().length + 1;

			 			$(mapViewOn).find(polyView).off('click.polyView');
			 			$(mapViewOn).find(polyInfo).find('.box-remove').off('click.polyClose');
				 		$(pathArea).remove();

				 		$('<div><input type="text" class="url-txt" placeholder="'+txtInputLength+'. poly url"><input type="text" class="alt-txt" placeholder="'+txtInputLength+'. poly alt"><button type="button" class="box-remove">X</button></div>')
			 				.addClass('poly-info-box')
			 				.appendTo($(mapViewOn).find(polyInfo));

				 		$('<div/>')
				 			.addClass('path-area')
				 			.appendTo($(mapViewOn).find(polyView));

			 			$('<svg xmlns="http://www.w3.org/2000/svg"/>')
			 				.appendTo($(mapViewOn).find(svgArea)).siblings().remove();

			 			$(mapView).css({'cursor':'crosshair'});

			 			$(mapViewOn).find(polyView).on('click.polyView', function(event){
			 				event.preventDefault();
			 				event.stopPropagation();
			 				var $polyView = $(this),
			 					_mouseX = event.pageX - $polyView.offset().left,
			 					_mouseY = event.pageY - $polyView.offset().top,
								point = [,_mouseX,_mouseY ];
							$('<p>'+point+'</p>').appendTo(pathArea);
							var polyA = $(pathArea).html(),
								polyB = polyA.replace(/<\/p>/g, ''),
								polyC = polyB.replace(/<p>/g, ' '),
								polyD = polyC.replace(/ ,/g, ' '), 
								polyLine = polyD.replace(/ /g, ','), //ploy 좌표
								path = polyD.replace(/ /g, 'L'),
								pathLine = path.replace('L', 'M'), //path 좌표
								svgMake = $(document.createElementNS("http://www.w3.org/2000/svg","path"))
												.attr({
													d:pathLine+'Z',
													stroke:'black',
													'stroke-width':1,
													fill:'red',
													'fill-opacity':0.5,
													'stroke-dasharray':'2,2'
												});
			 				$(svgMake).appendTo($(mapViewOn).find(svgArea).find('svg')).siblings().remove();
			 				$('<div class="poly-'+txtInputLength+'">'+polyLine+'</div>').appendTo($(mapViewOn).find(polyArea)).siblings('.poly-'+txtInputLength).remove();
			 			});

			 			$(mapViewOn).find(polyInfo).find('.box-remove').on('click.polyClose', function(){
			 				var $removeBtn = $(this),
			 					$polyInfoBox = $('.poly-info-box'),
			 					$polyAreaChild = $(polyArea).children(),
		 						polyIndex = $removeBtn.parent().index();
	 						$(mapViewOn).find(svgGroup).children().eq(polyIndex).remove();
	 						$polyInfoBox.eq(polyIndex).remove();
	 						$polyAreaChild.eq(polyIndex).remove();
	 						$polyInfoBox.each(function(){
	 							var $itemInfoBox = $(this),
	 								itemInfoIndex = $itemInfoBox.index()+1;
 								$itemInfoBox.find('.url-txt').attr({'placeholder':itemInfoIndex+'. poly url'});
 								$itemInfoBox.find('.alt-txt').attr({'placeholder':itemInfoIndex+'. poly alt'});
	 						});
			 			});

			 			$(polyInfo).find('input').focus(function(){
		 					var objIndex = $(this).parent().index();
		 					$(mapViewOn).find(svgGroup).children().eq(objIndex).find('path')
		 						.attr({'fill':'#00a32e'})
		 						.parent()
		 						.siblings()
		 						.find('path')
		 						.attr({'fill':'red'});
		 				}).blur(function(){
		 					$(mapViewOn).find(svgGroup).children().find('path')
		 						.attr({'fill':'red'});
		 				});
				 	})

				 	//result
				 	$('.result').on('click.result', function(event){
				 		event.preventDefault();
				 		var $result = $(this),
				 			$viewHeader = $(viewHeader),
				 			$mapView = $result.closest(mapView),
				 			$resultView = $mapView.find(resultView),
				 			$viewClose = $mapView.find('.map-view-close'),
				 			$rectViewChlid = $mapView.find(rectView).children(),
				 			$polyViewChlid = $mapView.find(polyArea).children(),
				 			useMap = $btn.prev(mapWrap).find('img').attr('usemap').replace('#',''),
				 			html = '';

				 		$('<div/>').addClass('map-code').appendTo($resultView);
				 		$viewClose.off('click.viewClose');

		 				html = '&lt;map name="'+useMap+'"&gt;';

			 			$rectViewChlid.each(function(){
		 					var $ele = $(this),
			 					$eleIndex = $ele.index(),
		 						$eleInfo = $ele.closest('.map-view').find(rectInfo).children().eq($eleIndex),
		 						_txtInfoUrl = $eleInfo.find('.url-txt').val(),
		 						_txtInfoAlt = $eleInfo.find('.alt-txt').val(),
		 						_x1 = $ele.position().left,
			 					_y1 = $ele.position().top,
			 					_x2 = $ele.width() + _x1,
			 					_y2 = $ele.height() + _y1;
		 					html += '<br>&lt;area shape="rect" coords="'+_x1+','+_y1+','+_x2+','+_y2+'" href="'+_txtInfoUrl+'" alt="'+_txtInfoAlt+'"&gt;';
			 			});

			 			$polyViewChlid.each(function(){
			 				var $ele = $(this),
			 					$eleIndex = $ele.index(),
		 						$eleInfo = $ele.closest('.map-view').find(polyInfo).children().eq($eleIndex),
		 						_txtInfoUrl = $eleInfo.find('.url-txt').val(),
		 						_txtInfoAlt = $eleInfo.find('.alt-txt').val(),
		 						_polyTxt = $ele.text().replace(',','');
	 						html += '<br>&lt;area shape="poly" coords="'+_polyTxt+'" href="'+_txtInfoUrl+'" alt="'+_txtInfoAlt+'"&gt;';
			 			});
	 					html += '<br>&lt;/map&gt;';

	 					$resultView
	 						.css({
	 							'display':'block',
	 							'left':_mouseX, 
	 							'top':_mouseY
	 						})
	 						.draggable({ handle: $viewHeader })
				 			.resizable()
	 						.find(mapCode)
	 						.html(html);

	 					$viewClose.on('click.viewClose', function(){
	 						var $viewCloseBtn = $(this);
	 						$resultView
	 							.css({
	 								'display':'none'
	 							});
 							$viewCloseBtn
 								.closest(viewHeader)
 								.siblings()
 								.remove();
	 					});

				 	});
			 	});
			 	$(mapView).on('click', function(event){
			 		event.preventDefault();
			 		$('.contextMenu').remove();
			 	});
		 	});
	 	});
	 }
})();