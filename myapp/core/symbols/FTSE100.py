
# FTSE100 Data from https://en.wikipedia.org/wiki/FTSE_100_Index
# Run the below script to get the data
#
"""
var data = [];
for(var x of $("#constituents tr")){
   var tds = $(x).find('td')
   data.push({'company':$(tds[0]).text(), 'symbol': $(tds[1]).text(), 'sector': $(tds[2]).text()});    
}
console.log(JSON.stringify(data,null,1))
"""
FTSE100_DATASET = [
    {
        "company": "3i",
        "symbol": "III",
        "sector": "Financial Services"
    },
    {
        "company": "Admiral Group",
        "symbol": "ADM",
        "sector": "Nonlife Insurance"
    },
    {
        "company": "Anglo American plc",
        "symbol": "AAL",
        "sector": "Mining"
    },
    {
        "company": "Antofagasta",
        "symbol": "ANTO",
        "sector": "Mining"
    },
    {
        "company": "Ashtead Group",
        "symbol": "AHT",
        "sector": "Support Services"
    },
    {
        "company": "Associated British Foods",
        "symbol": "ABF",
        "sector": "Food Producers"
    },
    {
        "company": "AstraZeneca",
        "symbol": "AZN",
        "sector": "Pharmaceuticals & Biotechnology"
    },
    {
        "company": "Auto Trader Group",
        "symbol": "AUTO",
        "sector": "Media"
    },
    {
        "company": "Avast",
        "symbol": "AVST",
        "sector": "Software & Computer Services"
    },
    {
        "company": "Aveva",
        "symbol": "AVV",
        "sector": "Software & Computer Services"
    },
    {
        "company": "Aviva",
        "symbol": "AV.",
        "sector": "Life Insurance"
    },
    {
        "company": "B&M",
        "symbol": "BME",
        "sector": "Retailers"
    },
    {
        "company": "BAE Systems",
        "symbol": "BA.",
        "sector": "Aerospace & Defence"
    },
    {
        "company": "Barclays",
        "symbol": "BARC",
        "sector": "Banks"
    },
    {
        "company": "Barratt Developments",
        "symbol": "BDEV",
        "sector": "Household Goods & Home Construction"
    },
    {
        "company": "Berkeley Group Holdings",
        "symbol": "BKG",
        "sector": "Household Goods & Home Construction"
    },
    {
        "company": "BHP",
        "symbol": "BHP",
        "sector": "Mining"
    },
    {
        "company": "BP",
        "symbol": "BP.",
        "sector": "Oil & Gas Producers"
    },
    {
        "company": "British American Tobacco",
        "symbol": "BATS",
        "sector": "Tobacco"
    },
    {
        "company": "British Land",
        "symbol": "BLND",
        "sector": "Real Estate Investment Trusts"
    },
    {
        "company": "BT Group",
        "symbol": "BT.A",
        "sector": "Fixed Line Telecommunications"
    },
    {
        "company": "Bunzl",
        "symbol": "BNZL",
        "sector": "Support Services"
    },
    {
        "company": "Burberry",
        "symbol": "BRBY",
        "sector": "Personal Goods"
    },
    {
        "company": "Coca-Cola HBC",
        "symbol": "CCH",
        "sector": "Beverages"
    },
    {
        "company": "Compass Group",
        "symbol": "CPG",
        "sector": "Support Services"
    },
    {
        "company": "CRH plc",
        "symbol": "CRH",
        "sector": "Construction & Materials"
    },
    {
        "company": "Croda International",
        "symbol": "CRDA",
        "sector": "Chemicals"
    },
    {
        "company": "DCC plc",
        "symbol": "DCC",
        "sector": "Support Services"
    },
    {
        "company": "Diageo",
        "symbol": "DGE",
        "sector": "Beverages"
    },
    {
        "company": "Entain",
        "symbol": "ENT",
        "sector": "Travel & Leisure"
    },
    {
        "company": "Evraz",
        "symbol": "EVR",
        "sector": "Industrial Metals & Mining"
    },
    {
        "company": "Experian",
        "symbol": "EXPN",
        "sector": "Support Services"
    },
    {
        "company": "Ferguson plc",
        "symbol": "FERG",
        "sector": "Support Services"
    },
    {
        "company": "Flutter Entertainment",
        "symbol": "FLTR",
        "sector": "Travel & Leisure"
    },
    {
        "company": "Fresnillo",
        "symbol": "FRES",
        "sector": "Mining"
    },
    {
        "company": "GlaxoSmithKline",
        "symbol": "GSK",
        "sector": "Pharmaceuticals & Biotechnology"
    },
    {
        "company": "Glencore",
        "symbol": "GLEN",
        "sector": "Mining"
    },
    {
        "company": "Halma",
        "symbol": "HLMA",
        "sector": "Electronic & Electrical Equipment"
    },
    {
        "company": "Hargreaves Lansdown",
        "symbol": "HL.",
        "sector": "Financial Services"
    },
    {
        "company": "Hikma Pharmaceuticals",
        "symbol": "HIK",
        "sector": "Pharmaceuticals & Biotechnology"
    },
    {
        "company": "HSBC",
        "symbol": "HSBA",
        "sector": "Banks"
    },
    {
        "company": "IHG Hotels & Resorts",
        "symbol": "IHG",
        "sector": "Travel & Leisure"
    },
    {
        "company": "Imperial Brands",
        "symbol": "IMB",
        "sector": "Tobacco"
    },
    {
        "company": "Informa",
        "symbol": "INF",
        "sector": "Media"
    },
    {
        "company": "Intermediate Capital Group",
        "symbol": "ICP",
        "sector": "Investment Services"
    },
    {
        "company": "International Airlines Group",
        "symbol": "IAG",
        "sector": "Travel & Leisure"
    },
    {
        "company": "Intertek",
        "symbol": "ITRK",
        "sector": "Support Services"
    },
    {
        "company": "JD Sports",
        "symbol": "JD.",
        "sector": "General Retailers"
    },
    {
        "company": "Johnson Matthey",
        "symbol": "JMAT",
        "sector": "Chemicals"
    },
    {
        "company": "Just Eat Takeaway",
        "symbol": "JET",
        "sector": "Software & Computer Services"
    },
    {
        "company": "Kingfisher",
        "symbol": "KGF",
        "sector": "Retailers"
    },
    {
        "company": "Land Securities",
        "symbol": "LAND",
        "sector": "Real Estate Investment Trusts"
    },
    {
        "company": "Legal & General",
        "symbol": "LGEN",
        "sector": "Life Insurance"
    },
    {
        "company": "Lloyds Banking Group",
        "symbol": "LLOY",
        "sector": "Banks"
    },
    {
        "company": "London Stock Exchange Group",
        "symbol": "LSEG",
        "sector": "Financial Services"
    },
    {
        "company": "M&G",
        "symbol": "MNG",
        "sector": "Asset Managers"
    },
    {
        "company": "Melrose Industries",
        "symbol": "MRO",
        "sector": "Automobiles & Parts"
    },
    {
        "company": "Mondi",
        "symbol": "MNDI",
        "sector": "Forestry & Paper"
    },
    {
        "company": "National Grid plc",
        "symbol": "NG.",
        "sector": "Gas, Water & Multi-utilities"
    },
    {
        "company": "NatWest Group",
        "symbol": "NWG",
        "sector": "Banks"
    },
    {
        "company": "Next plc",
        "symbol": "NXT",
        "sector": "General Retailers"
    },
    {
        "company": "Ocado Group",
        "symbol": "OCDO",
        "sector": "Food & Drug Retailers"
    },
    {
        "company": "Pearson plc",
        "symbol": "PSON",
        "sector": "Media"
    },
    {
        "company": "Pershing Square Holdings",
        "symbol": "PSH",
        "sector": "Financial Services"
    },
    {
        "company": "Persimmon plc",
        "symbol": "PSN",
        "sector": "Household Goods & Home Construction"
    },
    {
        "company": "Phoenix Group",
        "symbol": "PHNX",
        "sector": "Life Insurance"
    },
    {
        "company": "Polymetal International",
        "symbol": "POLY",
        "sector": "Precious Metals & Mining"
    },
    {
        "company": "Prudential plc",
        "symbol": "PRU",
        "sector": "Life Insurance"
    },
    {
        "company": "Reckitt",
        "symbol": "RKT",
        "sector": "Household Goods & Home Construction"
    },
    {
        "company": "RELX",
        "symbol": "REL",
        "sector": "Media"
    },
    {
        "company": "Renishaw",
        "symbol": "RSW",
        "sector": "Industrial Goods and Services"
    },
    {
        "company": "Rentokil Initial",
        "symbol": "RTO",
        "sector": "Support Services"
    },
    {
        "company": "Rightmove",
        "symbol": "RMV",
        "sector": "Media"
    },
    {
        "company": "Rio Tinto",
        "symbol": "RIO",
        "sector": "Mining"
    },
    {
        "company": "Rolls-Royce Holdings",
        "symbol": "RR.",
        "sector": "Aerospace & Defence"
    },
    {
        "company": "Royal Dutch Shell",
        "symbol": "RDSA",
        "sector": "Oil & Gas Producers"
    },
    {
        "company": "RSA Insurance Group",
        "symbol": "RSA",
        "sector": "Nonlife Insurance"
    },
    {
        "company": "Sage Group",
        "symbol": "SGE",
        "sector": "Software & Computer Services"
    },
    {
        "company": "Sainsbury's",
        "symbol": "SBRY",
        "sector": "Food & Drug Retailers"
    },
    {
        "company": "Schroders",
        "symbol": "SDR",
        "sector": "Financial Services"
    },
    {
        "company": "Scottish Mortgage Investment Trust",
        "symbol": "SMT",
        "sector": "Equity Investment Instruments"
    },
    {
        "company": "Segro",
        "symbol": "SGRO",
        "sector": "Real Estate Investment Trusts"
    },
    {
        "company": "Severn Trent",
        "symbol": "SVT",
        "sector": "Gas, Water & Multi-utilities"
    },
    {
        "company": "DS Smith",
        "symbol": "SMDS",
        "sector": "General Industrials"
    },
    {
        "company": "Smiths Group",
        "symbol": "SMIN",
        "sector": "General Industrials"
    },
    {
        "company": "Smith & Nephew",
        "symbol": "SN.",
        "sector": "Health Care Equipment & Services"
    },
    {
        "company": "Smurfit Kappa",
        "symbol": "SKG",
        "sector": "General Industrials"
    },
    {
        "company": "Spirax-Sarco Engineering",
        "symbol": "SPX",
        "sector": "Industrial Engineering"
    },
    {
        "company": "SSE plc",
        "symbol": "SSE",
        "sector": "Electricity"
    },
    {
        "company": "Standard Chartered",
        "symbol": "STAN",
        "sector": "Banks"
    },
    {
        "company": "Standard Life Aberdeen",
        "symbol": "SLA",
        "sector": "Financial Services"
    },
    {
        "company": "St. James's Place plc",
        "symbol": "STJ",
        "sector": "Life Insurance"
    },
    {
        "company": "Taylor Wimpey",
        "symbol": "TW.",
        "sector": "Household Goods & Home Construction"
    },
    {
        "company": "Tesco",
        "symbol": "TSCO",
        "sector": "Food & Drug Retailers"
    },
    {
        "company": "Unilever",
        "symbol": "ULVR",
        "sector": "Personal Goods"
    },
    {
        "company": "United Utilities",
        "symbol": "UU.",
        "sector": "Gas, Water & Multi-utilities"
    },
    {
        "company": "Vodafone Group",
        "symbol": "VOD",
        "sector": "Mobile Telecommunications"
    },
    {
        "company": "Weir Group",
        "symbol": "WEIR",
        "sector": "Industrial Goods and Services"
    },
    {
        "company": "Whitbread",
        "symbol": "WTB",
        "sector": "Retail hospitality"
    },
    {
        "company": "WPP plc",
        "symbol": "WPP",
        "sector": "Media"
    }
]
