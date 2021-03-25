<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="Generator" content="EditPlus®">
<meta name="Author" content="@작업자">
<meta name="Keywords" content="@업무현황판">
<meta name="Description" content="@HDC신라아이파크면세점 온라인몰 일일 업무 현황판 입니다.">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>업무용 MAP TO ANCHOR</title>
<link rel="shortcut icon" href="/inc_local/images/favicon-anchor.ico" />
<link rel="apple-touch-icon" href="/inc_local/images/favicon-anchor.ico" />
<link rel="stylesheet" href="inc_local/css/base.css" type="text/css">
<link rel="stylesheet" href="inc_local/css/common.css" type="text/css">
<script type="text/javascript" src="http://www.lottemart.com/js/jquery/jquery-1.6.4.min.js"></script>
<script>
function resizeMap(_thisObj) {
	var _thisCoords = _thisObj.attr('coords-data');
	var _targetImg = $('img[usemap=#' + _thisObj.parent().attr('name') + ']');
	var _newImg = new Image();
	_newImg.src = _targetImg.attr('src');
	var _naturalWidth = _newImg.width;
	var _imgRatio = _targetImg.width() / _naturalWidth;
	var _cArray = _thisCoords.split(',');
	var _cArrayCount = _cArray.length;
	var _respos = '';

	for (i=0; i<_cArrayCount; i++) {
		_cArray[i] = (_cArray[i] * _imgRatio).toFixed(4);
		(i == _cArrayCount - 1) ? _respos = _respos + _cArray[i] : _respos = _respos + _cArray[i] + ',';
	};

	_thisObj.attr('coords', _respos);
};
</script>
</head>
<body>

<style type="text/css">
	html {font-size:20px;}
	body {background:#ECEFF2; overflow-y:scroll;}
	.header {padding:20px; font-size:20px; color:#dddedf; font-family:'NanumGothic'; background:#263238;}
	.wrap {overflow:hidden;}
	.wrap > div {float:left; width:48.5%; padding:1%;}
	.wrap > div:first-child {padding-right:0;}
	.wrap .txt-area {width:100%; background:#fff; border-radius:5px; border-right:1px solid rgba(109,109,109,.2); border-bottom:2px solid rgba(109,109,109,.2); overflow:hidden;}
	.wrap .txt-area textarea {width:96%; height:100%; padding:2%; margin-bottom:0; border:none; text-align:left; resize:vertical;}
	.wrap .viewport {margin-top:10px;}
	.wrap .viewport img {max-width:100%;}
	.wrap .result-side .viewport a {border:1px dashed red; background:rgba(255,255,0,.3); box-sizing:border-box;}
	.wrap .result-side .txt-area {position:relative; text-align:right;}
	.wrap .result-side .txt-area input[type='radio'] {position:absolute; top:0; left:-9999px;}
	.wrap .result-side .txt-area .option-wrap {position:absolute; top:5px; right:20px;}
	.wrap .result-side .txt-area input[type='radio']:checked + label {color:#dddedf; background:#263238;}
	.wrap .result-side .txt-area label {display:inline-block; padding:5px 10px; border:1px solid #263238; background:#fff; cursor:pointer;}
</style>

<script type="text/javascript">
	$(function(){
		var _currentOption = localStorage.getItem('resultOption');

		$('#' + _currentOption).prop('checked', true);

		$('.original-side textarea').keyup(function(){
			resultWrite($(this), _currentOption);
		})

		$('.option-wrap input[type=radio]').change(function(){
			var _checked = $(this).parent().find('input[type=radio]:checked').attr('id');
			localStorage.setItem('resultOption', _checked);
			_currentOption = localStorage.getItem('resultOption')
			resultWrite($('.original-side textarea'), _currentOption)
		})
	});

	function originalFunc(_this, _thisValue) {
		_this.parent().next('.viewport').html(_thisValue);
	};

	function resultWrite(_this, _currentOption) {
		var _thisValue = _this.val();
		if (_thisValue == null || _thisValue == '') {
			$('.result-side textarea').val('');
			$('.viewport').html('');
		} else {
			originalFunc(_this, _thisValue);
			resultFunc(_this, _thisValue, _currentOption);
		}
	}

	function resultFunc(_this, _thisValue, _currentOption) {
		var _style =
			'<style type="text/css">'
			+'	.hasmap-wrap {display:block; position:relative;}'
			+'	.hasmap-wrap img {width:100%;}'
			+'	.hasmap-wrap a {position:absolute; display:block; font:0/0 a;}'
			+'</style>';
		$('.result-side .viewport').html(_style + _thisValue)
		$('.result-side map').each(function(){
			var _thisName = $(this).attr('name'); // map 의 name값
			var _findImg = $('.result-side img[usemap="#' + _thisName + '"]'); // 해당 map을 참조하는 이미지

			$(_findImg).each(function(){
				var _this = $(this);
				var _newImage = new Image();

				_newImage.src = _this.attr('src');
				_this.wrap('\n<div class="hasmap-wrap" />'); // wrap 생성

				if (_currentOption == 'percent') {
					calPercent(_this, _thisName, _newImage);
				} else if (_currentOption == 'rem') {
					calRem(_this, _thisName, _newImage);
				}

				_this.removeAttr('usemap'); // 이미지에서 usemap값 삭제
			});
		});
		$('.result-side map').remove(); // 문서에서 map 태그 삭제
		$('.result-side textarea').val($('.result-side .viewport').html().replace(/\t/g, '').replace(/\n/g, '').replace('<img', '\n	<img').replace(/\<a href/g, '\n	<a href').replace('</div>', '\n</div>').replace(/\.hasmap/g,'\n	.hasmap').replace('</style>','\n</style>\n'));
	}

	function calPercent(_this, _thisName, _newImage){
		$('.result-side .viewport').removeAttr('style');
		$('.result-side [name=' + _thisName + '] area').each(function(){
			var _thisHref = $(this).attr('href');
			var _thisAlt = $(this).attr('alt');
			var _coordsArray = $(this).attr('coords').split(','); // 좌표 배열
			var _calLeft = ((_coordsArray[0]/_newImage.width)*100).toFixed(4) + '%'; // left값 계산
			var _calTop = ((_coordsArray[1]/_newImage.height)*100).toFixed(4) + '%'; // top값 계산
			var _calWidth = (((_coordsArray[2] - _coordsArray[0])/_newImage.width)*100).toFixed(4) + '%'; // width값 계산
			var _calheight = (((_coordsArray[3] - _coordsArray[1])/_newImage.height)*100).toFixed(4) + '%'; // height값 계산

			if (_thisAlt == null || _thisAlt == '') { _thisAlt = 'alt없음'; };
			_this.closest('.hasmap-wrap').append('<a href="' + _thisHref + '" style="' + 'left:' + _calLeft + '; top:' + _calTop + '; width:' + _calWidth + '; height:' + _calheight + ';">' + _thisAlt + '</a>'); // a태그 생성
		});
	}

	function calRem(_this, _thisName, _newImage){
		$('.result-side .viewport').css('width', _newImage.width);
		$('.result-side [name=' + _thisName + '] area').each(function(){
			var _thisHref = $(this).attr('href');
			var _thisAlt = $(this).attr('alt');
			var _coordsArray = $(this).attr('coords').split(','); // 좌표 배열
			var _calLeft = _coordsArray[0]/20 + 'rem'; // left값 계산
			var _calTop = _coordsArray[1]/20 + 'rem'; // top값 계산
			var _calWidth = (_coordsArray[2] - _coordsArray[0])/20 + 'rem'; // width값 계산
			var _calheight = (_coordsArray[3] - _coordsArray[1])/20 + 'rem'; // height값 계산

			if (_thisAlt == null || _thisAlt == '') { _thisAlt = 'alt없음'; };
			_this.closest('.hasmap-wrap').append('<a href="' + _thisHref + '" style="' + 'left:' + _calLeft + '; top:' + _calTop + '; width:' + _calWidth + '; height:' + _calheight + ';">' + _thisAlt + '</a>'); // a태그 생성
		});
	}
</script>

<div class="header">MAP TO ANCHOR</div>
<div class="wrap">
	<div class="original-side">
		<div class="txt-area">
			<textarea name="" id="" cols="30" rows="10" placeholder="Map 코드 입력"></textarea>
		</div>
		<div class="viewport"></div>
	</div>
	<div class="result-side">
		<div class="txt-area">
			<div class="option-wrap">
				<input type="radio" id="percent" name="optionRadio" checked="checked" /><label for="percent">퍼센트</label>
				<input type="radio" id="rem" name="optionRadio" /><label for="rem">REM</label>
			</div>
			<textarea name="" id="" cols="30" rows="10" placeholder="Anchor 코드 출력" readonly="readonly"></textarea>
		</div>
		<div class="viewport">
		</div>
	</div>
</div>

</body>
</html>