/**
 * Basemap Widget for changing the basemaps in an ESRI map using a content pane
 * @module app/widgets/BasemapWidget
 * @requires module:app/widgets/MapWidget
 * @author David Kristiansen <david.kristiansen@nscc.ca>
 * @copyright Nova Scotia Community College 2017
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/_WidgetBase",
    "dijit/_OnDijitClickMixin",
    "esri/dijit/BasemapGallery"
],
function (
    declare,
    lang,
    on,
    _WidgetBase,
    _OnDijitClickMixin,
    BasemapGallery
) {
    return declare([_WidgetBase, _OnDijitClickMixin], {
        baseClass: "basemapWidget",
        title: null,

        options: {
            map: null,
            pane: null
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
            // store localized strings
            this.title = this.options.title || "Basemap Gallery";
            this.set("map", this.options.map);
            this.set("pane", this.options.pane);
        },
        /**
             * Sets title and html content of the base class content pane.
             * Occurs after the constructor has run and dom elements have been created.
             *
             **/
        postCreate: function () {
            if (this.pane) {
                this.pane.set("title", this.title);
                this.pane.set("content", "<div id='basemapGallery'></div>");
            }
        },
        /**
             * Starts the widget after it has been constructed.
             * Checks to make sure the required map is loaded.
             * @public
             *
             **/
        startup: function () {
            // map not defined
            if (!this.map) {
                this.destroy();
            }
            // when map is loaded
            if (this.map.loaded) {
                this._init();
            } else {
                on(this.map, "load", lang.hitch(this, function () {
                    this._init();
                }));
            }
        },
        /**
             * Destroys widget
             * @public
             *
             **/
        destroy: function () {
            this.inherited(arguments);
        },
        /**
             * Loads the Esri basemap gallery widget
             * @private
             *
             **/
        _init: function () {
            var basemapGallery = new BasemapGallery({
                showArcGISBasemaps: true,
                map: this.map
            }, "basemapGallery");
            basemapGallery.startup();

            basemapGallery.on("error", function (msg) {
                console.error("basemap gallery error:  ", msg);
            });
        }
    });
});
