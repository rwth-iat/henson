function import_libraries(){
    app.createObject("/acplt/ksapi", "/acplt/ov/library");
    app.createObject("/acplt/CTree", "/acplt/ov/library");
}

function quick_run1(){
    import_libraries();
    // creating
    var objpath = "/TechUnits/upload";
    var factory = "/acplt/CTree/Upload";
    app.createObject(objpath, factory);

    //hanging in urtasks
    var urtask = "/Tasks/UrTask";
    app.link(objpath+".taskparent", urtask);

    //debug
    // var tree = '{"Libraries": ["CTree", "fb", "ACPLTlab003lindyn", "iec61131stdfb"],  "Tree": {    "test1": { "factory": "/acplt/CTree/Download", "children": {} },    "pid2": {      "factory": "/acplt/fb/functionchart",      "children": {        "x": { "factory": "/acplt/fb/singleport", "children": {} },        "w": { "factory": "/acplt/fb/singleport", "children": {} },        "KI": { "factory": "/acplt/fb/singleport", "children": {} },        "KP": { "factory": "/acplt/fb/singleport", "children": {} },        "KD": { "factory": "/acplt/fb/singleport", "children": {} },        "y": { "factory": "/acplt/fb/singleport", "children": {} },        "diff": { "factory": "/acplt/ACPLTlab003lindyn/diff", "children": {} },        "int": { "factory": "/acplt/ACPLTlab003lindyn/int", "children": {} },        "add": { "factory": "/acplt/iec61131stdfb/ADD", "children": {} },        "mul": { "factory": "/acplt/iec61131stdfb/MUL", "children": {} },        "add2": { "factory": "/acplt/iec61131stdfb/ADD", "children": {} },        "sub": { "factory": "/acplt/iec61131stdfb/SUB", "children": {} },        "mul2": { "factory": "/acplt/iec61131stdfb/MUL", "children": {} },        "VorFilter": {          "factory": "/acplt/ACPLTlab003lindyn/pt1",          "children": {}        }    }    }  },  "Path": "/TechUnits",  "Links": {}}'
    var tree = '{ "Libraries":	["CTree"], "Tree":	{ "download":	{ "factory": "/acplt/CTree/Download", "children":	{ } } }, "Path": "/TechUnits", "Links":	[{ "of_association":	"/acplt/fb/tasklist", "parent":	["taskparent", "/Tasks/UrTask"], "children": ["taskchild", "/TechUnits/download"] }] }'
    // app.setVariable(path+".json", tree);

    //setting active to 1
    app.setVariable(objpath+".actimode", 1);
    // app.refreshNode($('#tree').dynatree('getTree').getNodeByKey(objpath));
    app.refreshNode($('#tree').dynatree('getActiveNode'));
  }
  function quick_run2(){
    // creating
    var path = "/TechUnits/download";
    var factory = "/acplt/CTree/Download";
    app.createObject(path, factory);
    
    //hanging in urtasks
    var urtask = "/Tasks/UrTask";
    app.link(path+".taskparent", urtask);
    
    //setting active to 1
    app.setVariable(path+".root", "/TechUnits");
    
    app.setVariable(path+".getvar", "TRUE");
    // setting active to 1
    app.setVariable(path+".actimode", 1);
    $("#view-table").trigger("refresh", path);
    app.refreshNode($('#tree').dynatree('getActiveNode'));
  }
  
  function quick_run3(){
    // creating
    var objpath = "/TechUnits/transport";
    var factory = "/acplt/CTree/Transport";
    app.createObject(objpath, factory);
    
    //hanging in urtasks
    var urtask = "/Tasks/UrTask";
    app.link(objpath+".taskparent", urtask);
    
    //setting active to 1
    // app.setVariable(path+".root", "/TechUnits");
    // app.setVariable(path+".Submit", "TRUE");
    
    app.setVariable(objpath+".getvar", "TRUE");
    app.setVariable(objpath+".targetKS", "localhost:MANAGER");
    //setting active to 1
    app.setVariable(objpath+".actimode", 1);

    app.refreshNode($('#tree').dynatree('getActiveNode'));
  }
  
  
function quick_run4(){
  // creating
  var objpath = "/TechUnits/loadlibs";
  var factory = "/acplt/CTree/LoadLibs";
  app.createObject(objpath, factory);
  
  //hanging in urtasks
  var urtask = "/Tasks/UrTask";
  app.link(objpath+".taskparent", urtask);
  
  //setting active to 1
  // app.setVariable(path+".root", "/TechUnits");
  // app.setVariable(path+".Submit", "TRUE");
  
  //setting active to 1
  app.setVariable(objpath+".actimode", 1);
  
  app.refreshNode($('#tree').dynatree('getActiveNode'));
}


function quick_run5(){
  // creating
  var objpath = "/TechUnits/test";
  var factory = "/acplt/CTree/test";
  app.createObject(objpath, factory);
  
  //hanging in urtasks
  //   var urtask = "/Tasks/UrTask";
  //   app.link(path+".taskparent", urtask);
  
  //setting active to 1
  // app.setVariable(path+".root", "/TechUnits");
  // app.setVariable(path+".Submit", "TRUE");
  
  //setting active to 1
  app.setVariable(objpath+".actimode", 1);
  
  app.refreshNode($('#tree').dynatree('getActiveNode'));
}
