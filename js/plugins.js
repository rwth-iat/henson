var plugins = [
  domainViewPlugIn,
  jsonViewPlugIn,
  compactViewPlugIn,
  cshmiViewPlugIn,
  engineeringViewPlugIn

  // {
  //   name: 'domain-view', // internal name for plugin, also creates a DOM element with ID
  //   title: 'Domain View', // title of the tab
  //   author: 'Christoph Sachsenhausen', // your name here
  //   activate: {
  //     always: true
  //   }, // activate condition, implemented: {exactClass: 'partial/path/of/class'}, {baseClass: 'partial/name/of/baseclass' or {always: true}
  //   foreground: true, // switch plugin to foreground on activation?
  //   refresh: true, // reload data on refresh?
  //   destroy: false, // should the plugin be destroyed if the activation condition does not match anymore?
  //   checkConditions: domainViewPlugIn.checkConditions,
  //   run: domainViewPlugIn.run
  // },
  // {
  //   name: 'compact-view', // internal name for plugin, also creates a DOM element with ID
  //   title: 'Compact View', // title of the tab
  //   author: 'Zolboo Erdenebayar', // your name here
  //   activate: {
  //     always: true
  //   }, // activate condition, implemented: {exactClass: 'partial/path/of/class'}, {baseClass: 'partial/name/of/baseclass' or {always: true}
  //   foreground: false, // switch plugin to foreground on activation?
  //   refresh: true, // reload data on refresh?
  //   destroy: false, // should the plugin be destroyed if the activation condition does not match anymore?
  //   checkConditions: compactViewPlugIn.checkConditions,
  //   run: compactViewPlugIn.run
  // },
  
  // {
  //   name: 'JSON', // internal name for plugin, also creates a DOM element with ID
  //   title: 'JSON', // title of the tab
  //   author: 'Zolboo Erdenebayar', // your name here
  //   activate: {
  //     always: true
  //   }, // activate condition, implemented: {exactClass: 'partial/path/of/class'}, {baseClass: 'partial/name/of/baseclass' or {always: true}
  //   foreground: false, // switch plugin to foreground on activation?
  //   refresh: true, // reload data on refresh?
  //   destroy: false, // should the plugin be destroyed if the activation condition does not match anymore?
  //   checkConditions: jsonViewPlugIn.checkConditions,
  //   run: jsonViewPlugIn.run
  // },
  // {
  //   name: 'cshmi-view',
  //   title: 'CSHMI',
  //   author: 'Christoph Sachsenhausen',
  //   activate: {
  //     baseClass: 'cshmi/Group'
  //   },
  //   foreground: true,
  //   refresh: true,
  //   destroy: true,
  //   checkConditions: cshmiViewPlugIn.checkConditions,
  //   run: cshmiViewPlugIn.run
  // },
  // {
  //   name: 'engineering-view',
  //   title: 'FB Engineering',
  //   author: 'Sten Gruener',
  //   activate: {
  //     baseClass: 'ov/domain'
  //   },
  //   foreground: false,
  //   refresh: true,
  //   destroy: true,
  //   checkConditions: engineeringViewPlugIn.checkConditions,
  //   run: engineeringViewPlugIn.run
  // }
];