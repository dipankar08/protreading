/****************************************************** 
import { TObject } from '@/common/types';
This function will convert the UI scan JS object to filter string which should be send to backend.
we need to do teh reverse when we want to do the same.
// This maily recusrive function which serialize the tree to string
// see the test code to understand how we serilaie the data
*******************************************************/

import { TObject } from "@/common/types";

let ONE_RULE_ACTION_BUTTON = `<span class="btn_list">
              <span class="btn_add_fx_group mdi mdi-view-grid-plus-outline"></span>
              <span class="btn_disable_row mdi-toggle-switch mdi"></span>
              <span class="btn_duplicate_row mdi-content-duplicate mdi"></span>
              <span class="btn_delete_row mdi-close-circle mdi"></span>
            </span>`;
let ADD_ROW_BUTTON_HTML = `
<span class="btn_addrow mdi-plus-box mdi action"></span>`;

// This function will HTML and Convert into a Object Tree
export function convert_html_to_rule_dict(filter_id: string): TObject {
  let result: TObject = {
    node_type: "group",
  };
  // find filetr head
  let head_group = $(`#${filter_id}`).find(".filter_group")[0];
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
  return result;
}

export function convertRuleDictToRuleStr(input: any): string {
  console.log(input);
  if (input.node_type == "group") {
    if (!input.child) return "";
    return input.child.map((x: any) => ` ( ${convertRuleDictToRuleStr(x)} ) `).join(input.combination);
  } else if (input.node_type == "edge") {
    let merge_exp = "";
    for (let fx_group of input.expression) {
      if (!fx_group) {
        continue;
      }
      if (fx_group.type == "indicator_group") {
        if (fx_group.value.indicator == "number") {
          merge_exp += ` ${fx_group.value.number} `;
        } else {
          merge_exp += ` indicator:${fx_group.value.offset}:${fx_group.value.indicator} `;
        }
      } else if (fx_group.type == "operator_group") {
        merge_exp += ` ${fx_group.value.operator} `;
      }
    }
    return merge_exp;
  } else {
    throw new Error("Unsupported node_type");
  }
}

////// DERISLIZATION////////
// number is not supported...
// one one rule group is supported..
// WE DONT NEED AS WE JUST SAVED THE HTML AS WELL

/*
// Test Code
console.log(
  convertRuleDictToRuleStr({
    node_type: "group",
    combination: "or",
    child: [
      {
        node_type: "edge",
        expression: [
          { type: "indicator_group", value: ["indicator:ema", "offset:day:0", "number:10"] },
          { type: "operator_group", value: "operator:>" },
        ],
      },

      {
        node_type: "edge",
        expression: [
          { type: "indicator_group", value: ["indicator:ema", "offset:day:0", "number:10"] },
          { type: "operator_group", value: "operator:>" },
        ],
      },
      {
        node_type: "edge",
        expression: [
          { type: "indicator_group", value: ["indicator:ema", "offset:day:0", "number:10"] },
          { type: "operator_group", value: "operator:>" },
        ],
      },
      {
        node_type: "group",
        combination: "and",
        child: [
          {
            node_type: "edge",
            expression: [
              { type: "indicator_group", value: ["indicator:ema", "offset:day:0", "number:10"] },
              { type: "operator_group", value: "operator:>" },
            ],
          },
          {
            node_type: "edge",
            expression: [
              { type: "indicator_group", value: ["indicator:ema", "offset:day:0", "number:10"] },
              { type: "operator_group", value: "operator:>" },
            ],
          },
        ],
      },
    ],
  })
);
*/
