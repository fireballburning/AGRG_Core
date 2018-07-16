/**
 * Controller module for loading sidebar widgets
 * @module app/SidebarController
 * @author David Kristiansen <david.kristiansen@nscc.ca>
 * @copyright Nova Scotia Community College 2017
 */
define([
    "dojo/_base/declare",
    "dojo/topic",
    "dijit/_WidgetBase",
    "dijit/layout/ContentPane",
    "dijit/TitlePane",
    "dojox/layout/GridContainerLite",

    //Add app widget modules here
    "app/widgets/LayerWidget",
    "app/widgets/BasemapWidget",
    "app/widgets/TextWidget"

],
function (
    declare,
    topic,
    _WidgetBase,
    ContentPane,
    TitlePane,
    GridContainer,

    //Add app widget module reference name here
    LayerWidget,
    BasemapWidget,
    TextWidget

) {
    return declare("app.SidebarController", [_WidgetBase], {
        gc: null,
        cp0: null,
        cp1: null,
        cp2: null,
        options: {
            map: null,
            data: null
        },
        /** @constructor
             * @param {object} param Object of properties to mixin
             * @param {object} srcRefNode Dom node for the widget to attach to
             **/
        constructor: function (param, srcRefNode) {
            /** mix in settings and defaults
                 * @mixin args
                 */
            declare.safeMixin(this.options, param);
            /** Dom widget node */
            this.domNode = srcRefNode;
            // store localized strings
            this.set("map", this.options.map);
            this.set("data", this.options.data);
        },
        /**
             * Calls createGridContainer after widget constructor finishes and before startup is called.
             * @public
             *
             **/
        postCreate: function () {
            this.createGridContainer();
        },
        /**
             * Starts the widget after it has been constructed
             * @public
             *
             **/
        startup: function () {
            this._init();
        },
        /**
             * Tells the grid container to start and begins adding widgets to the dom.
             * @private
             *
             **/
        _init: function () {
            this.gc.startup();
            this.addSidebarWidgets();
        },
        /**
             * Constructs the grid container and inserts content panes.
             * @todo create content panes dynamically based on an array or object of widgets.
             *
             **/
        createGridContainer: function () {
            this.gc = new GridContainer({
                nbZones: 1,
                dragHandleClass: 'dijitTitlePaneTitle',
                style: {
                    width: '100%'
                },
                doLayout: false
            }, "sidebarToolbar");

            this.cp0 = new ContentPane();
            this.gc.addChild(this.cp0);
            this.cp1 = new TitlePane({
                open: false
            });
            this.gc.addChild(this.cp1);
            this.cp2 = new TitlePane({
                open: false
            });
            this.gc.addChild(this.cp2);
        },
        /**
             * Adds the widgets to the side bar.
             *
             **/
        addSidebarWidgets: function () {

            var basemaps = new BasemapWidget({
                title: "Basemaps",
                map: this.map,
                pane: this.cp2
            });
            basemaps.startup();

            var tpLayers = new LayerWidget({
                title: "Layers",
                map: this.map,
                pane: this.cp1
            });
            tpLayers.startup();

            var text = new TextWidget({
                title: "Description",
                pane: this.cp0
            });
            text.startup();
            this.resize();
            topic.publish("Sidebar/Loaded");
        },
        /**
             * NOT IMPLEMENTED
             * @todo resize grid container externally
             */
        resize: function () {
            this.gc.resize();
        }
    });
});
