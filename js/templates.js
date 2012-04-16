var HTML_TEMPLATES = {
    search: '<div id="search_div">' +
            '   <span id="search_label">Search:</span><input id="search_input" type="text"><span id="search_loader" style="display: none">&nbsp;</span>' +
            '   <div style="display: none" id="search_suggestion"></div>' +
            '</div>',
    about:  '<style type="text/css">' +
            '   #about_info_table {margin-left: 10px;}' +
            '   #about_info_table td{text-align: left;}' +
            '   #about_info_table td.title{font-weight: bold;width: 100px;vertical-align: top;}' +
            '</style>' +
            '<h2 style="margin-bottom:5px;"><span id="about-skosjs">&nbsp;</span></h2>' +
            '<h3 style="margin-top:0;">A SPARQL 1.1 based SKOS Editor</h3>' +
            '<table id="about_info_table">' +
            '   <tr><td class="title">Version</td><td>0.2.0 (alpha)</td></tr>' +
            '   <tr><td class="title">Author</td><td>Thomas Kurz</td></tr>' +
            '   <tr><td class="title">Owner</td><td>Salzburg Research Forschungsgesellschaft</td></tr>' +
            '   <tr><td class="title">Contact</td><td>thomas.kurz@salzburgresearch.at</td></tr>' +
            '   <tr><td class="title">License</td><td>Apache License, Version 2.0</td></tr>' +
            '</table>',
    views:  {
        resource : {
            basic:  '<style type="text/css">' +
                    '   .view_header .header_uri{margin: 5px;padding: 5px 0 0;font-size: 12px;font-weight: normal;}' +
                    '   #view_header_uri{color: gray;font-style: italic;padding-top:3px;}' +
                    '</style>' +
                    '<div class="view_header">' +
                    '   <h1 class="header_uri"><span id="view_header_rdf_link" title="Open in Linked Data Browser">&nbsp;</span>&nbsp;<span id="view_header_uri"></span>&nbsp;<button class="button" id="view_header_uri_delete"><i class="icon-trash"></i></button></h1>' +
                    '</div>' +
                    '<div id="view_content" style="margin:10px 0 0">' +
                    '   <div style="float:left;width: 50%">' +
                    '       <div  id="view_content_left" class="content"></div>' +
                    '   </div>' +
                    '   <div style="float:left;width: 50%">' +
                    '       <div id="view_content_right" class="content"></div>' +
                    '   </div>' +
                    '   <div style="clear:both;"></div>' +
                    '</div>',
            add:    '<tr><td colspan="3">' +
                    '   <div style="width:100%;height:18px;text-align:right;">' +
                    '       <button class="button add"><i class="icon-plus"></i></button>' +
                    '   </div>' +
                    '</td></tr>',
            concept: {
                edit:   '<tr class="view_display">' +
                        '   <td style="width:30px;"></td>' +
                        '   <td><div style="width: 100%;height:23px;padding-top:3px;">' +
                        '       <div class="concept_text"></div>' +
                        '   </div></td>' +
                        '   <td style="width:45px;"><div style="width:100%;height:21px;">' +
                        '       <button class="button concept_delete"><i class="icon-trash"></i></button>' +
                        '   </div></td>' +
                        '</tr>',
                fix:    '<tr class="view_display">' +
                        '   <td style="width:30px;"></td>' +
                        '   <td><div style="width: 100%;height:23px;padding-top:3px;"><div class="concept_text"></div></div></td>' +
                        '   <td style="width:40px;"></td>' +
                        '</tr>'
            },
            literal : {
                view:   '<tr class="view_display">' +
                        '   <td><div style="width: 100%;height:25px;"><div style="border: 1px dashed #d3d3d3;height:16px;margin-right: 3px;padding-left:2px;cursor:text">' +
                        '       <div class="literal_text" style="width:100%;border:none;margin:0;font-size: 12px;padding-top: 2px;overflow: auto;"></div>' +
                        '       </div></div>' +
                        '   </td>' +
                        '   <td style="width:40px;">' +
                        '       <div style="width:100%;height:23px;">' +
                        '           <button class="button literal_edit"><i class="icon-pencil"></i></button>' +
                        '           <button class="button literal_delete"><i class="icon-trash"></i></button>' +
                        '       </div>' +
                        '   </td>' +
                        '</tr>',
                edit:   '<tr class="view_edit" style="display:none">' +
                        '   <td>' +
                        '       <div style="width: 100%;height:25px;"><div style="overflow:hidden;border: 2px dotted #FFC414;height:16px;margin-right: 3px;padding-left:1px;overflow: hidden">' +
                        '           <input class="literal_input" type="text" style="width:100%;border:none;margin:0;font-size: 12px;margin-top: -1px">' +
                        '       </div></div>' +
                        '   </td>' +
                        '   <td style="width:40px;">' +
                        '       <div style="width:100%;height:23px;">' +
                        '           <button class="button literal_save"><i class="icon-upload-alt"></i></button>' +
                        '           <button class="button literal_cancel"><i class="icon-remove"></i></button>' +
                        '       </div>' +
                        '   </td>' +
                        '</tr>',
                fix:    '<tr class="view_display">' +
                        '   <td>' +
                        '       <div style="width: 100%;height:25px;"><div style="border: 1px dashed #d3d3d3;height:16px;margin-right: 3px;padding-left:2px">' +
                        '           <div class="literal_text" style="width:100%;border:none;margin:0;font-size: 12px;padding-top: 3px;overflow: auto;"></div>' +
                        '       </div></div>' +
                        '   </td>' +
                        '</tr>'
            },
            text    : {
                view:   '<tr class="view_display">' +
                        '   <td>' +
                        '       <div style="width: 100%;height:86px;"><div style="border: 1px dashed #d3d3d3;height:83px;margin-right: 3px;padding-left:2px;cursor:text;overflow: auto;">' +
                        '           <div class="literal_text" style="width:100%;border:none;margin:0;font-size: 12px;padding-top: 3px;overflow: auto;min-height:77px"></div>' +
                        '       </div></div>' +
                        '   </td>' +
                        '   <td style="width:40px;vertical-align: bottom;">' +
                        '       <div style="width:100%;height:18px;">' +
                        '           <button class="button literal_edit"><i class="icon-pencil"></i></button>' +
                        '           <button class="button literal_delete"><i class="icon-trash"></i></button>' +
                        '       </div>' +
                        '   </td>' +
                        '</tr>',
                edit:   '<tr class="view_edit" style="display:none">' +
                        '   <td><div style="width: 100%;"><div style="border: 2px dotted #FFC414;margin-right: 3px;padding-left:1px;overflow: auto;">' +
                        '       <textarea rows="5" class="literal_input" type="text" style="width:100%;border:none;margin:0;font-size: 12px;padding-top: 1px;resize: none;font-family: helvetica,arial,clean,sans-serif;padding-top:2px;"></textarea>' +
                        '   </div></div></td>' +
                        '   <td style="width:40px;vertical-align: bottom;">' +
                        '       <div style="width:100%;height:18px;">' +
                        '           <button class="button literal_save"><i class="icon-upload-alt"></i></button>' +
                        '           <button class="button literal_cancel"><i class="icon-remove"></i></button>' +
                        '       </div>' +
                        '   </td>' +
                        '</tr>',
                fix:    '<tr class="view_display">' +
                        '   <td>' +
                        '       <div style="width: 100%;height:101px;"><div style="border: 1px dashed #d3d3d3;height:98px;margin-right: 3px;padding-left:2px;overflow:auto;">' +
                        '           <div class="literal_text" style="width:100%;border:none;margin:0;font-size: 14px;padding-top: 3px;overflow: auto;min-height:86px"></div>' +
                        '       </div></div>' +
                        '   </td>' +
                        '</tr>'
            }
        }
    },
    popups: {
        "custom" :  '<style type="text/css">' +
                        '   h1#popup_title {margin:0;padding:6px;background-color:#FFC414;color: black;font-size: 14px;border-bottom: 1px solid black;border-top: 1px solid #d3d3d3;border-right: 1px solid #d3d3d3;border-left: 1px solid #d3d3d3;}' +
                        '</style>' +
                        '<div id="popup_custom" style="width:500px;margin-left:-250px;top:100px;border:1px solid black;background-color:white;position:relative;display:none">' +
                        '   <h1 id="popup_title"></h1>' +
                        '   <span id="popup_close">&nbsp;</span>' +
                        '   <div id="popup_content" style="text-align: center;padding:10px 0;">' +
                        '   </div>' +
                        '</div>',
        alert:  '<style type="text/css">' +
                '   h1#popup_title {margin:0;font-size: 14px;border-bottom: 1px solid black;border-top: 1px solid #d3d3d3;border-right: 1px solid #d3d3d3;border-left: 1px solid #d3d3d3;}' +
                '</style>' +
                '<div style="width:300px;margin-left:-150px;top:100px;border:1px solid black;background-color:white;position:relative">' +
                '   <h1 id="popup_title" class="alert_title">Alert</h1>' +
                '   <span id="popup_close">&nbsp;</span>' +
                '   <div style="text-align: center;padding:10px 0;">' +
                '       <div style="margin-right: 10px;font-size: 12px" id="popup_message"></div>' +
                '       <div style="margin-top:10px;width: 100%;">' +
                '           <button id="popup_cancel">OK</button>' +
                '       </div>' +
                '   </div>' +
                '</div>',
        concept:'<style type="text/css">' +
                '   h1#popup_title {margin:0;padding:6px;background-color:#FFC414;color: black;font-size: 14px;border-bottom: 1px solid black;border-top: 1px solid #d3d3d3;border-right: 1px solid #d3d3d3;border-left: 1px solid #d3d3d3;}' +
                '</style>' +
                '<div style="width:500px;margin-left:-250px;top:100px;border:1px solid black;background-color:white;position:relative">' +
                '   <h1 id="popup_title">Create Concept</h1>' +
                '   <span id="popup_close">&nbsp;</span>' +
                '   <div style="text-align: center;padding:10px 0;">' +
                '       <span style="margin-right: 10px;font-size: 12px">Title:</span>' +
                '       <input style="width:390px" type="text" id="popup_input">' +
                '       <div style="margin-top:10px;width: 100%;">' +
                '           <button id="popup_create">Create</button>' +
                '       </div>' +
                '   </div>' +
                '</div>',
        graph:  '<style type="text/css">' +
                '   .popup h1{margin:0;padding:6px;background-color:#FFC414;color: black;font-size: 14px;border-bottom: 1px solid black;border-top: 1px solid #d3d3d3;border-right: 1px solid #d3d3d3;border-left: 1px solid #d3d3d3;}' +
                '   .popup h2 {font-size: 14px;padding-left: 10px;font-weight: normal;margin: 7px 0 1px;}' +
                '   .popup ul {margin: 0;padding: 0;text-align: left;list-style-type: none;}' +
                '   .popup .info {color:red;font-size:10px;display: block;margin-top: 5px;}' +
                '</style>' +
                '<div class="popup" style="width:500px;margin-left:-250px;top:100px;border:1px solid black;background-color:white;position:relative">' +
                '   <h1>Select / Create Graph</h1>' +
                '   <span id="popup_close">&nbsp;</span>' +
                '   <h2>Select existing Graph:</h2>' +
                '   <div style="width: 100%;padding: 5px;max-height:200px;overflow-y:auto;text-align: center">' +
                '       <span id="popup_loading">&nbsp;</span>' +
                '       <ul id="popup_list" class="project_list"></ul>' +
                '       <span id="popup_empty_list" style="display:none;font-size: 12px;">No existing Graphs</span>' +
                '   </div>' +
                '   <hr style="margin:10px;">' +
                '   <h2>Create new Graph:</h2>' +
                '   <div style="margin:10px 0;width: 100%;text-align: center;font-size: 12px">' +
                '       <span style="margin-right: 5px">Title:</span>' +
                '       <input style="width:390px" type="text" id="popup_input"><br>' +
                '       <button style="margin-top:10px" id="popup_create">Create</button><br>' +
                '   </div>' +
                '</div>',
        info:   '<style type="text/css">' +
                '   h1#popup_title {margin:0;font-size: 14px;border-bottom: 1px solid black;border-top: 1px solid #d3d3d3;border-right: 1px solid #d3d3d3;border-left: 1px solid #d3d3d3;}' +
                '</style>' +
                '<div style="width:300px;margin-left:-150px;top:100px;border:1px solid black;background-color:white;position:relative">' +
                '   <h1 id="popup_title" class="info_title">Create Concept</h1>' +
                '   <span id="popup_close">&nbsp;</span>' +
                '   <div style="text-align: center;padding:10px 0;">' +
                '       <div style="margin-right: 10px;font-size: 12px" id="popup_message"></div>' +
                '       <div style="margin-top:10px;width: 100%;">' +
                '           <button id="popup_cancel">OK</button>' +
                '       </div>' +
                '   </div>' +
                '</div>',
        settings:''
    }
}