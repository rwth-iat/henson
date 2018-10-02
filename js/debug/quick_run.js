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
    app.setVariable(objpath+".path", "/TechUnits/draft") 
    app.setVariable(objpath+".getvar", "TRUE");
    app.setVariable(objpath+".targetKS", "localhost/loadlibs");
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
    app.setVariable(objpath+".targetKS", "localhost/loadlibs")
    app.setVariable(objpath+".libsToSend", "{A}%20{B}%20{C}%20{eks}");
    
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
  function quick_run_draft(){
    // creating
    var objpath = "/TechUnits/draft";
    var factory = "/acplt/draft/test";
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
  function quick_run_sendfiles(){
    // creating
    var objpath = "/TechUnits/sendfiles";
    var factory = "/acplt/CTree/SendFiles";
    app.createObject(objpath, factory);
    
    //hanging in urtasks
    var urtask = "/Tasks/UrTask";
    app.link(objpath+".taskparent", urtask);
    
    //setting active to 1
    app.setVariable(objpath+".targetKS", "localhost/loadlibs");
    app.setVariable(objpath+".filesToSend", "{$ACPLT_HOME/system/addonlibs/A.png}%20{$ACPLT_HOME/system/addonlibs/B.png}%20{$ACPLT_HOME/system/addonlibs/C.png}");
    
    //setting active to 1
    // app.setVariable(objpath+".actimode", 1);
    
    app.refreshNode($('#tree').dynatree('getActiveNode'));
  }
  function quick_run_draft(){
    // creating
    var objpath = "/TechUnits/draft";
    var factory = "/acplt/draft/test";
    app.createObject(objpath, factory);
    
    //hanging in urtasks
    var urtask = "/Tasks/UrTask";
    app.link(objpath+".taskparent", urtask);
    
    //setting active to 1
    app.setVariable(path+".targetKS", "localhost/MANAGER");
    // app.setVariable(path+".Submit", "TRUE");
    
    //setting active to 1
    app.setVariable(objpath+".actimode", 1);
    
    app.refreshNode($('#tree').dynatree('getActiveNode'));
  }
  
  
  function quick_run_bfs(){
    app.createObject("/acplt/malloc","/acplt/ov/domain");
    app.createObject("/acplt/graphSearch","/acplt/ov/library");
    
    // creating
    var objpath = "/TechUnits/bfs";
    var factory = "/acplt/graphSearch/bfs";
    app.createObject(objpath, factory);
    
    //hanging in urtasks
    // var urtask = "/Tasks/UrTask";
    // app.link(objpath+".taskparent", urtask);
    
    //setting active to 1
    app.setVariable(objpath+".start", "PE004");
    app.setVariable(objpath+".topologie", "/TechUnits/Topology");
    app.setVariable(objpath+".recipe", "{PE009 Heat}%20{PE009 Heat}%20{PE025 Turn}%20{PE025 Turn}");
    
    //setting active to 1
    // app.setVariable(objpath+".actimode", 1);
    
    app.refreshNode($('#tree').dynatree('getActiveNode'));
  }
  
  function quick_run_bfs_test(){
    app.createObject("/acplt/malloc","/acplt/ov/domain");
    app.createObject("/acplt/graphSearch","/acplt/ov/library");
    
    // creating
    var objpath = "/TechUnits/testBfs";
    var factory = "/acplt/graphSearch/testBfs";
    app.createObject(objpath, factory);
    
    //hanging in urtasks
    var urtask = "/Tasks/UrTask";
    app.link(objpath+".taskparent", urtask);
    
    //setting active to 1
    // app.setVariable(objpath+".start", "PE004");
    // app.setVariable(objpath+".topologie", "/TechUnits/Topology");
    // app.setVariable(objpath+".recipe", "{PE009 Heat}%20{PE025 Turn}%20{PE033}");
    
    //setting active to x
    app.setVariable(objpath+".actimode", 3);
  
  app.refreshNode($('#tree').dynatree('getActiveNode'));
}
function quick_run_draft(){
  // creating
  var objpath = "/TechUnits/draft";
  var factory = "/acplt/draft/test";
  app.createObject(objpath, factory);
  
  //hanging in urtasks
  var urtask = "/Tasks/UrTask";
  app.link(objpath+".taskparent", urtask);
  
  //setting active to 1
  app.setVariable(path+".targetKS", "localhost/MANAGER");
  // app.setVariable(path+".Submit", "TRUE");
  
  //setting active to 1
  app.setVariable(objpath+".actimode", 1);
  
  app.refreshNode($('#tree').dynatree('getActiveNode'));
}

function quick_run_gtpf(){
  // creating
  var objpath = "/TechUnits/gtpf";
  var factory = "/acplt/gtpf/assozierer";
  app.createObject(objpath, factory);


  app.setVariable(objpath+".Path", "/TechUnits/WandelbareTopologie");
  
  //hanging in urtasks
  var urtask = "/Tasks/UrTask";
  app.link(objpath+".taskparent", urtask);
  
  //setting active to 1
  // app.setVariable(path+".targetKS", "localhost/MANAGER");
  // app.setVariable(path+".Submit", "TRUE");
  
  //setting active to 1
  app.setVariable(objpath+".actimode", 3);
  
  app.refreshNode($('#tree').dynatree('getActiveNode'));
}

function quick_run_gtpfTest(){
  app.createObject("/acplt/malloc","/acplt/ov/domain");
  app.createObject("/acplt/TGraph","/acplt/ov/library");
  app.createObject("/acplt/ovunity","/acplt/ov/library");
  app.createObject("/acplt/gtpf","/acplt/ov/library");
  app.createObject("/acplt/gtpfTest","/acplt/ov/library");
  // creating
  var objpath = "/TechUnits/gtpfTest";
  var factory = "/acplt/gtpfTest/dijkstraTest";
  app.createObject(objpath, factory);
  
  //hanging in urtasks
  var urtask = "/Tasks/UrTask";
  app.link(objpath+".taskparent", urtask);
  
  //setting active to 1
  // app.setVariable(path+".targetKS", "localhost/MANAGER");
  // app.setVariable(path+".Submit", "TRUE");
  
  //setting active to 1
  app.setVariable(objpath+".actimode", 3);
  
  app.refreshNode($('#tree').dynatree('getActiveNode'));
}

function quick_run_TGraphTest(){
  app.createObject("/acplt/malloc","/acplt/ov/domain");
  app.createObject("/acplt/ovunity","/acplt/ov/library");
  app.createObject("/acplt/TGraph","/acplt/ov/library");
  app.createObject("/acplt/TGraphTest","/acplt/ov/library");
  // creatin
  var objpath = "/TechUnits/TGraphTest";
  var factory = "/acplt/TGraphTest/dijkstraTest";
  app.createObject(objpath, factory);
  
  //hanging in urtasks
  var urtask = "/Tasks/UrTask";
  app.link(objpath+".taskparent", urtask);
  
  //setting active to 1
  // app.setVariable(path+".targetKS", "localhost/MANAGER");
  // app.setVariable(path+".Submit", "TRUE");
  
  //setting active to 1
  app.setVariable(objpath+".actimode", 3);
  
  app.refreshNode($('#tree').dynatree('getActiveNode'));
}

function quick_run_syncTest(){
  app.createObject("/acplt/malloc","/acplt/ov/domain");
  app.createObject("/acplt/syncTest","/acplt/ov/library");
  // creating
  var objpath = "/TechUnits/syncTest";
  var factory = "/acplt/syncTest/sscSyncTest";
  app.createObject(objpath, factory);
  
  //hanging in urtasks
  var urtask = "/Tasks/UrTask";
  app.link(objpath+".taskparent", urtask);
  
  //setting active to 1
  // app.setVariable(path+".targetKS", "localhost/MANAGER");
  // app.setVariable(path+".Submit", "TRUE");
  
  //setting active to 1
  app.setVariable(objpath+".actimode", 3);
  
  app.refreshNode($('#tree').dynatree('getActiveNode'));
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}

