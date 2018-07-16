/**
 * Text Widget for showing text in a content pane
 * @module app/widgets/TextWidget
 * @author David Kristiansen <david.kristiansen@nscc.ca>
 * @copyright Nova Scotia Community College 2017
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",

    "dijit/_WidgetBase",
    "dijit/_OnDijitClickMixin"
],
function (
    declare,
    lang,
    on,
    topic,

    _WidgetBase,
    _OnDijitClickMixin
) {

    return declare([_WidgetBase, _OnDijitClickMixin], {

        title: null,
        options: {
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
            // properties
            this.title = this.options.title || "Description";
            this.set("pane", this.options.pane);
        },
        /**
             * Sets title and html content of the base class content pane.
             * Occurs after the constructor has run and dom elements have been created.
             *
             **/
        postCreate: function () {
            //                console.log("TextWidget::postCreate");
            if (this.pane) {
                this.pane.set("title", this.title);
                this.pane.set("content", "<div id='Description'><h3 style='text-align:center;'>Description</h3><p>Spicy jalapeno bacon ipsum dolor amet sunt flank venison quis sirloin. Enim salami irure shoulder incididunt short ribs cupidatat, aute beef ribs capicola anim ball tip nulla. Beef jerky pork loin burgdoggen deserunt dolor. Ea nostrud leberkas kevin ham hock.</p></div>");
            }
        },
        /**
             * Starts the widget after it has been constructed.
             * @public
             *
             **/
        startup: function () {
            //                console.log("TextWidget::startup");
        },
        /**
             * Destroys widget.
             * @public
             *
             **/
        destroy: function () {
            this.inherited(arguments);
        },
        /**
             * Not required.
             * @private
             *
             **/
        _init: function () {
            //                console.log("TextWidget::_init");
        }
    });
});
