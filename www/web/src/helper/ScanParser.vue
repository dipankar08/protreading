<template>
  <div class="scan_parser d_layout_col" :id="filter_id">
    <div class="filter">
      <div class="filter_group">
        <p class="header">
          Stock <span class="combination_ref references" data-key="combination" data-value="and"> passes all </span> of the below filters:
        </p>
        <ul class="rules"></ul>
        <p class="action"><span class="btn_addrow mdi-plus-box mdi"></span></p>
      </div>

      <ul>
        <li></li>
      </ul>
    </div>
    <p class="preview">Preview: {{ preview }}</p>
    <select class="combination_selector selector">
      <option value="and">Pass All</option>
      <option value="or">Pass Any</option>
    </select>
    <select class="segment_selector selector">
      <option value="segment:cash">Cash</option>
      <option value="segment:future">Future</option>
    </select>
    <select class="indicator_selector selector">
      <option v-for="item in indicator_list" :key="item.key" :value="`${item.key}`">{{ item.text }}</option>
    </select>
    <select class="operator_selector selector">
      <option v-for="item in operator_list" :key="item.key" :value="`${item.key}`">{{ item.text }}</option>
    </select>
    <select class="offset_selector selector">
      <option v-for="item in offset_list" :key="item.key" :value="`${item.key}`">{{ item.text }}</option>
    </select>
    <input class="input_selector selector" />
  </div>
</template>
<script>
import $ from "jquery";
import { convertRuleDictToRuleStr } from "./scan_helper";
import { assertOrThrow } from "../../../libs/app";
import { INDICATOR_LIST, OFFSET_LIST, OPERATOR_LIST } from "./const";

export default {
  props: {
    filter_id: String,
  },
  data() {
    return {
      preview: "",
      indicator_list: INDICATOR_LIST,
      offset_list: OFFSET_LIST,
      operator_list: OPERATOR_LIST,
    };
  },
  methods: {
    hideAll() {
      $(`#${this.filter_id} .selector`).hide();
      $(`#${this.filter_id} .references`)
        .css("width", "auto")
        .css("opacity", "1");
    },
    updateData() {
      let result = {
        node_type: "group",
      };
      // find filetr head
      let head_group = $(`#${this.filter_id}`).find(".filter_group")[0];
      // find filter head confition
      result.combination = $(head_group)
        .find(".header")
        .find(".references")
        .attr("data-value");
      result.child = [];
      let rule_list_ele = $(head_group)
        .find(".rule_list")
        .get();
      for (let x of rule_list_ele) {
        // Just ignore disabled item.
        if (
          $(x)
            .closest("li")
            .hasClass("disabled")
        ) {
          continue;
        }
        let fx_group_ele = $(x)
          .find(".fx_group")
          .get();
        let fx_group = [];
        for (let y of fx_group_ele) {
          let value = {};
          for (let t of $(y)
            .find(".references")
            .get()) {
            value[$(t).attr("data-key")] = $(t).attr("data-value");
          }
          let type = $(y).hasClass("indicator_group") ? "indicator_group" : "operator_group";
          fx_group.push({ type: type, value: value });
        }
        result.child.push({ node_type: "edge", expression: fx_group });
      }
      this.preview = convertRuleDictToRuleStr(result);
      this.$emit("OnChange", this.preview);
    },
    convertRuleDictToRuleStr() {},
  },
  mounted() {
    this.hideAll();
  },
  created() {
    assertOrThrow(this.filter_id != null, "You must pass a assert id");
    let filter_id = this.filter_id;
    let _vue = this;

    //Common Veriable
    var global_current_ref = null;
    var indicator_html = `<span class='indicator_group fx_group'>
             <span class='indicator_ref references' data-key='indicator' data-value='--'>Select</span>
             <span class='offset_ref references' data-key='offset' data-value='1d:0'>[0]day</span>
             <span class='input_ref references ignore' data-key='number' data-value='--'>Select</span>
            </span>
      `;
    var operator_html = `<span class='operator_group fx_group'> <span class="operator_ref references" data-key="operator" data-value='--'>Select</span></span>`;
    var empty_rule_html = `<li>
            <span class="rule_list"></span>
            <span class = "btn_list">
              <span class="btn_add_fx_group mdi mdi-view-grid-plus-outline"></span>
              <span class="btn_disable_row mdi-toggle-switch mdi"></span>
              <span class="btn_duplicate_row mdi-content-duplicate mdi"></span>
              <span class="btn_delete_row mdi-close-circle mdi"></span>
            </span>
      </li>`;

    // Helper function
    function showSelectorHideRef(ref, selector) {
      _vue.hideAll();
      ref = $(ref);
      global_current_ref = ref;
      selector = $(selector);
      selector.css("top", ref.position().top + 4);
      selector.css("left", ref.position().left);
      ref.css("width", "101px");
      ref.css("opacity", "0");
      selector.val(ref.attr("data-value"));
      selector.show();
    }
    function addIndicatorGroup(where) {
      let indicator = $(where).append(indicator_html);
      showSelectorHideRef(
        $(indicator)
          .find(".indicator_ref")
          .last(),
        `#${filter_id}  .indicator_selector`
      );
    }
    function addOperatorGroup(where) {
      let operator = $(where).append(operator_html);
      showSelectorHideRef(
        $(operator)
          .find(".operator_ref")
          .last(),
        `#${filter_id}  .operator_selector`
      );
    }
    function appendNewFXGroup(rule_list) {
      if (
        $(rule_list)
          .children()
          .last()
          .hasClass("indicator_group")
      ) {
        addOperatorGroup(rule_list);
      } else {
        addIndicatorGroup(rule_list);
      }
    }

    // define when ref is clicked
    for (let x of ["segment", "combination", "indicator", "operator", "offset", "input"]) {
      $(document).on("click", ` #${filter_id} .${x}_ref`, function(event) {
        _vue.hideAll();
        showSelectorHideRef(this, `#${filter_id}  .${x}_selector`);
        event.stopPropagation();
      });
    }

    $(document).on("change", `#${this.filter_id} .selector`, function() {
      let cur_selector = $(this);
      let current_ref = global_current_ref;

      // default
      current_ref.attr("data-value", this.value + "");
      current_ref.html($(this.selectedOptions).html());

      // for input just print the input.
      if (cur_selector.hasClass("input_selector")) {
        current_ref.html(this.value + "");
      }

      // You need show and hide base on indicator selector
      if (cur_selector.hasClass("indicator_selector")) {
        if (this.value == "number") {
          current_ref
            .closest(".indicator_group")
            .find(".offset_ref")
            .addClass("ignore");
          current_ref
            .closest(".indicator_group")
            .find(".input_ref")
            .removeClass("ignore");
        } else {
          current_ref
            .closest(".indicator_group")
            .find(".offset_ref")
            .removeClass("ignore");
          current_ref
            .closest(".indicator_group")
            .find(".input_ref")
            .addClass("ignore");
        }
      }

      // Do you need to auto add operator or indicator.
      if (global_current_ref.closest(".rule_list").length > 0 && global_current_ref.closest(".rule_list").children().length <= 2) {
        appendNewFXGroup(global_current_ref.closest(".rule_list"));
      } else {
        _vue.hideAll();
      }
      // now update the UI
      _vue.updateData();
    });

    $(document).on("click", `#${this.filter_id} .btn_addrow`, function() {
      let cur_rule = $(this)
        .closest(".filter_group")
        .find("ul")
        .append(empty_rule_html);
      addIndicatorGroup(cur_rule.find(".rule_list"));
      _vue.updateData();
    });

    $(document).on("click", `#${this.filter_id} .btn_disable_row`, function() {
      $($(this).closest("li")).toggleClass(`disabled`);
      _vue.updateData();
    });

    $(document).on("click", `#${this.filter_id} .btn_duplicate_row`, function() {
      $($(this).closest("li"))
        .clone(true)
        .insertAfter($(this).closest("li"));
      _vue.updateData();
    });

    $(document).on("click", `#${this.filter_id} .btn_delete_row`, function() {
      $($(this).closest("li")).remove();
      _vue.hideAll();
      _vue.updateData();
    });

    $(document).on("click", `#${this.filter_id} .btn_add_fx_group`, function() {
      appendNewFXGroup(
        $(this)
          .closest("li")
          .find(".rule_list")
      );
      _vue.updateData();
    });
  },
};
</script>
<style lang="scss">
.scan_parser {
  .selector {
    position: absolute;
    top: 0;
    left: 0;
    width: 101px;
  }
  .references {
    color: black;
    display: inline-block;
    cursor: pointer;
    border-radius: 10px;
    padding: 2px;
    font-size: 1rem;
    &:hover {
      background: whitesmoke;
    }
    &.opacity_zero {
      opacity: 0;
    }
    &.ignore {
      display: none;
    }
    &.operator_ref {
      font-weight: bolder;
      color: #f53030;
    }
    &.indicator_ref {
      color: #21b121;
      font-weight: bolder;
    }
    &.offset_ref {
      color: grey;
      text-transform: lowercase;
    }
  }
  .filter {
    ul {
      border-left: 1px dotted #11111166;
      padding-left: 10px;
      li {
        margin-top: 10px;
        list-style: none;
        &.disabled {
          opacity: 0.4;
        }
      }
    }
  }
  .preview {
    opacity: 0.5;
    font-size: 12px;
    margin-top: 10px;
  }
  .btn_list {
    margin-left: 14px;
    .mdi {
      font-size: 17px;
      margin: 10px 0px;
    }
  }
  .action {
    .mdi {
      font-size: 30px;
      color: #1abf1a;
      opacity: 1;
    }
  }
  .mdi {
    padding: 0px 5px;
    cursor: pointer;
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
