/**
 * Entry point for the application
 * @module app/main
 * @author David Kristiansen <david.kristiansen@nscc.ca>
 * @copyright Nova Scotia Community College 2017
 */
define([
    "dojo/ready",
    "dojo/on",
    "dojo/dom",
    "dijit/registry",
    "dojo/topic",
    "dojo/keys",
    "dojo/cookie",

    "dijit/TooltipDialog",
    "dijit/popup",

    //App specific imports
    "app/Layout",
    "app/widgets/MapWidget",
    "app/SidebarController"
],
function (
    ready,
    on,
    dom,
    registry,
    topic,
    keys,
    cookie,

    TooltipDialog,
    popup,

    Layout,
    MapWidget,
    SidebarController
) {
    var app = {};

    app.layout = new Layout({
        title: "AGRG Core Template",
        description: "Map centric template for AGRG",
        sidebarContent: "",
        mapContent: "<div id='homebutton'></div> <img id='loadingImg' src='//js.arcgis.com/3.19/esri/themes/calcite/images/loadingIndicator/loading-dark.gif' />",
        footerContent: "Created by AGRG of the NSCC &copy;2018"
    }, dom.byId("main"));

    app.mapWidget = new MapWidget({
        navigationMode: 'css-tranforms',
        extent: {
            "xmin": -67.42191601562364,
            "ymin": 43.559155856810165,
            "xmax": -59.12723828124905,
            "ymax": 46.9227486438679,
            "spatialReference": {
                "wkid": 4326
            }
        },
        basemap: 'topo',
        geocoder: true
    });

    app.Data = {};
    app.layout.startup();
    app.mapWidget.startup();
    app.sidebarController = new SidebarController({
        map: app.mapWidget.map,
        data: app.Data
    });
    app.sidebarController.startup();

    return app;
});
