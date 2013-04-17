/**
 * Implements SPARQL query and update
 * @param endpointSelect
 * @param endpointUpdate
 */
function SparqlClient(endpointSelect, endpointUpdate) {

    this.select = function(query, onsuccess, onfailure) {
        $.getJSON(endpointSelect+"?query="+encodeURIComponent(query)+"&output=json")
            .done(function(data){
                onsuccess(data.results.bindings);
            })
            .fail(function(){
                onfailure();
            });
    }

    this.ask = function(query, onsuccess, onfailure) {
        $.getJSON(endpointSelect+"?query="+encodeURIComponent(query)+"&output=json")
            .done(function(data){
                onsuccess(data.boolean ? data.boolean : data.boolean == 'true');
            })
            .fail(function(){
                onfailure();
            });
    }

    this.update = function(query, onsuccess, onfailure) {
        $.post(endpointUpdate+"?query="+encodeURIComponent(query)+"&output=json")
            .done(function(){
                onsuccess();
            })
            .fail(function(){
                onfailure();
            });
    }

}