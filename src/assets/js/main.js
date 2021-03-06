(function($){
	$(window).load(function(){

		// INITIALIZE ANIMSITION
		if($(".animsition").length){
			$(".animsition").animsition({
				inClass               :   'fade-in-up-sm',
				outClass              :   'fade-out-up-sm',
				inDuration            :    1100,
				outDuration           :    800,
				linkElement           :   '.animsition-link',
				loading               :    true,
				loadingParentElement  :   'body',
				unSupportCss          : [ 'animation-duration',
										  '-webkit-animation-duration',
										  '-o-animation-duration'
										],
				overlay               :   false,
				overlayClass          :   'animsition-overlay-slie',
				overlayParentElement  :   'body'
			});
		}

		// INPUTS EVENTS
		$('.input_1 input, .textarea_1 textarea').on('focus', function() {
			$(this).next("span").addClass("active");
		});
		$('.input_1 input, .textarea_1 textarea').on('blur', function() {
			if($(this).val() === ""){
				$(this).next("span").removeClass("active");
			}
		});


		// TABS
		$(".bottom-line").css({
			width : $(".tab nav a").first().width() + 20 + "px" // 20 = element's padding * 2
		});
		var _current_index = 0;
		$(".tab nav a").on('click', function(){
			e.preventDefault();
			// tab navigation styles
			var _this = $(this);
			var _index = _this.index();
			if(_current_index !== _index){
				$(".tab nav a").each(function(){
					if($(this).hasClass("current")) $(this).removeClass("current");
				});
				_this.addClass("current");
				$(".bottom-line").css({
					left : _this.offset().left - _this.parent().offset().left + "px",
					width : _this.width() + 20 + "px" // 20 = element's padding * 2
				});

				// show tab content
				$(".tab_single.shown").fadeOut(200);
				setTimeout(function(){
					$(".tab_single").eq(_index).fadeIn(200);
					$(".tab_single").eq(_index).addClass("shown");
				},200);

				_current_index = _index;
			}
		});

		// NAVBAR
		var _link = $("nav.desktop-nav ul.first-level").children("li");
		var shown = false;
		// show navbar
		$(".menu-icon").on( 'click', function(){
			var _this = $(this);
			$("nav.mobile-nav").slideToggle(200);
			if(!shown){
				_this.children("div").css("width","30px");
				shown = true;
			}else{
				_this.children("div").first().css("width","30px");
				_this.children("div").eq(1).css("width","15px");
				_this.children("div").eq(2).css("width","20px");
				shown = false;
			}
		});



		 // Contact form
  		var form = $('#main-contact-form');
  			form.submit(function(event){
                event.preventDefault();
                var form_status = $('<div class="form_status"></div>');
    			var username = $('#username').val();
                var password = $('#password').val();
    			$.ajax({
      				url: $(this).attr('action'),
      				method: 'POST',
					data: {
      					username: username,
						password: password
					}
    			}).done(function(data){
    				if(data==='login') {
                        window.location.replace('/users/admin')
					} else {
                        form.prepend(form_status.html('<p class="text-danger">Invalid user name or password</p>').delay(3000).fadeOut());
					}
    			});
  			});


		// dropdown - desktop
		_link.on('hover', function(e) {
			e.preventDefault();
			var _this = $(this);
			if(_this.children("ul.second-level").html() !== undefined){
				if(e.type === "mouseenter"){
					_this.children("ul.second-level").slideDown(200);
				}else{
					_this.children("ul.second-level").slideUp(200);
				}
			}
		});

		$("#owl-demo").owlCarousel({

		 autoPlay: 3000, //Set AutoPlay to 3 seconds

		 items : 4,
		 itemsDesktop : [1199,5],
		 itemsDesktopSmall : [979,3]

 		});

		// dropdown - mobile
		$("nav.mobile-nav").html($("nav.desktop-nav").html()); // set navbar

		var mobile_link = $("nav.mobile-nav ul.first-level").children("li");
		mobile_link.children("a").on( 'click', function(e){
			var _this = $(this);
			var submenu_exists = (_this.next("ul.second-level").html() === undefined) ? false : true;
			if(submenu_exists){
				e.preventDefault();
				$(".down").slideUp(200);
				if(_this.next("ul.second-level").hasClass("down")){
					_this.next("ul.second-level").removeClass("down");
				}else{
					$(".down").removeClass("down");
					_this.next("ul.second-level").slideDown(200);
					_this.next("ul.second-level").addClass("down");
				}
			}
		});


		//Upload Image

        $('.uploadImg1').on('click', function(){
            var x = uploadImage('123123');
            if(x.trim().length>0) saveImageToDb(x);
        });

        saveImageToDb = (urlImage)=>{
            var form = $('#photography_upload_form');
            var form_status = $('<div class="form_status"></div>');
            $.ajax({
                type: 'POST',
                url: '/users/uploadImage',
                contentType: 'application/json',
                data: JSON.stringify({
                    imageUrl: urlImage
                }),
                success: function(res){
                    console.log('save DB success');
                    console.log(res);
                }
            }).done((data)=>{
            	//form.prepend(form_status.html('<p class="text-success">Uploading successful</p>').delay(3000).fadeOut())
			});
        };

        function uploadImage(chooseImage){
            //TODO: choose file later.
            var files = $('.image1').get(0).files;
            var returnURL = '';
            var form = $('#photography_upload_form');
            var form_status = $('<div class="form_status"></div>');
            if (files.length) {
                console.log('uploading imgur');

                var apiURL = 'https://api.imgur.com/3/image';
                var apiKey = 'Client-ID 8cbfbb88f13ed41';

                var settings = {
                    async: false,
                    crossDomain: true,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    url: apiURL,
                    headers: {
                        Authorization: apiKey,
                        Accept: 'application/json'
                    },
                    mimeType: 'multipart/form-data',
                    beforeSend: function(){
                        form.prepend( form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Image is uploading...</p>').fadeIn() );
                    }
                };

                var formData = new FormData();
                formData.append('image', files[0]);
                settings.data = formData;
                console.log('gogogo');
                $.ajax(settings)
                    .done(function(response) {
                        console.log($.parseJSON(response));
                        returnURL = $.parseJSON(response).data.link;
                        form_status.html('<p class="text-success">Uploading successful</p>').delay(3000).fadeOut();

                    })
                    .fail(function(){
                        console.log('Upload Fail');
                        returnURL =  'upload fail';
                    })
            }
            return returnURL;
        };

	});
})(jQuery);
