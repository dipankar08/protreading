export function cal_intraday_tax(bp: number, sp: number, qty: number) {
  var brokerage_buy: number = bp * qty * 0.0003 > 20 ? 20 : bp * qty * 0.0003;
  var brokerage_sell: number = sp * qty * 0.0003 > 20 ? 20 : sp * qty * 0.0003;
  var brokerage = brokerage_buy + brokerage_sell;

  var turnover = (bp + sp) * qty;

  var stt_total = Math.round(sp * qty * 0.00025);
  var isNSE = true;

  var exc_trans_charge = isNSE ? 0.0000345 * turnover : 0.0000345 * turnover;

  var cc = 0;

  var stax = 0.18 * (brokerage + exc_trans_charge);

  var sebi_charges = turnover * 0.0000005;

  var stamp_charges = bp * qty * 0.00003;

  var total_tax = brokerage + stt_total + exc_trans_charge + cc + stax + sebi_charges + stamp_charges;

  var breakeven = total_tax / qty;

  var net_profit = (sp - bp) * qty - total_tax;
  return {
    turnover: turnover,
    brokerage: brokerage,
    stt_total: stt_total,
    exc_trans_charge: exc_trans_charge,
    cc: cc,
    stax: stax,
    sebi_charges: sebi_charges,
    stamp_charges: stamp_charges,
    total_tax: total_tax,
    breakeven: breakeven,
    net_profit: net_profit,
  };
}

export function cal_delivery_tax(bp: number, sp: number, qty: number) {
  var turnover = (bp + sp) * qty;
  var brokerage = 0;
  var stt_total = Math.round(turnover * 0.001);

  let isNSE = true;

  var exc_trans_charge = isNSE ? 0.0000345 * turnover : 0.0000345 * turnover;
  var cc = 0;

  var stax = 0.18 * (brokerage + exc_trans_charge);

  var sebi_charges = turnover * 0.0000005;

  var stamp_charges = bp * qty * 0.00015;

  var total_tax = brokerage + stt_total + exc_trans_charge + cc + stax + sebi_charges + stamp_charges;

  var breakeven = total_tax / qty;

  var net_profit = (sp - bp) * qty - total_tax;
  return {
    turnover: turnover,
    brokerage: brokerage,
    stt_total: stt_total,
    exc_trans_charge: exc_trans_charge,
    cc: cc,
    stax: stax,
    sebi_charges: sebi_charges,
    stamp_charges: stamp_charges,
    total_tax: total_tax,
    breakeven: breakeven,
    net_profit: net_profit,
  };
}
