/**
 * Created by IntelliJ IDEA.
 * User: tkurz
 * Date: 20.03.12
 * Time: 11:12
 * To change this template use File | Settings | File Templates.
 */

function IOService(editor,host) {

    var ioservice = new IOService();

    var _importer = new Importer();
    var _exporter = new Exporter();

    var template = TEMPLATE();

    var graph;
    var graphtitle;

    return ioservice;

    function IOService() {
        editor.menu.createSeperator("Project");
        var _import = editor.menu.createMenuItem("Project","Import",function(){_importer.open()});
        var _export = editor.menu.createMenuItem("Project","Export",function(){_exporter.open()});
        _import.addClass("disabled");
        _export.addClass("disabled");

        //bindings
        editor.event.bind(editor.EventCode.GRAPH.LOAD,function(event){
            _import.removeClass("disabled");
            _export.removeClass("disabled");
            graph = event.data.uri;
            graphtitle = event.data.title;
        });
    }

    function Importer() {
        var popup;
        this.open = function(){
            popup = editor.popup.custom("Import Thesaurus");
            popup.setContent($(template.importer));
            $("#popup_cancel").click(function(){
                popup.close();
            });
            $("#popup_import").click(function(){
                run();
            });
            $("#popup_file").change(function(){
                $("#popup_info").text("File selected");
                var filename = $("#popup_file").val();
                if (filename.match(/.n3$/)) $('#popup_type').val("text/n3");
                if (filename.match(/.xml$/)) $('#popup_type').val("application/rdf+xml");
            })
            popup.open();
        }
        function run() {
            var fd = document.getElementById('popup_file').files[0];
            if(!fd) {
                $("#popup_info").text("Select a file first!");
                return false;
            }
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener("load", uploadComplete, false);
            xhr.addEventListener("error", uploadFailed, false);
            xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open("POST", host+"skos/import"+"?context="+encodeURIComponent(graph));
            xhr.setRequestHeader('Content-Type', $("#popup_type").val());
            xhr.send(fd);
        }
        function uploadProgress(evt) {
            if (evt.lengthComputable) {
                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                if(percentComplete==100) $("#popup_info").text('Import data ...');
                else $("#popup_info").text('Upload: '+percentComplete.toString() + '%');
            } else {
                $("#popup_info").text('Import data ...');
            }
        }

        function uploadComplete(evt) {
            if(evt.target.status==200) {
                $("#popup_info").text("Import complete");
                setTimeout(function(){
                   editor.event.fire(editor.EventCode.GRAPH.SELECTED,{uri:graph});
                   popup.close();
                },1000);
            } else {
                popup.close();
                editor.popup.alert("Import failed","There was an error attempting to import the file.");
            }
        }

        function uploadFailed(evt) {
            popup.close();
            editor.popup.alert("Import failed","There was an error attempting to upload the file.");
        }

        function uploadCanceled(evt) {
            popup.close();
            editor.popup.alert("Import failed","The upload has been canceled by the user or the browser dropped the connection.");
        }
    }

    function Exporter() {
        var popup;
        this.open = function(){
            popup = editor.popup.custom("Export Thesaurus");
            popup.setContent($(template.exporter));
            $("#popup_cancel").click(function(){
                popup.close();
            });
            $("#popup_export").click(function(){
                run();
            });
            var name = (graphtitle&& graphtitle.indexOf("http://")!=0)?graphtitle:graph.substring(graph.lastIndexOf("/")+1);
            $("#popup_name").val(name);
            popup.open();
        }
        function run() {
            var type = $("#popup_type").val();
            var name = $("#popup_name").val();
            if(type=="text/n3") name+=".n3";
            else name+=".xml";
            window.open(host+"skos/export/"+name+"?context="+encodeURIComponent(graph)+"&type="+encodeURIComponent(type));
            popup.close();
        }
    }

    function TEMPLATE() {
        var t = {
             importer : '<span style="font-size:12px;padding-right:5px">File:</span><input type="file" id="popup_file"/>' +
                        '<span style="font-size:12px;padding:0 5px 0 20px">Type:</span>' +
                        '<select id="popup_type">' +
                        '   <option value="application/rdf+xml">XML</option>' +
                        '   <option value="text/n3">N3</option>' +
                        '</select>' +
                        '<div id="popup_info" style="font-size: 12px; height: 20px; padding-top: 10px;">&nbsp;</div>' +
                        '<div>' +
                        '   <button id="popup_cancel">Cancel</button>' +
                        '   <button id="popup_import">Import</button>' +
                        '</div>',
             exporter : '<span style="font-size:12px;padding-right:5px">Name:</span><input style="width:300px" type="text" id="popup_name"/>' +
                        '<span style="font-size:12px;padding:0 5px 0 20px">Type:</span>' +
                        '<select id="popup_type">' +
                        '   <option value="application/rdf+xml">XML</option>' +
                        '   <option value="text/n3">N3</option>' +
                        '</select>' +
                        '<div id="popup_info" style="font-size: 12px; height: 20px; padding-top: 10px;">&nbsp;</div>' +
                        '<div>' +
                        '   <button id="popup_cancel">Cancel</button>' +
                        '   <button id="popup_export">Export</button>' +
                        '</div>'
        }
        return t;
    }

}