(function (factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        factory();
    }
}(function () {
    'use strict';

    if (!window.rb) {
        window.rb = {};
    }

    var rb = window.rb;

    var getData = function (oReq, obj) {
        obj.xhr = oReq;
        obj.data = oReq.response || oReq.responseXML || oReq.responseText;
        obj.text = oReq.responseText;
        obj.xml = oReq.responseXML;

        if (typeof obj.data != 'object' &&
            (oReq.getResponseHeader('Content-Type') || '').split(';')[0].endsWith('json')) {
            obj.data = rb.jsonParse(oReq.responseText) || obj.data;
        }
    };

    /**
     * Simple XHRequest util that returns a promise.
     * @memberof rb
     * @param {String|Object} url Either the URL to send for the request or the options Object.
     * @param {Object} [options]
     *  @param {String} [options.url] The URL for the request.
     *  @param {String|null} [options.username=null] The URL for the request.
     *  @param {String|null} [options.password=null] The URL for the request.
     *  @param {String} [options.type='GET'] The request type to use.
     *  @param {object} [options.data=null] The send data.
     *  @param {function} [options.beforeSend] A callback function to allow modification of the XHR object before it is send.
     * @returns {Promise}
     *
     * @example
     *
     * rb.fetch('api/user.json?id=12')
     *  .then(function(response, xhr){
	 *      console.log(response.data);
	 *  });
     */
    rb.fetch = function (url, options) {
        if (typeof url == 'object') {
            options = url;
            url = options.url;
        }

        options = Object.assign({
            type: 'get',
            username: null,
            password: null,
        }, options);

        var oReq = new XMLHttpRequest();
        var promise = new Promise(function (resolve, reject) {
            var header;

            var value = {opts: options};

            oReq.addEventListener('load', function () {
                var status = oReq.status;
                var isSuccess = status >= 200 && status < 300 || status == 304;

                getData(oReq, value);

                if (isSuccess) {
                    resolve(value, oReq);
                } else {
                    reject(value, oReq);
                }
                oReq = null;
            });

            oReq.addEventListener('error', function () {
                getData(oReq, value);
                reject(value, oReq);
                oReq = null;
            });

            oReq.open(options.type.toUpperCase(), url, true, options.username, options.password);

            if(options.headers){
                for(header in options.headers){
                    oReq.setRequestHeader(header, options.headers[header]);
                }
            }

            if (options.beforeSend) {
                options.beforeSend(oReq);
            }

            oReq.send(options.data || null);
        });

        promise.abort = function(){
            if(oReq){
                oReq.abort();
            }
        };

        promise.getXhr = function(){
            return oReq;
        };

        return promise;
    };

    return rb.fetch;
}));
