function UserService(editor, host) {

    function update(ed, concepts, property, single, callback) {
        if (!ed.active) return;
        if (!ed.graph) return;

        var delExisting = (single == true);

        var urlParams="?property="+encodeURIComponent(property)
            + "&context="+encodeURIComponent(ed.graph)
            + "&replace="+delExisting;

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
            function handleUpdate(event) {
                var uris = event.data.uris;
                var prop = "http://purl.org/dc/elements/1.1/contributor";
                update(self, uris, prop, false, function() {
                    self.editor.event.fire(editor.EventCode.VIEW.RELOAD, {uris: [prop]});
                });
            }
            function handleCreate(event) {
                var uris = event.data.uri;
                var prop = "http://purl.org/dc/elements/1.1/creator";
                update(self, uris, prop, true, function() {
                    self.editor.event.fire(editor.EventCode.VIEW.RELOAD, {uris: [prop]});
                });
            }

            self.editor.event.bind(editor.EventCode.GRAPH.LOAD, function(event) {
                self.graph = event.data.uri;
            });

            self.editor.event.bind(editor.EventCode.CONCEPT.UPDATED, handleUpdate);
            self.editor.event.bind(editor.EventCode.SCHEME.UPDATED, handleUpdate);
            self.editor.event.bind(editor.EventCode.GRAPH.UPDATED, handleUpdate);

            self.editor.event.bind(editor.EventCode.CONCEPT.CREATED, handleCreate);
            self.editor.event.bind(editor.EventCode.SCHEME.CREATED, handleCreate);
            self.editor.event.bind(editor.EventCode.GRAPH.CREATED, function(event) {
                self.graph = event.data.uri;
                handleCreate(event);
            });
        }
    };
    us.init();
    return us;
}

