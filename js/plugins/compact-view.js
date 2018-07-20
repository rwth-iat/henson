function CompactView() {
}
var compactViewPlugIn = new CompactView

CompactView.prototype.run = function (activeElementPath, data) {
  if ($('#compact-view')[0].innerHTML == "") {
    console.log("inited");
    CompactView.prototype.init();
  }
  t = $('#cs-view-table').DataTable();
  t.rows().remove().draw();
  path = data.getElementsByTagName('path')[0].textContent;
  // // empty cache at this path
  // Application.objCache.removeChildren(path);
  // append elements to table
  CompactView.prototype.appendRows(data.getElementsByTagName('VariableEngProps'), path, 'variable');
  // $('#container').css('display', 'block');
  t.columns.adjust().draw();

};
CompactView.prototype.checkConditions = function () { // startup function that checks conditions before running the plugin
  return true;
};

CompactView.prototype.init = function () {
  $('#compact-view')[0].innerHTML = '<table id="cv-view-table" class="table table-striped table-hover">\
    <thead>\
    <tr>\
    <th>Value</th> \
    <th>Input</th>\
    <th>Output</th>\
    <th>Value</th>\
    <th>Hidden</th> \
    <th>Value</th>\
    </tr>\
    </thead>\
    <tbody></tbody>\
    </table>'

  // init datatable of domain view
  var compactViewTable = $('#cv-view-table').DataTable({
    scrollX: true,
    scrollY: '70vh',
    scrollCollapse: true,
    paging: false,
    info: true,

    stateSave: false,

    select: true,

    "dom": 'rt<"bottom"i><"bottom"flp><"clear">',

    // "createdRow": function (row, data, index) {
    //   // if ( data[5].replace(/[\$,]/g, '') * 1 > 150000 ) {
    //   $(row).attr("data-path", data["path"]);
    //   $(row).attr("data-type", data["type"]);
    // },

    "columnDefs": [
      //   {
      //   "searchable": false,
      //   "orderable": false,
      //   "targets": 0
      // },
      // {
      //   "visible": false,
      //   // "targets": [-1]
      // }
    ],
    "columns": [
      // { "data": "order" },
      {
        "data": "invalue"
      },
      // null,
      {
        "data": "input"
      },
      {
        "data": "output"
      },
      {
        "data": "outvalue"
      },
      {
        "data": "hidden"
      },
      {
        "data": "hidvalue"
      }
    ]
  });
};

CompactView.prototype.appendRows = function (list, path, type) {
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
    // Application.objCache.addChild(
    //   path,
    //   list[i].getElementsByTagName("identifier")[0].textContent,
    //   type,
    //   l["access"],
    //   l["class"],
    //   l["semantics"],
    //   list[i].getElementsByTagName("creationtime")[0].textContent,
    //   l["techUnit"],
    //   l["comment"]
    // );


    var identButton = "<td ><button class='variable-identifier' tabIndes='-1'>" + l["identifier"] + "</button></td>"
    var value;
    if (l["access"].includes('write')) {
      $("#domain-view>table>tbody>tr:last-child").append(
        value = '<td> <input id="' + l["path"] + '" name="' + l["identifier"] + '" class="varvalinp" type="text" value="" tabIndex="1" > </td>');
    } else {
      $("#domain-view>table>tbody>tr:last-child").append(
        value = '<td> <p id="' + l["path"] + '" name="' + l["identifier"] + '" class="varval" type="text" value=""> </p> </td>')
    };


    var t = $('#cs-view-table').DataTable();
    t.row.add({
      "invalue": value, 
      "input": identButton,
      "output": identButton,
      "outvalue": value,
      "hidden" : identButton,
      "hidvalue" : value
   }).draw();
  }

 $('#cs-view-table tbody').on('click', 'button.variable-identifier', function (e) {
    var rowtype = $(this.parentNode.parentNode).attr("data-type");
    var rowpath = $(this.parentNode.parentNode).attr("data-path");
    // left click
    if (e.which == 1) {
      if (rowtype == "variable") {
        // open variable modal
        $("#cs-view-table").trigger("getVariable", rowpath);
        // $("#view-table").trigger("updateVariable", rowpath);
      } else {
        Application.prototype.expandNodes(rowpath);
      }
      // right click
    } else if (e.which == 3) {
      $("#cs-view-table").trigger("saveClickedPath", rowpath);
    }
  });

  $(".varvalinp").keyup(function (event) {
    if (event.keyCode == 13) {
      $(this).trigger("setVariable", {
        path: event.currentTarget.id,
        newValue: event.currentTarget.value
      });

    }
  });
  //update looper
}

