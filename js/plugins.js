var plugins = [
  {
    name: 'domain-view', // internal name for plugin, also creates a DOM element with this ID
    title: 'Domain View', // title of the tab
    author: 'Christoph Sachsenhausen', // your name here
    activate: {always: true}, // activate condition, implemented: {class: '/name/of/class'} or {always: true}
    foreground: true, // switch plugin to foreground on activation?
    refresh: true, // reload data on refresh?
    run: function(activeElementPath, data) { // custom plugin code, DOM elements are attachable to the created ID: $('#'+this.name).append(newElement);
      // empty the table
      $('#domain-view>table>tbody').empty();
      path = data.getElementsByTagName('path')[0].textContent;
      // empty cache at this path
      Application.objCache.removeChildren(path);
      // append elements to table
      Application.prototype.appendRows(data.getElementsByTagName('VariableEngProps'), path, 'variable');
      Application.prototype.appendRows(data.getElementsByTagName('LinkEngProps'), path, 'link');
      Application.prototype.appendRows(data.getElementsByTagName('DomainEngProps'), path, 'domain');
    }
  },
  {
    name: 'cshmi-view',
    title: 'CSHMI',
    author: 'Christoph Sachsenhausen',
    activate: {class: 'cshmi/Group'},
    //activate: {class: '/acplt/ov/object'},
    foreground: true,
    refresh: false,
    run: function(activeElementPath, data) {
      var iFrame = '<iframe src="http://localhost:7509/hmi/?RefreshTime=1000&Host=localhost&Server=MANAGER&Sheet=/TechUnits/cshmi/demo_for_sten" style="border: 0; width: 100%; height: 100%; margin: -1px; padding: 0;"></iframe>';
      // server name von /vendor/server_name
      $('#'+this.name).append(iFrame);
    }
  }
];