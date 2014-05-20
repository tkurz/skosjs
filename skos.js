/*
 * Copyright (C) 2013 Salzburg Research.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function SKOSEditor(options) {

    var OPTIONS = {
        RDF_LINK : function(uri){window.open(uri)},
        BASE_URI : "http://localhost:8080/LMF/resource/",
        LANGUAGES_SUPPORTED : ["de","it"],
        ENDPOINT_SELECT : "http://localhost:8080/LMF/sparql/select",
        ENDPOINT_UPDATE : "http://localhost:8080/LMF/sparql/update",
        LANGUAGE : "de",
        DEBUG : false,
        COOKIES_ENABLED : true,
        COOKIE_EXPIRE_DAYS : 7,
        LABEL_GRAPH : "http://purl.org/dc/terms/title",
        LABEL_SCHEME : "http://www.w3.org/2000/01/rdf-schema#label"
    }

    $.extend(OPTIONS,options);

    /**
     * Properties for graph, schemes and concepts
     */
    var PROPERTIES = {
        graph : {
            left:[
                {title:"Title",property:"http://purl.org/dc/terms/title",type:"string",multivalue:false,multilingual:false,editable:true},
                {title:"Subject",property:"http://purl.org/dc/terms/subject",type:"string",multivalue:false,multilingual:true,editable:true},
                {title:"Description",property:"http://purl.org/dc/terms/description",type:"text",multivalue:false,multilingual:true,editable:true}
            ],
            right:[
                {title:"Author",property:"http://purl.org/dc/terms/creator",type:"uri",multivalue:false,multilingual:false,editable:false},
                {title:"Created",property:"http://purl.org/dc/terms/created",type:"string",multivalue:false,multilingual:false,editable:false},
                {title:"Publisher (Organisation)",property:"http://purl.org/dc/terms/publisher",type:"string",multivalue:true,multilingual:false,editable:true},
                {title:"Contributors",property:"http://purl.org/dc/terms/contributor",type:"uri",multivalue:true,multilingual:false,editable:false}
            ]
        },
        scheme : {
            left:[
                {title:"Top Concepts",property:"http://www.w3.org/2004/02/skos/core#hasTopConcept",type:"concept",droppable:true,editable:true}
            ],
            right:[
                {title:"Title",property:"http://www.w3.org/2000/01/rdf-schema#label",type:"string",multivalue:false,multilingual:true,editable:true},
                {title:"Description",property:"http://purl.org/dc/terms/description",type:"text",multivalue:false,multilingual:true,editable:true},
                {title:"Author",property:"http://purl.org/dc/terms/creator",type:"uri",multivalue:false,multilingual:false,editable:false},
                {title:"Created",property:"http://purl.org/dc/terms/created",type:"string",multivalue:false,multilingual:false,editable:false},
                {title:"Modified",property:"http://purl.org/dc/terms/modified",type:"string",multivalue:false,multilingual:false,editable:false},
                {title:"Publisher (Organisation)",property:"http://purl.org/dc/terms/publisher",type:"string",multivalue:true,multilingual:false,editable:true},
                {title:"Contributors",property:"http://purl.org/dc/terms/contributor",type:"uri",multivalue:true,multilingual:false,editable:false},
                {title:"License",property:"http://purl.org/dc/terms/license",type:"uri",multivalue:true,droppable:false,editable:true}
            ]
        },
        concept : {
            left:[
                {title:"Broader Concepts",property:"http://www.w3.org/2004/02/skos/core#broader",type:"concept",droppable:true,editable:true},
                {title:"Narrower Concepts",property:"http://www.w3.org/2004/02/skos/core#narrower",type:"concept",droppable:true,editable:true},
                {title:"Related Concepts",property:"http://www.w3.org/2004/02/skos/core#related",type:"concept",droppable:true,editable:true},
                {title:"Broad Match",property:"http://www.w3.org/2004/02/skos/core#broadMatch",type:"concept",droppable:true,editable:true},
                {title:"Narrow Match",property:"http://www.w3.org/2004/02/skos/core#narrowMatch",type:"concept",droppable:true,editable:true},
                {title:"Close Match",property:"http://www.w3.org/2004/02/skos/core#closeMatch",type:"concept",droppable:true,editable:true},
                {title:"Exact Match",property:"http://www.w3.org/2004/02/skos/core#exactMatch",type:"concept",droppable:true,editable:true}
            ],
            right:[
                {title:"Preferred Label",property:"http://www.w3.org/2004/02/skos/core#prefLabel",type:"string",multivalue:false,multilingual:true,editable:true},
                {title:"Alternative Label",property:"http://www.w3.org/2004/02/skos/core#altLabel",type:"string",multivalue:true,multilingual:true,editable:true},
                {title:"Hidden Label",property:"http://www.w3.org/2004/02/skos/core#hiddenLabel",type:"string",multivalue:true,multilingual:true,editable:true},
                {title:"Author",property:"http://purl.org/dc/terms/creator",type:"uri",multivalue:false,multilingual:false,editable:false},
                {title:"Created",property:"http://purl.org/dc/terms/created",type:"string",multivalue:false,multilingual:false,editable:false},
                {title:"Modified",property:"http://purl.org/dc/terms/modified",type:"string",multivalue:false,multilingual:false,editable:false},
                {title:"Contributors",property:"http://purl.org/dc/terms/contributor",type:"uri",multivalue:true,multilingual:false,editable:false},
                {title:"Definition",property:"http://www.w3.org/2004/02/skos/core#definition",type:"text",multivalue:false,multilingual:true,editable:true},
                {title:"Hidden Label",property:"http://www.w3.org/2004/02/skos/core#hiddenLabel",type:"string",multivalue:true,multilingual:true,editable:true}
            ]
        }
    }

    //event manager
    var events = new EventManager();
    var EventCode = {
        GRAPH : {
            CREATE : 100,
            CREATED : 101,
            SELECT : 102,
            SELECTED : 103,
            DELETE : 104,
            DELETED : 105,
            LOAD : 106,
            UPDATED: 107
        },
        CONCEPT : {
            CREATE : 200,
            CREATED : 201,
            SELECT : 202,
            SELECTED : 203,
            DELETE : 204,
            DELETED : 205,
            DRAGSTART: 206,
            DRAGEND: 207,
            UPDATED: 208
        },
        SCHEME : {
            CREATE : 300,
            CREATED : 301,
            SELECT : 302,
            SELECTED : 303,
            DELETE : 304,
            DELETED : 305,
            UPDATED : 306
        },
        PROPERTY : {
            CREATE : 400,
            CREATED : 401,
            SELECT : 402,
            SELECTED : 403,
            DELETE : 404,
            DELETED : 405,
            UPDATE : 406,
            UPDATED : 407
        },
        RELATION : {
            CREATED : 500,
            DELETED : 501
        },
        SETTINGS : {
            UPDATE : 600,
            UPDATED : 601
        },
        VIEW : {
            RELOAD : 700
        }
    }

    //settings (graph dependent)
    var settings = new Settings();
    //server interaction
    var client = new SparqlClient(OPTIONS.ENDPOINT_SELECT,OPTIONS.ENDPOINT_UPDATE);
    //skos interaction
    var skos = new SKOSClient(client, {LANGUAGE:settings.getLanguage(),DEBUG:OPTIONS.DEBUG,ENDPOINT_SELECT:OPTIONS.ENDPOINT_SELECT,ENDPOINT_UPDATE:OPTIONS.ENDPOINT_UPDATE,LABEL_GRAPH :OPTIONS.LABEL_GRAPH,LABEL_SCHEME :OPTIONS.LABEL_SCHEME});

    //create views
    var menu = new Menu('menu');
    var tree = new Tree('col1');
    var resource = new Resource('col2');
    var popups = new Popups('popup','popup_background');
    var search = new Search('search');
    var dragscroller = new DragScroller();

    function init() {
        //init views
        menu.init();
        tree.init();
        resource.init();
        popups.init();

        settings.init();
    }

    //the return object for external interaction
    var return_object = {
        endpoint : {
            update : {
                get : function() {
                    return client.getUpdateEndpoint();
                },
                set : function(value) {
                    client.setUpdateEndpoint(value);
                }
            },
            select : {
                get : function() {
                    return client.getSelectEndpoint();
                },
                set : function(value) {
                    client.setSelectEndpoint(value);
                }
            }
        },
        menu : {
            createMenuItem : function(name,subname,action) {
                return menu.createMenuItem(name,subname,action);
            },
            createSeperator : function(name) {
                menu.createSeperator(name);
            }
        },
        event : {
            fire : function(type,data,source) {
                events.fire(new Event(type,data,source));
            },
            bind : function(type,action) {
                events.bind(type,action,arguments.callee.caller.toString().md5());
            },
            unbind : function(type) {
                events.unbind(arguments.callee.caller.toString().md5(),type);
            }
        },
        popup : {
            info : function(title,message) {
                popups.info(title,message);
            },
            alert : function(title,message) {
                popups.alert(title,message);
            },
            custom : function(title) {
                return popups.custom(title);
            }
        },
        properties : {
            add : function(type,property,configuration,position,index) {

                position = position ? position : "right";

                var new_elem = {
                    title: configuration.title ? configuration.title : "No Title",
                    property: property,
                    type: configuration.type ? configuration.type : "string",
                    multivalue: configuration.multivalue ? configuration.multivalue : true,
                    multilingual: configuration.multilingual ? configuration.multilingual : true,
                    editable: configuration.editable ? configuration.editable : true
                }

                if(index != undefined && index < PROPERTIES[type][position].length) {
                    PROPERTIES[type][position].splice(index,0,new_elem);
                } else {
                    PROPERTIES[type][position].push(new_elem);
                }
            },
            remove : function(type,property) {
                var columns = ["left","right"];
                for(var c in columns) {
                    for(var i in PROPERTIES[type][columns[c]]) {
                        if(PROPERTIES[type][columns[c]][i].property == property) {
                            PROPERTIES[type][columns[c]].splice(i,1);break;
                        }
                    }
                }
            },
            alter : function(type,property,configuration) {
                var columns = ["left","right"];
                for(var c in columns) {
                    for(var i in PROPERTIES[type][columns[c]]) {
                        if(PROPERTIES[type][columns[c]][i].property == property) {
                            if(configuration.title) PROPERTIES[type][columns[c]][i].title = configuration.title;
                            if(configuration.type) PROPERTIES[type][columns[c]][i].type = configuration.type;
                            if(configuration.multivalue) PROPERTIES[type][columns[c]][i].multivalue = configuration.multivalue;
                            if(configuration.multilingual) PROPERTIES[type][columns[c]][i].multilingual = configuration.multilingual;
                            if(configuration.editable) PROPERTIES[type][columns[c]][i].editable = configuration.editable;
                        }
                    }
                }
            }
        },
        EventCode : EventCode,
        init : function() {
            init();
        },
        authentification: {
            setAuth : function(user, pass, token) {
                client.setAuth(user, pass, token);
            }
        }
    }
    return return_object;

    /**
     * Event Management: used by different views to trigger and react on events
     */
    function EventManager() {
        var bindings = [];
        /**
         * fires @see Event
         * @param event
         */
        this.fire = function(event) {
            if(!bindings[event.type])return;
            for(var i=0;i<bindings[event.type].length;i++) {
                bindings[event.type][i].action(event);
            }
            if(OPTIONS.DEBUG)console.debug("Fired Event:",event);
        }
        /**
         * bind actions to events, name is used for unbinding
         * @param type
         * @param action a javascript function with parameter @see Event
         * @param name
         */
        this.bind = function(type,action,name){
            if(bindings[type] == undefined) bindings[type] = [];
            bindings[type].push(new Action(name,action));
        }
        this.unbind = function(name,type) {
            for(var property in bindings) {
                if(type==undefined || property==type) {
                    var undeleted = [];
                    for(var i=0;i<bindings[property].length;i++) {
                        if(bindings[property][i].name != name) undeleted.push(bindings[property][i]);
                    }
                    bindings[property] = undeleted;
                }
            }
        }
        function Action(name,action) {
            this.name = name;
            this.action = action;
        }
    }

    /**
     * Used to pass type (@see EventCode), data and source to bound functions
     * @param type
     * @param data
     * @param source
     */
    function Event(type,data,source) {
        this.type = type;
        this.data = data;
        this.source = source;
    }

    /**
     * Settings depending on graph
     */
    function Settings() {
        var self = this;
        var graph;

        var language;
        var languages;

        function resetCookie(name) {
            var date = new Date();
            document.cookie = name + "=" + "undefined" + "; expires=" + date.toUTCString();
        }

        function setCookie(name,value) {
            var date = new Date();
            date.setDate(date.getDate() + OPTIONS.COOKIE_EXPIRE_DAYS);
            document.cookie = name + "=" + escape(value) + "; expires=" + date.toUTCString();
        }
        function getCookie(name) {
            var i,x,y,ARRcookies=document.cookie.split(";");
            for (i=0;i<ARRcookies.length;i++) {
                x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
                y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
                x=x.replace(/^\s+|\s+$/g,"");
                if (x==name) {return unescape(y);}
            } return null;
        }

        function loadGraph(uri) {
            graph = uri;
            skos.get.graphFirstLanguage(graph,function(data){
                if(data[0]&&data[0].language)language=data[0].language.value;
                skos.list.graphLanguages(graph,function(data){
                    var lngs = [];
                    lngs.push(language);
                    for(var i in data) {
                        if(data[i].language.value!=language)lngs.push(data[i].language.value);
                    }
                    if(data.length>0)languages = lngs;
                    if(skos)skos.setLanguage(language);
                    skos.get.graph(graph,function(data){
                        var title = graph;
                        if(data[0]&&data[0].title)title=data[0].title.value;
                        events.fire(new Event(EventCode.GRAPH.LOAD,{uri:graph,title:title},self));
                        if(OPTIONS.COOKIES_ENABLED) setCookie("graph",graph);
                    },function(){
                        popups.alert("Error","Could not load graph");
                        if(OPTIONS.COOKIES_ENABLED) resetCookie("graph");
                    })
                },function(){alert("could not read languages")})
            },function(){alert("could not read first language")});
        }

        this.reset = function() {
            language = OPTIONS.LANGUAGE;
            languages = OPTIONS.LANGUAGES_SUPPORTED;
        }

        this.init = function() {
            if(OPTIONS.COOKIES_ENABLED) {
                var uri = getCookie("graph");
                if(uri){
                    skos.exists.graph(uri,function(){
                        events.fire(new Event(EventCode.GRAPH.SELECTED,{uri:uri}));
                    },function(){
                        popups.alert("Error","Could not load graph");
                        if(OPTIONS.COOKIES_ENABLED) resetCookie("graph");
                    })
                }
            }
        }
        /*
         this.set = function(settings) {
         //TODO
         events.fire(new Event(EventCode.SETTINGS.UPDATED));
         } */
        this.getLanguage = function(){return language};
        this.getLanguages = function(){return languages};
        this.setLanguage = function(l){
            language = l;
        }
        this.setLanguages = function(l){
            languages = l;
        }
        this.getGraph = function(){return graph};

        events.bind(EventCode.GRAPH.SELECTED,function(event){
            self.reset();
            loadGraph(event.data.uri);
        });
        events.bind(EventCode.SETTINGS.UPDATED,function(){
            events.fire(new Event(EventCode.GRAPH.SELECTED,{uri:graph},self));
        });

        self.reset();
    }

    /**
     * Creates Menu in container. The Object has functions to create MenuItems and (graphical) Seperators
     * @param container_id
     */
    function Menu(container_id) {

        var self = this;

        var menu_items = [];
        var current;

        //Create Menu
        var menu = $("<ul></ul>").addClass("menu").appendTo("#"+container_id);

        this.init = function() {
            setShortcuts()
        }
        /**
         * creates a submenu point (subname) on given menu point (name) triggering action.
         * @param name
         * @param subname
         * @param action
         */
        this.createMenuItem = function(name,subname,action,shortcut) {
            if(!menu_items[name]) {
                menu_items[name] = $("<li></li>").html("<a>"+name+"</a><ul></ul>").appendTo(menu);
                menu_items[name].hover(function(){
                    menu_items[name].addClass("hover");
                    $('ul:first',menu_items[name]).css('visibility', 'visible');
                }, function(){
                    menu_items[name].removeClass("hover");
                    $('ul:first',menu_items[name]).css('visibility', 'hidden');
                });
            }
            var shortcut=shortcut?"<span class='menu_shortcut'>"+shortcut+"</span>":"";
            var menu_point = $("<li></li>").append($("<a></a>").html(subname+shortcut).click(function(){
                if(menu_point.hasClass("disabled")) return false;
                action();
            })).appendTo(menu_items[name].find("ul"));
            return menu_point;
        }
        /**
         * creates a graphical sepertator on the bottom of the submenu list of menu 'name'
         * @param name
         */
        this.createSeperator = function(name) {
            $("<hr>").addClass("seperator").appendTo(menu_items[name].find("ul"));
        }

        //thesaurus submenu

        var open_new_graph = self.createMenuItem("Project","Open/Create Graph",function(){
            if(open_new_graph.hasClass("disabled")) return false;
            events.fire(new Event(EventCode.GRAPH.CREATE));
        },"CTRL+g");
        var new_concept = self.createMenuItem("Project","Create Scheme/Concept",function(){
            if(new_concept.hasClass("disabled")) return false;
            events.fire(new Event(EventCode.CONCEPT.CREATE,current));
        },"CTRL+n");

        self.createSeperator("Project");

        var settings = self.createMenuItem("Project","Graph Settings",function(){
            if(settings.hasClass("disabled")) return false;
            events.fire(new Event(EventCode.SETTINGS.UPDATE,current));
        });

        var about = self.createMenuItem("Help","About",function(){
            popups.info("About",HTML_TEMPLATES.about);
        });

        new_concept.addClass("disabled");
        settings.addClass("disabled");

        //bind events
        events.bind(EventCode.GRAPH.SELECTED,function(event){
            new_concept.removeClass("disabled");
            settings.removeClass("disabled");
            current = {uri:event.data.uri,type:'graph'};
        });
        events.bind(EventCode.CONCEPT.SELECTED,function(event){
            current = {uri:event.data.uri,type:event.data.type};
        });

        function setShortcuts() {
            $(window).keydown(function(event) {
                if(event.ctrlKey) {
                    switch(event.which) {
                        case 71://G
                            events.fire(new Event(EventCode.GRAPH.CREATE));
                            event.preventDefault();
                            break;
                        case 78://N
                            if(!new_concept.hasClass("disabled"))events.fire(new Event(EventCode.CONCEPT.CREATE,current));
                            event.preventDefault();
                            break;
                    }
                }
            });
        }

    }

    /**
     * SKOS Tree
     * @param container
     */
    function Tree(container) {
        var source = this;

        var graph;
        var tree;
        var free;
        var current;

        //bind events
        events.bind(EventCode.GRAPH.LOAD,function(event){
            init(event);
        });
        events.bind(EventCode.PROPERTY.UPDATED,function(event){
            if(event.data.language==settings.getLanguage()) {
                if(event.data.property=="http://www.w3.org/2004/02/skos/core#prefLabel" || event.data.property=="http://www.w3.org/2000/01/rdf-schema#label") {
                    $(".concept_"+event.data.uri.md5()).text(event.data.value);
                }
            } else if(event.data.property=="http://purl.org/dc/terms/title") {
                $(".concept_"+event.data.uri.md5()).text(event.data.value);
            }
        });
        events.bind(EventCode.PROPERTY.DELETED,function(event){
            if(event.data.language==settings.getLanguage()) {
                if(event.data.property=="http://www.w3.org/2004/02/skos/core#prefLabel" || event.data.property=="http://www.w3.org/2000/01/rdf-schema#label") {
                    $(".concept_"+event.data.uri.md5()).text(event.data.uri);
                }
            } else if(event.data.property=="http://purl.org/dc/terms/title") {
                $(".concept_"+event.data.uri.md5()).text(event.data.value);
            }
        });
        events.bind(EventCode.PROPERTY.CREATED,function(event){
            if(event.data.language==settings.getLanguage()) {
                if(event.data.property=="http://www.w3.org/2004/02/skos/core#prefLabel" || event.data.property=="http://www.w3.org/2000/01/rdf-schema#label") {
                    $(".concept_"+event.data.uri.md5()).text(event.data.value);
                }
            }  else if(event.data.property=="http://purl.org/dc/terms/title") {
                $(".concept_"+event.data.uri.md5()).text(event.data.value);
            }
        });
        events.bind(EventCode.CONCEPT.SELECTED,function(event){
            if(event.source != source) {
                console.log("TODO: open to selected");//TODO
                if(current.uri!=event.data.uri){
                    $(".concept_"+current.uri.md5()).removeClass('activeNode');
                    current = event.data;
                    $(".concept_"+current.uri.md5()).addClass('activeNode');
                }
            }
        });
        events.bind(EventCode.SCHEME.CREATED,function(event){
            current = event.data;
            load();
        });
        events.bind(EventCode.CONCEPT.CREATED,function(event){
            open(event.data);
        });
        events.bind(EventCode.RELATION.CREATED,function(event){
            switch(event.data.type) {
                case 'broader': reload(event.data.broader);loadFreeConcepts();break;
                case 'narrower': reload(event.data.broader);loadFreeConcepts();break;
                case 'broaderNarrower': reload(event.data.broader);loadFreeConcepts();break;
                case 'topConcept': reload(event.data.parent);loadFreeConcepts();break;
            }
        });
        events.bind(EventCode.RELATION.DELETED,function(event){
            switch(event.data.type) {
                case 'broader': reload(event.data.broader);loadFreeConcepts();break;
                case 'narrower': reload(event.data.broader);loadFreeConcepts();break;
                case 'topConcept': reload(event.data.parent);loadFreeConcepts();break;
            }
        });

        //initialize
        this.init = function() {
            tree = $("<ul></ul>").addClass("tree");
            $("#"+container).empty().append(tree);
            bindShortcuts();
        }

        //TODO fix
        function bindShortcuts() {

            var timeout;
            var item = undefined;

            var loading = false;

            $(window).keydown(function(event) {
                if(graph && event.target.id!="search_input" && $(".concept_"+current.uri.md5()).length>0) {
                    switch(event.keyCode) {
                        //37 l 38 o 39 r 40 u 13 enter
                        case 13:
                            if(loading) return false;
                            event.preventDefault();
                            if(!item) return false;
                            item.children().eq(1).click();
                            break;
                        case 37:
                            if(loading) return false;
                            event.preventDefault();
                            if(!item) setCurrent($(".concept_"+current.uri.md5()).parent());
                            else {
                                if(item.parent().hasClass('tree'))return false;
                                setCurrent(item.parent().parent());
                            }
                            break;
                        case 38:
                            if(loading) return false;
                            event.preventDefault();
                            if(!item) setCurrent($(".concept_"+current.uri.md5()).parent());
                            else {
                                if(item.prev().length == 0) setCurrent(item.parent().children().last());
                                else setCurrent(item.prev());
                            }
                            break;
                        case 39:
                            if(loading) return false;
                            event.preventDefault();
                            if(!item) setCurrent($(".concept_"+current.uri.md5()).parent());
                            else {
                                if(item.parent().hasClass('tree')) {
                                    if(item.children().eq(2).children().length!=0){
                                        setCurrent(item.children().eq(2).children().first());
                                    }
                                } else if(item.children().eq(0).hasClass('plus')) {
                                    loading=true;
                                    var test = function() {
                                        setTimeout(function(){
                                            if(!item.children().eq(0).hasClass('minus')) {
                                                test();
                                            } else {
                                                setCurrent(item.children().eq(2).children().first());
                                                loading=false;
                                            }
                                        },200);
                                    }
                                    item.children().eq(0).click();
                                    test();
                                } else if(item.children().eq(0).hasClass('minus')) {
                                    setCurrent(item.children().eq(2).children().first());
                                }
                            }
                            break;
                        case 40:
                            if(loading) return false;
                            event.preventDefault();
                            if(!item) setCurrent($(".concept_"+current.uri.md5()).parent());
                            else {
                                if(item.next().length == 0) setCurrent(item.parent().children().first());
                                else setCurrent(item.next());
                            }
                            break;
                    }}
            });

            function setCurrent(li) {
                item = li;
                $(".navi").removeClass("navi");
                li.addClass("navi");
                window.clearTimeout(timeout);
                timeout = window.setTimeout(function() {
                    $(".navi").removeClass("navi");
                    item = undefined;
                },2000);
            }
        }

        //re(load) graph
        function init(event) {
            graph = {uri:event.data.uri,title:event.data.title};
            current = {uri:event.data.uri,type:'graph'};
            load();
        }

        //select node (given by data.uri)
        function open(data) {
            $(".concept_"+current.uri.md5()).each(function(){
                current = data;
                $(this).removeClass('activeNode');
                var parent = $(this).parent();
                parent.get(0).data.children.value = 'true';
                var _li = createNode(parent.get(0).data,parent.get(0).datatype);
                if(parent.hasClass("last"))_li.addClass("last");
                parent.replaceWith(_li);
                ((_li.children()).first()).click();
            });
            events.fire(new Event(EventCode.CONCEPT.SELECTED,current,source));
        }

        //load graph and schemes
        function load() {
            //tree
            var _li = $("<li style='padding-left: 0'></li>").append("<a class='graph_leaf'>&nbsp;</a>").append($("<a></a>").text(graph.title).addClass('graph').attr("draggable",false).addClass("concept_"+graph.uri.md5()).addClass('node').click(function(){
                $(".activeNode").removeClass('activeNode');
                $(this).addClass('activeNode');
                select(graph.uri,'graph');
            }));
            var _childs = $("<ul></ul>");
            //load childs
            skos.list.schemes(graph.uri,function(data){
                for(var i=0; i<data.length;i++) {
                    _childs.append(createNode(data[i],'scheme'));
                }
                _childs.children().last().addClass("last");
                //select current
                $(".concept_"+current.uri.md5()).first().click();
            },function(){popups.alert("Alert","could not load schemes")})
            _li.append(_childs);
            tree.empty().append(_li).append(initFreeConcepts());

            tree.children().last().addClass("last");
        }

        /**
         * ATTENTION the skos query is very inefficient for bigger datsets
         */
        function initFreeConcepts() {
            var _li = $("<li style='padding-left: 0'></li>").append("<a class='free_concept_leaf'>&nbsp;</a>").append($("<a></a>").text("Free Concepts").addClass('free').attr("draggable",false).addClass('node'));
            free = $("<ul></ul>");
            _li.append(free);
            //load childs
            loadFreeConcepts();
            return _li;
        }

        function loadFreeConcepts() {
            skos.list.freeConcepts(graph.uri,function(data){
                free.empty();
                for(var i=0; i<data.length;i++) {
                    free.append(createNode(data[i],'concept'));
                }
                free.children().last().addClass("last");
            },function(){popups.alert("Alert","could not load free concepts")});
        }

        //reload node
        function reload(uri) {
            $(".concept_"+uri.md5()).each(function(){
                var type = $(this).attr("type");
                var container = $(this).parent();
                if(type=="scheme") {
                    skos.get.scheme(graph.uri,uri,function(data){rewrite(data,type,container)},function(){popups.alert("Alert","could not reload scheme")});
                } else {
                    skos.get.concept(graph.uri,uri,function(data){rewrite(data,type,container)},function(){popups.alert("Alert","could not reload concept")});
                }
            });
            function rewrite(data,type,container) {
                data[0].uri = {value:uri};
                var li = createNode(data[0],type,container.attr("closed")=="false");
                container.replaceWith(li);
                (li.parent()).children().last().addClass("last");
            }
        }

        /**
         * draw node given by data and type
         * @param data
         * @param type
         * @param openOnLoad list subnodes after loading
         */
        function createNode(data,type,openOnLoad) {
            var _title = data.title?data.title.value:data.uri.value;
            var _more = $("<a>&nbsp;</a>");
            var _span =  $("<a></a>").text(_title).addClass(type).attr('type',type).addClass("concept_"+data.uri.value.md5()).addClass('node').click(function(){
                $(".activeNode").removeClass('activeNode');
                $('.concept_'+data.uri.value.md5()).addClass('activeNode').focus();
                select(data.uri.value,type);
            });

            if(data.uri.value == current.uri) _span.addClass('activeNode');
            var _li = $("<li></li>").attr("closed","true").append(_more).append(_span);
            _li[0].data = data;
            _li[0].datatype= type;
            var _childs = $("<ul></ul>");
            var current_uri = data.uri.value;
            var loadChildren = type=='scheme'? skos.list.top_concepts : skos.list.narrower;
            var _child_type = type=='scheme'?"top-concept":"concept";
            if(data.children.value.bool() || data.children.value == 1) {
                _more.addClass('plus');
                _more.click(function(){
                    if(_more.hasClass('plus')){
                        _more.removeClass('plus').addClass('loading');
                        loadChildren(graph.uri,data.uri.value,function(data){
                            for(var i=0; i<data.length;i++) {
                                _childs.append(createNode(data[i],_child_type));
                            }
                            _childs.children().last().addClass("last");
                            _more.removeClass('loading').addClass('minus');
                            _li.attr("closed","false");
                        },function(){popups.alert("Alert","could not load children")})
                    } else if(_more.hasClass('minus')){
                        _childs.empty();
                        _more.removeClass('minus').addClass('plus');
                        _li.attr("closed","true");
                    }
                });
                _more.get(0).addEventListener('dragover', function(e){
                    if($(this).hasClass('plus')){
                        $(this).click();
                    }
                },false);
            } else {
                _more.addClass('leaf');
            }
            //make concepts draggable and schemas + concepts dropable
            if(type!="scheme") {
                _span.attr("draggable",true);
                _span.addClass("draggable");
            }
            _span.get(0).addEventListener('dragstart', function(e){
                events.fire(new Event(EventCode.CONCEPT.DRAGSTART));
                this.style.opacity = '0.4';
                //e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/uri-list', data.uri.value);
                //e.dataTransfer.setData('parent', parent_uri);
            }, false);
            _span.get(0).addEventListener('dragenter', function(e){
                $(this).addClass('dragover');
            }, false);
            _span.get(0).addEventListener('dragover', function(e){
                if (e.preventDefault) {e.preventDefault();}
                //e.dataTransfer.dropEffect = 'move';
                return false;
            }, false);
            _span.get(0).addEventListener('dragleave', function(e){
                $(this).removeClass('dragover');
            }, false);
            _span.get(0).addEventListener('drop', function(e){
                if (e.stopPropagation) {e.stopPropagation();}
                var uri = e.dataTransfer.getData('text/uri-list');
                //var parent = e.dataTransfer.getData('parent');
                //add and redraw
                e.preventDefault();
                //prevent other drops
                if(e.dataTransfer.getData('text/plain')) {
                    popups.info("Not Allowed","This kind of drop is not allowed");
                    return false;
                }
                if(uri==data.uri.value) {
                    if(!confirm("Make concept child of itself?")) return false;
                }
                if(!uri || uri=="") {
                    popups.info("Not Allowed","This kind of drop is not allowed");
                    return false;
                }
                if(type=='scheme') {
                    skos.set.topConcept(graph.uri,data.uri.value,uri,function(){
                        events.fire(new Event(EventCode.RELATION.CREATED,{type:"topConcept",parent:data.uri.value,child:uri},source));
                        events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[data.uri.value,uri]}));
                    },function(){popups.alert("Alert","could not add narrower")});
                } else {
                    skos.set.broaderNarrower(graph.uri,data.uri.value,uri,function(){
                        events.fire(new Event(EventCode.RELATION.CREATED,{type:"broaderNarrower",broader:data.uri.value,narrower:uri},source));
                        events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[data.uri.value,uri]}));
                    },function(){popups.alert("Alert","could not add narrower")});
                }
                return false;
            }, false);
            _span.get(0).addEventListener('dragend', function(e){
                events.fire(new Event(EventCode.CONCEPT.DRAGEND));
                $('.dragover').removeClass('dragover');
                $('.draggable').css('opacity',1);
            }, false);

            _li.append(_childs);
            if(openOnLoad) _more.click();
            return _li;
        }

        //on node-click
        function select(uri,type) {
            current = {uri:uri,type:type};
            events.fire(new Event(EventCode.CONCEPT.SELECTED,current,source));
        }
    }

    /**
     * Search with suggestions
     * @param container
     */
    function Search(container) {
        var graph;
        var source = this;

        events.bind(EventCode.GRAPH.LOAD, function(event) {
            graph = event.data.uri;
            $("#search_input").val("");
        });

        var minLenght = 3;
        var maxSuggestions = 5;
        var caseSensitive = false;

        var loader = new Loader();

        //load container
        $("#" + container).html(HTML_TEMPLATES.search);
        var selected;
        var input_field = $("#search_input");
        var suggestions = $("#search_suggestion");

        $("#search_div").focusout(function() {
            suggestions.hide();
        });

        function setShortcuts() {
            $(window).keydown(function(event) {
                if(event.ctrlKey) {
                    switch(event.which) {
                        case 70://F
                            input_field.val("").focus();
                            break;
                    }
                }
            });
        }
        setShortcuts();

        //react on keypress
        input_field.keyup(function(e) {
            if (graph == null) {
                input_field.val("");
                popups.info("Info", "select a graph first");
            }
            var text = input_field.val();

            if (text.length >= minLenght) {
                //return
                if (e.keyCode == 13) {
                    if (selected) {
                        events.fire(new Event(EventCode.CONCEPT.SELECTED, selected, source));
                        suggestions.hide();
                        input_field.focusout();
                    } else popups.info("Info", "no results");
                    return;
                }
                //up
                if (e.keyCode == 38) {
                    selected = {type:"concept"};
                    e.preventDefault();
                    var found = false;
                    suggestions.children().each(function() {
                        if ($(this).hasClass('current')) {
                            found = true;
                            $(this).removeClass('current');
                            var prev = $(this).prev();
                            if (prev.length != 0) {
                                prev.addClass('current');
                                selected.uri = prev.attr("uri");
                                selected.title = prev.attr("name");
                            }
                            else found = false;
                            return false;
                        }
                    });
                    if (!found) {
                        suggestions.children().last().addClass('current');
                        selected.uri = suggestions.children().last().attr("uri");
                        selected.title = suggestions.children().last().attr("name");
                    }
                    return false;
                }
                //down
                if (e.keyCode == 40) {
                    selected = {type:"concept"};
                    e.preventDefault();
                    var found = false;
                    suggestions.children().each(function() {
                        if ($(this).hasClass('current')) {
                            found = true;
                            $(this).removeClass('current');
                            var next = $(this).next();
                            if (next.length != 0) {
                                next.addClass('current');
                                selected.uri = next.attr("uri");
                                selected.title = next.attr("name");
                            }
                            else found = false;
                            return false;
                        }
                    });
                    if (!found) {
                        suggestions.children().first().addClass('current');
                        selected.uri = suggestions.children().first().attr("uri");
                        selected.title = suggestions.children().first().attr("name");
                    }
                    return false;
                }
                loader.set();
                //load suggestions
                skos.search.suggestion(graph, text, maxSuggestions, caseSensitive, function(data) {
                    suggestions.empty();
                    selected = undefined;
                    if (data.length == 0) {
                        suggestions.append("<span class='empty'>no results</span>");
                    }
                    for (var i = 0; i < data.length; i++) {
                        //show suggestions
                        var regex = new RegExp('(' + text + ')', 'gi');
                        var t = data[i].text.value.replace(regex, "<span>$1</span>");
                        var s = data[i].scheme ? (" (" + data[i].scheme.value + ")") : "";
                        suggestions.append("<div name='" + data[i].text.value + "' uri='" + data[i].uri.value + "'>" + t + s + "</div>");
                        if (i == 0) {
                            (suggestions.children()).first().addClass('current');
                            selected = {uri:data[i].uri.value,title:data[i].text.value,type:'concept'};
                        }
                    }
                    suggestions.show();
                    loader.remove();
                }, function() {
                    popups.alert("Alert", "could not return suggestions")
                });
            } else suggestions.hide();
        });

        //show loader until the last request is served
        function Loader() {
            var i = 0;
            this.set = function() {
                if (i == 0) $("#search_loader").show();
                i++;
            }
            this.remove = function() {
                i--;
                if (i == 0) $("#search_loader").hide();
            }
        }

        this.init = function() {
            //nothing to do
        }
    }

    /**
     * SKOS resource view
     * @param container
     */
    function Resource(container) {
        var graph;
        var current;
        var source = this;

        var views;

        //bind events
        events.bind(EventCode.CONCEPT.SELECTED,function(event){
            current = event.data;
            show(event.data.uri,event.data.type);
        });
        events.bind(EventCode.GRAPH.LOAD,function(event){
            graph = event.data.uri;
        });

        events.bind(EventCode.VIEW.RELOAD,function(event){
            for(var i in event.data.uris) {
                var uri = event.data.uris[i];
                for(var j in views) {
                    if(views[j].getProperty() == uri) {
                        views[j].reload();
                        console.info(uri);
                    }
                }
            }
        });

        this.init = function() {
        }

        //load templates
        var literal_view_template = HTML_TEMPLATES.views.resource.literal.view;
        var literal_fix_template = HTML_TEMPLATES.views.resource.literal.fix;
        var literal_edit_template = HTML_TEMPLATES.views.resource.literal.edit;
        var add_template = HTML_TEMPLATES.views.resource.add;
        var text_view_template = HTML_TEMPLATES.views.resource.text.view;
        var text_fix_template = HTML_TEMPLATES.views.resource.text.fix;
        var text_edit_template = HTML_TEMPLATES.views.resource.text.edit;
        var concept_fix_template = HTML_TEMPLATES.views.resource.concept.fix;
        var concept_edit_template = HTML_TEMPLATES.views.resource.concept.edit;

        //show skos view
        function show(uri,type) {
            var content = $("<div></div>");
            $("#" + container).empty().append(content);
            events.unbind("property-view");
            content.html(HTML_TEMPLATES.views.resource.basic);
            $("#view_header_uri").text(uri);
            $("#view_content").addClass(type);
            $("#view_header_rdf_link").click(function() {
                OPTIONS.RDF_LINK(uri);
            });
            $("#view_header_uri_delete").click(function(){
                events.fire(new Event(EventCode.CONCEPT.DELETE,current,self));
            })
            switch (type) {
                case 'graph':
                    views = createView(PROPERTIES.graph);
                    break;
                case 'scheme':
                    views = createView(PROPERTIES.scheme);
                    break;
                default:
                    views = createView(PROPERTIES.concept);
                    // Enabel DnD for concepts
                    var c = $("#view_header_rdf_link").closest(".draghandle");
                    c.attr("draggable",true).addClass("draggable");
                    c.get(0).addEventListener('dragstart', function(e){
                        events.fire(new Event(EventCode.CONCEPT.DRAGSTART));
                        this.style.opacity = '0.4';
                        //e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/uri-list', uri);
                        //e.dataTransfer.setData('parent', parent_uri);
                    }, false);
                    c.get(0).addEventListener('dragend', function(e){
                        events.fire(new Event(EventCode.CONCEPT.DRAGEND));
                        $('.dragover').removeClass('dragover');
                        $('.draggable').css('opacity',1);
                    }, false);

                    break;
            }
        }

        //display in columns depending on configurations
        function createView(options) {

            var v = [];

            for(var i=0;i<options.left.length;i++) {
                var view = createPropertyView(options.left[i]);
                $("#view_content_left").append(view.getBox());
                bindEvents(view);
                v.push(view);
            }
            for(var i=0;i<options.right.length;i++) {
                var view = createPropertyView(options.right[i]);
                $("#view_content_right").append(view.getBox());
                bindEvents(view);
                v.push(view);
            }

            return v;
        }

        //event-binding for rerender (e.g. modified, broader, etc)
        function bindEvents(view) {
            switch(view.getType()) {
                case "string":
                    switch(view.getProperty()) {
                        case "http://purl.org/dc/terms/modified" :
                            events.bind(EventCode.PROPERTY.UPDATED,function(e) {
                                if(e.data.uri==current.uri) {
                                    view.reload();
                                }
                            },"property-view");
                            events.bind(EventCode.PROPERTY.DELETED,function(e) {
                                if(e.data.uri==current.uri) {
                                    view.reload();
                                }
                            },"property-view");
                            events.bind(EventCode.PROPERTY.CREATED,function(e) {
                                if(e.data.uri==current.uri) {
                                    view.reload();
                                }
                            },"property-view");
                            events.bind(EventCode.RELATION.CREATED,function(e){
                                switch(e.data.type) {
                                    case "broader": if(e.data.narrower==current.uri)view.reload();break;
                                    case "narrower": if(e.data.broader==current.uri)view.reload();break;
                                    case "broaderNarrower": if(e.data.broader==current.uri||e.data.narrower==current.uri)view.reload();break;
                                    case "topConcept": if(e.data.parent==current.uri) view.reload();break;
                                    default: if(e.data.concept1=current.uri) view.reload();
                                }
                            },"property-view");
                            events.bind(EventCode.RELATION.DELETED,function(e){
                                switch(e.data.type) {
                                    case "broader": if(e.data.narrower==current.uri) view.reload();break;
                                    case "narrower": if(e.data.broader==current.uri) view.reload();break;
                                    case "topConcept": if(e.data.parent==current.uri) view.reload();break;
                                    default: if(e.data.concept1=current.uri) view.reload();
                                }
                            },"property-view");
                            break;
                    }break;
                case 'concept':
                    switch(view.getProperty()) {
                        case "http://www.w3.org/2004/02/skos/core#broader" :
                        case "http://www.w3.org/2004/02/skos/core#narrower" :
                        case "http://www.w3.org/2004/02/skos/core#hasTopConcept" :
                            events.bind(EventCode.RELATION.DELETED,function(e){
                                switch(e.data.type) {
                                    case "broader": if(e.data.narrower==current.uri) view.reload();break;
                                    case "narrower": if(e.data.broader==current.uri) view.reload();break;
                                    case "topConcept": if(e.data.parent==current.uri) view.reload();break;
                                }
                            },"property-view");
                            events.bind(EventCode.RELATION.CREATED,function(e){
                                switch(e.data.type) {
                                    case "broader": if(e.data.narrower==current.uri) view.reload();break;
                                    case "narrower": if(e.data.broader==current.uri) view.reload();break;
                                    case "broaderNarrower": if(e.data.broader==current.uri||e.data.narrower==current.uri)view.reload();break;
                                    case "topConcept": if(e.data.parent==current.uri) view.reload();break;
                                }
                            },"property-view");
                            break;
                    }break;
            }
        }

        //different view-type for different types of properties
        function createPropertyView(options) {
            switch(options.type) {
                case 'string': return new StringPropertyView(options.title,options.property,options.multilingual,options.multivalue,options.editable,false);
                case 'text' : return new StringPropertyView(options.title,options.property,options.multilingual,options.multivalue,options.editable,true);
                case 'uri' : return new UriPropertyView(options.title,options.property,options.multivalue,options.editable);
                case 'concept' : return new ConceptPropertyView(options.title,options.property,options.droppable,options.editable);
                case 'boolean' : return new BooleanPropertyView(options.title,options.property,options.editable,options.confirm);
            }
        }

        function BooleanPropertyView(title,property,editable,confirm) {

            var box = $("<div></div>").addClass("content_box").append($("<h1></h1>").text(title));
            var container = $("<div></div>").appendTo(box);
            load();
            this.getBox = function() {
                return box;
            }
            this.getType = function() {
                return "boolean";
            }
            this.getProperty = function() {
                return property;
            }
            this.reload = function() {
                load();
            }

            //get properties
            function load(){
                skos.list.values(graph,current.uri,property,write,function(){popups.alert("Alert","could not list values "+property)});
            }

            //write properties
            function write(data) {
                container.empty();

                var checkbox = $("<input type='checkbox'>").addClass("check");
                if(!editable) checkbox.attr("disabled","disabled");
                if(data.length!=0 && data[0].value.value == "true") checkbox.prop("checked",true);
                $("<div></div>").addClass('list_values').append(checkbox).appendTo(container);

                var isNew = data.length == 0;

                checkbox.click(function() {
                    var _inner_self = this;
                    function setValue() {
                        if(!isNew) {
                            skos.update.value(graph, current.uri, property,!$(_inner_self).is(':checked'),$(_inner_self).is(':checked'),"http://www.w3.org/2001/XMLSchema#boolean",null,function(){
                                load();
                            },function(){
                                alert("Could not set value!");
                            });
                        } else {
                            skos.set.value(graph, current.uri, property,$(_inner_self).is(':checked'),null,"http://www.w3.org/2001/XMLSchema#boolean",function(){
                                load();
                            },function(){
                                alert("Could not set value!");
                            });
                        }
                    }

                    if(confirm) {
                        //open confirm dialoge
                        var popup = popups.confirm("Warning","Are you sure you want to set '"+title+"' to '"+($(this).is(':checked') ? "true" : "false")+"'?",[{
                            title:"Yes",
                            action:function() {
                                setValue();
                            }
                        }]);
                        popup.onclose = function(){ console.log($(_inner_self).is(':checked')+"13")
                             $(_inner_self).prop("checked",!$(_inner_self).is(':checked'));
                        }
                    } else {
                        setValue();
                    }
                });
            }
        }

        /**
         *
         * @param title to show
         * @param property as uri
         * @param multilingual
         * @param multivalue
         * @param editable
         * @param multiline text should have more then one line
         */
        function StringPropertyView(title,property,multilingual,multivalue,editable,multiline) {
            var box = $("<div></div>").addClass("content_box").append($("<h1></h1>").text(title));
            var container = $("<div></div>").appendTo(box);
            load();
            this.getBox = function() {
                return box;
            }
            this.getType = function() {
                return "string";
            }
            this.getProperty = function() {
                return property;
            }
            this.reload = function() {
                load();
            }

            //get properties
            function load(){
                skos.list.values(graph,current.uri,property,write,function(){popups.alert("Alert","could not list values "+property)});
            }
            //write properties
            function write(data) {
                container.empty();
                var obj = {};
                //order on language
                for(var i=0; i<data.length;i++) {
                    if(data[i].value["xml:lang"]) {
                        if(!obj[data[i].value["xml:lang"]]) obj[data[i].value["xml:lang"]] = [];
                        obj[data[i].value["xml:lang"]].push(data[i].value.value);
                    } else {
                        if(!obj["none"]) obj["none"] = [];
                        obj["none"].push(data[i].value.value);
                    }
                }
                var boxClass = multiline?"view_subbox_text":"view_subbox";
                if(multilingual) {
                    for(var i=0; i<settings.getLanguages().length;i++) {
                        var content = $("<div></div>").addClass('list_values');
                        content.appendTo(container);
                        content.append($("<div></div>").addClass("language_sign").append("<span>"+settings.getLanguages()[i]+"</span>"));
                        content.append($("<div></div>").addClass(boxClass).append(createTable(obj[settings.getLanguages()[i]],settings.getLanguages()[i])));
                    }
                } else {
                    var content = $("<div></div>").addClass('list_values');
                    content.appendTo(container);
                    content.append($("<div></div>").addClass(boxClass).append(createTable(obj["none"],null)));
                }

                function createTable(data, language) {
                    var table = $("<table></table>").addClass("literal_table");

                    // a single row
                    function createSingle(data) {
                        if(editable) {
                            var templ1 = multiline?$(text_view_template):$(literal_view_template);
                            var templ2 = multiline?$(text_edit_template):$(literal_edit_template);
                            templ2.find(".literal_input").val(data);
                            templ1.find(".literal_text").html(data.n3escapeToHMTL());
                            templ1.find(".literal_text").attr('original',data);
                            templ1.find(".literal_text").click(function() {
                                templ1.hide();
                                templ2.show();
                                templ2.find(".literal_input").focus();
                            });
                            templ1.find(".literal_edit").click(function() {
                                templ1.hide();
                                templ2.show();
                                templ2.find(".literal_input").focus();
                            });
                            templ2.find(".literal_save").click(function() {
                                var n3str = templ2.find(".literal_input").val().n3escape();
                                var htmlStr = templ2.find(".literal_input").val().n3escapeToHMTL();
                                skos.update.value(graph, current.uri, property, templ1.find(".literal_text").attr('original').n3escape(), n3str, undefined, language, function() {
                                    events.fire(new Event(EventCode.PROPERTY.UPDATED, {uri:current.uri,property:property,language:language,value:n3str}, source));
                                    events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri]}));
                                    templ1.find(".literal_text").html(htmlStr);
                                    templ1.find(".literal_text").attr('original',n3str);
                                    templ2.hide();
                                    templ1.show();
                                })
                            });
                            templ2.find(".literal_cancel").click(function() {
                                templ2.hide();
                                templ2.find(".literal_input").val(templ1.find(".literal_text").attr('original'));
                                templ1.show();
                            });
                            templ1.find(".literal_delete").click(function() {
                                if (confirm("delete property?")) {
                                    skos._delete.value(graph, current.uri, property, templ1.find(".literal_text").attr('original').n3escape(), language, function() {
                                        events.fire(new Event(EventCode.PROPERTY.DELETED, {uri:current.uri,property:property,language:language}, source));
                                        events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri]}));
                                        load();
                                    });
                                }
                            });
                            table.append(templ1);
                            table.append(templ2);
                        } else {
                            var templ = multiline?$(text_fix_template):$(literal_fix_template);
                            templ.find(".literal_text").text(data);
                            table.append(templ);
                        }

                    }

                    //to add new rows
                    function createAdd() {
                        var templ = $(add_template);
                        templ.find(".add").click(function() {
                            var lang = language?("("+language+")"):"";
                            var inp = prompt("Set value for '"+title+"' "+lang, "");
                            if (inp != null) {
                                if (inp == "") {
                                    popups.alert("Alert","value must not be empty");
                                } else {
                                    skos.set.value(graph,current.uri,property,inp,language,undefined,function(){
                                        events.fire(new Event(EventCode.PROPERTY.CREATED,{uri:current.uri,property:property,language:language,value:inp},source));
                                        events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri]}));
                                        load();
                                    });
                                }
                            }
                        });
                        table.append(templ);
                    }

                    //if value is not set and not editable
                    function createEmpty() {
                        var templ = $(literal_fix_template);
                        templ.find(".literal_text").text("N/A");
                        table.append(templ);
                    }

                    //organize display
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            createSingle(data[i]);
                        }
                        if (multivalue && editable) {
                            createAdd();
                        }
                    } else {
                        if(editable) {
                            createAdd();
                        } else {
                            createEmpty();
                        }
                    }
                    return table;
                }
            }
            return this;
        }

        /**
         * to display and edit uris
         * @param title
         * @param property
         * @param multivalue
         * @param editable
         */
        function UriPropertyView(title, property, multivalue, editable) {
            var box = $("<div></div>").addClass("content_box").append($("<h1></h1>").text(title));
            var container = $("<div></div>").appendTo(box);
            load();
            this.getBox = function() {
                return box;
            }
            this.getType = function() {
                return "uri";
            }
            this.getProperty = function() {
                return property;
            }
            this.reload = function() {
                load();
            }
            //get properties
            function load() {
                skos.list.values(graph, current.uri, property, write, function() {
                    popups.alert("Alert","could not list values " + property)
                });
            }

            //write editable row
            function writeEditable(table,data) {
                var templ1 = $(literal_view_template);
                var templ2 = $(literal_edit_template);
                templ2.find(".literal_input").val(data.value.value);
                templ1.find(".literal_text").text(data.value.value);
                templ1.find(".literal_text").click(function() {
                    templ1.hide();
                    templ2.show();
                    templ2.find(".literal_input").focus();
                });
                templ1.find(".literal_edit").click(function() {
                    templ1.hide();
                    templ2.show();
                    templ2.find(".literal_input").focus();
                });
                templ2.find(".literal_save").click(function() {
                    var oldT = templ1.find(".literal_text").text();
                    var newT = templ2.find(".literal_input").val();
                    //Check url
                    if (check(newT)) {
                        skos.update.uri(graph, current.uri, property, oldT, newT, function() {
                            events.fire(new Event(EventCode.PROPERTY.UPDATED, {uri:current.uri,property:property,value:newT}, source));
                            events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri]}));
                            templ1.find(".literal_text").text(newT);
                            templ2.hide();
                            templ1.show();
                        });
                    } else {
                        popups.alert("Alert",newT + " is not a valid url");
                    }
                });
                templ2.find(".literal_cancel").click(function() {
                    templ2.hide();
                    templ2.find(".literal_input").val(templ1.find(".literal_text").text());
                    templ1.show();
                });
                templ1.find(".literal_delete").click(function() {
                    if (confirm("delete property?")) {
                        skos._delete.uri(graph, current.uri, property, templ1.find(".literal_text").text(), function() {
                            events.fire(new Event(EventCode.PROPERTY.DELETED, {uri:current.uri,property:property}, source));
                            events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri]}));
                            load();
                        });
                    }
                });
                table.append(templ1);
                table.append(templ2);
            }

            //write table
            function write(data) {
                var table = $("<table></table>").addClass("literal_table");
                var subview = $("<div></div>").addClass("view_subbox").append(table);
                var content = $("<div></div>").addClass('list_values').append(subview);
                container.empty().append(content);
                if (data && data.length>0) {
                    if (editable) {
                        for (var i = 0; i < data.length; i++) {
                            writeEditable(table,data[i])
                        }
                        if(multivalue)createAdd();
                    } else {
                        for (var i = 0; i < data.length; i++) {
                            var templ = $(literal_fix_template);
                            templ.find(".literal_text").text(data[i].value.value);
                            table.append(templ);
                        }
                    }
                } else {
                    if(editable) {
                        createAdd();
                    } else {
                        var templ = $(literal_fix_template);
                        templ.find(".literal_text").text("N/A");
                        table.append(templ);
                    }
                }
                //to add new value
                function createAdd() {
                    var templ = $(add_template);
                    templ.find(".add").click(function() {
                        var inp = prompt("Set value for '" + title + "'");
                        if (inp != null) {
                            if (inp == "") {
                                popups.alert("Alert","value must not be empty");
                            } else if(check(inp)){
                                skos.set.uri(graph, current.uri, property, inp, function() {
                                    events.fire(new Event(EventCode.PROPERTY.CREATED, {uri:current.uri,property:property,value:inp}, source));
                                    events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri]}));
                                    load();
                                });
                            } else {
                                popups.alert("Alert",inp+" is not a valid url");
                            }
                        }
                    });
                    table.append(templ);
                }
            }

            //check if input is valid uri
            function check(value) {
                var urlregex = new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
                return urlregex.test(value);
            }

            return this;
        }

        /**
         * To show concepts (with dropable feature)
         * @param title
         * @param property
         * @param droppable
         * @param editable
         */
        function ConceptPropertyView(title,property,droppable,editable) {
            var box = $("<div></div>").addClass("content_box").append($("<h1></h1>").text(title));
            var container = $("<div></div>").appendTo(box);
            load();
            this.getBox = function() {
                return box;
            }
            this.getType = function() {
                return "concept";
            }
            this.getProperty = function() {
                return property;
            }
            this.reload = function() {
                load();
            }
            //get properties
            function load() {
                skos.list.concepts(graph, current.uri, property, write, function() {
                    popups.alert("Alert","could not list values " + property);
                });
            }

            //write a single row
            function writeSingle(table,data) {
                var title = data.title?data.title.value:data.uri.value;
                if(editable) {
                    var temp = $(concept_edit_template);
                    var c = temp.find(".concept_text");
                    c.text(title).click(function() {
                        events.fire(new Event(EventCode.CONCEPT.SELECTED,{uri:data.uri.value,type:'concept'},source));
                    });
                    c.attr("draggable",true).addClass("draggable");
                    c.get(0).addEventListener('dragstart', function(e){
                        events.fire(new Event(EventCode.CONCEPT.DRAGSTART));
                        this.style.opacity = '0.4';
                        //e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/uri-list', data.uri.value);
                        //e.dataTransfer.setData('parent', parent_uri);
                    }, false);
                    c.get(0).addEventListener('dragend', function(e){
                        events.fire(new Event(EventCode.CONCEPT.DRAGEND));
                        $('.dragover').removeClass('dragover');
                        $('.draggable').css('opacity',1);
                    }, false);

                    table.append(temp);
                    temp.find(".concept_delete").click(function(){
                        if(!confirm("delete relation")) return false;
                        if(property=="http://www.w3.org/2004/02/skos/core#broader") {
                            skos._delete.broaderNarrower(graph,data.uri.value,current.uri,function(){
                                events.fire(new Event(EventCode.RELATION.DELETED,{type:"broader",narrower:current.uri,broader:data.uri.value},source));
                                events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri,data.uri.value]}));
                            },function(){popups.alert("Alert","could not delete relation")});
                        } else if(property=="http://www.w3.org/2004/02/skos/core#narrower") {
                            skos._delete.broaderNarrower(graph,current.uri,data.uri.value,function(){
                                events.fire(new Event(EventCode.RELATION.DELETED,{type:"narrower",narrower:data.uri.value,broader:current.uri},source));
                                events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri,data.uri.value]}));
                            },function(){popups.alert("Alert","could not delete relation")});
                        } else if((property=="http://www.w3.org/2004/02/skos/core#hasTopConcept")) {
                            skos._delete.topConcept(graph,current.uri,data.uri.value,function(){
                                events.fire(new Event(EventCode.RELATION.DELETED,{type:"topConcept",parent:current.uri,child:data.uri.value},source));
                                events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri,data.uri.value]}));
                            },function(){popups.alert("Alert","could not delete relation")});
                        } else if((property=="http://www.w3.org/2004/02/skos/core#related")) {
                            skos._delete.related(graph,current.uri,data.uri.value,function(){
                                events.fire(new Event(EventCode.RELATION.DELETED,{type:"related",concept1:current.uri,concept2:data.uri.value},source));
                                events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri,data.uri.value]}));
                                load();
                            },function(){popups.alert("Alert","could not delete relation")});
                        }  else {
                            skos._delete.uri(graph,current.uri,property,data.uri.value,function(){
                                //TODO check event
                                events.fire(new Event(EventCode.RELATION.CREATED,{type:property,concept1:current.uri,concept2:data.uri.value},source));
                                events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri,data.uri.value]}));
                                load();
                            },function(){popups.alert("Alert","could not create relation")});
                        }
                    })
                } else {
                    var temp = $(concept_fix_template);
                    var c = temp.find(".concept_text");
                    c.text(title).click(function() {
                        events.fire(new Event(EventCode.CONCEPT.SELECT,current,source));
                    });
                    c.attr("draggable",true).addClass("draggable");
                    c.get(0).addEventListener('dragstart', function(e){
                        events.fire(new Event(EventCode.CONCEPT.DRAGSTART));
                        this.style.opacity = '0.4';
                        //e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/uri-list', data.uri.value);
                        //e.dataTransfer.setData('parent', parent_uri);
                    }, false);
                    c.get(0).addEventListener('dragend', function(e){
                        events.fire(new Event(EventCode.CONCEPT.DRAGEND));
                        $('.dragover').removeClass('dragover');
                        $('.draggable').css('opacity',1);
                    }, false);

                    table.append(temp);
                }
            }

            //write table
            function write(data) {
                var table = $("<table></table>").addClass("literal_table");
                var subview = $("<div></div>").addClass("view_subbox").append(table);
                if(droppable) {
                    $("<div><i class='icon-share-alt'></i></div>").addClass("droppable").appendTo(subview);
                    subview.addClass("view_uri_subbox");
                }
                var content = $("<div></div>").addClass('list_values').append(subview);
                container.empty().append(content);
                if (data && data.length>0) {
                    for (var i = 0; i < data.length; i++) {
                        writeSingle(table,data[i]);
                    }
                }

                //implement drop actions
                if(droppable) {
                    subview.get(0).addEventListener('dragenter', function(e) {
                        content.addClass('boxDragover');
                    }, false);
                    subview.get(0).addEventListener('dragover', function(e) {
                        if (e.preventDefault) {e.preventDefault();}
                        //e.dataTransfer.dropEffect = 'move';
                        return false;
                    }, false);
                    subview.get(0).addEventListener('dragleave', function(e) {
                        content.removeClass('boxDragover');
                    }, false);
                    subview.get(0).addEventListener('drop', function(e) {
                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }
                        var uri = e.dataTransfer.getData('text/uri-list');
                        e.preventDefault();
                        //prevent other drops
                        if(e.dataTransfer.getData('text/plain')) {
                            popups.info("Not Allowed","This kind of drop is not allowed");
                            return false;
                        }
                        if(!uri || uri=="") {
                            popups.info("Not Allowed","This kind of drop is not allowed");
                            return false;
                        }

                        var parent = e.dataTransfer.getData('parent');
                        if(property=="http://www.w3.org/2004/02/skos/core#broader") {
                            skos.set.broaderNarrower(graph,uri,current.uri,function(){
                                events.fire(new Event(EventCode.RELATION.CREATED,{type:"broader",broader:uri,narrower:current.uri},source));
                                events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri,data.uri]}));
                            },function(){popups.alert("Alert","could not set relation")});
                        } else if(property=="http://www.w3.org/2004/02/skos/core#narrower") {
                            skos.set.broaderNarrower(graph,current.uri,uri,function(){
                                events.fire(new Event(EventCode.RELATION.CREATED,{type:"narrower",narrower:uri,broader:current.uri},source));
                                events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri,data.uri]}));
                            },function(){popups.alert("Alert","could not set relation")});
                        } else if((property=="http://www.w3.org/2004/02/skos/core#hasTopConcept")) {
                            skos.set.topConcept(graph,current.uri,uri,function(){
                                events.fire(new Event(EventCode.RELATION.CREATED,{type:"topConcept",parent:current.uri,child:uri},source));
                                events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri,data.uri]}));
                            },function(){popups.alert("Alert","could not set relation");});
                        } else if((property=="http://www.w3.org/2004/02/skos/core#related")) {
                            skos.set.related(graph,current.uri,uri,function(){
                                events.fire(new Event(EventCode.RELATION.CREATED,{type:"related",concept1:current.uri,concept2:uri},source));
                                events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri,data.uri]}));
                                load();
                            },function(){popups.alert("Alert","could not create relation")});
                        }  else {
                            skos.set.uri(graph,current.uri,property,uri,function(){
                                events.fire(new Event(EventCode.RELATION.CREATED,{type:property,concept1:current.uri,concept2:uri},source));
                                events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[current.uri,data.uri]}));
                                load();
                            },function(){popups.alert("Alert","could not create relation")});
                        }
                        content.removeClass('boxDragover');
                        return false;
                    }, false);
                }
            }
            return this;
        }
    }

    /**
     * Popups
     * @param container
     */
    function Popups(container,background) {
        var graph;
        var self = this;
        //bind events
        events.bind(EventCode.GRAPH.CREATE,function(){
            new SelectGraphPopup();
        })
        events.bind(EventCode.CONCEPT.CREATE,function(event){
            new CreateConceptPopup(event.data);
        })
        events.bind(EventCode.SETTINGS.UPDATE,function(){
            new SettingsPopup();
        })
        events.bind(EventCode.GRAPH.SELECTED,function(e){
            graph=e.data.uri;
        });
        events.bind(EventCode.CONCEPT.DELETE,function(event){
            var deleteGraph = function() {
                skos._delete.graph();
            }

            var deleteSchemeAll = function() {
                alert("Not implemented yet");close();
            }

            var deleteSchemeOnly = function() {
                skos.list.incomings(graph,event.data.uri,function(data){
                    skos._delete.concept(graph,event.data.uri,function(){
                        events.fire(new Event(EventCode.GRAPH.SELECTED,{uri:graph},self));
                        var list = [];
                        for(var i in data) {
                            if(data[i].uri.value != event.data.uri) {
                                list.push(data[i].uri.value);
                            }
                        }
                        events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:list}));
                        events.fire(new Event(EventCode.SCHEME.DELETED,{uri:event.data.uri}));
                        close();
                    },function(){popups.alert("Alert","Could not delete scheme!")});
                },function(){popups.alert("Alert","Could not delete scheme!")});
            }

            var deleteConceptAll = function() {
                skos.list.incomings(graph,event.data.uri,function(data){
                    skos._delete.concept(graph,event.data.uri,function(){
                        events.fire(new Event(EventCode.GRAPH.SELECTED,{uri:graph},self));
                        var list = [];
                        for(var i in data) {
                            if(data[i].uri.value != event.data.uri) {
                                list.push(data[i].uri.value);
                            }
                        }
                        events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:list}));
                        events.fire(new Event(EventCode.CONCEPT.DELETED,{uri:event.data.uri}));
                        close();
                    },function(){popups.alert("Alert","Could not delete scheme!")});
                },function(){popups.alert("Alert","Could not delete scheme!")});
            }

            var deleteConceptRelations = function() {
                skos.list.incomings(graph,event.data.uri,function(data){
                    skos._delete.skosRelations(graph,event.data.uri,function(){
                        events.fire(new Event(EventCode.GRAPH.SELECTED,{uri:graph},self));
                        var list = [];
                        for(var i in data) {
                            if(data[i].uri.value != event.data.uri) {
                                list.push(data[i].uri.value);
                            }
                        }
                        list.push(event.data.uri);
                        events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:list}));
                        close();
                    },function(){popups.alert("Alert","Could not delete scheme!")});
                },function(){popups.alert("Alert","Could not delete scheme!")});
            }

            switch(event.data.type) {
                case 'graph':
                    new Confirm("Delete Graph","Deleting graph will delete all underlying schemes and concepts!",
                        [{"title":"Delete Graph","action":deleteGraph}]
                    );break;
                case 'scheme':
                    new Confirm("Delete Scheme","Delete scheme and all concepts or delete the scheme only?",
                        [{"title":"Delete all","action":deleteSchemeAll},{"title":"Delete scheme only","action":deleteSchemeOnly}]
                    );break;
                default:
                    new Confirm("Delete Concept","Delete concept with all properties or just remove concept from SKOS Tree?",
                        [{"title":"Delete Concept","action":deleteConceptAll},{"title":"Remove Concept","action":deleteConceptRelations}]
                    );
            };

            function reload() {

            }
        });
        this.init = function() {

        }
        this.alert = function(title,message) {
            return new Alert(title,message);
        }
        this.confirm = function(title,message,func) {
            return new Confirm(title,message,func);
        }
        this.info = function(title,message) {
            return new Info(title,message);
        }
        this.custom = function(title) {
            return new CustomPopup(title);
        }

        //func is an array of objects {title:t,action:f}
        function Confirm(title,message,func) {
            var _conf_self = this;
            this.onclose = undefined;

            $("#"+background).show();
            $("#" + container).html(HTML_TEMPLATES.popups.confirm);
            $("#popup_title").text(title);
            $("#popup_message").html(message);
            $("#popup_close").click(function() {
                close();
            });
            $("#popup_cancel").click(function() {
                if(_conf_self.onclose) _conf_self.onclose();
                close();
            });
            var buttons = $("#popup_button_list");
            for(var i in func) {
                var b = buildButton(func[i]);
                b.appendTo(buttons);
            }
            $("#popup_cancel").focus();

            function buildButton(func) {
                var b = $("<button></button>").text(func.title).click(function(){
                    func.action();
                    close();
                });
                return b;
            }

        }

        function CustomPopup(title) {

            var self = this;

            $("#popup").html(HTML_TEMPLATES.popups.custom);
            $("#popup_title").text(title);
            $("#popup_close").click(function(){
                self.close();
            })

            this.open = function() {
                $("#"+background).show();
                $("#popup_custom").show();
            }

            this.setContent = function(jquery_obj) {
                $("#popup_content").html(jquery_obj);
            }

            this.close = function() {
                close();
            }
        }

        function Alert(title,message,action) {
            $("#"+background).show();
            $("#" + container).html(HTML_TEMPLATES.popups.alert);
            $("#popup_title").text(title);
            $("#popup_message").html(message);
            $("#popup_close").click(function() {
                close();
                if (action)action();
            });
            $("#popup_cancel").click(function() {
                close();
                if (action)action();
            });
            $("#popup_cancel").focus();
        }

        function Info(title,message,action) {
            $("#"+background).show();
            $("#" + container).html(HTML_TEMPLATES.popups.info);
            $("#popup_title").text(title);
            $("#popup_message").html(message);
            $("#popup_close").click(function() {
                close();
                if (action)action();
            });
            $("#popup_cancel").click(function() {
                close();
                if (action)action();
            });
            $("#popup_cancel").focus();
        }

        /**
         * Create a concept
         * @param data weather it should be a scheme, a top concept or a concept
         */
        function CreateConceptPopup(data) {
            $("#"+background).show();
            $("#" + container).html(HTML_TEMPLATES.popups.concept);
            $("#popup_title").text("Create " + getType(data.type));
            $("#popup_close").click(function() {
                close();
            });
            $("#popup_create").click(function() {
                if ($("#popup_input").val() == "") {
                    popups.info("Info", "name is mandatory");
                } else {
                    var uri = OPTIONS.BASE_URI + String.random(8);
                    var title = $("#popup_input").val();
                    switch (data.type) {
                        case 'graph':
                            createScheme(uri, title);
                            break;
                        case 'scheme':
                            createTopConcept(data.uri, uri, title);
                            break;
                        default:
                            createConcept(data.uri, uri, title);
                            break;
                    }
                }
            });

            $("#popup_input").focus();
            $('#popup_input').keydown(function(e){
                if(e.which == 13){
                    $("#popup_create").click();
                    return false;
                }
            });


            function createScheme(uri,title) {
                skos.create.scheme(graph,uri,title,function() {
                    events.fire(new Event(EventCode.SCHEME.CREATED, {parent:graph,uri:uri,type:'scheme'}));
                    events.fire(new Event(EventCode.GRAPH.UPDATED, {uris:[graph]}));
                    close();
                }, function() {
                    popups.alert("Alert","could not create concept",close);
                });
            }
            function createTopConcept(parent,uri,title) {
                skos.create.top_concept(graph,parent,uri,title,function() {
                    events.fire(new Event(EventCode.CONCEPT.CREATED, {parent:parent,uri:uri,type:'top-concept'}));
                    events.fire(new Event(EventCode.SCHEME.UPDATED, {uris:[parent]}));
                    close();
                }, function() {
                    popups.alert("Alert","could not create concept",close);
                });
            }
            function createConcept(parent,uri,title) {
                skos.create.concept(graph,parent,uri,title,function() {
                    events.fire(new Event(EventCode.CONCEPT.CREATED, {parent:parent,uri:uri,type:'concept'}));
                    events.fire(new Event(EventCode.CONCEPT.UPDATED,{uris:[parent]}));
                    close();
                }, function() {
                    popups.alert("Alert","could not create concept",close);
                });
            }
            //get the type that should be generated
            function getType(parentType) {
                switch(parentType) {
                    case 'graph':return 'scheme';
                    case 'scheme':return 'top-concept';
                    default:return 'concept';
                }
            }
        }

        /**
         * Create or select a graph
         */
        function SelectGraphPopup() {
            $("#"+background).show();
            $("#" + container).html(HTML_TEMPLATES.popups.graph);
            $("#popup_close").click(function() {
                close();
            });
            $("#popup_create").click(function() {
                if ($("#popup_input").val() == "") {
                    popups.info("Info", "name is mandatory");
                } else {
                    var uri = OPTIONS.BASE_URI + String.random(8);
                    var title = $("#popup_input").val();
                    skos.create.graph(uri, title, function() {
                        events.fire(new Event(EventCode.GRAPH.CREATED, {uri:uri}));
                        events.fire(new Event(EventCode.GRAPH.SELECTED, {uri:uri}));
                        close();
                    }, function() {
                        popups.alert("Alert", "could not create graph", close);
                    });
                }
            });

            $("#popup_input").focus();
            $('#popup_input').keydown(function(e){
                if(e.which == 13){
                    $("#popup_create").click();
                    return false;
                }
            });

            //list existing graphs
            skos.list.graphs(function(data) {
                $("#popup_loading").hide();
                function appendItem(item) {
                    var title = (item.title) ? item.title.value : item.uri.value;
                    var button = $("<button></button>").text(title).click(function() {
                        events.fire(new Event(EventCode.GRAPH.SELECTED, {uri:item.uri.value}));
                        close();
                    });
                    $("#popup_list").append($("<li></li>").append(button));
                }

                for (var i = 0; i < data.length; i++) {
                    appendItem(data[i]);
                }
                if (data.length == 0) {
                    $("#popup_list").hide();
                    $("#popup_empty_list").show();
                }
            }, function() {
                popups.alert("Alert", "could not list graphs", close);
            });
        }

        /**
         * Settings for graph
         * @param current
         */
        function SettingsPopup() {

            var updated = false;
            var timeout;

            $("#"+background).show();
            $("#" + container).html(HTML_TEMPLATES.popups.settings);
            $(".popup_cancel").click(function() {
                clearTimeout(timeout);
                close();
                if(updated)events.fire(new Event(EventCode.SETTINGS.UPDATED));
            });
            //write data
            init();

            function init() {

                $("#settings_language_firstLanguageSelect").change(function(){
                    setFirstLang($("#settings_language_firstLanguageSelect").val());
                });
                $("#settings_language_newLanguageButton").click(function(){
                    var n = $("#settings_language_newLanguageInput").val();
                    if(n=="") writeInfo("language may not be empty");
                    else {
                        addLang(n);
                    }
                });
                write();
            }

            function write() {
                var lang = settings.getLanguage();
                var langs = settings.getLanguages();
                function writeLI(l){
                    var li = $("<li><span>"+l+"</span></li>").append($("<button class='button'></button>").html("<i class='icon-minus'></i>").click(function(){
                        removeLang(l);
                    }));
                    return li;
                }
                $("#settings_language_list").empty();
                for(var i in langs) {
                    $("#settings_language_list").append(writeLI(langs[i]));
                }
                $("#settings_language_firstLanguageSelect").empty();
                for(var i in langs) {
                    if(lang==langs[i]) $("#settings_language_firstLanguageSelect").append("<option selected='selected'>"+langs[i]+"</option>");
                    else  $("#settings_language_firstLanguageSelect").append("<option>"+langs[i]+"</option>");
                }
            }

            function removeLang(lang) {
                if(settings.getLanguages().length==1) {
                    writeInfo("graph must support at least one language"); return;
                }
                if(lang==settings.getLanguage()) {
                    writeInfo("first language cannot be deleted"); return;
                }
                var ls = settings.getLanguages();
                var ls2 = [];
                for(i in ls) {
                    if(ls[i]!=lang) ls2.push(ls[i]);
                }
                skos.set.graphLanguages(graph,ls2,function(){
                    events.fire(new Event(EventCode.GRAPH.UPDATED,{uris:[graph]}));
                    settings.setLanguages(ls2);
                    updated = true;
                    write();
                },function(){alert("could not set languages")});
            }

            function setFirstLang(lang) {
                skos.set.graphFirstLanguage(graph,lang,function(){
                    events.fire(new Event(EventCode.GRAPH.UPDATED,{uris:[graph]}));
                    updated = true;
                },function(){alert("could not set language")});
            }

            function addLang(lang) {
                var ls = settings.getLanguages();
                for(i in ls) {
                    if(ls[i]==lang) return;
                }
                ls.push(lang);
                skos.set.graphLanguages(graph,ls,function(){
                    events.fire(new Event(EventCode.GRAPH.UPDATED,{uris:[graph]}));
                    settings.setLanguages(ls);
                    updated = true;
                    write();
                },function(){alert("could not set languages")});
            }

            function writeInfo(text) {
                $("#settings_language_info").text(text);
                timeout = setTimeout(function(){$("#settings_language_info").empty()},2000);
            }
        }

        function close(){
            $("#" + container).empty();
            $("#"+background).hide();
        }
    }

    /**
     * Supports drag scrolling
     */
    function DragScroller() {

        var speed = 50;

        var down;
        var up;

        var active = false;
        var direction = undefined;

        events.bind(EventCode.CONCEPT.DRAGSTART,function(e){
            add();
        });
        events.bind(EventCode.CONCEPT.DRAGEND,function(e){
            active = false;
            direction = undefined;
            remove();
        });

        function add() {
            //create
            up = $("<div style='height:20px;width:100%;position:fixed;50%;z-index:1001;top:0;display:none'></div>").appendTo('body');
            up.get(0).addEventListener('dragenter',function(){
                active = true;
                direction = 'top';
                scroll();
            });
            up.get(0).addEventListener('dragleave',function(){
                active = false;
                direction = undefined;
            });
            down = $("<div style='height:20px;width:100%;position:fixed;z-index:1001;bottom:0;display: none'></div>").appendTo('body');
            down.get(0).addEventListener('dragenter',function(){
                active = true;
                direction = 'bottom';
                scroll();
            });
            down.get(0).addEventListener('dragleave',function(){
                active = false;
                direction = undefined;
            });
            //display
            if($(window).scrollTop()>0) up.show();
            if($(document).height()>($(window).height()+$(window).scrollTop()+1)) down.show();
        }

        function remove() {
            down.remove();
            up.remove();
        }

        function scroll() {
            if(!active) return;
            if(direction=='top') {
                $(window).scrollTop($(window).scrollTop()-speed);
                if($(document).height()>($(window).height()+$(window).scrollTop())) down.show();
                if($(window).scrollTop()==0) up.hide();
                else setTimeout(scroll,50);
            } else {
                $(window).scrollTop($(window).scrollTop()+speed);
                if($(window).scrollTop()>0) up.show();
                if($(document).height()==($(window).height()+$(window).scrollTop()+1)) down.hide();
                else setTimeout(scroll,50);
            }
        }
    }
}

/**
 * String methods
 */
String.prototype.md5 = function(){return hex_md5(this)}
String.random = function (string_length) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}
String.prototype.bool = function() { return (/^true$/i).test(this);};
String.prototype.n3escape = function() {console.log(1);return this.replace(/(\r\n|\n|\r)/gm,"\\n");}
String.prototype.n3escapeToHMTL = function() {return this.replace(/(\r\n|\n|\r)/gm,"<br/>");}
