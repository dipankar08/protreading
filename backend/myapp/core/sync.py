from ast import Str
import json
from typing import Dict

SUPPORTED_SYMBOL: Dict = {
    "IN": {},
    "UK": {},
    "USA": {}
}


with open('myapp/core/symbols/symbols.json') as json_file:
    data = json.load(json_file)
    for p in data['SUPPORTED_SYMBOL']:
        if p['domain'] == 'IN':
            SUPPORTED_SYMBOL["IN"][p['key']] = p
        elif p['domain'] == 'UK':
            SUPPORTED_SYMBOL["UK"][p['key']] = p
        elif p['domain'] == 'USA':
            SUPPORTED_SYMBOL["USA"][p['key']] = p
        else:
            raise Exception("Not able to map symbol in the domain")

# print(symbols)
SUPPORTED_CHART_DURATION = [
    "30", "60"
]


def getSymbolList(domain="IN") -> Dict[str, dict]:
    return SUPPORTED_SYMBOL.get(domain)
