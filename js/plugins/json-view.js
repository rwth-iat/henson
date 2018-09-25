function jsonView() {
    this.name = 'JSON'; // internal name for plugin, also creates a DOM element with ID
    this.title = 'JSON'; // title of the tab
    this.author = 'Zolboo Erdenebayar'; // your name here
    this.activate = {
        always: true
    }; // activate condition, implemented: {exactClass: 'partial/path/of/class'}, {baseClass: 'partial/name/of/baseclass' or {always: true}
    this.foreground = false; // switch plugin to foreground on activation?
    this.refresh = true; // reload data on refresh?
    this.destroy = true; // should the plugin be destroyed if the activation condition does not match anymore?

    this.checkConditions = function () { // startup function that checks conditions before running the plugin
        return true;
    };

    this.run = function (activeElementPath, data) { // custom plugin code, DOM elements are attachable to the created ID: $('#'+this.name).append(newElement);
        activeElementPath
        $('#JSON')[0].innerHTML = '<form>\
        <div class="form-group">\
        </div>\
        </form>';
        $('#JSON .form-group').append('<button id="button-json-refresh" class="btn" title="Refresh">\
          <i class="fa fa-refresh"></i>\
        </button>');
        $('#JSON .form-group').append('<button id="button-json-download" type="submit" class="btn"><i class="fa fa-download"></i> Download</button>');
        $('#JSON .form-group').append('<button id="button-json-upload" type="submit" class="btn"><i class="fa fa-upload"></i> Upload</button>');
        //     $('#JSON .form-group').append('<div class="custom-file">\
        //     <input type="file" class="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01">\
        //     <label class="custom-file-label" for="inputGroupFile01">Choose file</label>\
        //   </div>');
        $('#JSON .form-group').append('<label for="Upload">json to upload</label>\
        <input type="file" class="form-control-file" id="json-upload-input">');
        // empty the table
        $('#JSON').append('<div class="container-fluid">...</div>');
        // $('#JSON')[0].innerHTML = '<p class="text-justify">Ambitioni dedisse scripsisse iudicaretur. Cras mattis iudicium purus sit amet fermentum. Donec sed odio operae, eu vulputate felis rhoncus. Praeterea iter est quasdam res quas ex communi. At nos hinc posthac, sitientis piros Afros. Petierunt uti sibi concilium totius Galliae in diem certam indicere. Cras mattis iudicium purus sit amet fermentum.</p>'
        this.downloadTree(activeElementPath);
        registerJsonEventListener();
    };
}
var jsonViewPlugIn = new jsonView;
/**
 * Prints tree json text.
 *
 * @param data XML data from AJAX request to server
 * @param objectPath Path to create object
 */
(jsonView.prototype.drawDownload = function (data, objectPath) {
    // $('#JSON .form-control')[0].innerHTML = '<p class="text-justify">' + data.getElementsByTagName("string")[0].textContent + '<p>';
    $('#JSON .container-fluid')[0].innerHTML = data.getElementsByTagName("string")[0].textContent;
});
// var registerJsonEventListener = function () {
//     $('#button-json-refresh').off('refresh').on('refresh',
//         this.downloadTree(activeElementPath)
//     });
// }

/**
 * Trigger Upload with path.
 *
 * @param path Object path
 */
(jsonView.prototype.downloadTree = function (path) {
    var uploadPaths = ["/data/CTree/Upload.path", "/data/CTree/Upload.trigger"];
    var value = [path, 1];
    var types = ["KS_VT_STRING", "KS_VT_INT"];
    app.serverConnection.setVar(uploadPaths, value, types, this.getJson, app.drawResult, this);
});

(jsonView.prototype.getJson = function (path,
    textStatus, txt, that) {
    var uploadPaths = ["/data/CTree/Upload.tree"];
    app.serverConnection.getVar(uploadPaths, that.drawDownload, app.drawResult, that);
});

jsonView.prototype.uploadTree = function (file, path) {
    var downloadPaths = ["/data/CTree/Download.json", "/data/CTree/Download.path", "/data/CTree/Download.trigger"];
    var values = [file, path, 1];
    app.serverConnection.setVar(downloadPaths, values, types, this.checkUploadResult, app.drawResult, this)
}

(jsonView.prototype.checkUploadResult = function (path,
    textStatus, txt, that) {
    var paths = ["/data/CTree/Download.result", "/data/CTree/Download.ErrorMsg"];
    app.serverConnection.getVar(paths, that.showUploadResult, app.drawResult, that);
});

/**
 * Prints tree json text.
 *
 * @param data XML data from AJAX request to server
 * @param objectPath Path to create object
 */
(jsonView.prototype.showUploadResult = function (data, objectPath) {
    // if (textStatus == "success") {
    //   Application.prototype.showAlert(funcName + " " + path, textStatus);
    // } else if (textStatus == "error") {
    //   Application.prototype.showAlert(
    //     funcName + " " + path + " (" + status + " " + statusText + ") ",
    //     textStatus
    //   );
    // } else if (textStatus == "timeout") {
    //   Application.prototype.showAlert(
    //     funcName + " " + path + " (" + statusText + ") ",
    //     "info"
    //   );
    // } else {
    //   Application.prototype.showAlert(
    //     "Something unexpected happened...",
    //     "error"
    //   );
    // }
});