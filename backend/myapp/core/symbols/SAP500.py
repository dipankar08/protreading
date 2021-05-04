
# FTSE100 Data from https://en.wikipedia.org/wiki/S%26P_100
# Run the below script to get the data
#
"""
var data = [];
for(var x of $("#constituents tr")){
   var tds = $(x).find('td')
   data.push({'company':$(tds[1]).text().trim(), 'symbol': $(tds[0]).text().trim(), 'sector': $(tds[2]).text().trim()});    
}
console.log(JSON.stringify(data,null,1))
"""
SAP100_DATASET = [
    {
        "company": "",
        "symbol": "",
        "sector": ""
    },
    {
        "company": "Apple Inc.",
        "symbol": "AAPL",
        "sector": "Information Technology"
    },
    {
        "company": "AbbVie Inc.",
        "symbol": "ABBV",
        "sector": "Health Care"
    },
    {
        "company": "Abbott Laboratories",
        "symbol": "ABT",
        "sector": "Health Care"
    },
    {
        "company": "Accenture",
        "symbol": "ACN",
        "sector": "Information Technology"
    },
    {
        "company": "Adobe Inc.",
        "symbol": "ADBE",
        "sector": "Information Technology"
    },
    {
        "company": "American International Group",
        "symbol": "AIG",
        "sector": "Financials"
    },
    {
        "company": "Amgen Inc.",
        "symbol": "AMGN",
        "sector": "Health Care"
    },
    {
        "company": "American Tower",
        "symbol": "AMT",
        "sector": "Real Estate"
    },
    {
        "company": "Amazon.com",
        "symbol": "AMZN",
        "sector": "Consumer Discretionary"
    },
    {
        "company": "Broadcom Inc.",
        "symbol": "AVGO",
        "sector": "Information Technology"
    },
    {
        "company": "American Express",
        "symbol": "AXP",
        "sector": "Financials"
    },
    {
        "company": "Boeing Co.",
        "symbol": "BA",
        "sector": "Industrials"
    },
    {
        "company": "Bank of America Corp",
        "symbol": "BAC",
        "sector": "Financials"
    },
    {
        "company": "Biogen",
        "symbol": "BIIB",
        "sector": "Health Care"
    },
    {
        "company": "The Bank of New York Mellon",
        "symbol": "BK",
        "sector": "Financials"
    },
    {
        "company": "Booking Holdings",
        "symbol": "BKNG",
        "sector": "Consumer Discretionary"
    },
    {
        "company": "BlackRock Inc",
        "symbol": "BLK",
        "sector": "Financials"
    },
    {
        "company": "Bristol-Myers Squibb",
        "symbol": "BMY",
        "sector": "Health Care"
    },
    {
        "company": "Berkshire Hathaway",
        "symbol": "BRK.B",
        "sector": "Financials"
    },
    {
        "company": "Citigroup Inc",
        "symbol": "C",
        "sector": "Financials"
    },
    {
        "company": "Caterpillar Inc.",
        "symbol": "CAT",
        "sector": "Industrials"
    },
    {
        "company": "Charter Communications",
        "symbol": "CHTR",
        "sector": "Communication Services"
    },
    {
        "company": "Colgate-Palmolive",
        "symbol": "CL",
        "sector": "Consumer Staples"
    },
    {
        "company": "Comcast Corp.",
        "symbol": "CMCSA",
        "sector": "Communication Services"
    },
    {
        "company": "Capital One Financial Corp.",
        "symbol": "COF",
        "sector": "Financials"
    },
    {
        "company": "ConocoPhillips",
        "symbol": "COP",
        "sector": "Energy"
    },
    {
        "company": "Costco Wholesale Corp.",
        "symbol": "COST",
        "sector": "Consumer Staples"
    },
    {
        "company": "Salesforce",
        "symbol": "CRM",
        "sector": "Information Technology"
    },
    {
        "company": "Cisco Systems",
        "symbol": "CSCO",
        "sector": "Information Technology"
    },
    {
        "company": "CVS Health",
        "symbol": "CVS",
        "sector": "Health Care"
    },
    {
        "company": "Chevron Corporation",
        "symbol": "CVX",
        "sector": "Energy"
    },
    {
        "company": "DuPont de Nemours Inc",
        "symbol": "DD",
        "sector": "Materials"
    },
    {
        "company": "Danaher Corporation",
        "symbol": "DHR",
        "sector": "Health Care"
    },
    {
        "company": "The Walt Disney Company",
        "symbol": "DIS",
        "sector": "Communication Services"
    },
    {
        "company": "Dow Inc.",
        "symbol": "DOW",
        "sector": "Materials"
    },
    {
        "company": "Duke Energy",
        "symbol": "DUK",
        "sector": "Utilities"
    },
    {
        "company": "Emerson Electric Co.",
        "symbol": "EMR",
        "sector": "Industrials"
    },
    {
        "company": "Exelon",
        "symbol": "EXC",
        "sector": "Utilities"
    },
    {
        "company": "Ford Motor Company",
        "symbol": "F",
        "sector": "Consumer Discretionary"
    },
    {
        "company": "Facebook, Inc.",
        "symbol": "FB",
        "sector": "Communication Services"
    },
    {
        "company": "FedEx",
        "symbol": "FDX",
        "sector": "Industrials"
    },
    {
        "company": "General Dynamics",
        "symbol": "GD",
        "sector": "Industrials"
    },
    {
        "company": "General Electric",
        "symbol": "GE",
        "sector": "Industrials"
    },
    {
        "company": "Gilead Sciences",
        "symbol": "GILD",
        "sector": "Health Care"
    },
    {
        "company": "General Motors",
        "symbol": "GM",
        "sector": "Consumer Discretionary"
    },
    {
        "company": "Alphabet Inc. (Class C)",
        "symbol": "GOOG",
        "sector": "Communication Services"
    },
    {
        "company": "Alphabet Inc. (Class A)",
        "symbol": "GOOGL",
        "sector": "Communication Services"
    },
    {
        "company": "Goldman Sachs",
        "symbol": "GS",
        "sector": "Financials"
    },
    {
        "company": "The Home Depot",
        "symbol": "HD",
        "sector": "Consumer Discretionary"
    },
    {
        "company": "Honeywell",
        "symbol": "HON",
        "sector": "Industrials"
    },
    {
        "company": "International Business Machines",
        "symbol": "IBM",
        "sector": "Information Technology"
    },
    {
        "company": "Intel Corp.",
        "symbol": "INTC",
        "sector": "Information Technology"
    },
    {
        "company": "Johnson & Johnson",
        "symbol": "JNJ",
        "sector": "Health Care"
    },
    {
        "company": "JPMorgan Chase & Co.",
        "symbol": "JPM",
        "sector": "Financials"
    },
    {
        "company": "Kraft Heinz",
        "symbol": "KHC",
        "sector": "Consumer Staples"
    },
    {
        "company": "The Coca-Cola Company",
        "symbol": "KO",
        "sector": "Consumer Staples"
    },
    {
        "company": "Linde plc",
        "symbol": "LIN",
        "sector": "Industrials"
    },
    {
        "company": "Eli Lilly and Company",
        "symbol": "LLY",
        "sector": "Health Care"
    },
    {
        "company": "Lockheed Martin",
        "symbol": "LMT",
        "sector": "Industrials"
    },
    {
        "company": "Lowe's",
        "symbol": "LOW",
        "sector": "Consumer Discretionary"
    },
    {
        "company": "Mastercard",
        "symbol": "MA",
        "sector": "Financials"
    },
    {
        "company": "McDonald's Corp",
        "symbol": "MCD",
        "sector": "Consumer Discretionary"
    },
    {
        "company": "Mondelēz International",
        "symbol": "MDLZ",
        "sector": "Consumer Staples"
    },
    {
        "company": "Medtronic plc",
        "symbol": "MDT",
        "sector": "Health Care"
    },
    {
        "company": "MetLife Inc.",
        "symbol": "MET",
        "sector": "Financials"
    },
    {
        "company": "3M Company",
        "symbol": "MMM",
        "sector": "Industrials"
    },
    {
        "company": "Altria Group",
        "symbol": "MO",
        "sector": "Consumer Staples"
    },
    {
        "company": "Merck & Co.",
        "symbol": "MRK",
        "sector": "Health Care"
    },
    {
        "company": "Morgan Stanley",
        "symbol": "MS",
        "sector": "Financials"
    },
    {
        "company": "Microsoft",
        "symbol": "MSFT",
        "sector": "Information Technology"
    },
    {
        "company": "NextEra Energy",
        "symbol": "NEE",
        "sector": "Utilities"
    },
    {
        "company": "Netflix",
        "symbol": "NFLX",
        "sector": "Communication Services"
    },
    {
        "company": "Nike, Inc.",
        "symbol": "NKE",
        "sector": "Consumer Discretionary"
    },
    {
        "company": "Nvidia Corporation",
        "symbol": "NVDA",
        "sector": "Information Technology"
    },
    {
        "company": "Oracle Corporation",
        "symbol": "ORCL",
        "sector": "Information Technology"
    },
    {
        "company": "PepsiCo",
        "symbol": "PEP",
        "sector": "Consumer Staples"
    },
    {
        "company": "Pfizer Inc",
        "symbol": "PFE",
        "sector": "Health Care"
    },
    {
        "company": "Procter & Gamble",
        "symbol": "PG",
        "sector": "Consumer Staples"
    },
    {
        "company": "Philip Morris International",
        "symbol": "PM",
        "sector": "Consumer Staples"
    },
    {
        "company": "PayPal",
        "symbol": "PYPL",
        "sector": "Financials"
    },
    {
        "company": "Qualcomm",
        "symbol": "QCOM",
        "sector": "Information Technology"
    },
    {
        "company": "Raytheon Technologies",
        "symbol": "RTX",
        "sector": "Industrials"
    },
    {
        "company": "Starbucks Corp.",
        "symbol": "SBUX",
        "sector": "Consumer Discretionary"
    },
    {
        "company": "Southern Company",
        "symbol": "SO",
        "sector": "Utilities"
    },
    {
        "company": "Simon Property Group",
        "symbol": "SPG",
        "sector": "Real Estate"
    },
    {
        "company": "AT&T Inc",
        "symbol": "T",
        "sector": "Communication Services"
    },
    {
        "company": "Target Corporation",
        "symbol": "TGT",
        "sector": "Consumer Staples"
    },
    {
        "company": "Thermo Fisher Scientific",
        "symbol": "TMO",
        "sector": "Health Care"
    },
    {
        "company": "T-Mobile US",
        "symbol": "TMUS",
        "sector": "Communication Services"
    },
    {
        "company": "Tesla, Inc.",
        "symbol": "TSLA",
        "sector": "Consumer Discretionary"
    },
    {
        "company": "Texas Instruments",
        "symbol": "TXN",
        "sector": "Information Technology"
    },
    {
        "company": "UnitedHealth Group",
        "symbol": "UNH",
        "sector": "Health Care"
    },
    {
        "company": "Union Pacific Corporation",
        "symbol": "UNP",
        "sector": "Industrials"
    },
    {
        "company": "United Parcel Service",
        "symbol": "UPS",
        "sector": "Industrials"
    },
    {
        "company": "U.S. Bancorp",
        "symbol": "USB",
        "sector": "Financials"
    },
    {
        "company": "Visa Inc.",
        "symbol": "V",
        "sector": "Financials"
    },
    {
        "company": "Verizon Communications",
        "symbol": "VZ",
        "sector": "Communication Services"
    },
    {
        "company": "Walgreens Boots Alliance",
        "symbol": "WBA",
        "sector": "Consumer Staples"
    },
    {
        "company": "Wells Fargo",
        "symbol": "WFC",
        "sector": "Financials"
    },
    {
        "company": "Walmart",
        "symbol": "WMT",
        "sector": "Consumer Staples"
    },
    {
        "company": "Exxon Mobil Corp.",
        "symbol": "XOM",
        "sector": "Energy"
    }
]
