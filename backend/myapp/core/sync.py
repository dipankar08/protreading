import json
from typing import Dict
SUPPORTED_SYMBOL: Dict = {}
with open('myapp/core/symbols/symbols.json') as json_file:
    data = json.load(json_file)

    for p in data['SUPPORTED_SYMBOL']:
        SUPPORTED_SYMBOL[p['key']] = p

# print(symbols)
SUPPORTED_CHART_DURATION = [
    "30", "60"
]
