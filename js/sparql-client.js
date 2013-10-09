/**
 * Implements SPARQL query and update
 * @param endpointSelect
 * @param endpointUpdate
 */
function SparqlClient(endpointSelect, endpointUpdate) {

    var HTTP = new HTTP_Client();

    this.setAuthToken = function(token) {
        HTTP.setAuthToken(token);
    }

    /**
     * select and return result bindings
     * @param query
     * @param onsuccess
     * @param onfailure
     */
    this.select = function(query, onsuccess, onfailure) {
        HTTP.get(endpointSelect, {query:encodeURIComponent(query)}, null, "application/sparql-results+json", {
            200:function(data) {
                if (onsuccess)onsuccess(JSON.parse(data).results.bindings)
            },
            "default":function(err) {
                if (onfailure)onfailure(err)
            }
        });
    }
    /**
     * ask and return boolean value
     * @param query
     * @param onsuccess
     * @param onfailure
     */
    this.ask = function(query, onsuccess, onfailure) {
        HTTP.get(endpointSelect, {query:encodeURIComponent(query)}, null, "application/sparql-results+json;charset=UTF-8", {
            200:function(data) {
                var value = JSON.parse(data)['boolean'];
                if (onsuccess)onsuccess(String(value) == 'true' ? true : false);
            },
            "default":function(err) {
                if (onfailure)onfailure(err)
            }
        });
    }
    /**
     * update (SPARQL 1.1)
     * @param query
     * @param onsuccess
     * @param onfailure
     */
    this.update = function(query, onsuccess, onfailure) {
        HTTP.post(endpointUpdate, null, query, "application/sparql-update;charset=UTF-8", {
            200:function() {
                if (onsuccess)onsuccess()
            },
            204:function() {
                if (onsuccess)onsuccess()
            },
            "default":function(err) {
                if (onfailure)onfailure(err)
            }
        });
    }

    this.getSelectEndpoint = function() {return endpointSelect}
    this.setSelectEndpoint = function(value){ endpointSelect = value}
    this.getUpdateEndpoint = function() {return endpointUpdate}
    this.setUpdateEndpoint = function(value){endpointUpdate = value}
}

/**
 * HTTP Client based on XMLHTTPRequest Object, allows RESTful interaction (GET;PUT;POST;DELETE)
 * @param url
 */
function HTTP_Client() {

    var auth_token = undefined;

    function createRequest() {
        var request = null;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            throw "request object can not be created"
        }
        return request;
    }

    //build a query param string
    function buildQueryUrl(url, params) {
        if (params == null || params.length == 0) return url;
        var s = (url.indexOf('?')>=0)?"&":"?"
        if(auth_token != undefined) s += "auth_token=" + auth_token + "&";
        for (prop in params) {
            s += prop + "=" + params[prop] + "&";
        }
        return url+s.substring(0, s.length - 1);
    }

    //fire request, the method takes a callback object which can contain several callback functions for different HTTP Response codes
    function doRequest(method, path, queryParams, data, mimetype, callbacks) {
        mimetype = mimetype || "application/json;charset=UTF-8";
        var _url = buildQueryUrl(path, queryParams);
        var request = createRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (callbacks.hasOwnProperty(request.status)) {
                    callbacks[request.status](request.responseText, request);
                } else if (callbacks.hasOwnProperty("default")) {
                    callbacks["default"](request.responseText, request);
                } else {
                    throw "Status:" + request.status + ",Text:" + request.responseText;
                }
            }
        };
        request.open(method, _url, true);
        if (method == "PUT" || method == "POST")request.setRequestHeader("Content-Type", mimetype);
        if (method == "GET")request.setRequestHeader("Accept", mimetype);
        request.send(data);
    }

    this.get = function(path, queryParams, data, mimetype, callbacks) {
        doRequest("GET", path, queryParams, data, mimetype, callbacks);
    }

    this.put = function(path, queryParams, data, mimetype, callbacks) {
        doRequest("PUT", path, queryParams, data, mimetype, callbacks);
    }

    this.post = function(path, queryParams, data, mimetype, callbacks) {
        doRequest("POST", path, queryParams, data, mimetype, callbacks);
    }

    this._delete = function(path, queryParams, data, mimetype, callbacks) {
        doRequest("DELETE", path, queryParams, data, mimetype, callbacks);
    }

    this.setAuthToken = function(token) {
        auth_token = token;
    }
}
