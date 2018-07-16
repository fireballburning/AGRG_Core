/**
 * Widget that displays the widgets of the ESRI map and provides layer controls
 * @module app/widget/LayerWidget
 * @requires module:app/widget/MapWidget
 * @author David Kristiansen <david.kristiansen@nscc.ca>
 * @copyright Nova Scotia Community College 2017
 */
define([
    "dojo/dom",
    "dojo/on",
    "dojo/topic",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "dijit/registry",
    "dijit/_WidgetBase",
    "dijit/_OnDijitClickMixin",
    "dijit/form/CheckBox",
    "dijit/form/Select"
],
function (
    dom,
    on,
    topic,
    domConstruct,
    arrayUtils,
    declare,
    lang,
    ArcGISDynamicMapServiceLayer,
    registry,
    _WidgetBase,
    _OnDijitClickMixin,
    CheckBox, Select
) {
    return declare([_WidgetBase, _OnDijitClickMixin], {

        baseClass: "layerWidget",
        title: null,
        options: {
            map: null,
            visible: true,
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
            this.title = this.options.title || "Map Layers";
            this.set("map", this.options.map);
            this.set("visible", this.options._visible);
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
                this.pane.set("content", "<div id='layer_list' class='" + this.baseClass + "'><div class='description'><p>Checkbox toggles layer on/off.</p><p>Drop-down changes opacity (0-100%).</p></div></div>");
            }
        },
        /**
             * Starts the widget after it has been constructed.
             * Checks to make sure the required map is loaded and layers have been added.
             * @public
             *
             **/
        startup: function () {
            // map not defined
            if (!this.map) {
                this.destroy();
                console.warn("LayerWidget::map required");
            }
            // when map is loaded
            if (this.map.loaded) {
                this._init();
            } else {
                on(this.map, "load", lang.hitch(this, function () {
                    this._init();
                }));

            }
            on(this.map, "layers-add-result", lang.hitch(this, function (evt) {
                this.buildLayerList(evt);
            }));
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
             * NOT IMPLEMENTED
             * @todo poll for layers being added and removed
             **/
        _init: function () {

        },
        /**
             * Builds the list of layers and adds opacity and visibilty controls.
             * @public
             **/
        buildLayerList: function (evt) {
            var tempMap = this.map;
            //add check boxes
            arrayUtils.forEach(evt.layers.reverse(), function (layer) {
                var layerName = layer.layer.title;
                domConstruct.create("span", {
                    id: layer.layer.id,
                    class: "tocDiv"
                }, dom.byId("layer_list"));

                var checkBox = new CheckBox({
                    id: "checkBox" + layer.layer.id,
                    class: "chkLayer",
                    name: "checkBox" + layer.layer.id,
                    value: layer.layer.id,
                    checked: layer.layer.visible,
                    onChange: function () {
                        var targetLayer = tempMap.getLayer(this.value);
                        targetLayer.setVisibility(!targetLayer.visible);
                        this.checked = targetLayer.visible;
                    }
                });

                var layerAlpha = new Select({
                    className: "selLayer",
                    name: "select" + layer.layer.id,
                    options: [{
                        label: "100%",
                        value: "1"
                    }, {
                        label: "90%",
                        value: ".9"
                    }, {
                        label: "80%",
                        value: ".8"
                    }, {
                        label: "70%",
                        value: ".7"
                    }, {
                        label: "60%",
                        value: ".6"
                    }, {
                        label: "50%",
                        value: ".5"
                    }, {
                        label: "40%",
                        value: ".4"
                    }, {
                        label: "30%",
                        value: ".3"
                    }, {
                        label: "20%",
                        value: ".2"
                    }, {
                        label: "10%",
                        value: ".1"
                    }, {
                        label: "0%",
                        value: "0"
                    }]
                });
                try {
                    layerAlpha.set("value", layer.layer.opacity);
                } catch (error) {
                    console.error(error);
                    console.error("unable to set transparency to " + layer.opacity + " of " + layer.id);
                    layerAlpha.set("value", "1");
                }

                layerAlpha.on("change", function (value) {
                    layer.layer.setOpacity((value));
                });

                //add the check box and label to the toc
                domConstruct.place(checkBox.domNode, dom.byId(layer.layer.id));

                var checkLabel = domConstruct.create("label", {
                    className: "lblLayer",
                    style: {
                        display: "block"
                    },
                    "for": "checkBox" + layer.layer.id,
                    innerHTML: layerName
                }, checkBox.domNode, "after");
                domConstruct.place(layerAlpha.domNode, checkLabel, "after");
            });
        }
    });
});
