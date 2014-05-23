var cohortioTracker = (function () {
	var POST_USER_URL = "https://silver-ripple-544.appspot.com/_ah/api/cohortioraw/v1/void",
		POST_PAYMENT_URL = "https://silver-ripple-544.appspot.com/_ah/api/cohortiopaymentraw/v1/void",
		PROJECT_ID = "preply.com";
	var setCookie = function(cname,cvalue,exdays){
        var d = new Date();
        d.setTime(d.getTime()+(365*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };

    var getCookie = function(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    };
    var getUserCookie = function(){
	    var user=getCookie("cohortio_username");
	    if (user != ""){
	        return user;
	    }else{
	        var randomName = Math.random().toString(36).slice(2);
	        setCookie("cohortio_username", randomName,365);
	        return randomName;
	    }
	};
	var getXmlhttp = function(){
		var xmlhttp = null;
		if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
    		xmlhttp = new XMLHttpRequest();
    	}else{// code for IE6, IE5
    		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    	}
    	return xmlhttp;
	}
    var postUser = function(args){
    	var email = args.email || "";    	
  		var xmlhttp = getXmlhttp();
		xmlhttp.open("POST", POST_USER_URL, true);
		//xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		//xmlhttp.send("userCookie=" + getUserCookie() + "&userEmail=" + email + "&project=" + PROJECT_ID + "&date="+(new Date()).toJSON()+"&location=" + (document.URL).toString());
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xmlhttp.send(JSON.stringify({ userCookie: getUserCookie(),
									  userEmail: email,
									  project: PROJECT_ID,
									  date: (new Date()).toJSON(),
									  location: document.URL.toString()
									  }));
 	};
    var postPayment = function(args){
    	var amount = args.amount || "";
    	
		var xmlhttp = getXmlhttp();
		xmlhttp.open("POST", POST_PAYMENT_URL, true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

		xmlhttp.send("userCookie=" + getUserCookie() + "&project=" + PROJECT_ID + "&date="+(new Date()).toJSON()+"&amount=" + amount);
 	}; 	
  return {
     // A public function utilizing privates
    trackUser: function(email, reset) {
 		if(reset || getCookie("cohortio_username") == "" ){
 			postUser({email: email,
 			 		  });
 		}
     
    },
    trackPayment: function(amount) {
 		if(getCookie("cohortio_username") != "" ){
 			postPayment({amount: amount
 			 		  });
 		}
     
    }
  };
 
})();