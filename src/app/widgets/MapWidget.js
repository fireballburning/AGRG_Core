/**
 * Widget that renders the map and the Esri widgets on the map
 * @module app/widgets/MapWidget
 * @author David Kristiansen <david.kristiansen@nscc.ca>
 * @copyright Nova Scotia Community College 2017
 */

define([
    "dojo/dom",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "dojo/json",
    "dijit/registry",

    "esri/domUtils",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/map",
    "esri/SpatialReference",
    "esri/geometry/Extent",
    "esri/geometry/Point",
    "esri/dijit/Scalebar",
    "esri/dijit/HomeButton",
    "esri/tasks/QueryTask",
    "esri/tasks/query",

    "esri/graphic",
    "esri/lang",
    "dojo/dom-style",
    "dijit/TooltipDialog",
    "dijit/popup",

    "dojo/text!../Layers.json"
], function (
    dom,
    declare,
    lang,
    on,
    topic,
    JSON,
    registry,

    domUtils,
    ArcGISDynamicMapServiceLayer,
    FeatureLayer,
    Map,
    SpatialReference,
    Extent,
    Point,
    Scalebar,
    HomeButton,
    QueryTask,
    Query,

    Graphic, esriLang,
    domStyle,
    TooltipDialog, dijitPopup,

    jsonLayers
) {
    return declare([], {
        map: null,
        homeButton: null,
        scalebar: null,
        options: {
            extent: null,
            center: null,
            zoom: null,
            basemap: null
        },
        /** @constructor
             * @param {object} args Object of properties to mixin
             * @param {object} srcRefNode Dom node for the widget to attach to
             **/
        constructor: function (param, srcRefNode) {
            /** mix in settings and defaults
                 * @mixin args
                 */
            declare.safeMixin(this.options, param);
            /** Dom widget node */
            this.domNode = srcRefNode;
            // properties
            this.extent = this.options.extent || null;
            this.center = this.options.center || null;
            this.zoom = this.options.zoom || 13;
            this.basemap = this.options.basemap || "topo";
        },
        /**
        * Starts the widget after the dom has been constructed.
        * Calls createMap and sets up the map widgets and calls addlayers: scalebar, homebutton and flood level slider
        **/
        startup: function () {
            this.createMap();

            this.scalebar = new Scalebar({
                map: this.map,
                // "dual" displays both miles and kilmometers
                // "english" is the default, which displays miles
                // use "metric" for kilometers
                scalebarUnit: "dual",
                //                scalebarStyle: "ruler",
                //                attachTo: "bottom-right"
            });

            this.homeButton = new HomeButton({
                map: this.map
            }, "homebutton");
            this.homeButton.startup();
            this.addLayers();
        },
        /**
        * Creates the map per Esri JSAPI
        * Checks extent and sets it accordingly
        **/
        createMap: function () {
            if (this.extent === null) {
                if (this.center === null) {
                    console.error("No center or extent for map. Defaulting to Halifax, NS.");
                    this.map = new Map("mapDiv", {
                        center: [-63.60, 44.65],
                        zoom: this.zoom,
                        basemap: this.basemap
                    });
                } else {
                    this.map = new Map("mapDiv", {
                        center: this.center,
                        zoom: this.zoom,
                        basemap: this.basemap
                    });
                }

            } else {

                this.map = new Map("mapDiv", {
                    extent: new Extent(this.extent),
                    basemap: this.basemap
                });
            }
        },
        /**
        * Parses the JSON files of Layers.json and adds them to the map.
        * Adds the feature layer used as the overview.
        * Sets up map events and popups.
        **/
        addLayers: function () {
            var map = this.map;

            on(map, "update-end", hideLoading);
            on(map, "update-start", showLoading);

            var loading = dom.byId("loadingImg");

            function showLoading() {
                domUtils.show(loading);
            }

            function hideLoading() {
                domUtils.hide(loading);
            }

            var oLayers = JSON.parse(jsonLayers);
            var aLayers = [];
            for (var i = 0; i < oLayers.layers.length; i++) {
                var temp = new ArcGISDynamicMapServiceLayer(oLayers.layers[i].url, {
                    id: oLayers.layers[i].id,
                    visible: oLayers.layers[i].visible,
                    opacity: oLayers.layers[i].opacity
                });
                var tmpLegend = oLayers.layers[i].legend;
                lang.mixin(temp, {
                    title: oLayers.layers[i].title,
                    legend: tmpLegend
                });
                aLayers.push(temp);
            }
            this.map.addLayers(aLayers);
        }
    });
});
