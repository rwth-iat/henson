var compactViewPlugIn = new function () {
  this.run = function (activeElementPath, data) {
    console.log("hello!")
  };
  
  this.checkConditions = function () { // startup function that checks conditions before running the plugin
    return true;
  }
}