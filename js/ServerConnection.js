/**
 * Sets up new a connection to ACPLT/KS server and handles all transmissions.
 *
 * @author Christoph Sachsenhausen <christoph.sachsenhausen@rwth-aachen.de>
 * @version 0.1
 *
 * @param address Network address of server
 * @param port Server port
 */
var ServerConnection = function(address) {
  this.setServerAddress(address);
  this.cache = true;
  this.timeout = 5000;
}

/**
 * Get server address
 *
 * @returns Server address
 */
ServerConnection.prototype.getServerAddress = function() {
  return this.address;
},

/**
 * Set server address (and port if exists)
 *
 * @param address New server address (and port)
 */
ServerConnection.prototype.setServerAddress = function(address) {
  var serverArray = address.split(':');
  
  this.address = serverArray[0];
  
  var port = parseInt(serverArray[1], 10);
  if (isNaN(port)) {
    this.setServerPort(7509);
  } else {
    this.setServerPort(port);
  }
},

/**
 * Get server port
 *
 * @returns Server port
 */
ServerConnection.prototype.getServerPort = function(port) {
  return this.port;
},

/**
 * Set server port
 *
 * @param port New server port
 */
ServerConnection.prototype.setServerPort = function(port) {
  this.port = port;
},

/**
 * Generate URL path.
 *
 * @param path Working path
 * @param funcName Name of function to call
 * @return URL path
 */
ServerConnection.prototype.getURL = function(path, funcName) {
  return 'http://'+this.address+':'+this.port+'/'+funcName+'?'+(funcName == 'getServer' ? 'servername' : 'path')+'='+path+(funcName == 'getEP' ? '&requestType=OT_ANY': '')+'&format=ksx';
},

/**
 * 
 */
ServerConnection.prototype.getServer = function(serverName, successCallback, failCallback) {
  $.ajax({
    url: this.getURL(serverName, 'getServer'),
    dataType: 'xml',
    cache: this.cache,
    timeout: this.timeout,
    success: function(data, textStatus) {
      successCallback(ServerConnection.prototype.appendPath(data, serverName));
    },
    error: function(obj, textStatus, errorThrown) {
      failCallback(serverName, textStatus, 'Get Server', obj.status, obj.statusText);
    }
  });
},

/**
 * AJAX Request to the getEP function of the server. 
 * Calls callback for success or failure.
 *
 * @param path Domain path
 * @param successCallback Callback on success
 * @param failCallback Callback on failure
 * @param node Dynatree node to attach data to
 * @param callbackVar Additional callback parameter if needed
 */
ServerConnection.prototype.getEP = function(path, successCallback, failCallback, node, callbackVar) {
  $.ajax({
    url: this.getURL(path, 'getEP'),
    dataType: 'xml',
    cache: this.cache,
    timeout: this.timeout,
    success: function(data, textStatus) {
      successCallback(ServerConnection.prototype.appendPath(data, path), node, callbackVar);
    },
    error: function(obj, textStatus, errorThrown) {
      failCallback(path, textStatus, 'Get EP', obj.status, obj.statusText);
    }
  });
},

/**
 * AJAX Request to the getVar function of the server. 
 * Calls callback for success or failure.
 *
 * @param path Variable path
 * @param successCallback Callback on success
 * @param failCallback Callback on failure
 * @param callbackVar Additional callback parameter if needed
 */
ServerConnection.prototype.getVar = function(path, successCallback, failCallback, callbackVar) {
  $.ajax({
    url: this.getURL(path, 'getVar'),
    dataType: 'xml',
    cache: this.cache,
    timeout: this.timeout,
    success: function(data) {
      successCallback(ServerConnection.prototype.appendPath(data, path), callbackVar);
    },
    error: function(obj, textStatus, errorThrown) {
      failCallback(path, textStatus, 'Get Variable', obj.status, obj.statusText);
    }
  });
},

/**
 * AJAX Request to the setVar function of the server. 
 * Calls callback for success or failure.
 *
 * @param path Variable path
 * @param newValue New variable value
 * @param newVartype New variable type
 * @param successCallback Callback on success
 * @param failCallback Callback on failure
 */
ServerConnection.prototype.setVar = function(path, newValue, newVartype, successCallback, failCallback) {
  $.ajax({
    url: this.getURL(path, 'setVar'),
    data: {
      newvalue: newValue,
      vartype: newVartype
    },
    dataType: 'xml',
    cache: this.cache,
    timeout: this.timeout,
    success: function(data, textStatus) {
      successCallback(path, textStatus, 'Set Variable');
    },
    error: function(obj, textStatus, errorThrown) {
      failCallback(path, textStatus, 'Set Variable', obj.status, obj.statusText);
    }
  });
},

/**
 * AJAX Request to the createObject function of the server. 
 * Calls callback for success or failure.
 *
 * @param path Object path to instantiate at
 * @param factory Class path
 * @param successCallback Callback on success
 * @param failCallback Callback on failure
 */
ServerConnection.prototype.createObject = function(path, factory, successCallback, failCallback) {
  $.ajax({
    url: this.getURL(path, 'createObject'),
    data: {
      factory: factory
    },
    dataType: 'xml',
    cache: this.cache,
    timeout: this.timeout,
    success: function(data, textStatus) {
      successCallback(path, textStatus, 'Create Object');
    },
    error: function(obj, textStatus, errorThrown) {
      failCallback(path, textStatus, 'Create Object', obj.status, obj.statusText);
    }
  });
},

/**
 * AJAX Request to the deleteObject function of the server. 
 * Calls callback for success or failure.
 *
 * @param path Object path to delete
 * @param successCallback Callback on success
 * @param failCallback Callback on failure
 */
ServerConnection.prototype.deleteObject = function(path, successCallback, failCallback) {
  $.ajax({
    url: this.getURL(path, 'deleteObject'),
    dataType: 'xml',
    cache: this.cache,
    timeout: this.timeout,
    success: function(data, textStatus) {
      successCallback(path, textStatus, 'Delete Object');
    },
    error: function(obj, textStatus, errorThrown) {
      failCallback(path, textStatus, 'Delete Object', obj.status, obj.statusText);
    }
  });
},

/**
 * AJAX Request to the renameObject function of the server. 
 * Calls callback for success or failure.
 *
 * @param path Object path
 * @param newName New object name (path)
 * @param successCallback Callback on success
 * @param failCallback Callback on failure
 */
ServerConnection.prototype.renameObject = function(path, newName, successCallback, failCallback) {
  $.ajax({
    url: this.getURL(path, 'renameObject'),
    dataType: 'xml',
    data: {
      newname: newName
    },
    cache: this.cache,
    timeout: this.timeout,
    success: function(data, textStatus) {
      successCallback(path, textStatus, 'Rename Object');
    },
    error: function(obj, textStatus, errorThrown) {
      failCallback(path, textStatus, 'Rename Object', obj.status, obj.statusText);
    }
  });
},

/**
 * AJAX Request to the link function of the server. 
 * Calls callback for success or failure.
 *
 * @param path Link path
 * @param element Object path
 * @param successCallback Callback on success
 * @param failCallback Callback on failure
 */
ServerConnection.prototype.link = function(path, element, successCallback, failCallback) {
  $.ajax({
    url: this.getURL(path, 'link'),
    dataType: 'xml',
    data: {
      element: element
    },
    cache: this.cache,
    timeout: this.timeout,
    success: function(data, textStatus) {
      successCallback(path, textStatus, 'Link');
    },
    error: function(obj, textStatus, errorThrown) {
      failCallback(path, textStatus, 'Link', obj.status, obj.statusText);
    }
  });
},

/**
 * AJAX Request to the link function of the server. 
 * Calls callback for success or failure.
 *
 * @param path Link path
 * @param element Object path
 * @param successCallback Callback on success
 * @param failCallback Callback on failure
 */
ServerConnection.prototype.unlink = function(path, element, successCallback, failCallback) {
  $.ajax({
    url: this.getURL(path, 'unlink'),
    dataType: 'xml',
    data: {
      element: element
    },
    cache: this.cache,
    timeout: this.timeout,
    success: function(data, textStatus) {
      successCallback(path, textStatus, 'Unlink');
    },
    error: function(obj, textStatus, errorThrown) {
      failCallback(path, textStatus, 'Unlink', obj.status, obj.statusText);
    }
  });
},

/**
 * Appends operating path to result data
 *
 * @param data Result data
 * @param path Operating path
 * @return Result data containing path
 */
ServerConnection.prototype.appendPath = function(data, path) {
  pathel = data.createElement('path');
  pathel.appendChild(data.createTextNode(path));
  data.getElementsByTagName('response')[0].appendChild(pathel);
  return data;
};