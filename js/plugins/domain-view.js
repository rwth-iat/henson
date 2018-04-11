var domainViewPlugIn = new function () {

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
        app.appendRows(data.getElementsByTagName('VariableEngProps'), path, 'variable');
        app.appendRows(data.getElementsByTagName('LinkEngProps'), path, 'link');
        app.appendRows(data.getElementsByTagName('DomainEngProps'), path, 'domain');
        $('#container').css('display', 'block');
        t.columns.adjust().draw();
    }
}