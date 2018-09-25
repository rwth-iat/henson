var domainViewPlugIn = new function () {

    this.name = 'domain-view'; // internal name for plugin, also creates a DOM element with ID
    this.title= 'Domain View'; // title of the tab
    this.author= 'Christoph Sachsenhausen'; // your name here
    this.activate= {
      always: true
    }; // activate condition, implemented: {exactClass: 'partial/path/of/class'}, {baseClass: 'partial/name/of/baseclass' or {always: true}
    this.foreground= true; // switch plugin to foreground on activation?
    this.refresh= true; // reload data on refresh?
    this.destroy= false; // should the plugin be destroyed if the activation condition does not match anymore?

    this.checkConditions = function () { // startup function that checks conditions before running the plugin
        return true;
    };

    this.run = function (activeElementPath, data) { // custom plugin code, DOM elements are attachable to the created ID: $('#'+this.name).append(newElement);
        // empty the table
        if ($.fn.dataTable.isDataTable('#view-table')) {
            t = $('#view-table').DataTable();
        } else {
            t = $('#view-table').DataTable({
                "columns": [
                    null,
                    null,
                    {
                        "data": null,
                        "defaultContent": "<button>Edit</button>"
                    },
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                ]
            });
        }
        t.rows().remove().draw();
        path = data.getElementsByTagName('path')[0].textContent;
        // empty cache at this path
        Application.objCache.removeChildren(path);
        // append elements to table
        appendRows(data.getElementsByTagName('VariableEngProps'), path, 'variable');
        appendRows(data.getElementsByTagName('LinkEngProps'), path, 'link');
        appendRows(data.getElementsByTagName('DomainEngProps'), path, 'domain');
        $('#container').css('display', 'block');
        t.columns.adjust().draw();
        
        /*input change value*/
        $(".varvalinp").keyup(function (event) {
            if (event.keyCode == 13) {
                $(this).trigger("setVariable", {
                    path: event.currentTarget.id,
                    newValue: event.currentTarget.value
                });

            }
        });
    };

    /**
     * Adds rows to main view table and registers event handlers (click on row)
     *
     * @param list List of data items
     * @param type Data Type: variable, link or domain
     */
    appendRows = function (list, path, type) {
        // loop through list and append items as rows
        for (var i = 0; i < list.length; i++) {
            var l = [];
            l["identifier"] = list[i].getElementsByTagName(
                "identifier"
            )[0].textContent;
            l["comment"] = list[i].getElementsByTagName("comment")[0].textContent;
            l["access"] = list[i].getElementsByTagName("access")[0].textContent;
            var seperator = l["access"].indexOf("part") == -1 ? "/" : ".";

            var d = new Date(
                list[i].getElementsByTagName("creationtime")[0].textContent
            );
            l["creation"] = d.toLocaleString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });

            l["semantics"] = list[i].getElementsByTagName("semantics")[0].textContent;

            // Type specific values, pretty output, icons
            if (type == "domain") {
                l["type"] = "Domain";
                l["class"] = list[i].getElementsByTagName(
                    "classIdentifier"
                )[0].textContent;
                l["path"] =
                    path +
                    (path == "/" || path == "/vendor" ? "" : seperator) +
                    encodeURI(l["identifier"]);
                l["icon"] = "fa fa-folder";
                l["techUnit"] = undefined;
            } else if (type == "variable") {
                l["type"] = "Variable";
                l["class"] = list[i].getElementsByTagName("type")[0].textContent;
                l["path"] =
                    path +
                    (path == "/vendor" ? "/" : seperator) +
                    encodeURI(l["identifier"]);
                l["identifier"] =
                    list[i].getElementsByTagName("identifier")[0].textContent;
                // (path == "/vendor" ? "" : seperator) + l["identifier"];
                l["icon"] = "fa fa-file-text";
                l["techUnit"] = list[i].getElementsByTagName("techunit")[0].textContent;
            } else if (type == "link") {
                l["type"] = list[i].getElementsByTagName("type")[0].textContent;
                // if (rel == "global-1-m") {
                //   l["type"] = "Global Link 1:m";
                // } else if (rel == "global-m-1") {
                //   l["type"] = "Global Link m:1";
                // } else if (rel == "global-1-1") {
                //   l["type"] = "Global Link 1:1";
                // } else else {
                //   l["type"] = "unknown"
                // }
                l["class"] = list[i].getElementsByTagName(
                    "associationIdentifier"
                )[0].textContent;
                l["path"] =
                    path +
                    (path == "/vendor" ? "/" : seperator) +
                    encodeURI(l["identifier"]);
                l["identifier"] =
                    list[i].getElementsByTagName("identifier")[0].textContent,
                    // (path == "/vendor" ? "" : seperator) + l["identifier"];
                    l["icon"] = "fa fa-link";
                l["techUnit"] = undefined;
            } else {
                l["type"] = "unknown";
                l["class"] = "unknown";
                l["path"] = path;
            }

            // Add to object cache
            Application.objCache.addChild(
                path,
                list[i].getElementsByTagName("identifier")[0].textContent,
                type,
                l["access"],
                l["class"],
                l["semantics"],
                list[i].getElementsByTagName("creationtime")[0].textContent,
                l["techUnit"],
                l["comment"]
            );


            var identButton = "<td ><button class='variable-identifier' tabIndes='-1'>" + l["identifier"] + "</button></td>"
            var value;
            if (l["access"].includes('write')) {
                value = '<td> <input id="' + l["path"] + '" name="' + l["identifier"] + '" class="varvalinp" type="text" value="" tabIndex="1" > </td>'
            } else {
                value = '<td> <p id="' + l["path"] + '" name="' + l["identifier"] + '" class="varval" type="text" value=""> </p> </td>'
            };


            // add data to table
            // var t = $('#view-table').DataTable();
            //    t.row.add( [
            //       '<td><i class="' + l["icon"] + '"></i></td>',
            //       identButton,
            //       value,
            //       l["class"],
            //       l["type"],
            //       l["access"],
            //      semanticsBitsToChars(l["semantics"]),
            //       l["creation"],
            //       l["comment"],
            //       l["path"]
            //   ] );
            var t = $('#view-table').DataTable();
            t.row.add({
                "icon": '<td><i class="' + l["icon"] + '"></i></td>',
                "identifier": identButton,
                "value": value,
                "class": l["class"],
                "type": l["type"],
                "access": l["access"],
                "semantics": Application.prototype.semanticsBitsToChars(l["semantics"]),
                "creation": l["creation"],
                "comment": l["comment"],
                "path": l["path"]
            });
            // ] ).draw( false );
        }
        // $('#view-table tbody button.variable-identifier').off("mousedown").mousedown(function(e){
        //   var data = t.row( this ).data();
        //   alert( 'You clicked on '+data[0]+'\'s row' );
        // });
        $('#view-table tbody').on('click', 'button.variable-identifier', function (e) {
            var rowtype = $(this.parentNode.parentNode).attr("data-type");
            var rowpath = $(this.parentNode.parentNode).attr("data-path");
            // left click
            if (e.which == 1) {
                if (rowtype == "variable") {
                    // open variable modal
                    $("#view-table").trigger("getVariable", rowpath);
                    // $("#view-table").trigger("updateVariable", rowpath);
                } else {
                    Application.prototype.expandNodes(rowpath);
                }
                // right click
            } else if (e.which == 3) {
                $("#view-table").trigger("saveClickedPath", rowpath);
            }
        });
        // // register event listeners when clicking on row
        // $("#view-table>table>tbody>tr>td>button.variable-identifier")
        //   .off("mousedown")
        //   .mousedown(function(e) {
        //     var data = t.row( this ).data();
        //     alert( 'You clicked on '+data[0]+'\'s row' );

        // });
        
        //update looper
    };


    /**!!!
     *
     *
     * @param path Variable path to open
     */
    updateVarValues = function (path) {
        var paths = [];
        var variables = [];
        var children = Application.objCache.getChildren(path);
        var seperator = (path == "/vendor") ? '/' : '.';
        children.forEach(function (el, i) {
            if (el.type == 'variable' || el.type == 'link') {
                paths.push(path + seperator + el.name);
                // Applicvariables.push(el.name);
            }
        });
        app.serverConnection.getVar(paths, this.showVarValues, this.updateVarValuesFailure, children);
    };

    /**!!!
     *
     *
     * @param path Variable path to open
     */
    updateVarValuesFailure = function (paths, textStatus, title, objstatus, objstatusText, results) {
        var dif = paths.length < results.length ? results.length - paths.length : 0;
        for (var i = 0; i < paths.length; i++) {

            path = paths[i];
            var v = [];

            if (results[i + dif].tagName == "failure")
                v["value"] = "ERROR: " + results[i + dif].textContent
            else
                v["value"] = results[i + dif].getElementsByTagName("value")[0].textContent

            // $("#domain-view>table>tbody>tr>td>input").val(v["value"]);
            var inp = document.getElementById(path);
            if (inp == document.activeElement) {
                continue;
            }
            if (inp == null || inp.tagName == 'INPUT')
                $(inp).val(v["value"]);
            else
                inp.textContent = v["value"];
        }

    };

    /**
     *
     *
     * @param data  XML variables data from AJAX request to server
     * @param variables variables of object !!!(optional)
     */
    (showVarValues = function (data, variables) {

        var paths = data.getElementsByTagName("path")[0].textContent.split(',');
        for (var i = 0; i < paths.length; i++) {

            path = paths[i];
            var v = [];

            v["value"] = data
                .getElementsByTagName("value")[i]
                .textContent.replace(/\n+$/g, ""); // remove empty line at end

            // $("#domain-view>table>tbody>tr>td>input").val(v["value"]);
            var inp = document.getElementById(path);
            if (inp == null || inp == document.activeElement) {
                continue;
            }
            if (inp.tagName == 'INPUT')
                $(inp).val(v["value"]);
            else
                inp.textContent = v["value"];
        }
    });

    // Set value refresh timeout
    $('#value-refresh-timeout, #value-auto-refresh').off('change').change(function () {
        window.clearInterval(timer);
        if ($('#value-auto-refresh').is(':checked')) {
            timer = window.setInterval(function () {
                updateVarValues(Application.history.getPath());
            }, parseInt($('#value-refresh-timeout').val()) * 1000);
        }
    });
}