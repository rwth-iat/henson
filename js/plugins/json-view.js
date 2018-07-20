function jsonView() {
    this.name = 'JSON'; // internal name for plugin, also creates a DOM element with ID
    this.title = 'JSON'; // title of the tab
    this.author = 'Zolboo Erdenebayar'; // your name here
    this.activate = {
        always: true
    }; // activate condition, implemented: {exactClass: 'partial/path/of/class'}, {baseClass: 'partial/name/of/baseclass' or {always: true}
    this.foreground = false; // switch plugin to foreground on activation?
    this.refresh = true; // reload data on refresh?
    this.destroy = false; // should the plugin be destroyed if the activation condition does not match anymore?

    this.checkConditions = function () { // startup function that checks conditions before running the plugin
        return true;
    };

    this.run = function (activeElementPath, data) { // custom plugin code, DOM elements are attachable to the created ID: $('#'+this.name).append(newElement);
        activeElementPath
        // empty the table
        if ($('#JSON')[0].innerHTML == "") {
            $('#JSON')[0].innerHTML = '<p class="text-justify">Ambitioni dedisse scripsisse iudicaretur. Cras mattis iudicium purus sit amet fermentum. Donec sed odio operae, eu vulputate felis rhoncus. Praeterea iter est quasdam res quas ex communi. At nos hinc posthac, sitientis piros Afros. Petierunt uti sibi concilium totius Galliae in diem certam indicere. Cras mattis iudicium purus sit amet fermentum.</p>'
        }
        $('#JSON')[0].innerHTML = '<p class="text-justify">Ambitioni dedisse scripsisse iudicaretur. Cras mattis iudicium purus sit amet fermentum. Donec sed odio operae, eu vulputate felis rhoncus. Praeterea iter est quasdam res quas ex communi. At nos hinc posthac, sitientis piros Afros. Petierunt uti sibi concilium totius Galliae in diem certam indicere. Cras mattis iudicium purus sit amet fermentum.</p>'
        this.downloadTree(activeElementPath);
    };
}
var jsonViewPlugIn = new jsonView;
/**
 * Opens instantiate modal.
 *
 * @param data XML data from AJAX request to server
 * @param objectPath Path to create object
 */
(jsonView.prototype.drawDownload = function (data, objectPath) {
    $('#JSON')[0].innerHTML = '<p class="text-justify">' + data.getElementsByTagName("string")[0].textContent + '<p>';
});

/**
 * Download tree new variable data.
 *
 * @param path Variable path
 * @param newValue New variable value
 * @param newVartype New variable type
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