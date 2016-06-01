/// <reference path="jquery-2.2.3.js">	</reference>
/// <reference path="bootstrap.min.js">	</reference>
/// <reference path="facebook_sdk.js">	</reference>
/// <reference path="config.js">	 	</reference>
/// <references path="res.js">	 		</reference>

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function def(variable) {
    return variable != undefined;
}

function number_of_pairs(n) {
    return n * (n - 1) / 2;
}

function split_name(name) {
	if(name==undefined || name.length==0) return [];
	var parts = name.split(' ');
	for(var i=0;i<parts.length;) {
		if(parts[i].length<=1) parts.splice(i, 1);
		else i++;
	}
	if (parts.length <= 1) return [[name, 'full']];
	else {
		var sparts = [[name, 'full']];
		sparts.push([parts[0], 'first']);
		sparts.push([parts[parts.length - 1], 'last']);
		return sparts;
	}
	return [];
}

function print_stack_trace(e) {
	var stack = e.stack;
	console.log(stack);
}

function onResponse(succ_fun, error_fun_or_param, opt_err) {
    var param = typeof error_fun_or_param == 'string' ? error_fun_or_param : '';
    var default_error_fun = (response) => {
        console.log('Error in function ' + param + '\n' + JSON.stringify(response));
    }
    var main_error_fun;
    if (typeof error_fun_or_param != 'function' || opt_err) main_error_fun = default_error_fun;
    else main_error_fun = error_fun_or_param;

    var extra_error_fun = opt_err ? error_fun_or_param : () => { };

    return (response) => {
    	if (response) {
    		try {
    			succ_fun(response);
    		} catch (e) {
    			if (opt_err == 'before') extra_error_fun(response);
    			main_error_fun(response);
    			if (opt_err == 'after') extra_error_fun(response);
    			console.log(e);
    			print_stack_trace(e);
    		}
    	}
    	else {
    		if (opt_err == 'before') extra_error_fun(response);
    		main_error_fun(response);
    		if (opt_err == 'after') extra_error_fun(response);
    	}
    }
}

function to_base64(str) {
	return window.btoa(unescape(encodeURIComponent(str)));
}
// base64 encoded ascii to ucs-2 string
function from_base64(str) {
	return decodeURIComponent(escape(window.atob(str)));
}