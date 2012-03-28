/**
 * Created by IntelliJ IDEA.
 * User: tkurz
 * Date: 20.03.12
 * Time: 11:12
 * To change this template use File | Settings | File Templates.
 */

function IOService(editor) {

    var ioservice = new IOService();

    var _importer = new Importer();
    var _exporter = new Exporter();

    return ioservice;

    function IOService() {
        editor.menu.createSeperator("Project");
        var _import = editor.menu.createMenuItem("Project","Import",function(){_importer.open()});
        var _export = editor.menu.createMenuItem("Project","Export",function(){_exporter.open()});
        _import.addClass("disabled");
        _export.addClass("disabled");

        //bindings
        editor.event.bind(editor.EventCode.GRAPH.CREATED,function(event){
            _import.removeClass("disabled");
            _export.removeClass("disabled");
        });
        editor.event.bind(editor.EventCode.GRAPH.SELECTED,function(event){
            _import.removeClass("disabled");
            _export.removeClass("disabled");
        });
    }

    function Importer() {
        this.open = function(){
            editor.popup.info("Implementation Message","Feature not yet implemented");
        }
    }

    function Exporter() {
        this.open = function(){
            editor.popup.info("Implementation Message","Feature not yet implemented");
        }
    }

}