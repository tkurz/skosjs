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
            if(graph) text = "Graph: " + graph;

            popup.setContent($("<p></p>").text(text));

            popup.open();
        }
    }

    function Extension() {

        editor.menu.createSeperator("Project");
        editor.menu.createMenuItem("Project","Extension",function(){
            var popup = new Popup();
            popup.open();
        });

        //bindings
        editor.event.bind(editor.EventCode.GRAPH.LOAD,function(event){
            graph = event.data.uri;
        });
    }

    return new Extension();

}