/*
 * Copyright (c) 2012 Salzburg Research.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function SKOSClient(options) {

    var OPTIONS = {
        LANGUAGE : "en",
        ENDPOINT_SELECT : "http://localhost:8080/LMF/sparql/select",
        ENDPOINT_UPDATE : "http://localhost:8080/LMF/sparql/update",
        DEBUG : false
    }

    $.extend(OPTIONS,options);

    var self = this;

    var namespaces = {
        SKOS : "http://www.w3.org/2004/02/skos/core#",
        RDF : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        RDFS: "http://www.w3.org/2000/01/rdf-schema#",
        DC : "http://purl.org/dc/elements/1.1/",
        DC_TERMS : "http://purl.org/dc/terms/",
        SKOSJS : "http://newmedialab.at/ns/2012/01/skosjs#"
    }

    var sparqlClient = new SparqlClient(OPTIONS.ENDPOINT_SELECT,OPTIONS.ENDPOINT_UPDATE);

    this.exists = {
        uri : function(uri, onsuccess, onfailure) {
            var query = "ASK { <"+uri+"> ?a ?b }";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.ask(query, onsuccess, onfailure);
        }
    }

    this.create = {
        graph : function(uri, title, onsuccess, onfailure) {
            self.exists.uri(uri,function(data){
                if(data) {onfailure();return;}
                var datetime = currentDateTime();
                var query1 = "CREATE GRAPH<" + uri + ">";
                if(OPTIONS.DEBUG)console.debug(query1);
                sparqlClient.update(query1, function(){
                    var language = OPTIONS.LANGUAGE=='none'?'':"@"+OPTIONS.LANGUAGE;
                    var query2 = "INSERT DATA {GRAPH <" + uri + "> {<" + uri + "> <" + namespaces.DC + "title>\"" + title + "\"" + language + ";<"+ namespaces.RDF +"type><"+namespaces.SKOSJS+"Project>;<"+ namespaces.DC_TERMS+"created>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>;<"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>. }}";
                    if(OPTIONS.DEBUG)console.debug(query2);
                    sparqlClient.update(query2, onsuccess, onfailure);
                }, onfailure);
            },onfailure);
        },
        scheme : function(graph, uri, title, onsuccess, onfailure) {
            self.exists.uri(uri,function(data){
                if(data) {onfailure();return;}
                var datetime = currentDateTime();
                var language = OPTIONS.LANGUAGE=='none'?'':"@"+OPTIONS.LANGUAGE;
                var query = "INSERT DATA {GRAPH <" + graph + "> {<" + uri + "> <" + namespaces.RDFS + "label>\"" + title + "\"" + language + ";<" + namespaces.RDF + "type><" + namespaces.SKOS + "ConceptScheme>;<"+ namespaces.DC_TERMS+"created>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>;<"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>. }}";
                if(OPTIONS.DEBUG)console.debug(query);
                sparqlClient.update(query, onsuccess, onfailure);
            },onfailure);
        },
        top_concept : function(graph, concept, uri, title, onsuccess, onfailure) {
            self.exists.uri(uri,function(data){
                if(data) {onfailure();return;}
                var datetime = currentDateTime();
                var language = OPTIONS.LANGUAGE=='none'?'':"@"+OPTIONS.LANGUAGE;
                var query = "INSERT DATA {GRAPH <" + graph + "> {<" + uri + "> <" + namespaces.SKOS + "prefLabel>\"" + title + "\"" + language + ";<" + namespaces.RDF + "type><" + namespaces.SKOS + "Concept>;<"+ namespaces.DC_TERMS+"created>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>;<"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>.<" + concept + "><" + namespaces.SKOS + "hasTopConcept><" + uri + ">.<" + uri + "><" + namespaces.SKOS + "topConceptOf><" + concept + ">;<"+namespaces.SKOS+"inScheme><"+concept+">.}}";
                if(OPTIONS.DEBUG)console.log(query);
                sparqlClient.update(query, onsuccess, onfailure);
            },onfailure);
        },
        concept : function(graph, concept, uri, title, onsuccess, onfailure) {
            self.exists.uri(uri,function(data){
                if(data) {onfailure();return;}
                var datetime = currentDateTime();
                var language = OPTIONS.LANGUAGE=='none'?'':"@"+OPTIONS.LANGUAGE;
                var query = "WITH <" + graph + "> INSERT {<" + uri + "> <" + namespaces.SKOS + "prefLabel>\"" + title + "\"" + language + ";<" + namespaces.RDF + "type><" + namespaces.SKOS + "Concept>;<"+ namespaces.DC_TERMS+"created>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>;<"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>;<" + namespaces.SKOS + "broader><" + concept + ">;<"+namespaces.SKOS+"inScheme>?scheme.<" + concept + "><" + namespaces.SKOS + "narrower><" + uri + ">.} WHERE {<" + concept + "><" + namespaces.SKOS + "inScheme>?scheme.}";
                if(OPTIONS.DEBUG)console.log(query);
                sparqlClient.update(query, onsuccess, onfailure);
            },onfailure);
        }
    }

    this.set = {
        value : function(graph, uri, property, value, language, onsuccess, onfailure) {
            var datetime = currentDateTime();
            language = language&&language!='none'?"@"+language:"";
            var query = "WITH <" + graph + "> DELETE {<" + uri + "><"+ namespaces.DC_TERMS+"modified>?x} INSERT {<" + uri + "> <" + property + ">\"" + value + "\"" + language + ";<"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>} WHERE {}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.update(query, onsuccess, onfailure);
        },
        uri : function(graph, uri, property, value, onsuccess, onfailure) {
            var datetime = currentDateTime();
            var query = "WITH <" + graph + "> DELETE {<" + uri + "><"+ namespaces.DC_TERMS+"modified>?x} INSERT {<" + uri + "> <" + property + "><" + value + ">;<"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>} WHERE {}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.update(query, onsuccess, onfailure);
        },
        values : function(graph, uri, list, onsuccess, onfailure) {
            var datetime = currentDateTime();
            var query = "WITH <" + graph + "> DELETE {<" + uri + "><"+ namespaces.DC_TERMS+"modified>?x}  INSERT {<" + uri + ">";
            for(var i=0; i<list.length;i++) {
                switch (list[i].type) {
                    case 'uri':     query += "<" + list[i].property + "><" + list[i].value + ">";
                                    break;
                    case 'string':  list[i].language = list[i].language?"@"+list[i].language:"";
                                    query += "<" + list[i].property + ">\"" + list[i].value + "\"" + list[i].language;
                                    break;
                    case 'date':    query += "<" + list[i].property + ">\"" + list[i].value + "\"^^<http://www.w3.org/2001/XMLSchema#date>";
                }
                query += ";";
            }
            query += "<"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>.} WHERE {}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.update(query, onsuccess, onfailure);
        },
        broaderNarrower : function(graph,broader,narrower, onsuccess, onfailure) {
            var datetime = currentDateTime();
            var query = "WITH <" + graph + "> DELETE {<" + narrower + "><"+ namespaces.DC_TERMS+"modified>?x.<" + broader + "><"+ namespaces.DC_TERMS+"modified>?y} INSERT {<" + broader + "> <" + namespaces.SKOS + "narrower> <" + narrower + ">;<"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>.<" + narrower + "> <" + namespaces.SKOS + "broader> <" + broader + ">;<"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>} WHERE {}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.update(query, onsuccess, onfailure);
        },
        topConcept : function(graph,parent,child, onsuccess, onfailure) {
            var datetime = currentDateTime();
            var query = "WITH <" + graph + "> DELETE {<" + parent + "><"+ namespaces.DC_TERMS+"modified>?x.<" + child + "><"+ namespaces.DC_TERMS+"modified>?y} INSERT {<" + parent + "> <" + namespaces.SKOS + "hasTopConcept> <" + child + ">;<"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>.<" + child + "> <" + namespaces.SKOS + "topConceptOf> <" + parent + ">;<"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>} WHERE {}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.update(query, onsuccess, onfailure);
        },
        related : function(graph,concept1,concept2, onsuccess, onfailure) {
            var datetime = currentDateTime();
            var query = "WITH <" + graph + "> DELETE {<" + concept1 + "><"+ namespaces.DC_TERMS+"modified>?x.<" + concept2 + "><"+ namespaces.DC_TERMS+"modified>?y} INSERT {<" + concept1 + "> <" + namespaces.SKOS + "related> <" + concept2 + ">;<"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>.<" + concept2 + "> <" + namespaces.SKOS + "related> <" + concept1 + ">;<"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>} WHERE {}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.update(query, onsuccess, onfailure);
        }
    }

    this.update = {
        value : function(graph,uri,property,value_old,value_new,language,onsuccess, onfailure) {
            var datetime = currentDateTime();
            language = language&&language!='none'?"@"+language:"";
            var query = "WITH <" + graph + "> DELETE {<" + uri + "> <" + property + "> \"" + value_old + "\"" + language + ";<"+ namespaces.DC_TERMS+"modified>?x} INSERT {<" + uri + "> <" + property + "> \"" + value_new + "\"" + language + ";<"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>.} WHERE {<" + uri + "> <" + property + "> \"" + value_old + "\"" + language + "}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.update(query, onsuccess, onfailure);
        },
        uri : function(graph,uri,property,value_old,value_new,onsuccess, onfailure) {
            var datetime = currentDateTime();
            var query = "WITH <" + graph + "> DELETE {<" + uri + "> <" + property + "> <" + value_old + ">;<"+ namespaces.DC_TERMS+"modified>?x} INSERT {<" + uri + "> <" + property + "> <" + value_new + ">;<"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>.} WHERE {<" + uri + "> <" + property + "> <" + value_old + ">}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.update(query, onsuccess, onfailure);
        }
    }

    this.delete = {
        value : function(graph,uri,property,value,language,onsuccess, onfailure) {
            var datetime = currentDateTime();
            language = language&&language!='none'?"@"+language:"";
            var query = "WITH <" + graph + "> DELETE {<" + uri + "> <" + property + "> \"" + value + "\"" + language + ";<"+ namespaces.DC_TERMS+"modified>?x} INSERT {<" + uri + "><"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>} WHERE {}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.update(query, onsuccess, onfailure);
        },
        uri : function(graph,uri,property,value,onsuccess, onfailure) {
            var datetime = currentDateTime();
            var query = "WITH <" + graph + "> DELETE {<" + uri + "> <" + property + "> <" + value + ">;<"+ namespaces.DC_TERMS+"modified>?x} INSERT {<" + uri + "><"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>} WHERE {}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.update(query, onsuccess, onfailure);
        },
        broaderNarrower : function(graph,broader,narrower,onsuccess, onfailure) {
            var datetime = currentDateTime();
            var query = "WITH <" + graph + "> DELETE {<" + narrower + "> <" + namespaces.SKOS + "broader> <" + broader + ">;<"+ namespaces.DC_TERMS+"modified>?x.<" + broader + "> <" + namespaces.SKOS + "narrower> <" + narrower + ">;<"+ namespaces.DC_TERMS+"modified>?y} INSERT {<" + broader + "><"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>.<" + narrower + "><"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>} WHERE {}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.update(query, onsuccess, onfailure);
        },
        topConcept : function(graph,parent,child,onsuccess, onfailure) {
            var datetime = currentDateTime();
            var query = "WITH <" + graph + "> DELETE {<" + parent + "> <" + namespaces.SKOS + "hasTopConcept> <" + child + ">;<"+ namespaces.DC_TERMS+"modified>?x.<" + child + "> <" + namespaces.SKOS + "topConceptOf> <" + parent + ">;<"+ namespaces.DC_TERMS+"modified>?y} INSERT {<" + parent + "><"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>.<" + child + "><"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>} WHERE {}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.update(query, onsuccess, onfailure);
        },
        related : function(graph,concept1,concept2,onsuccess, onfailure) {
            var datetime = currentDateTime();
            var query = "WITH <" + graph + "> DELETE {<" + concept1 + "> <" + namespaces.SKOS + "related> <" + concept2 + ">;<"+ namespaces.DC_TERMS+"modified>?x.<" + concept2 + "> <" + namespaces.SKOS + "topConceptOf> <" + concept1 + ">;<"+ namespaces.DC_TERMS+"modified>?y} INSERT {<" + concept1 + "><"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>.<" + concept2 + "><"+ namespaces.DC_TERMS+"modified>\""+datetime+"\"^^<http://www.w3.org/2001/XMLSchema#date>} WHERE {}";
            if(DEBUG)console.debug(query);
            sparqlClient.update(query, onsuccess, onfailure);
        }
    }
    this.get = {
        parent : function(graph, uri, onsuccess, onfailure) {
            var query = "SELECT ?uri ?isScheme {GRAPH <" + graph + "> { <" + uri + "> (<" + namespaces.SKOS + "broader>|<" + namespaces.SKOS + "topConceptOf>) ?uri. BIND (EXISTS {?uri <" + namespaces.RDF + "type> <" + namespaces.SKOS + "ConceptScheme>} AS ?isScheme)}}"
            if(OPTIONS.DEBUG)console.log(query);
            sparqlClient.select(query, onsuccess, onfailure);
        },
        scheme : function(graph,uri,onsuccess, onfailure) {
            var language = OPTIONS.LANGUAGE=='none'?"":OPTIONS.LANGUAGE;
            var query = "SELECT DISTINCT ?title ?children {GRAPH <" + graph + "> {OPTIONAL { <"+uri+"> <" + namespaces.RDFS + "label> ?title. FILTER (lang(?title) = '" + language + "') }BIND ( EXISTS { <"+uri+">  <" + namespaces.SKOS + "hasTopConcept> ?x } AS ?children )}}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.select(query, onsuccess, onfailure)
        },
        concept : function(graph, uri, onsuccess, onfailure) {
            var language = OPTIONS.LANGUAGE=='none'?"":OPTIONS.LANGUAGE;
            var query = "SELECT DISTINCT ?title ?children {GRAPH <" + graph + "> {OPTIONAL { <"+uri+"> <" + namespaces.SKOS + "prefLabel> ?title . FILTER (lang(?title) = '" + language + "') }BIND ( EXISTS { <"+uri+">  <" + namespaces.SKOS + "narrower> ?x } AS ?children )}}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.select(query, onsuccess, onfailure)
        }
    }

    this.list = {
        graphs : function(onsuccess, onfailure) {
            var language = OPTIONS.LANGUAGE=='none'?"":OPTIONS.LANGUAGE;
            var query = "SELECT DISTINCT ?uri ?title ?children {GRAPH ?uri{?uri <"+ namespaces.RDF +"type><"+namespaces.SKOSJS+"Project>. Optional {?uri <" + namespaces.DC + "title> ?title. FILTER (lang(?title) = '" + language + "')}.BIND ( EXISTS { ?s <" + namespaces.RDF + "type> <" + namespaces.SKOS + "ConceptScheme> } AS ?children )}}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.select(query, onsuccess, onfailure);
        },
        schemes : function(graph, onsuccess, onfailure) {
            var language = OPTIONS.LANGUAGE=='none'?"":OPTIONS.LANGUAGE;
            var query = "SELECT DISTINCT ?uri ?title ?children {GRAPH <" + graph + "> {?uri a <" + namespaces.SKOS + "ConceptScheme>.OPTIONAL { ?uri <" + namespaces.RDFS + "label> ?title. FILTER (lang(?title) = '" + language + "') }BIND ( EXISTS { ?uri <" + namespaces.SKOS + "hasTopConcept> ?x } AS ?children )}}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.select(query, onsuccess, onfailure)
        },
        top_concepts : function(graph, scheme, onsuccess, onfailure) {
            var language = OPTIONS.LANGUAGE=='none'?"":OPTIONS.LANGUAGE;
            var query = "SELECT DISTINCT ?uri ?title ?children {GRAPH <" + graph + ">  {<" + scheme + "> <" + namespaces.SKOS + "hasTopConcept> ?uri.OPTIONAL { ?uri <" + namespaces.SKOS + "prefLabel> ?title . FILTER (lang(?title) = '" + language + "') }BIND ( EXISTS { ?uri <" + namespaces.SKOS + "narrower> ?x } AS ?children )}}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.select(query, onsuccess, onfailure)
        },
        narrower : function(graph, concept, onsuccess, onfailure) {
            var language = OPTIONS.LANGUAGE=='none'?"":OPTIONS.LANGUAGE;
            var query = "SELECT DISTINCT ?uri ?title ?children {GRAPH <" + graph + "> {<" + concept + "> <" + namespaces.SKOS + "narrower> ?uri.OPTIONAL { ?uri <" + namespaces.SKOS + "prefLabel> ?title . FILTER (lang(?title) = '" + language + "') }BIND ( EXISTS { ?uri <" + namespaces.SKOS + "narrower> ?x } AS ?children )}}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.select(query, onsuccess, onfailure)
        },
        values : function(graph,concept,property,onsuccess, onfailure) {
            var query = "SELECT ?value {GRAPH <" + graph + "> {<" + concept + "> <" + property + "> ?value}}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.select(query, onsuccess, onfailure)
        },
        concepts : function(graph,concept,property,onsuccess, onfailure) {
            var language = OPTIONS.LANGUAGE=='none'?"":OPTIONS.LANGUAGE;
            var query = "SELECT ?uri ?title {GRAPH <" + graph + "> {<" + concept + "> <" + property + "> ?uri. OPTIONAL { ?uri <"+namespaces.SKOS+"prefLabel> ?title. FILTER (lang(?title) = '" + language + "')}}}";
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.select(query, onsuccess, onfailure)
        }
    }

    this.search = {
        suggestion : function(graph, text, limit, case_sensitive, onsuccess, onfailure) {
            var language = OPTIONS.LANGUAGE=='none'?"":OPTIONS.LANGUAGE;
            var query = "Select DISTINCT ?uri ?text ?scheme {GRAPH<" + graph + "> {?uri <" + namespaces.RDF + "type> <" + namespaces.SKOS + "Concept>;<" + namespaces.SKOS + "prefLabel> ?text.OPTIONAL{?uri <"+namespaces.SKOS+"inScheme> ?scheme_uri. ?scheme_uri <"+namespaces.RDFS+"label> ?scheme.FILTER (lang(?scheme) = '" + language + "') }FILTER (regex(str(?text), \"" + text + "\" " + (case_sensitive ? "" : ",\"i\"") + ")).FILTER (lang(?text) = '" + language + "')}} LIMIT " + limit;
            if(OPTIONS.DEBUG)console.debug(query);
            sparqlClient.select(query, onsuccess, onfailure);
        }
    }

    function currentDateTime() {
        var D = new Date();
        var month = D.getMonth()+1;
        var date = D.getDate();
        var hours = D.getHours();
        var minutes = D.getMinutes();
        var seconds = D.getSeconds();
        return D.getFullYear()+"-"+
            (month<10?("0"+month):month)+"-"+
            (date<10?("0"+date):date)+"T"+
            (hours<10?("0"+hours):hours)+":"+
            (minutes<10?("0"+minutes):minutes)+":"+
            (seconds<10?("0"+seconds):seconds);
    }
}