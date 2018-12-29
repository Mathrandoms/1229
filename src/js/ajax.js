function ajax(opt) {
    var def = {
        method: "get",
        async: true,
        data: '',
        success: null,
        error: null
    }
    var settings = ajax.extend({}, def, opt);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status <= 300 || xhr.status === 304) {
                settings.success(xhr.response);
            } else {
                settings.error(new Error(xhr.statusText));
            }
        } else {
            console.log('loading...')
        }
    }
    var isget = /get/i.test(settings.method);
    data = typeof settings.data === 'string' ? settings.data : ajax.format(settings.data);
    xhr.open(settings.method, isget && data ? settings.url + '?' + data : settings.url, settings.async);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Accept', 'application/json');
    if (!isget) {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    xhr.send(isget ? null : data);
}
ajax.extend = function() {
    var arg = arguments;
    for (var i = 1; i < arg.length; i++) {
        for (var k in arg[i]) {
            arg[0][k] = arg[i][k];
        }
    }
    return arg[0];
}
ajax.format = function(obj) {
    var str = '';
    for (var k in obj) {
        str += k + '=' + obj[k] + '&';
    }
    return str.replace(/&$/, '');
}