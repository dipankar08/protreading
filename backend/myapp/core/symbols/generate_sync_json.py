# These files are downlaoder from NSE and If you add some more file.
# Please run this script to generate the symbol.json which ic used by the coreapi
# python generate_sync_json.py
from FTSE100 import FTSE100_DATASET
from SAP500 import SAP100_DATASET
import os
import glob
import pdb
import json
import pandas as pd
# Get a list of all csv file
extension = 'csv'
all_filenames = [i for i in glob.glob('*.{}'.format(extension))]
# combine all files in the list
combined_csv = pd.concat([pd.read_csv(f) for f in all_filenames])
# export to csv
combined_csv.to_csv("combined_csv.csv", index=False, encoding='utf-8-sig')
# pdb.set_trace()
records = json.loads(combined_csv.to_json(orient='records'))
map = {}
# Symbole for India
for x in records:
    # pdb.set_trace()
    if x["Symbol"] not in map:
        map[x["Symbol"]] = {
            "key": x["Symbol"] + '.NS',
            'domain': 'IN',  # India Domain
            "symbol": x["Symbol"],
            "isin": x["ISIN Code"],
            "name": x["Company Name"],
            "text": x["Company Name"],
            "sector": [x["Industry"]]
        }
    else:
        print('duplicate')
        if x["Industry"] not in map[x["Symbol"]]["sector"]:
            map[x["Symbol"]]["sector"].append(x["Industry"])


# Symbol for UK
for x in FTSE100_DATASET:
    map[x["symbol"]] = {
        "key": x["symbol"] + '.NS',
        'domain': 'UK',  # India Domain
        "symbol": x["symbol"],
        "isin": '',
        "name": x["company"],
        "text": x["company"],
        "sector": [x["sector"]]
    }

# Symbol for USA
for x in SAP100_DATASET:
    map[x["symbol"]] = {
        "key": x["symbol"],  # yf.download("AAPL")
        'domain': 'USA',  # India Domain
        "symbol": x["symbol"],
        "isin": '',
        "name": x["company"],
        "text": x["company"],
        "sector": [x["sector"]]
    }


result_as_list = [x for x in map.values()]

data = json.dumps({"SUPPORTED_SYMBOL": result_as_list},
                  sort_keys=True, indent=4)
with open("symbols.json", 'w') as f:
    f.write(data)
# pdb.set_trace()
