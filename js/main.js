var conn, app, timer, clickedPath;

var initializeTree = function() {
  $('#tree').dynatree({
    keyPathSeparator: "|",
    // lazy read: load nodes when expanded with ajax
    onLazyRead: function(node) {
      app.getNode(node, node.data.key);
    },
    onActivate: function(node) {
      app.setActivePath(node.data.key);
      // is node a link or a domain?
      if (node.data.type == 'link') {
        app.getReferences(node.data.key);
      } else {
        app.getData(node.data.key);
      }
      // set refresh interval timer
      if ($('#auto-refresh').is(':checked')) {
        window.clearInterval(timer);
        timer = window.setInterval(function() {
          app.refreshNode(node);
        }, parseInt($('#refresh-timeout').val())*1000);
      }
    },
    onExpand: function(flag, node) {
      // when closing node set to lazy again
      if (!flag) node.resetLazy();
    },
    debugLevel: 1
  });
}

var registerCustomEventListeners = function() {
  $('#view-table').on('setServer', function(e, serverName) {
      app.getPort(serverName);
  });
  $('#view-table').on('setPort', function(e, data) {
    conn.setPort(data.port);
    app.getRoot($('#tree').dynatree('getRoot'), data.serverName);
  });
  $('#view-table').on('getVariable', function(e, path) {
    app.getVariable(path);
  });
  $('#view-table').on('getReferences', function(e, path) {
    app.getReferences(path);
  });
  $('#view-table').on('setVariable', function(e, data) {
    app.setVariable(data.path, data.newValue, data.newVartype);
  });
  $('#view-table').on('createObject', function(e, data) {
    app.createObject(data.path, data.factory);
  });
  $('#view-table').on('deleteObject', function(e, path) {
    app.deleteObject(path);
  });
  $('#view-table').on('renameObject', function(e, data) {
    app.renameObject(data.path, data.newName);
  });
  $('#view-table').on('link', function(e, data) {
    app.link(data.path, data.element);
  });
  $('#view-table').on('unlink', function(e, data) {
    app.unlink(data.path, data.element);
  });
  $('#view-table').on('refresh', function(e, path) {
    app.refreshNode($("#tree").dynatree("getTree").getNodeByKey(path));
  });
}

var registerContextMenuEventListeners = function() {
  $('.dropdown-menu li a[href="#modal-instantiate"]').click(function() {
    app.getInstantiate(clickedPath);
  });
  $('.dropdown-menu li a[href="#modal-delete"]').click(function() {
    app.drawDelete(clickedPath);
  });
  $('.dropdown-menu li a[href="#modal-rename"]').click(function() {
    app.drawRename(clickedPath);
  });
  $('.dropdown-menu li a[href="#modal-link"]').click(function() {
    app.drawLink(clickedPath);
  });
}

$(document).ready(function() {
  
  // listen to clicks on nav buttons
  $('#button-submit').unbind('click').click(function(event) {

    // don't reload page on submit
    event.preventDefault();
    
    conn = new ServerConnection($('#server-address').val());
    app = new Application(conn, $('#path').val());
    
    initializeTree();
    registerCustomEventListeners();
    registerContextMenuEventListeners();

    app.getServer();
    
    // save clicked path to global variable
    $('#view-table').on('saveClickedPath', function(e, path) {
      clickedPath = path;
    });
    
    $(window).resize();
  });
  $('#button-refresh').unbind('click').click(function(event) {
    event.preventDefault();
    app.refreshNode($("#tree").dynatree("getActiveNode"));
  });
  $('#button-instantiate').unbind('click').click(function(event) {
    event.preventDefault();
    app.getInstantiate($("#tree").dynatree("getActiveNode").data.key);
  });
  $('#button-delete').unbind('click').click(function(event) {
    event.preventDefault();
    app.drawDelete($("#tree").dynatree("getActiveNode").data.key);
  });
  $('#button-rename').unbind('click').click(function(event) {
    event.preventDefault();
    app.drawRename($("#tree").dynatree("getActiveNode").data.key);
  });
  $('#button-link').unbind('click').click(function(event) {
    event.preventDefault();
    app.drawLink($("#tree").dynatree("getActiveNode").data.key);
  });
  
  // Set refresh timeout
  $('#refresh-timeout, #auto-refresh').change(function() {
    window.clearInterval(timer);
    if ($('#auto-refresh').is(':checked')) {
      
      timer = window.setInterval(function() {
        app.refreshNode($('#tree').dynatree('getActiveNode'));
      }, parseInt($('#refresh-timeout').val())*1000);
    }
  });
  
  // Adjust viewport on resize
  $(window).resize(function() {
    $('#values .tab-pane').css('height', function() {
      height = $(window).height()*0.96 - $('.navbar').outerHeight(true) - $('#nav-form').outerHeight(true) - $('#values ul.nav-tabs').outerHeight(true);
      return height;
    });
    
    $('ul.dynatree-container').css('height', function() {
      height = $(window).height()*0.96 - $('.navbar').outerHeight(true) - $('#nav-form').outerHeight(true);
      return height;
    });
  });
  
	// add zen mode to inputs
  $('.zen-mode').zenForm({ trigger: '.zen-open', theme: 'light' });
  
  // fire it up
  $('#button-submit').trigger('click');

});