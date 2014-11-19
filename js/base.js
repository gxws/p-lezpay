/*!
 * base
 * create: 2014/9/29
 */ 

/**
 * 基础模块
 * @module base
 * @since p64
 */
(function(window, undefined){

	/**
	 * 基础模块 - 交互逻辑
	 * @class base
	 * @since p64
	 */
	var	$win	= $(window),
		doc		= document,
		$doc	= $(doc),
		loc		= location,
		WS		= window.WS || (window.WS = {}),
		init	= {},							//启动时加载程序
		base	= WS.base || (WS.base = {});	//接口程序

/**************************** begin p64 ****************************/

	/**
	 * 初始化事件
	 * @method base.events
	 * @since p64
	 * @return {none}
	 */
	init.events = function(){
		$doc.on('input', '[data-verify]', function(){
			$('[data-verify-prompt]').html('');
		}).on('submit','.J_x_form_login',function(){
			var $this = $(this);
			return base.loginSubmit($this);
		}).on('submit','.J_j_form',function(){//N种验证方式
			var $form = $(this);
			return base.nionpaySubmit($form)
		}).on('submit','.J_j_idform',function(){//银行卡号验证
			var $form = $(this);
			return base.idSubmit($form)
		}).on('focus','.J_j_fm input',function(){//获取焦点,错误提示消失
			$(this).parent().next('.error').text('');
		}).on('focus','.J_j_fm input[data-type=vcode]',function(){//获取焦点,错误提示消失
			$(this).size() && $('.J_j_vcode').next('.error').text('');
		}).on('click','.J_j_gain',function(){//点击获取验证码
			var $this = $(this),
          $phone = $('[data-type=phone]'),
		    	vphone = $phone.val();
		  if($phone.size()){
		  	if(vphone==''){
		  		$phone.parent().next().html('<i class="glyphicon glyphicon-remove-sign"></i>' + '请输入手机号');
		  		return false;
		  	}
		  	base.gAin($this,vphone,function(){//回调倒计时
					var time = null,
					    s 	 = 60,
					    text ='',
					    vhref = $this.attr('href');
					$this.removeAttr('href');
					$this.addClass('disabled')
					$('[data-type=vcode]').focus();
					time = setInterval(function(){
						s--;
						text = s<=0 ? '获取验证码' : s + '秒',
						$this.text(text);
						if(s<=0){
							clearInterval(time);
							$this.attr('href',vhref);
							$this.removeClass('disabled');
						}
					},1000);
				});
		  }
			return false;
		}).on('input','.J_k_phone',function(){//344方式显示手机号码
			var		$this	=	$(this),
					$val	=	$this.val(),
					$noSpac	=	$val.replace(/\W/g, ""),
					str		=	'';
			if($win.width() < 768)return;
			for(i=0;i<$noSpac.length;i++){
				str += ((i-3) % 4?'':' ') + $noSpac[i];
			}
			$this.val(str);
			//this.setSelectionRange(0,0);
			//$.cookie('phone',str);//启用cookie
			return false;
		}).on('input','.J_k_cardnum',function(){//4443方式显示卡号
			var		$this	=	$(this),
					$val	=	$this.val(),
					$noSpac	=	$val.replace(/\W/g, ""),
					str		=	'';
			if($win.width()<768)return;
			$val	=	$noSpac;
			for(i=0;i<$noSpac.length;i++){
				str += ( i % 4?'':i == 0?'':' ') + $val[i];
			}
			$this.val(str);
			return false;
		}).on('submit','.J_k_form',function(){//注册验证
			var $form = $(this);
			return base.registerSubmit($form);
		}).on('focus', '[data-formName]', function(){//获取焦点，错误消失
			$('[data-error]').html('');
		}).on('change', '.J_c_intprice,.J_c_surprice',function(){
			if($(this).size()){
				base.setTotalPrice();
			}
		}).on('submit','.J_x_submitToPay',function(){//选择银行进行支付
			var $this	= $(this);
			if($this.find('.weixin input[type=radio]').prop('checked') && window.WeixinJSBridge && base.wxCallback){
				 return base.wxGoToPay(this);
			}
		})
		.on('click','.c_paywaybox label',function(){//选择付款方式（银行、淘宝、微信）
			var $this = $(this);
			if($('.J_c_paybox').hasClass('on')){
				return false;
			}
			else{
				$('.J_c_p64slelab.on').css('border','1px solid #969696');
				$this.addClass('on').css('border','1px solid #00a0e6');
			}			
		}).on('submit','.J_c_p64safety',function(){//银行卡号验证
			var $form = $(this);
			return base.p64safety($form)
		}).on('submit','.J_c_p64safetypwd',function(){//银行卡号验证
			var $form = $(this);
			return base.p64safetypwd($form)
		})
		// .on('click','.J_k_click',function(){//p79  按键背景色变化
		// 	$('.J_k_click').removeClass('click');
		// 	$(this).addClass('click');
		// }).on('click','.J_k_clickpage',function(){
		// 	$('.J_k_clickpage').removeClass('clickpage');
		// 	$(this).addClass('clickpage');
		// })
		.on('click','.J_K_sel',function(e){//下拉菜单点击事件
			$('.J_K_sel').addClass('clicksel');
			e.stopPropagation();
		}).on('click',document,function(e){//全局点击事件
			var	$sel	=	$('.J_K_sel');
			if($sel.size()){
				$sel.removeClass('clicksel');
			}
		}).on('change','.J_k_volCode',base.k_change);//协议判断
		
		aLert($('.J_j_validity'),'j_help','validity','click hover');//银行卡有效期帮助提示
		aLert($('.J_j_afthree'),'j_help','afthree','click hover');//银行卡末三位帮助提示
		function aLert($obj,boxClass,css,action){//弹出帮助提示框
			$obj.tooltip({
				container: 'body',
				template: '<div class="tooltip '+ boxClass +'" role="tooltip"><div class="tooltip-inner ' + css + '"></div></div>',
				trigger: action
			});
		}
	};

	/**
	 * 判断注册协议是否阅读
	 * @method base.k_change
	 * @since p64
	 * @return {none}
	 */
	init.k_change = function(){
		$('.J_k_volCode').size() && $('.J_k_regBtn').prop('disabled', !$('.J_k_volCode').get(0).checked);
	}

	/**
	 * 判断是否微信开启页面
	 * @method base.wxApi
	 * @since p64
	 * @return {none}
	 */
	init.wxApi = function(){
		if(!$('.J_x_submitToPay').size() || _getWxVersion() < 5)return;
		var _apiCheck,
			$form	= $('.J_x_submitToPay'),
			time	= 10;
		(_apiCheck = function(){
			if(window.WeixinJSBridge){
				$form.find('label.weixin').show();
				return;
			}
			if(!time)return;
			time--;
			setTimeout(_apiCheck, 1000);
		})();
		function _getWxVersion(){
			var wxTag	= 'MicroMessenger',
				agent	= navigator.userAgent,
				index	= agent.indexOf(wxTag);
			return index < 0 ? 0 : agent.slice(index + 15, index + 16, 1) ;
		}
	};

	/**
	 * 读取cookie中的值
	 * @method base.cookie
	 * @since p64
	 * @return {none}
	 */
	/*init.cookie = function(){
		$('.J_k_phone').val($.cookie('phone'));
		$.cookie('phone','',-1);
	};*/

	/**
	 * 读取cookie中的值
	 * @method base.cookie
	 * @since p64
	 * @return {none}
	 */
	base.c_discheck = function(disabled){
		if(disabled == 1){
			$('.J_c_paybox').removeClass('on');
		}
		else if(disabled == 0){
			$('.J_c_paybox').addClass('on');
		}
		$('.J_c_paybox input[type=radio]').prop('disabled', !disabled);
	}

/**************************** end p64 ****************************/

	$.extend(base, $.loader(init));

})(window);