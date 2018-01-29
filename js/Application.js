/**
 * HTML5 based single page interface for the ACPLT/KS server.
 * Offering similar functionality and replacing Magellan Pro.
 * Uses the Dynatree jQuery plugin and Twitter Bootstrap.
 * Main application class
 *
 * @author Christoph Sachsenhausen <christoph.sachsenhausen@rwth-aachen.de>
 * @version 0.1
 *
 * @param serverConnection Object of type ServerConnection
 * @param activePath Working path to start the application with
 */
var Application = function(serverConnection) {
  this.serverConnection = serverConnection;
};

/**
 * Realizes an Object Cache
 */
Application.objCache = (function() {
  var cache = {
    name: "root",
    type: undefined,
    access: "read",
    classId: "/acplt/ov/domain",
    semantics: 0,
    creationTime: undefined,
    techUnit: undefined,
    comment: undefined,
    parent: undefined,
    children: [],
    variables: []
  };
  return {
    /**
     * Gets the name of a node
     *
     * @param node String or node object
     * @return Name of node
     */

    getName: function(node) {
      if (typeof node !== "string") return node.name;
      return this.findObj(this.splitPath(node)).name;
    },
    /**
     * Gets the type of a node
     *
     * @param node String or node object
     * @return Type of node
     */
    getType: function(node) {
      if (typeof node !== "string") return node.type;
      return this.findObj(this.splitPath(node)).type;
    },
    /**
     * Gets the access of a node
     *
     * @param node String or node object
     * @return Access of node
     */
    getAccess: function(node) {
      if (typeof node !== "string") return node.access;
      return this.findObj(this.splitPath(node)).access;
    },
    /**
     * Gets the class identifier of a node
     *
     * @param node String or node object
     * @return Class identifier of node
     */
    getClassId: function(node) {
      if (typeof node !== "string") return node.classId;
      return this.findObj(this.splitPath(node)).classId;
    },
    /**
     * Gets the semantics of a node
     *
     * @param node String or node object
     * @return semantics of node
     */
    getSemantics: function(node) {
      if (typeof node !== "string") return node.semantics;
      return this.findObj(this.splitPath(node)).semantics;
    },
    /**
     * Gets the creation time of a node
     *
     * @param node String or node object
     * @return Creation time of node
     */
    getCreationTime: function(node) {
      if (typeof node !== "string") return node.creationTime;
      return this.findObj(this.splitPath(node)).creationTime;
    },
    /**
     * Gets the tech unit of a node
     *
     * @param node String or node object
     * @return Tech unit of node
     */
    getTechUnit: function(node) {
      if (typeof node !== "string") return node.techUnit;
      return this.findObj(this.splitPath(node)).techUnit;
    },
    /**
     * Gets the comment of a node
     *
     * @param node String or node object
     * @return Comment of node
     */
    getComment: function(node) {
      if (typeof node !== "string") return node.comment;
      return this.findObj(this.splitPath(node)).comment;
    },
    /**
     * Gets the parent object of a node
     *
     * @param node String or node object
     * @return Parent Object of node
     */
    getParent: function(node) {
      if (typeof node !== "string") return node.parent;
      return this.findObj(this.splitPath(node)).parent || cache;
    },
    /**
     * Gets the child nodes of a node
     *
     * @param node String or node object
     * @return Array of child nodes
     */
    getChildren: function(node) {
      if (typeof node !== "string") return node.children;
      return this.findObj(this.splitPath(node)).children;
    },
    /**
     * Removes all child nodes of a node
     *
     * @param node String or node object
     */
    removeChildren: function(node) {
      if (typeof node !== "string") {
        node.children = [];
      } else {
        this.findObj(this.splitPath(node)).children = [];
      }
    },
    /**
     * Adds a new child node to cache
     *
     * @param node Path to node or node object
     * @param name Name of node
     * @param type Type of node
     * @param access Access of node
     * @param classId Class Identifier of node
     * @param semantics Semantics of node
     * @param creationTime Creation Time of node
     * @param techUnit Tech unit of node
     * @param comment Comment of node
     */
    addChild: function(
      node,
      name,
      type,
      access,
      classId,
      semantics,
      creationTime,
      techUnit,
      comment
    ) {
      var obj;
      if (typeof node !== "string") {
        obj = node;
      } else {
        obj = this.findObj(this.splitPath(node));
      }
      var exists = false;
      var i = 0;
      while (!exists && i < obj.children.length) {
        if (obj.children[i].name == name) {
          // Consistency: child already exists, just update values
          exists = true;
          obj.children[i].type = type;
          obj.children[i].access = access;
          obj.children[i].classId = classId;
          obj.children[i].semantics = semantics;
          obj.children[i].creationTime = creationTime;
          obj.children[i].techUnit = techUnit;
          obj.children[i].comment = comment;
        }
        i++;
      }
      // Consistency: child does not exist, create new node
      if (!exists)
        obj.children.push({
          name: name,
          type: type,
          access: access,
          classId: classId,
          semantics: semantics,
          creationTime: creationTime,
          techUnit: techUnit,
          comment: comment,
          parent: obj,
          children: []
        });
    },
    /**
     * Splits path into array elements
     *
     * @param path Path to node
     * @return Array path elements
     */
    splitPath: function(path) {
      var pathElements = path.split(/[\/\.]+/);
      return pathElements.splice(1, pathElements.length - 1);
    },
    /**
     * Find an object in cache by it's path array
     *
     * @param pathArray Array of path elements (returned by splitPath())
     * @param obj Root object (Cache root if unset)
     * @return Object in cache or cache root if not found
     */
    findObj: function(pathArray, obj) {
      if (obj === undefined) obj = cache;
      var found = false;
      var i = 0;
      while (!found && i < obj.children.length) {
        if (pathArray[0] == obj.children[i].name) {
          found = true;
          if (pathArray.length == 1) {
            return obj.children[i];
          } else {
            return this.findObj(
              pathArray.splice(1, pathArray.length - 1),
              obj.children[i]
            );
          }
        }
        i++;
      }
      return obj;
    },
    /**
     * Log complete cache to console
     */
    log: function() {
      console.log(cache);
    }
  };
})();

/**
 * Realizes a history API to navigate and save states
 */
Application.history = (function() {
  return {
    /**
     * Gets server address from hash
     *
     * @return Server address
     */
    getServerAddress: function() {
      return $("input#server-address").val() || this.getHashArray()[0];
    },
    /**
     * Gets server name from hash
     *
     * @return Server name
     */
    getServerName: function() {
      return $("input#server-name").val() || this.getHashArray()[1];
    },
    /**
     * Gets path from hash
     *
     * @return Path
     */
    getPath: function() {
      var hashArray = this.getHashArray();
      // remove first to elements from array
      hashArray.shift();
      hashArray.shift();
      return "/" + hashArray.join("/") || $("input#path").val();
    },
    /**
     * Initially sets the correct server on startup
     */
    initServerAddress: function() {
      var hashArray = this.getHashArray();
      if (hashArray.length != 0 && hashArray[0] != "")
        $("input#server-address").val(hashArray[0]);
    },
    /**
     * Set URL hash
     *
     * @param serverAddress Server address
     * @param serverName Server name
     * @param path Path
     */
    setHash: function(serverAddress, serverName, path) {
      if (serverAddress == null) serverAddress = this.getServerAddress();
      if (serverName == null) serverName = this.getServerName();
      if (path == null) path = this.getPath();
      window.location.href = "#" + serverAddress + "/" + serverName + path;
    },
    /**
     * Gets complete hash from URL
     *
     * @return Hash from URL
     */
    getHash: function() {
      return window.location.hash.replace("#", "");
    },
    /**
     * Gets array of hash elements from URL
     *
     * @return Array of hash elements from URL
     */
    getHashArray: function() {
      return this.getHash().split("/") || [];
    }
  };
})();

/**
 * Set current active path in interface and browser history.
 *
 * @param activePath New active path
 */
(Application.prototype.setActivePath = function(activePath) {
  $("input#path").val(activePath);
  Application.history.setHash(null, null, activePath);
}),
  /**
   * Gets list of all servers and draws selection modal on success.
   */
  (Application.prototype.fillServerList = function() {
    this.serverConnection.getEP(
      "/servers",
      "OT_DOMAIN",
      this.drawServer,
      this.drawResult
    );
  }),
  /**
   * Draws server selection modal from AJAX data
   *
   * @param data XML data from AJAX request to server
   */
  (Application.prototype.drawServer = function(data) {
    $("#server-name")
      .empty()
      .prop("disabled", false);
    var servers = data.getElementsByTagName("identifier");

    for (var i = 0; i < servers.length; i++) {
      $("#server-name").append(
        "<option" +
          (servers[i].textContent == Application.history.getServerName()
            ? " selected"
            : "") +
          ">" +
          servers[i].textContent +
          "</option>"
      );
    }

    // register event handler for changing server name
    $("#server-name")
      .off("change")
      .change(function() {
        Application.history.setHash(null, $("#server-name").val(), null);
        $("#view-table").trigger("setServer", $("#server-name").val());
      });

    $("#server-name").change();
  }),
  /**
   * Gets port for server name
   *
   * @param serverName Name of the server
   */
  (Application.prototype.getPort = function(serverName) {
    this.serverConnection.resolveServerPort(
      serverName,
      this.setPort,
      this.drawResult
    );
  }),
  /**
   * Sets port in server connection
   *
   * @param data XML data from AJAX request
   */
  (Application.prototype.setPort = function(data) {
    $("#view-table").trigger("setPort", {
      port: data.getElementsByTagName("port")[0].textContent,
      serverName: data.getElementsByTagName("path")[0].textContent
    });
  }),
  /**
   * Draws root node children.
   *
   * @param rootNode Dynatree root node
   * @param serverName Name of the server
   */
  (Application.prototype.drawRoot = function(rootNode, serverName) {
    rootNode.data.key = "server";
    rootNode.removeChildren();

    rootNode.addChild({
      title: serverName,
      isLazy: true,
      key: "/",
      isFolder: true,
      type: "domain",
      addClass: "context-menu-domain"
    });

    Application.prototype.expandNodes($("input#path").val());
    Application.prototype.addContextMenu();
  }),
  /**
   * Gets data for node by AJAX request and draws children on success.
   *
   * @param node Dynatree node to attach to
   * @param path Query path to server
   */
  (Application.prototype.getNode = function(node, path) {
    this.serverConnection.getEP(
      path,
      "OT_ANY",
      this.drawNode,
      this.drawResult,
      node
    );
  }),
  /**
   * Draws children from AJAX data.
   *
   * @param data XML data from AJAX request to server
   * @param node Dynatree node to attach to
   */
  (Application.prototype.drawNode = function(data, node) {
    var listVariable = data.getElementsByTagName("VariableEngProps");
    var listLink = data.getElementsByTagName("LinkEngProps");
    var listDomain = data.getElementsByTagName("DomainEngProps");
    var res = [];

    Application.objCache.removeChildren(node.data.key);

    for (var i = 0; i < listVariable.length; i++) {
      var el = listVariable[i].getElementsByTagName("identifier")[0]
        .textContent;
      var access = listVariable[i].getElementsByTagName("access")[0]
        .textContent;
      var classId = listVariable[i].getElementsByTagName("type")[0].textContent;
      var semantics = listVariable[i].getElementsByTagName("semantics")[0]
        .textContent;
      var creationTime = listVariable[i].getElementsByTagName("creationtime")[0]
        .textContent;
      var techUnit = listVariable[i].getElementsByTagName("techunit")[0]
        .textContent;
      var comment = listVariable[i].getElementsByTagName("comment")[0]
        .textContent;
      Application.objCache.addChild(
        node.data.key,
        el,
        "variable",
        access,
        classId,
        semantics,
        creationTime,
        techUnit,
        comment
      );
    }

    // add domains and links to tree
    if (listDomain.length > 0 || listLink.length > 0) {
      // create array of nodes
      for (var i = 0; i < listLink.length; i++) {
        var el = listLink[i].getElementsByTagName("identifier")[0].textContent;
        var access = listLink[i].getElementsByTagName("access")[0].textContent;
        var classId = listLink[i].getElementsByTagName(
          "associationIdentifier"
        )[0].textContent;
        var semantics = listLink[i].getElementsByTagName("semantics")[0]
          .textContent;
        var creationTime = listLink[i].getElementsByTagName("creationtime")[0]
          .textContent;
        var comment = listLink[i].getElementsByTagName("comment")[0]
          .textContent;

        var seperator = access.indexOf("part") == -1 ? "/" : ".";
        res.push({
          title: seperator + decodeURI(el),
          isLazy: false,
          key: node.data.key + seperator + encodeURI(el),
          type: "link",
          addClass: "context-menu-link"
        });
        Application.objCache.addChild(
          node.data.key,
          el,
          "link",
          access,
          classId,
          semantics,
          creationTime,
          undefined,
          comment
        );
      }

      for (var i = 0; i < listDomain.length; i++) {
        var el = listDomain[i].getElementsByTagName("identifier")[0]
          .textContent;
        var access = listDomain[i].getElementsByTagName("access")[0]
          .textContent;
        var classId = listDomain[i].getElementsByTagName("classIdentifier")[0]
          .textContent;
        var semantics = listDomain[i].getElementsByTagName("semantics")[0]
          .textContent;
        var creationTime = listDomain[i].getElementsByTagName("creationtime")[0]
          .textContent;
        var comment = listDomain[i].getElementsByTagName("comment")[0]
          .textContent;
        var seperator = access.indexOf("part") == -1 ? "/" : ".";
        res.push({
          title: decodeURI(el),
          isLazy: true,
          key:
            node.data.key +
            (node.data.key == "/" ? "" : seperator) +
            encodeURI(el),
          isFolder: true,
          type: "domain",
          addClass: "context-menu-domain"
        });
        Application.objCache.addChild(
          node.data.key,
          el,
          "domain",
          access,
          classId,
          semantics,
          creationTime,
          undefined,
          comment
        );
      }
    } else {
      // remove expandable status if no children found
      //node.data.isLazy = false;
      node.render();
    }
    // add children from array
    node.addChild(res);

    // Hack to fix recursive loading: https://code.google.com/p/dynatree/issues/detail?id=222&q=keypath&colspec=Stars%20ID%20Type%20Status%20Modified%20Priority%20Milestone%20Owner%20Summary
    //node.setLazyNodeStatus(DTNodeStatus_Ok);
    var tree = node.tree,
      eventType =
        "nodeLoaded.dynatree." + tree.$tree.attr("id") + "." + node.data.key;
    tree.$tree.trigger(eventType, [node, true]);

    Application.prototype.addContextMenu();
  }),
  /**
   * Gets data for domain by AJAX request.
   *
   * @param path Query path to server
   */
  (Application.prototype.getData = function(path) {
    this.serverConnection.getEP(path, "OT_ANY", this.drawData, this.drawResult);
  }),
  /**
   * Draws view table from AJAX data.
   * If plugin ist set for this class, also launches the plugin.
   *
   * @param dataDomain XML data from AJAX request to server
   */
  (Application.prototype.drawData = function(dataDomain) {
    var removeTab = function(name) {
      $('#values .nav-tabs a[href="#' + name + '"]')
        .parent()
        .remove();
      $("#values .tab-content #" + name).remove();
    };
    var addTab = function(name, title) {
      $("#values .nav-tabs").append(
        '<li><a href="#' +
          name +
          '" data-toggle="tab">' +
          title +
          '&nbsp;&nbsp;&nbsp;</a><button type="button" class="close" title="close plugin">&times;</button></li>'
      );
      $("#values .tab-content").append(
        '<div class="tab-pane" id="' + name + '"></div>'
      );
    };
    var setActive = function(name) {
      $("#values .nav-tabs li").removeClass("active");
      $("#values .tab-pane").removeClass("active");
      $('#values .nav-tabs a[href="#' + name + '"]')
        .parent()
        .addClass("active");
      $("#values #" + name).addClass("active");
    };

    // check plugins
    var currentClass = dataDomain.getElementsByTagName("path")[0].textContent;
    var classId = Application.objCache.getClassId(currentClass);

    for (var i = 0; i < plugins.length; i++) {
      // is the selected domain equal to activation requirement?
      if (
        currentClass.indexOf(plugins[i].activate.exactClass) != -1 ||
        classId.indexOf(plugins[i].activate.baseClass) != -1 ||
        plugins[i].activate.always
      ) {
        // load the plugin only if it does not exist yet OR it exists in DOM and is allowed to refresh?
        var pluginExists = $("#" + plugins[i].name).length > 0 ? true : false;

        if (!pluginExists || (pluginExists && plugins[i].refresh)) {
          if (plugins[i].name != "domain-view") {
            // remove old tab
            removeTab(plugins[i].name);

            // add new tab
            addTab(plugins[i].name, plugins[i].title);

            // set to foreground
            if (plugins[i].foreground) {
              setActive(plugins[i].name);
            }

            // set correct height for plugin
            $(window).resize();
          }
          // execute plugin
          if (plugins[i].checkConditions()) {
            // start plugin only when it gets to the foreground, else register onClick handler to start it
            if (plugins[i].foreground) {
              plugins[i].run(currentClass, dataDomain);
            } else {
              var currentPlugin = plugins[i];
              $('.nav-tabs li a[href="#' + plugins[i].name + '"]')
                .off("click")
                .click(function() {
                  currentPlugin.run(currentClass, dataDomain);
                });
            }
          } else {
            removeTab(plugins[i].name);
            setActive("domain-view");
          }
        }
      } else {
        if (plugins[i].destroy) {
          removeTab(plugins[i].name);
        }
        setActive("domain-view");
      }
    }

    // register event listeners for close button
    $(".nav-tabs > li .close")
      .off("click")
      .click(function() {
        var name = $(this)
          .prev()
          .attr("href")
          .replace("#", "");
        removeTab(name);
        setActive("domain-view");
      });
  }),
  /**
   * Adds rows to main view table and registers event handlers (click on row)
   *
   * @param list List of data items
   * @param type Data Type: variable, link or domain
   */
  (Application.prototype.appendRows = function(list, path, type) {
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
          (path == "/vendor" ? "" : seperator) + l["identifier"];
        l["icon"] = "fa fa-file-text";
        l["techUnit"] = list[i].getElementsByTagName("techunit")[0].textContent;
      } else if (type == "link") {
        var rel = list[i].getElementsByTagName("type")[0].textContent;
        if (rel == "global-1-m") {
          l["type"] = "Global Link 1:m";
        } else if (rel == "global-m-1") {
          l["type"] = "Global Link m:1";
        } else if (rel == "global-1-1") {
          l["type"] = "Global Link 1:1";
        }
        l["class"] = list[i].getElementsByTagName(
          "associationIdentifier"
        )[0].textContent;
        l["path"] =
          path +
          (path == "/vendor" ? "/" : seperator) +
          encodeURI(l["identifier"]);
        l["identifier"] =
          (path == "/vendor" ? "" : seperator) + l["identifier"];
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

      // add data to table
      $("#domain-view>table>tbody").append(
        '<tr data-toggle="context" data-target="#context-menu-' +
          type +
          '" data-path="' +
          l["path"] +
          '" data-type="' +
          type +
          '"></tr>'
      );

      $("#domain-view>table>tbody>tr:last-child").append(
        '<td><i class="' + l["icon"] + '"></i></td>'
      );
      $("#domain-view>table>tbody>tr:last-child").append(
        "<td class='variable-identifier'>" + decodeURI(l["identifier"]) + "</td>"
      );
      if(l["access"].includes('write')){
        $("#domain-view>table>tbody>tr:last-child").append(
          '<td> <input id="' + Application.objCache.getName(path) +l["identifier"] + '" name="' + l["identifier"]+'" class="varvalinp" type="text" value=""> </td>');
        }
      else{
        $("#domain-view>table>tbody>tr:last-child").append(
        '<td> <p id="' + Application.objCache.getName(path) +l["identifier"] + '" name="' + l["identifier"]+'" class="varval" type="text" value=""> </p> </td>')
      };
      $("#domain-view>table>tbody>tr:last-child").append(
        "<td>" + l["type"] + "</td>"
      );
      $("#domain-view>table>tbody>tr:last-child").append(
        "<td>" + l["class"] + "</td>"
      );
      $("#domain-view>table>tbody>tr:last-child").append(
        "<td>" + l["access"] + "</td>"
      );
      $("#domain-view>table>tbody>tr:last-child").append(
        "<td>" +
          Application.prototype.semanticsBitsToChars(l["semantics"]) +
          "</td>"
      );
      $("#domain-view>table>tbody>tr:last-child").append(
        "<td>" + l["creation"] + "</td>"
      );
      $("#domain-view>table>tbody>tr:last-child").append(
        "<td>" + l["comment"] + "</td>"
      );
    }

    // register event listeners when clicking on row
    $("#domain-view>table>tbody>tr>td.variable-identifier")
      .off("mousedown")
      .mousedown(function(e) {
        var rowtype = $(this.parentNode).attr("data-type");
        var rowpath = $(this.parentNode).attr("data-path");
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

      $(".varvalinp").keyup(function (event) {
        if (event.keyCode == 13) {
            $(this).trigger("setVariable", 
            {
              path: Application.history.getPath()+ event.currentTarget.name, 
              newValue: event.currentTarget.value
            });
        }
      });
    //update looper
  }),

    /**!!!
   *
   *
   * @param path Variable path to open
   */
  (Application.prototype.updateVarValues = function(path) {
    var paths = [];
    var variables = [];
    var children = Application.objCache.getChildren(path);
    children.forEach(function(el, i){
      if (el.type=='variable'){
        paths.push(path + '.'+ el.name);
        variables.push(el.name);
      }
    });
    this.serverConnection.getVar(paths, this.showVarValues, this.drawResult, children);
  }),

  //   /**
  //  * Gets data for domain by AJAX request.
  //  *
  //  * @param data Query path to server
  //  */
  // (Application.prototype.getVars = function(data, path) {
  //   var listVariable = data.getElementsByTagName("VariableEngProps");
  //   var paths = []
  //   for (var i = 0; i < listVariable.length; i++) {
  //     paths[i] = path + '.'+ listVariable[i].getElementsByTagName("identifier")[0]
  //       .textContent;
  //   }
  //   app.serverConnection.getVar(paths, app.showVarValues, app.drawResult);
  // }),

  /**
   *
   *
   * @param data  XML variables data from AJAX request to server
   * @param variables variables of object !!!(optional)
   */
  (Application.prototype.showVarValues = function(data, variables) {

    var paths = data.getElementsByTagName("path")[0].textContent.split(',');
    for (var i = 0; i < paths.length; i++){

      path = paths[i];
      var v = [];
      
      v["value"] = data
      .getElementsByTagName("value")[i]
      .textContent.replace(/\n+$/g, ""); // remove empty line at end
    
      // $("#domain-view>table>tbody>tr>td>input").val(v["value"]);
      var tmp = path.split("/");
      var inp = document.getElementById(tmp[tmp.length-1]);
      if (inp == document.activeElement){
          continue;
        }
      if(inp.tagName=='INPUT')
        $(inp).val(v["value"]);
      else
        inp.textContent = v["value"];
      }
    }),
  /**
   *
   *
   * @param path Variable path to open
   */
  (Application.prototype.updateVariable = function(path) {
    this.serverConnection.getEP(path, "OT_ANY", this.getVars, this.drawResult);
  }),
  /**
   * Open variable modal and shows data from AJAX request.
   *
   * @param data XML data from AJAX request to server
   */
  (Application.prototype.showVariable = function(data) {
    var path = data.getElementsByTagName("path")[0].textContent;
    var v = [];

    v["value"] = data
      .getElementsByTagName("value")[0]
      .textContent.replace(/\n+$/g, ""); // remove empty line at end

    // $("#domain-view>table>tbody>tr>td>input").val(v["value"]);
    tmp = path.split(".");
    inp = document.getElementById('.'+tmp[tmp.length-1]);
      if (inp == document.activeElement){
        logMsg("input is active");
        return;
      }
    $(inp).val(v["value"]);
    logMsg("var");
  }),
  /**
   * Gets data for variable by AJAX request and opens in modal on success.
   *
   * @param path Variable path to open
   */
  (Application.prototype.getVariable = function(path) {
    this.serverConnection.getVar(path, this.drawVariable, this.drawResult);
  }),
  /**
   * Open variable modal and shows data from AJAX request.
   *
   * @param data XML data from AJAX request to server
   */
  (Application.prototype.drawVariable = function(data) {
    var path = data.getElementsByTagName("path")[0].textContent;
    var v = [];

    v["resourceLocator"] = path;
    v["value"] = data
      .getElementsByTagName("value")[0]
      .textContent.replace(/\n+$/g, ""); // remove empty line at end
    v["dataType"] = data.getElementsByTagName(
      "value"
    )[0].childNodes[0].nodeName;
    v["timestamp"] = data.getElementsByTagName("timestamp")[0].textContent;
    v["state"] = data.getElementsByTagName("state")[0].textContent;

    v["techUnit"] = Application.objCache.getTechUnit(path);
    v["access"] = Application.objCache.getAccess(path);
    v["creationTime"] = Application.objCache.getCreationTime(path);
    v["semantics"] = Application.objCache.getSemantics(path);
    v["comment"] = Application.objCache.getComment(path);

    $("#modal-variable #variable-resource-locator").val(v["resourceLocator"]);
    $("#modal-variable #variable-value").val(v["value"]);
    $(
      '#modal-variable #variable-data-type option[value="' +
        v["dataType"] +
        '"]'
    ).prop("selected", true);
    $("#modal-variable #variable-timestamp").val(v["timestamp"]);
    $(
      '#modal-variable #variable-quality-state option[value="' +
        v["state"] +
        '"]'
    ).prop("selected", true);
    $("#modal-variable #variable-techunit").val(v["techUnit"]);
    $("#modal-variable #variable-access").val(v["access"]);
    $("#modal-variable #variable-creationtime").val(v["creationTime"]);
    $("#modal-variable #variable-semantics").val(
      Application.prototype.semanticsBitsToChars(v["semantics"])
    );
    $("#modal-variable #variable-comment").val(v["comment"]);

    $("#modal-variable .modal-title span").html(v["resourceLocator"]);

    $("#modal-variable").modal("show");

    // Register event handler for save button
    $("#modal-variable #save-variable")
      .off("click")
      .click(function() {
        // Trigger event to set variable with new value and type.
        $("#view-table").trigger("setVariable", {
          path: $("#modal-variable #variable-resource-locator").val(),
          newValue: $("#modal-variable #variable-value").val(),
          newVartype:
            "KS_VT_" +
            $("#modal-variable #variable-data-type")
              .val()
              .toUpperCase()
              .replace("VEC", "_VEC")
        });
      });
  }),
  /**
   * Sets new variable data.
   *
   * @param path Variable path
   * @param newValue New variable value
   * @param newVartype New variable type
   */
  (Application.prototype.setVariable = function(path, newValue, newVartype) {
    this.serverConnection.setVar(
      path,
      newValue,
      newVartype,
      this.drawResult,
      this.drawResult
    );
  }),
  /**
   * Gets data to instantiate new object and opens modal on success.
   *
   * @param objectPath Path to create object
   */
  (Application.prototype.getInstantiate = function(objectPath) {
    this.serverConnection.getVar(
      "/acplt/ov/library.instance",
      this.drawInstantiate,
      this.drawResult,
      objectPath
    ); // add to config: /acplt/ov/library.instance
  }),
  /**
   * Opens instantiate modal.
   *
   * @param data XML data from AJAX request to server
   * @param objectPath Path to create object
   */
  (Application.prototype.drawInstantiate = function(data, objectPath) {
    var access = Application.objCache.getAccess(objectPath),
    seperator = access.indexOf("part") == -1 ? "/" : ".";
    $("#modal-instantiate #instantiate-object-path").val(
      objectPath + (objectPath != "/" ? seperator : "")
    );
    
    // focusing on input
    $("#modal-instantiate #instantiate-object-path").focus();
    

    var list = data.getElementsByTagName("string");
    var appendArray = [];

    // add class pathes
    for (var i = 0; i < list.length; i++) {
      appendArray[i] = "<option>" + list[i].textContent + "</option>";
    }
    $("#modal-instantiate #instantiate-class-path")
      .empty()
      .append(appendArray);

    // register event handler for dropdown change
    $("#modal-instantiate #instantiate-class-path")
      .off("change")
      .change(function() {
        $("#view-table").trigger(
          "getInstantiable",
          $("#modal-instantiate #instantiate-class-path").val()
        );
      });
    $("#modal-instantiate #instantiate-class-path").change();

    // register event handler for save button
    $("#modal-instantiate #save-instantiate")
      .off("click")
      .click(function() {
        $("#view-table").trigger("createObject", {
          path: $("#modal-instantiate #instantiate-object-path").val(),
          factory: $("#modal-instantiate #instantiate-instantiable-path").val()
        });
      });

    // refresh on instantiate success
    $(document)
      .off("ajaxComplete")
      .ajaxComplete(function(e, xhr, settings) {
        if (settings.url.indexOf("createObject") != -1) {
          xhr.success(function() {
            $("#view-table").trigger("refresh", objectPath);
          });
        }
      });
  }),
  /**
   * Shows rename object modal.
   *
   * @param path Object path to rename
   */
  (Application.prototype.drawMove = function(path) {
    $("#modal-move #save-move").val(path);

    $("#modal-move #save-move")
      .off("click")
      .click(function() {
        $("#view-table").trigger("renameObject", {
          path: path,
          newName: $("#modal-move #save-move").val()
        });
      });
  }),
  /**
   * Gets data to fill instantiable dropdown.
   *
   * @param path Path to look for instantiables
   */
  (Application.prototype.getInstantiable = function(path) {
    this.serverConnection.getEP(
      path,
      "OT_DOMAIN",
      this.drawInstantiable,
      this.drawResult
    );
  }),
  /**
   * Fills instantiable dropwdown.
   *
   * @param data XML data from AJAX request to server
   */
  (Application.prototype.drawInstantiable = function(data) {
    var domains = data.getElementsByTagName("DomainEngProps"),
      path = data.getElementsByTagName("path")[0].textContent,
      instantiables = [];
    for (var i = 0; i < domains.length; i++) {
      var access = domains[i].getElementsByTagName("access")[0].textContent;
      if (access.indexOf("instantiable") != -1) {
        var instantiableName = domains[i].getElementsByTagName("identifier")[0]
            .textContent,
          separator = access.indexOf("part") != -1 ? "." : "/";
        instantiables.push(
          '<option value="' +
            path +
            separator +
            instantiableName +
            '">' +
            instantiableName +
            "</option>"
        );
      }
    }
    $("#modal-instantiate #instantiate-instantiable-path")
      .empty()
      .append(instantiables);
  }),
  /**
   * Creates new object.
   *
   * @param path Path of the new object
   * @param factory Class path of the new object
   */
  (Application.prototype.createObject = function(path, factory) {
    this.serverConnection.createObject(
      path,
      factory,
      this.drawResult,
      this.drawResult
    );
  }),
  /**
   * Shows delete modal.
   *
   * @param path Object path to delete
   */
  (Application.prototype.drawDelete = function(path) {
    $("#modal-delete .modal-body strong").html(path);

    $("#modal-delete #save-delete")
      .off("click")
      .click(function() {
        $("#view-table").trigger("deleteObject", path);
      });

    // refresh on delete success
    $(document)
      .off("ajaxComplete")
      .ajaxComplete(function(e, xhr, settings) {
        if (settings.url.indexOf("delete") != -1) {
          xhr.success(function() {
            var pathArray = path.split(/[\/\.](?=[^\/.]*$)/); // find last '/' or '.' of the path
            $("#view-table").trigger("refresh", pathArray[0]);
          });
        }
      });
  }),
  /**
   * Deletes object.
   *
   * @param path Object path to delete
   */
  (Application.prototype.deleteObject = function(path) {
    this.serverConnection.deleteObject(path, this.drawResult, this.drawResult);
  }),
  /**
   * Shows rename object modal.
   *
   * @param path Object path to rename
   */
  (Application.prototype.drawRename = function(path) {
    $("#modal-rename #rename-object-name").val(path);

    $("#modal-rename #save-rename")
      .off("click")
      .click(function() {
        $("#view-table").trigger("renameObject", {
          path: path,
          newName: $("#modal-rename #rename-object-name").val() + ".1"
        });
      });

    // refresh on rename success
    $(document)
      .off("ajaxComplete")
      .ajaxComplete(function(e, xhr, settings) {
        if (settings.url.indexOf("renameObject") != -1) {
          xhr.success(function() {
            var pathArray = path.split(/[\/\.](?=[^\/.]*$)/); // find last '/' or '.' of the path
            $("#view-table").trigger("refresh", pathArray[0]);
          });
        }
      });
  }),
  /**
   * Renames object.
   *
   * @param path Object path to rename
   * @param newName New name (path) of object
   */
  (Application.prototype.renameObject = function(path, newName) {
    this.serverConnection.renameObject(
      path,
      newName,
      this.drawResult,
      this.drawResult
    );
  }),
  /**
   * Shows modal to create link.
   *
   * @param path Path to create link at
   */
  (Application.prototype.drawLink = function(path) {
    // is path a domain or a link?
    var type = Application.objCache.getType(path);
    if (type == "domain") {
      $("#modal-link #link-element").val(path);
      $("#modal-link #link-path").val("/");
    } else {
      $("#modal-link #link-element").val("/");
      $("#modal-link #link-path").val(path);
    }

    $("#modal-link #save-link")
      .off("click")
      .click(function() {
        $("#view-table").trigger("link", {
          path: $("#modal-link #link-path").val(),
          element: $("#modal-link #link-element").val()
        });
      });

    // refresh on link success
    $(document)
      .off("ajaxComplete")
      .ajaxComplete(function(e, xhr, settings) {
        if (settings.url.indexOf("link") != -1) {
          xhr.success(function() {
            if (type == "domain") {
              $("#view-table").trigger("refresh", path);
            } else {
              var pathArray = path.split(/[\/\.](?=[^\/.]*$)/); // find last '/' or '.' of the path
              $("#view-table").trigger("refresh", pathArray[0]);
            }
          });
        }
      });
  }),
  /**
   * Creates link.
   *
   * @param path Link path
   * @param element Object path
   */
  (Application.prototype.link = function(path, element) {
    this.serverConnection.link(path, element, this.drawResult, this.drawResult);
  }),
  /**
   * Destroys link.
   *
   * @param path Link path
   * @param element Object path
   */
  (Application.prototype.unlink = function(path, element) {
    this.serverConnection.unlink(
      path,
      element,
      this.drawResult,
      this.drawResult
    );
  }),
  /**
   * Shows load library modal.
   */
  (Application.prototype.drawLoadLibrary = function() {
    $("#modal-load-library #load-library-name").focus();

    $("#modal-load-library #load-library-path").html("<option>/acplt</option>");
    

    if (Application.objCache.getName("/Libraries") == "Libraries") {
      $("#modal-load-library #load-library-path").append(
        "<option>/Libraries</option>"
      );
    }

    $("#modal-load-library #save-load-library")
      .off("click")
      .click(function() {
        $("#view-table").trigger("loadLibrary", {
          path:
            $("#modal-load-library #load-library-path").val() +
            "/" +
            $("#modal-load-library #load-library-name").val(),
          factory: "/acplt/ov/library"
        });
      });
    

    // show alert on link success
    $(document)
      .off("ajaxComplete")
      .ajaxComplete(function(e, xhr, settings) {
        if (settings.url.indexOf("link") != -1) {
          xhr.success(function() {
            if (type == "domain") {
              $("#view-table").trigger("refresh", path);
            } else {
              var pathArray = path.split(/[\/\.](?=[^\/.]*$)/); // find last '/' or '.' of the path
              $("#view-table").trigger("refresh", pathArray[0]);
            }
          });
        }
      });
    $('#load-library-name').click();
  }),
  /**
   * Gets data for link by AJAX request and opens in modal on success.
   *
   * @param path Link path
   */
  (Application.prototype.getReferences = function(path) {
    this.serverConnection.getVar(path, this.drawReferences, this.drawResult);
  }),
  /**
   * Open link modal and shows data from AJAX request.
   *
   * @param data XML data from AJAX request to server
   */
  (Application.prototype.drawReferences = function(data) {
    var refs = data.getElementsByTagName("string");
    $("#modal-references #new-link").val("");
    $("#modal-references .modal-body > table").empty();
    $("#modal-references .modal-body > table").attr(
      "data-path",
      data.getElementsByTagName("path")[0].textContent
    );
    // add links
    for (var i = 0; i < refs.length; i++) {
      if (refs[i].textContent != "") {
        $("#modal-references .modal-body > table").append("<tr></tr>");
        $("#modal-references .modal-body > table tr:last-child").append(
          '<td><a href="#">' + refs[i].textContent + "</a></td>"
        );
        $("#modal-references .modal-body > table tr:last-child").append(
          '<td><button type="button" class="btn btn-mini" title="unlink"><i class="fa fa-unlink"></i></button></td>'
        );
      }
    }
    $("#modal-references .modal-title span").html(
      data.getElementsByTagName("path")[0].textContent
    );
    $("#modal-references").modal("show");

    // register event handler for click on link
    $("#modal-references .modal-body table a")
      .off("click")
      .click(function() {
        $("#modal-references").modal("hide");
        Application.prototype.expandNodes($(this).html());
      });

    // register event handler for unlink button
    $("#modal-references .modal-body table button")
      .off("click")
      .click(function() {
        if (confirm("Do you really want to unlink?")) {
          $("#view-table").trigger("unlink", {
            path: $("#modal-references .modal-body table").attr("data-path"),
            element: $(this)
              .parent()
              .prev()
              .children("a")
              .html()
          });
        }
      });

    // register event handler for link button
    $("#modal-references #button-new-link")
      .off("click")
      .click(function(event) {
        event.preventDefault();
        $("#view-table").trigger("link", {
          path: $("#modal-references .modal-body table").attr("data-path"),
          element: $("#modal-references #new-link").val()
        });
      });

    // refresh on link / unlink success or close on link / unlink fail
    $(document)
      .off("ajaxComplete")
      .ajaxComplete(function(e, xhr, settings) {
        if (settings.url.indexOf("link") != -1) {
          xhr.success(function() {
            $("#view-table").trigger(
              "getReferences",
              data.getElementsByTagName("path")[0].textContent
            );
          });
        }
      });
  }),
  /**
   * Gets data for logfile by AJAX request and shows in console on success.
   */
  (Application.prototype.getLogfile = function() {
    this.serverConnection.getLogfile(this.drawLogfile, this.drawResult);
  }),
  /**
   * Shows log data from AJAX request.
   *
   * @param data XML data from AJAX request to server
   */
  (Application.prototype.drawLogfile = function(data) {
    var entries = data.getElementsByTagName("entry");

    $("#console").empty();
    for (var i = 0; i < entries.length; i++) {
      $("#console").append(
        entries[i].attributes[0].nodeValue +
          " - " +
          entries[i].textContent +
          "\r\n"
      );
    }
  }),
  /**
   * Shows success / error alert.
   *
   * @param path Operating path
   * @param textStatus Result of operation: success or error
   * @param funcName Function name of operation
   * @param status HTTP status code
   * @param statusText  HTTP status message
   */
  (Application.prototype.drawResult = function(
    path,
    textStatus,
    funcName,
    status,
    statusText
  ) {
    if (textStatus == "success") {
      Application.prototype.showAlert(funcName + " " + path, textStatus);
    } else if (textStatus == "error") {
      Application.prototype.showAlert(
        funcName + " " + path + " (" + status + " " + statusText + ") ",
        textStatus
      );
    } else if (textStatus == "timeout") {
      Application.prototype.showAlert(
        funcName + " " + path + " (" + statusText + ") ",
        "info"
      );
    } else {
      Application.prototype.showAlert(
        "Something unexpected happened...",
        "error"
      );
    }
  }),
  /**
   * Expand nodes according to path
   *
   * @param path Path to expand
   */
  (Application.prototype.expandNodes = function(path) {
    var type;

    // build the correct key path, for example /acplt/ov/object would be:
    // /|/acplt|/acplt/ov|/acplt/ov/|/acplt/ov/domain
    var pathElements = path.split(/[\/\.]+/);
    var pathExpanded = [];
    for (var i = 0; i < pathElements.length - 1; i++) {
      if (pathExpanded.length > 0) {
        var lastSeparatorPosition = pathExpanded[i - 1].length;
        var separator = path.substring(
          lastSeparatorPosition,
          lastSeparatorPosition + 1
        );
        pathExpanded[i] = pathExpanded[i - 1] + separator + pathElements[i + 1];
      } else {
        pathExpanded[i] = "/" + pathElements[i + 1];
      }
    }
    var pathCollapsed =
      (pathExpanded[0] != "/" ? "/|" : "") + pathExpanded.join("|");

    $("#tree")
      .dynatree("getTree")
      .loadKeyPath(pathCollapsed, function(node, status) {
        // this callback function is called recursively on every node in the path
        if (status == "loaded") {
          // 'node' is a parent that was just traversed.
          node.expand();
        } else if (status == "ok") {
          // 'node' is the end node of our path.
          node.expand();
          node.activate();
          // scroll to active node
          var activeNode = $("#tree").dynatree("getActiveNode");
          var activeLI = activeNode && activeNode.li;
          $("#tree ul.dynatree-container").animate(
            {
              scrollTop:
                $(activeLI).offset().top -
                $("#tree ul.dynatree-container").offset().top +
                $("#tree ul.dynatree-container").scrollTop() -
                50
            },
            0
          );
        } else if (status == "notfound") {
          var seg = arguments[2],
            isEndNode = arguments[3];
        }
        // does the path point to a variable / link?
        type = Application.objCache.getType(path);
      });

    // is path a variable or link?
    if (type == "variable") {
      $("#view-table").trigger("getVariable", path);
    } else if (type == "link") {
      $("#view-table").trigger("getReferences", path);
    }
  }),
  /**
   * Converts byte vector to characters.
   *
   * @param semantics Byte vector
   * @return Character representation of input
   */
  (Application.prototype.semanticsBitsToChars = function(semantics) {
    // create hashmap
    var map = [];
    map[256] = "i";
    map[16384] = "o";
    map[2097152] = "v";

    semantics = parseInt(semantics);

    var result = "";
    var i = 0;

    // is in hashmap?
    if (map[semantics] !== undefined) {
      return map[semantics];
      // if not, calculate
    } else {
      while (semantics > 0) {
        if (semantics % 2 != 0) {
          result = result + String.fromCharCode(97 + i);
          semantics = semantics - Math.pow(2, i);
        }
        semantics = semantics / 2;
        i++;
      }
      return result;
    }
  }),
  /**
   * Reloads node data from server
   *
   * @param node Dynatree node to refresh
   */
  (Application.prototype.refreshNode = function(node) {
    if (node.data.type != "link") {
      node.reloadChildren();
      this.getData(node.data.key);
    } else {
      node.getParent().reloadChildren();
      node.getParent().activate();
    }
  }),
  /**
   * Adds context menu to nodes.
   */
  (Application.prototype.addContextMenu = function() {
    // add context menu to nodes with corresponding class
    $("#tree ul.dynatree-container .context-menu-domain").attr(
      "data-target",
      "#context-menu-domain"
    );
    $("#tree ul.dynatree-container .context-menu-domain").attr(
      "data-toggle",
      "context"
    );
    $("#tree ul.dynatree-container .context-menu-link").attr(
      "data-target",
      "#context-menu-link"
    );
    $("#tree ul.dynatree-container .context-menu-link").attr(
      "data-toggle",
      "context"
    );

    // save path of node that has been right clicked
    $("#tree ul.dynatree-container span.dynatree-node").mousedown(function(e) {
      if (e.which == 3) {
        var node = $.ui.dynatree.getNode(this);
        $("#view-table").trigger("saveClickedPath", node.data.key);
      }
    });
  }),
  /**
   * Shows alert.
   *
   * @param alertMessage Message to display
   * @param alertType success, error or info
   */
  (Application.prototype.showAlert = function(alertMessage, alertType) {
    $("#main-alert").removeClass("hide alert-error alert-success alert-info");
    $("#main-alert").addClass("alert-" + alertType);
    $("#main-alert").html(
      "<strong>" +
        alertType.charAt(0).toUpperCase() +
        alertType.slice(1) +
        ":</strong> " +
        alertMessage
    );
    $("#main-alert").show();
    window.setTimeout(function() {
      $("#main-alert").fadeOut();
    }, 7000);
  }),
  /**
   * Adds columns to the width of the tree
   *
   * @param colums Number of columns to add (negative number subtracts)
   */
  (Application.prototype.changeTreeWidth = function(columns) {
    var spanColumns = 0,
      i = 0;
    while (spanColumns == 0 && i < 12) {
      i++;
      if ($("#tree").hasClass("span" + i)) spanColumns = i;
    }

    if (spanColumns + columns > 0) {
      $("#tree")
        .removeClass("span" + spanColumns)
        .addClass("span" + (spanColumns + columns));
      $("#values")
        .removeClass("span" + (12 - spanColumns))
        .addClass("span" + (12 - spanColumns - columns));
    }
  });
