$(document).ready(function() {

  var conn, app, timer, clickedPath;
  
  // initialize tree
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
  
  $('#button-submit').click(function(event) {
    
    // don't reload page on submit
    event.preventDefault();
    
    conn = new ServerConnection($('input#server').val(), $('input#port').val());
    app = new Application(conn, $('input#path').val());
    
    // draw root node
    app.getRoot($('#tree').dynatree('getRoot'));

    // save clicked path to global variable
    $('#view-table').on('saveClickedPath', function(e, path) {
      clickedPath = path;
    });
    
    // listen to custom event triggers and call corresponding function
    $('#view-table').on('getVariable', function(e, path) {
      app.getVariable(path);
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
    
    // listen to clicks on context menu
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
  $(window).resize(function(){
    $('#values .tab-pane').css('height', function() {
      height = $(window).height()*0.96 - $('.navbar').outerHeight(true) - $('#nav-form').outerHeight(true) - $('#values ul.nav-tabs').outerHeight(true);
      return height;
    });
    
    $('ul.dynatree-container').css('height', function() {
      height = $(window).height()*0.96 - $('.navbar').outerHeight(true) - $('#nav-form').outerHeight(true);
      return height;
    });
  });
  
  $(window).resize();


});