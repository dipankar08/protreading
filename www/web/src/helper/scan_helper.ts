/****************************************************** 
This function will convert the UI scan JS object to filter string which should be send to backend.
we need to do teh reverse when we want to do the same.
// This maily recusrive function which serialize the tree to string
// see the test code to understand how we serilaie the data
*******************************************************/

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
