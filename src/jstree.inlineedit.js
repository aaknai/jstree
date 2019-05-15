/**
 * ### Contextmenu plugin
 *
 * Shows a context menu when a node is right-clicked.
 */
/*globals jQuery, define, exports, require, document */
(function(factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    define("jstree.contextmenu", ["jquery", "jstree"], factory);
  } else if (typeof exports === "object") {
    factory(require("jquery"), require("jstree"));
  } else {
    factory(jQuery, jQuery.jstree);
  }
})(function($, jstree, undefined) {
  "use strict";

  if ($.jstree.plugins.inlineedit) {
    return;
  }

  /**
   * stores all defaults for the contextmenu plugin
   * @name $.jstree.defaults.contextmenu
   * @plugin contextmenu
   */
  $.jstree.defaults.inlineedit = {};

  $.jstree.plugins.inlineedit = function(options, parent) {
    this.bind = function() {
      parent.bind.call(this);
      var inst = this;
      this._lastId = 0;
      this.element
        .on(
          "ready.jstree",
          $.proxy(function(evt, data) {
            if (!this.get_node("_add_#")) {
              this.create_node(
                null,
                { text: "Add child", id: "_add_#", type: "add_btn" },
                "last"
              );
              console.log("created node _add_#");
            }
            //this.get_container_ul().addClass('jstree-contextmenu');
            console.log("inlineedit on:", data);
          }, this)
        )
        .on(
          "model.jstree",
          $.proxy(function(evt, data) {
            console.log("model.jstree _lastId", this._lastId);
            if (!data.nodes) return;
            for (var i = 0; i < data.nodes.length; i++) {
              var obj = this.get_node(data.nodes[i]);
              if (!obj || obj.id.indexOf("_add_") === 0) return;
              var id = parseInt(obj.id);
              if (!isNaN(id) && id > this._lastId) this._lastId = id;
              var add_btn = this.get_node("_add_" + obj.id);
              if (!add_btn) {
                this.create_node(
                  obj,
                  { text: "Add child", id: "_add_" + obj.id, type: "add_btn" },
                  "last"
                );
                console.log("created node _add_" + obj.id);
              }
            }
          }, this)
        )
        .on(
          "changed.jstree",
          $.proxy(function(evt, data) {
            if (data.selected[0] && data.selected[0].indexOf("_add_") === 0) {
              console.log(
                "selected:",
                data.selected[0],
                this.get_node(data.selected[0])
              );
              var obj = this.get_node(data.selected[0]);
              var par = this.get_node(obj.parent);
              var newId = this._lastId + 1;
              this._lastId = newId;
              this.create_node(
                par,
                { data: { isNew: true }, id: newId.toString() },
                par.children.length == 0 ? 0 : par.children.length - 1,
                function(new_item) {
                  inst.edit(new_item);
                }
              );
            }
          }, this)
        );
    };
    this.teardown = function() {
      if (this._data.contextmenu.visible) {
        $.vakata.context.hide();
      }
      parent.teardown.call(this);
    };
  };
});
