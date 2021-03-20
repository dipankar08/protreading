import json
from typing import Dict
SUPPORT_SYMBOL: Dict = {}
with open('myapp/core/sync.json') as json_file:
    data = json.load(json_file)

    for p in data['SUPPORTED_SYMBOL']:
        SUPPORT_SYMBOL[p['key']] = p['text']

# print(symbols)
SUPPORTED_CHART_DURATION = [
    "30", "60"
]
