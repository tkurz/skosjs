function UserService(editor, host) {

    function update(ed, concepts, property, callback) {
        if (!ed.active) return;
        if (!ed.graph) return;

        var urlParams="?property="+encodeURIComponent(property)
            + "&context="+encodeURIComponent(ed.graph);

        $.post(ed.host + "skos/currentUser"+urlParams, {uri: concepts})
            .error(function() { ed.active = false; })
            .complete(function() { if (callback) callback(); });
    }

    var us = {
        editor: editor,
        host: host,
        graph: null,
        active: true,
        init: function() {
            var self = this;
            self.editor.event.bind(editor.EventCode.GRAPH.LOAD, function(event) {
                self.graph = event.data.uri;
            });
            self.editor.event.bind(editor.EventCode.CONCEPT.UPDATED, function(event) {
                var uris = event.data.uris;
                var prop = "dc:contributor";
                update(self, uris, prop, function() {
                    self.editor.event.fire(editor.EventCode.VIEW.RELOAD, prop);
                });
            });
            self.editor.event.bind(editor.EventCode.CONCEPT.CRETED, function(event) {
                var uris = event.data.uris;
                var prop = "dc:creator";
                update(self, uris, prop, function() {
                    self.editor.event.fire(editor.EventCode.VIEW.RELOAD, prop);
                });
            });
        }
    };
    us.init();
    return us;
}

