/**
 * Created by IntelliJ IDEA.
 * User: tkurz
 * Date: 20.03.12
 * Time: 11:12
 * To change this template use File | Settings | File Templates.
 */

/**
 * This is a simple demonstrator how you can write extensions.
 * @param editor
 * @return {Extension}
 * @constructor
 */
function SimpleExtension(editor) {

    var graph = undefined;

    function Popup() {
        var popup;
        this.open = function(){
            popup = editor.popup.custom("Simple Extension");

            var text = "No graph selected";
            if(graph) text = "Selected " + graph.uri;

            popup.setContent($("<h1></h1>").text(text));

            popup.open();
        }
    }

    function Extension() {

        editor.menu.createSeperator("Project");
        editor.menu.createMenuItem("Project","Extension",function(){
            new Popup();
        });

        //bindings
        editor.event.bind(editor.EventCode.GRAPH.LOAD,function(event){
            graph = event.graph.uri;
        });
    }

    return new Extension();

}