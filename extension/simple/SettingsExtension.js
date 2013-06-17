/**
 * Created by IntelliJ IDEA.
 * User: tkurz
 * Date: 20.03.12
 * Time: 11:12
 * To change this template use File | Settings | File Templates.
 */

/**
 * This extension enables users to set custom endpoints
 * @param editor
 * @return {Extension}
 * @constructor
 */
function SettingsExtension(editor) {

    function Popup() {
        var popup;
        this.open = function(){
            popup = editor.popup.custom("Demo Settings");

            var input_select = $("<input>").css({width:"200px"});
            var input_update = $("<input>").css({width:"200px"});

            var button_store = $("<button></button>").css("margin-top","20px").text("Store").click(function(){

                if(input_select.val() == "") {
                    alert("select endpoint must be defined");
                    return;
                }

                if(input_update.val() == "") {
                    alert("update endpoint must be defined");
                    return;
                }

                editor.endpoint.select.set(input_select.val());
                editor.endpoint.update.set(input_update.val());

                editor.event.fire(editor.EventCode.GRAPH.CREATE);
                popup.close();
            })

            var content = $("<div></div>").append(
                "<span style='font-size:14px;padding-right:16px'>Select Endpoint</span>"
            ).append(
                input_select
            ).append(
                "<br>"
            ).append(
                "<span style='font-size:14px;padding-right:10px'>Update Endpoint</span>"
            ).append(
                input_update
            ).append(
                "<br><small style='font-weight:bold'>Attention! Endpoints are reset on reload!</small><br>"
            ).append(
                button_store
            )

            //get data
            input_select.val(editor.endpoint.select.get());
            input_update.val(editor.endpoint.update.get());

            popup.setContent(content);

            popup.open();
        }
    }

    function Extension() {

        //editor.menu.createSeperator("Project");
        editor.menu.createMenuItem("Demo","Settings",function(){
            var popup = new Popup();
            popup.open();
        });
    }

    return new Extension();

}