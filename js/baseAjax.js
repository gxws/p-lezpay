/*!
 * baseAjax
 * create: 2014/9/29
 */

/**
 * 基础模块
 * @module base
 * @since p64
 */
(function(window, undefined){

    /**
	 * 基础模块 - 业务逻辑
	 * @class baseAjax
	 * @since p64
	 */
    var	$win	= $(window),
		$doc	= $(document),
		loc		= location,
		WS		= window.WS || (window.WS = {}),
		init	= {},							//启动时加载程序
		base	= WS.base || (WS.base = {});	//接口程序

/**************************** begin p64 ****************************/

	/**
	 * 银行卡信息验证
	 * @method base.nionpaySubmit
	 * @since p64
	 * @param {object} $form 表单对象
	 * @return {bool}
	 */
	var vText ='';
	base.nionpaySubmit = function($form){
		var $name   = $form.find('[data-type=carname]'),
		    $idcard = $form.find('[data-type=idcard]'),
		    vidcard = $idcard.val(),
		    $passwd = $form.find('[data-type=passwd]'),
		    vpasswd = $passwd.val(),
		    $phone  = $form.find('[data-type=phone]'),
		    vphone  = $phone.val(),
		    vvphone = '',
		    $validity  = $form.find('[data-type=validity]'),
		    vvalidity  = $validity.val(),
		    $afterthree  = $form.find('[data-type=afterthree]'),
		    vafterthree = $afterthree.val(),
		    $vcode  = $form.find('[data-type=vcode]'),
		    vvcode= $vcode.val();
		if($name.size()){
			vText = $name.val()=='' ? '姓名不能为空' : '';
			if(vText!=''){
			 	return error($name);
			}
		}
		if($idcard.size()){
			vText = !(vidcard.length==6) ? '请输入身份证的最后6位！' : '';
			if(vText!=''){
			 	return error($idcard);
			}
		}
		if($passwd.size()){
			vText = !(/\d{6}/.test(vpasswd)) ? '银行卡密码只能为6位数字' : '';
			if(vText!=''){
			 	return error($passwd);
			}
		}
		if($phone.size()){
			vvphone = vphone.replace(/\D/g,'');
			vText = !(/\d{11}/.test(vvphone)) ? '手机号只能是11位数字！' : '';
			if(vText!=''){
			 	return error($phone);
			}
		}
		if($validity.size()){
			vText = !(/\d{4}/.test(vvalidity)) ? '有效期只能是4位数字！' : '';
			if(vText!=''){
			 	return error($validity);
			}
		}
		if($afterthree.size()){
			vText = !(/\d{3}/.test(vafterthree)) ? '请输入卡背面最后3位数字！' : '';
			if(vText!=''){
			 	return error($afterthree);
			}
		}		
		if($vcode.size()){
			vText = !(/\d{6}/.test(vvcode)) ? '短信验证码只能是6位数字！' : '';
			if(vText!=''){
			 	$('.J_j_vcode').next('.error').html('<i class="glyphicon glyphicon-remove-sign"></i>' + vText);
			 	return false;
			}
		}
	}
	/**
	 * 银行卡号验证
	 * @method base.idSubmit
	 * @since p64
	 * @param {object} $form 表单对象
	 * @return {bool}
	 */
	base.idSubmit = function($form){
		var $id   = $form.find('[data-type=cardnub]'),
				vid   = $id.val().replace(/\D/g,'').length;
		if($id.size()){
			vText = !(vid == 16 || vid == 19) ? '付款银行卡只能是16或19位数字！' : '';
			if(vText!=''){
			 	return error($id);
			}
		}
	}
	function error($obj){
		$obj.parent().next('.error').html('<i class="glyphicon glyphicon-remove-sign"></i>' + vText);
		return false;
	}

	/**
	 * 登录验证
	 * @method base.loginSubmit
	 * @since p64
	 * @param {object} $form 表单对象
	 * @return {bool}
	 */
	base.loginSubmit = function($form){
		var error,
			$phone	= $form.find('[data-verify=phone]'),
			phone	= $phone.val().replace(/\s/g, ''),
			$pwd	= $form.find('[data-verify=password]'),
			pwd		= $pwd.val(),
			$prompt	= $form.find('[data-verify-prompt=login]');
		if(phone == ''){
			error = '请输入您注册的手机号！';
			$phone.focus();
		}else if(!/^\d{11}$/.test(phone)){
			error = '手机号只能是11位数字！';
			$phone.focus();
		}else if(pwd == ''){
			error = '请输入密码！';
			$pwd.focus();
		}
		if(error){
			$prompt.html('<i class="glyphicon glyphicon-remove-sign"></i>' + error);
			return false;
		}
	}
	/**
	 * 获取验证码
	 * @method base.gAin
	 * @since p64
	 * @param {object} $btn 
	 * @param {function} fn 
	 * @return {bool}
	 */
	base.gAin = function($btn,vphone,fn){
		base.ajaxgo($btn.attr('href'),function(d){
			d.status==1 ? fn() : $('.J_j_error').html('<i class="glyphicon glyphicon-remove-sign"></i>' + d.message);
		},{"status":"1","message":"您输入的手机号码不存在，请重新输入。"},{"phone":vphone.replace(/\D/g, '')});
	};

	/**
	 * 兼容本地demo的ajax方法
	 * @method base.ajaxgo
	 * @since p61
	 * @param {string} url 请求链接
	 * @param {function} [fn] 方法
	 * @param {number|string|object} [demo] 测试数据
	 * @param {object} [data] 数据
	 * @param {string} [method=post] 请求方式
	 * @param {string} [datatype=json] 返回数据的格式
	 * @return {none}
	 */
	base.ajaxgo = function(url, fn, demo, data, method, datatype){
		fn = fn || Fn;
		url == 'javascript:;' ? fn(demo) : $[method || 'post'](url, data, fn, datatype || 'json');
	};


	 /**
	 * 找回密码，输入手机号码
	 * @method base.p64safety
	 * @since p64
	 * @param {object} $form 表单对象
	 * @return {bool}
	 */
	base.p64safety = function($form){
		var error,
			$phone	= $form.find('[data-verify=phone]'),
			phone	= $phone.val().replace(/\s/g, ''),
			$code	= $form.find('[data-verify=code]'),
			code	= $code.val(),
			errortxt= '<i class="glyphicon glyphicon-remove-sign"></i>';
		if(phone == ''){
			$phone.parent('.pa').next('.error').html(errortxt +'请您输入手机号！');
			$phone.focus();
			return false;
		}else if(!/^\w{11}$/.test(phone)){
			$phone.parent('.pa').next('.error').html(errortxt +'手机号应该是11位喔。');
			$phone.focus();
			return false;
		}else if(!/^\d+$/.test(phone)){
			$phone.parent('.pa').next('.error').html(errortxt +'手机号全都是数字喔。');
			$phone.focus();
			return false;
		}else if(code == ''){
			$code.parent('.pa').next('.error').html(errortxt +'请输入验证码！');
			$code.focus();
			return false;
		}else if(!/^\d{6}$/.test(code)){
			$code.parent('.pa').next('.error').html(errortxt +'验证码只能是6位数字！');
			$code.focus();
			return false;
		}
	}


	 /**
	 * 找回密码，设置新密码
	 * @method base.p64safetypwd
	 * @since p64
	 * @param {object} $form 表单对象
	 * @return {bool}
	 */
	base.p64safetypwd = function($form){
		var error,
			$pwd	= $form.find('[data-verify=pwd]'),
			pwd		= $pwd.val(),
			$agpwd	= $form.find('[data-verify=agpwd]'),
			agpwd	= $agpwd.val(),
			errortxt= '<i class="glyphicon glyphicon-remove-sign"></i>';
		if(pwd == ''){
			$pwd.parent('.pa').next('.error').html(errortxt +'请输入密码！');
			$pwd.focus();
			return false;
		}else if(!/^\d{6}$/.test(pwd)){
			$pwd.parent('.pa').next('.error').html(errortxt +'密码只能是6位数字喔！');
			$pwd.focus();
			return false;
		}else if(agpwd == ''){
			$agpwd.parent('.pa').next('.error').html(errortxt +'请输入确认密码！');
			$agpwd.focus();
			return false;
		}else if(agpwd != pwd){
			$agpwd.parent('.pa').next('.error').html(errortxt +'输入的确认密码和密码不一致喔！');
			$agpwd.focus();
			return false;
		}
	}


	/**
	 * 注册验证
	 * @method base.registerSubmit
	 * @since p64
	 * @param {object} $form 表单对象
	 * @return {bool}
	 */
	base.registerSubmit = function($form){
		var vText		= '',
			$phone		= $form.find('[data-formName=phone]'),
			phone		= $phone.val(),
			$pwd		= $form.find('[data-formName=password]'),
			pwd			= $pwd.val(),
			$conpwd		= $form.find('[data-formName=conPassword]'),
			conpwd		= $conpwd.val(),
			$verCode	= $form.find('[data-formName=verCode]'),
			verCode		= $verCode.val();
		if(!(/^\d{11}$/.test(phone.replace(/\W/g, "")))){
			error($phone, '手机号只能是11位数字！');
			return false;
		}else if(!/^\d{6}$/.test(pwd)){
			error($pwd,'密码只能是6位数字喔');
			return false;
		}else if(pwd != conpwd){
			error($conpwd,'输入的确认密码和密码不匹配喔！');
			return false;
		}else if(!/^\d{6}$/.test(verCode)){
			error($verCode, '短信验证码只能是6位数字！');
			return false;
		}

		//$.cookie('phone','',-1);//启用cookie

		function error($obj, str){
			$obj.parents('.form-group').find('.error').html('<i class="glyphicon glyphicon-remove-sign"></i>' + str);
		}
	};

	/**
	 * 微信提交后回调
	 * @property base.wxCallback
	 * @since p64
	 * @type object
	 * @default null
	 */
	base.wxCallback = null;

	/**
	 * 获取微信网页支付接口数据信息
	 * @method base.wxGoToPay
	 * @since p64
	 * @param {object} form 表单对象
	 * @return {bool}
	 */
	base.wxGoToPay = function(form){
		$.xajax($(form).attr('data-ajax-getWxApiInfoUrl'), function(d){
			+ d.status && WeixinJSBridge.invoke('getBrandWCPayRequest',d.data, base.wxCallback);
		}, {
			'status': '1',
			'data': {
				'appId': 'wx2e8e96fbaad951cf',
				'timeStamp': '1413446649',
				'nonceStr': 'YZoasrffkPWHMlaI',
				'package': 'bank_type=WX&body=%E6%94%AF%E4%BB%98%E6%B5%8B%E8%AF%95%E8%BF%9E%E6%8E%A5&fee_type=1&input_charset=GBK&notify_url=https%3A%2F%2Fweixin.code.lezpay.cn%2Fwxpay%2FreceiptNotify&out_trade_no=0%3A0%3A0%3A0%3A0%3A0%3A0%3A1&partner=1219711201&spbill_create_ip=0000225&total_fee=140&sign=4D2DCFF73195187666814D8A176EDEF9',
				'signType': 'SHA1',
				'paySign': '55ddfac3af969cf81f2042d1d127bbf590479a1b'
			}
		}, {
			jifen: $('.J_c_intprice').prop('checked') ? 1 : 0,
			yue: $('.J_c_surprice').prop('checked') ? 1 : 0,
			channelId: $('.J_j_wexin').val()
		});
		return false;
	};

/**************************** end p64 ****************************/

	$.extend(base, $.loader(init));

})(window);