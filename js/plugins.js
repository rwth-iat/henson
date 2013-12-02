var plugins = [
  {
    name: 'domain-view', // internal name for plugin, also creates a DOM element with this ID
    title: 'Domain View', // title of the tab
    author: 'Christoph Sachsenhausen', // your name here
    activate: {always: true}, // activate condition, implemented: {exactClass: 'partial/path/of/class'}, {baseClass: 'partial/name/of/baseclass' or {always: true}
    foreground: true, // switch plugin to foreground on activation?
    refresh: true, // reload data on refresh?
    destroy: false, // should the plugin be destroyed if the activation condition does not match anymore?
    checkConditions: function() { // startup function that checks conditions before running the plugin
      return true;
    },
    run: function(activeElementPath, data) { // custom plugin code, DOM elements are attachable to the created ID: $('#'+this.name).append(newElement);
      // empty the table
      $('#domain-view>table>tbody').empty();
      path = data.getElementsByTagName('path')[0].textContent;
      // empty cache at this path
      Application.objCache.removeChildren(path);
      // append elements to table
      app.appendRows(data.getElementsByTagName('VariableEngProps'), path, 'variable');
      app.appendRows(data.getElementsByTagName('LinkEngProps'), path, 'link');
      app.appendRows(data.getElementsByTagName('DomainEngProps'), path, 'domain');
    }
  },
  {
    name: 'cshmi-view',
    title: 'CSHMI',
    author: 'Christoph Sachsenhausen',
    activate: {baseClass: 'cshmi/Group'},
    foreground: true,
    refresh: true,
    destroy: true,
    checkConditions: function() {
      var req = new XMLHttpRequest();
      req.open('HEAD', 'http://'+app.serverConnection.getServerAddress()+':'+app.serverConnection.getServerPort()+'/hmi/', false);
      try{
        req.send(null);
        if(req.status == 200) {
          return 1;
        } else {
          req.open('HEAD', window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/hmi/', false);
          try {
            req.send(null);
            if (req.status == 200) return 2;
          } catch(e) {
            // do nothing
          }
        }
      } catch(e) {
        // do nothing
      }
      return false;
    },
    run: function(activeElementPath, data) {
      var sl = this.checkConditions();
      var iFrame = '<iframe src="'
        +(sl == 1 ? 'http://' : window.location.protocol+'//')
        +(sl == 1 ? app.serverConnection.getServerAddress() : window.location.hostname)
        +':'
        +(sl == 1 ? app.serverConnection.getServerPort() : window.location.port)
        +'/hmi/?Host='
        +(sl == 1 ? app.serverConnection.getServerAddress() : window.location.hostname)
        +'&Server='
        +$('#server-name').val()
        +'&Sheet='
        +activeElementPath
        +'" style="border: 0; width: 100%; height: 100%; margin: -1px; padding: 0;"></iframe>';
      $('#'+this.name).append(iFrame);
    }
  },
  {
    name: 'engineering-view',
    title: 'FB Engineering',
    author: 'Sten Gruener',
    activate: {baseClass: 'ov/domain'},
    foreground: false,
    refresh: true,
    destroy: true,
    checkConditions: function() {
      var req = new XMLHttpRequest();
      req.open('HEAD', 'http://'+app.serverConnection.getServerAddress()+':'+app.serverConnection.getServerPort()+'/hmi/', false);
      try{
        req.send(null);
        if(req.status == 200) {
          return 1;
        } else {
          req.open('HEAD', window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/hmi/', false);
          try {
            req.send(null);
            if (req.status == 200) return 2;
          } catch(e) {
            // do nothing
          }
        }
      } catch(e) {
        // do nothing
      }
      return false;
    },
    run: function(activeElementPath, data) {
      var sl = this.checkConditions();
      var iFrame = '<iframe src="'
        +(sl == 1 ? 'http://' : window.location.protocol+'//')
        +(sl == 1 ? app.serverConnection.getServerAddress() : window.location.hostname)
        +':'
        +(sl == 1 ? app.serverConnection.getServerPort() : window.location.port)
        +'/hmi/?Host='
        +(sl == 1 ? app.serverConnection.getServerAddress() : window.location.hostname)
        +'&Server='
        +$('#server-name').val()
		+'&Sheet=/TechUnits/cshmi/engineeringFBSheet'
        +'&FBReference='
        +activeElementPath
        +'" style="border: 0; width: 100%; height: 100%; margin: -1px; padding: 0;"></iframe>';
      $('#'+this.name).empty().append(iFrame);
    }
  }
];
