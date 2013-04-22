/**
 * Created by IntelliJ IDEA.
 * User: tkurz
 * Date: 22.03.12
 * Time: 11:12
 * To change this template use File | Settings | File Templates.
 */

/**
 * This extensions allows the setting of auth tokens
 * @param editor
 * @param container
 * @return {Extension}
 * @constructor
 */
function AuthTokenExtension(editor,container) {

    var graph = undefined;
    var token = undefined;

    //build login ui
    function createLogin() {
        var _login = $("<a></a>").text("login").click(function(){
            login();
        })
        $(container).empty().append(_login);
    }

    //build logout ui
    function createLogout(name) {
        var _logout = $("<a></a>").text("logout").click(function(){
            logout();
        });
        var name = $("<span></span>").text(name + " | ");
        $(container).empty().append(name).append(_logout);
    }

    //login popup
    function Popup() {
        var popup;
        var self = this;

        this.onLogin = function(name,pwd){}

        this.open = function(){
            popup = editor.popup.custom("Login");

            var name = $("<input>");
            var pwd = $("<input>").attr("type","password");
            var button = $("<button></button>").text("Login").click(function(){
                self.onLogin(name.val(),pwd.val());
            });

            popup.setContent($("<div style='text-align: center'></div>").append(name).append("<br>").append(pwd).append("<br>").append(button));
            popup.open();
        }

        this.close = function() {
            popup.close();
        }
    }

    //bindings and init
    function Extension() {
        //bindings
        editor.event.bind(editor.EventCode.GRAPH.LOAD,function(event){
            graph = event.data;
        });
        createLogin();
    }

    //logout process
    function logout() {
        editor.authentification.setAuthToken(undefined);
        createLogin();
        if(graph != undefined) editor.event.fire(new Event(editor.EventCode.GRAPH.LOAD,{uri:graph.uri,title:graph.title}));
    }

    //login process
    function login() {

        var popup = new Popup();
        popup.open();

        function onsuccess(name, token) {
            editor.authentification.setAuthToken(token);
            createLogout(name);
            if(graph != undefined) editor.event.fire(new Event(editor.EventCode.GRAPH.LOAD,{uri:graph.uri,title:graph.title}));
            popup.close();
        }

        function onfailure() {
            popup.close();
            editor.popup.alert("Error","Token Access Failure");
        }

        //TODO this function must be replaced by a real getToken method
        function getToken(name,pwd) {
            var token = "xyzabc";
            onsuccess(name, token);
        }

        popup.onLogin = getToken;

    }

    return new Extension();

}