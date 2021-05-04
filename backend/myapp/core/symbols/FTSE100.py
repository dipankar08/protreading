
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
    FTSE100_DATASET = [
    {
        "company": "",
        "symbol": "",
        "sector": ""
    },
    {
        "company": "3i",
        "symbol": "III",
        "sector": "Financial Services\n"
    },
    {
        "company": "Admiral Group",
        "symbol": "ADM",
        "sector": "Nonlife Insurance\n"
    },
    {
        "company": "Anglo American plc",
        "symbol": "AAL",
        "sector": "Mining\n"
    },
    {
        "company": "Antofagasta",
        "symbol": "ANTO",
        "sector": "Mining\n"
    },
    {
        "company": "Ashtead Group",
        "symbol": "AHT",
        "sector": "Support Services\n"
    },
    {
        "company": "Associated British Foods",
        "symbol": "ABF",
        "sector": "Food Producers\n"
    },
    {
        "company": "AstraZeneca",
        "symbol": "AZN",
        "sector": "Pharmaceuticals & Biotechnology\n"
    },
    {
        "company": "Auto Trader Group",
        "symbol": "AUTO",
        "sector": "Media\n"
    },
    {
        "company": "Avast",
        "symbol": "AVST",
        "sector": "Software & Computer Services\n"
    },
    {
        "company": "Aveva",
        "symbol": "AVV",
        "sector": "Software & Computer Services\n"
    },
    {
        "company": "Aviva",
        "symbol": "AV.",
        "sector": "Life Insurance\n"
    },
    {
        "company": "B&M",
        "symbol": "BME",
        "sector": "Retailers\n"
    },
    {
        "company": "BAE Systems",
        "symbol": "BA.",
        "sector": "Aerospace & Defence\n"
    },
    {
        "company": "Barclays",
        "symbol": "BARC",
        "sector": "Banks\n"
    },
    {
        "company": "Barratt Developments",
        "symbol": "BDEV",
        "sector": "Household Goods & Home Construction\n"
    },
    {
        "company": "Berkeley Group Holdings",
        "symbol": "BKG",
        "sector": "Household Goods & Home Construction\n"
    },
    {
        "company": "BHP",
        "symbol": "BHP",
        "sector": "Mining\n"
    },
    {
        "company": "BP",
        "symbol": "BP.",
        "sector": "Oil & Gas Producers\n"
    },
    {
        "company": "British American Tobacco",
        "symbol": "BATS",
        "sector": "Tobacco\n"
    },
    {
        "company": "British Land",
        "symbol": "BLND",
        "sector": "Real Estate Investment Trusts\n"
    },
    {
        "company": "BT Group",
        "symbol": "BT.A",
        "sector": "Fixed Line Telecommunications\n"
    },
    {
        "company": "Bunzl",
        "symbol": "BNZL",
        "sector": "Support Services\n"
    },
    {
        "company": "Burberry",
        "symbol": "BRBY",
        "sector": "Personal Goods\n"
    },
    {
        "company": "Coca-Cola HBC",
        "symbol": "CCH",
        "sector": "Beverages\n"
    },
    {
        "company": "Compass Group",
        "symbol": "CPG",
        "sector": "Support Services\n"
    },
    {
        "company": "CRH plc",
        "symbol": "CRH",
        "sector": "Construction & Materials\n"
    },
    {
        "company": "Croda International",
        "symbol": "CRDA",
        "sector": "Chemicals\n"
    },
    {
        "company": "DCC plc",
        "symbol": "DCC",
        "sector": "Support Services\n"
    },
    {
        "company": "Diageo",
        "symbol": "DGE",
        "sector": "Beverages\n"
    },
    {
        "company": "Entain",
        "symbol": "ENT",
        "sector": "Travel & Leisure\n"
    },
    {
        "company": "Evraz",
        "symbol": "EVR",
        "sector": "Industrial Metals & Mining\n"
    },
    {
        "company": "Experian",
        "symbol": "EXPN",
        "sector": "Support Services\n"
    },
    {
        "company": "Ferguson plc",
        "symbol": "FERG",
        "sector": "Support Services\n"
    },
    {
        "company": "Flutter Entertainment",
        "symbol": "FLTR",
        "sector": "Travel & Leisure\n"
    },
    {
        "company": "Fresnillo",
        "symbol": "FRES",
        "sector": "Mining\n"
    },
    {
        "company": "GlaxoSmithKline",
        "symbol": "GSK",
        "sector": "Pharmaceuticals & Biotechnology\n"
    },
    {
        "company": "Glencore",
        "symbol": "GLEN",
        "sector": "Mining\n"
    },
    {
        "company": "Halma",
        "symbol": "HLMA",
        "sector": "Electronic & Electrical Equipment\n"
    },
    {
        "company": "Hargreaves Lansdown",
        "symbol": "HL.",
        "sector": "Financial Services\n"
    },
    {
        "company": "Hikma Pharmaceuticals",
        "symbol": "HIK",
        "sector": "Pharmaceuticals & Biotechnology\n"
    },
    {
        "company": "HSBC",
        "symbol": "HSBA",
        "sector": "Banks\n"
    },
    {
        "company": "IHG Hotels & Resorts",
        "symbol": "IHG",
        "sector": "Travel & Leisure\n"
    },
    {
        "company": "Imperial Brands",
        "symbol": "IMB",
        "sector": "Tobacco\n"
    },
    {
        "company": "Informa",
        "symbol": "INF",
        "sector": "Media\n"
    },
    {
        "company": "Intermediate Capital Group",
        "symbol": "ICP",
        "sector": "Investment Services\n"
    },
    {
        "company": "International Airlines Group",
        "symbol": "IAG",
        "sector": "Travel & Leisure\n"
    },
    {
        "company": "Intertek",
        "symbol": "ITRK",
        "sector": "Support Services\n"
    },
    {
        "company": "JD Sports",
        "symbol": "JD.",
        "sector": "General Retailers\n"
    },
    {
        "company": "Johnson Matthey",
        "symbol": "JMAT",
        "sector": "Chemicals\n"
    },
    {
        "company": "Just Eat Takeaway",
        "symbol": "JET",
        "sector": "Software & Computer Services\n"
    },
    {
        "company": "Kingfisher",
        "symbol": "KGF",
        "sector": "Retailers\n"
    },
    {
        "company": "Land Securities",
        "symbol": "LAND",
        "sector": "Real Estate Investment Trusts\n"
    },
    {
        "company": "Legal & General",
        "symbol": "LGEN",
        "sector": "Life Insurance\n"
    },
    {
        "company": "Lloyds Banking Group",
        "symbol": "LLOY",
        "sector": "Banks\n"
    },
    {
        "company": "London Stock Exchange Group",
        "symbol": "LSEG",
        "sector": "Financial Services\n"
    },
    {
        "company": "M&G",
        "symbol": "MNG",
        "sector": "Asset Managers\n"
    },
    {
        "company": "Melrose Industries",
        "symbol": "MRO",
        "sector": "Automobiles & Parts\n"
    },
    {
        "company": "Mondi",
        "symbol": "MNDI",
        "sector": "Forestry & Paper\n"
    },
    {
        "company": "National Grid plc",
        "symbol": "NG.",
        "sector": "Gas, Water & Multi-utilities\n"
    },
    {
        "company": "NatWest Group",
        "symbol": "NWG",
        "sector": "Banks\n"
    },
    {
        "company": "Next plc",
        "symbol": "NXT",
        "sector": "General Retailers\n"
    },
    {
        "company": "Ocado Group",
        "symbol": "OCDO",
        "sector": "Food & Drug Retailers\n"
    },
    {
        "company": "Pearson plc",
        "symbol": "PSON",
        "sector": "Media\n"
    },
    {
        "company": "Pershing Square Holdings",
        "symbol": "PSH",
        "sector": "Financial Services\n"
    },
    {
        "company": "Persimmon plc",
        "symbol": "PSN",
        "sector": "Household Goods & Home Construction\n"
    },
    {
        "company": "Phoenix Group",
        "symbol": "PHNX",
        "sector": "Life Insurance\n"
    },
    {
        "company": "Polymetal International",
        "symbol": "POLY",
        "sector": "Precious Metals & Mining\n"
    },
    {
        "company": "Prudential plc",
        "symbol": "PRU",
        "sector": "Life Insurance\n"
    },
    {
        "company": "Reckitt",
        "symbol": "RKT",
        "sector": "Household Goods & Home Construction\n"
    },
    {
        "company": "RELX",
        "symbol": "REL",
        "sector": "Media\n"
    },
    {
        "company": "Renishaw",
        "symbol": "RSW",
        "sector": "Industrial Goods and Services\n"
    },
    {
        "company": "Rentokil Initial",
        "symbol": "RTO",
        "sector": "Support Services\n"
    },
    {
        "company": "Rightmove",
        "symbol": "RMV",
        "sector": "Media\n"
    },
    {
        "company": "Rio Tinto",
        "symbol": "RIO",
        "sector": "Mining\n"
    },
    {
        "company": "Rolls-Royce Holdings",
        "symbol": "RR.",
        "sector": "Aerospace & Defence\n"
    },
    {
        "company": "Royal Dutch Shell",
        "symbol": "RDSA",
        "sector": "Oil & Gas Producers\n"
    },
    {
        "company": "RSA Insurance Group",
        "symbol": "RSA",
        "sector": "Nonlife Insurance\n"
    },
    {
        "company": "Sage Group",
        "symbol": "SGE",
        "sector": "Software & Computer Services\n"
    },
    {
        "company": "Sainsbury's",
        "symbol": "SBRY",
        "sector": "Food & Drug Retailers\n"
    },
    {
        "company": "Schroders",
        "symbol": "SDR",
        "sector": "Financial Services\n"
    },
    {
        "company": "Scottish Mortgage Investment Trust",
        "symbol": "SMT",
        "sector": "Equity Investment Instruments\n"
    },
    {
        "company": "Segro",
        "symbol": "SGRO",
        "sector": "Real Estate Investment Trusts\n"
    },
    {
        "company": "Severn Trent",
        "symbol": "SVT",
        "sector": "Gas, Water & Multi-utilities\n"
    },
    {
        "company": "DS Smith",
        "symbol": "SMDS",
        "sector": "General Industrials\n"
    },
    {
        "company": "Smiths Group",
        "symbol": "SMIN",
        "sector": "General Industrials\n"
    },
    {
        "company": "Smith & Nephew",
        "symbol": "SN.",
        "sector": "Health Care Equipment & Services\n"
    },
    {
        "company": "Smurfit Kappa",
        "symbol": "SKG",
        "sector": "General Industrials\n"
    },
    {
        "company": "Spirax-Sarco Engineering",
        "symbol": "SPX",
        "sector": "Industrial Engineering\n"
    },
    {
        "company": "SSE plc",
        "symbol": "SSE",
        "sector": "Electricity\n"
    },
    {
        "company": "Standard Chartered",
        "symbol": "STAN",
        "sector": "Banks\n"
    },
    {
        "company": "Standard Life Aberdeen",
        "symbol": "SLA",
        "sector": "Financial Services\n"
    },
    {
        "company": "St. James's Place plc",
        "symbol": "STJ",
        "sector": "Life Insurance\n"
    },
    {
        "company": "Taylor Wimpey",
        "symbol": "TW.",
        "sector": "Household Goods & Home Construction\n"
    },
    {
        "company": "Tesco",
        "symbol": "TSCO",
        "sector": "Food & Drug Retailers\n"
    },
    {
        "company": "Unilever",
        "symbol": "ULVR",
        "sector": "Personal Goods\n"
    },
    {
        "company": "United Utilities",
        "symbol": "UU.",
        "sector": "Gas, Water & Multi-utilities\n"
    },
    {
        "company": "Vodafone Group",
        "symbol": "VOD",
        "sector": "Mobile Telecommunications\n"
    },
    {
        "company": "Weir Group",
        "symbol": "WEIR",
        "sector": "Industrial Goods and Services\n"
    },
    {
        "company": "Whitbread",
        "symbol": "WTB",
        "sector": "Retail hospitality\n"
    },
    {
        "company": "WPP plc",
        "symbol": "WPP",
        "sector": "Media\n"
    }
]
