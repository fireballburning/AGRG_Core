/**
 * Module that creates the application layout
 * @module app/Layout
 * @author David Kristiansen <david.kristiansen@nscc.ca>
 * @copyright Nova Scotia Community College 2017
 */
define([
    "dojo/dom",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane"
], function(
    dom,
    declare,
    lang,
    _WidgetBase,
    BorderContainer,
    ContentPane
) {
    return declare("app.Layout", [_WidgetBase, BorderContainer], {

        title: null,
        description: null,
        sidebarContent: null,
        mapContent: null,
        footerContent: null,
        options: {
            gutters: false,
            design: "headline",
            id: "mainContainer"
        },
        /** @constructor
          * @param {object} args Object of properties to mixin
          * @param {object} srcRefNode Dom node for the widget to attach to
          **/
        constructor: function(args, srcRefNode) {
            /** mix in settings and defaults
            * @mixin args
            */
            declare.safeMixin(this.options, args);
            /** Dom widget node */
            this.domNode = srcRefNode;
            /** Title */
            this.title = args.title || "TITLE";
            /** Sidebar content */
            this.sidebarContent = this.options.sidebarContent || "Sidebar goes here...";
            /** Map Widget content*/
            this.mapContent = this.options.mapContent || "Map goes here...";
            /** Footer html content */
            this.footerContent = this.options.footerContent || "Developed using Esri JavaScript API and the Dojo Tookit";
            this.set("design", this.options.design);
            this.set("gutters", this.options.gutters);
            this.set("id", this.options.id);
        },
        /**
          * Creates Dojo content panes in the Dojo border container after constructor has run.
          * Top title pane, sidebar, map area and footer.
          *
          **/
        postCreate: function() {
            this.addChild(new ContentPane({
                id: "topDiv",
                content: "<a href='http://nscc.ca'><img id='logoLeft' src='app/resources/logos/nscc_applied_research.png' alt='NSCC Applied Research Logo'></a><h1 id='title'>" + this.title + "</h1><a href='http://agrg.cogs.nscc.ca'><img id='logo' src='app/resources/logos/AGRG_rgb_150.png' alt='AGRG Logo'></a>",
                region: "top"
            }));
            this.addChild(new ContentPane({
                id: "sidebarDiv",
                content: "<span id='sidebarToolbar'></span>" + this.sidebarContent,
                //                content: this.sidebarContent,
                region: "left",
                splitter:true
            }));
            this.addChild(new ContentPane({
                id: "mapDiv",
                content: this.mapContent,
                region: "center"
            }));
            this.addChild(new ContentPane({
                id: "footerDiv",
                content: "<p>" + this.footerContent + "</p>",
                region: "bottom"
            }));
        }
    });

});
