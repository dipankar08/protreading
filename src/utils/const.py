from enum import Enum


CANDLE_TYPE_COUNT = {
    '1d': 1,
    '1h': 7,
    '15m': 25,
    '5m': 75
}


my_map = {'ACC Ltd.': 'ACC',
          'AU Small Finance Bank Ltd.': 'AUBANK',
          'Aarti Industries Ltd.': 'AARTIIND',
          'Abbott India Ltd.': 'ABBOTINDIA',
          'Adani Enterprises Ltd.': 'ADANIENT',
          'Adani Green Energy Ltd.': 'ADANIGREEN',
          'Adani Ports and Special Economic Zone Ltd.': 'ADANIPORTS',
          'Adani Total Gas Ltd.': 'ATGL',
          'Adani Transmission Ltd.': 'ADANITRANS',
          'Aditya Birla Capital Ltd.': 'ABCAPITAL',
          'Aditya Birla Fashion and Retail Ltd.': 'ABFRL',
          'Ajanta Pharmaceuticals Ltd.': 'AJANTPHARM',
          'Alembic Pharmaceuticals Ltd.': 'APLLTD',
          'Alkem Laboratories Ltd.': 'ALKEM',
          'Amara Raja Batteries Ltd.': 'AMARAJABAT',
          'Ambuja Cements Ltd.': 'AMBUJACEM',
          'Apollo Hospitals Enterprise Ltd.': 'APOLLOHOSP',
          'Apollo Tyres Ltd.': 'APOLLOTYRE',
          'Ashok Leyland Ltd.': 'ASHOKLEY',
          'Asian Paints Ltd.': 'ASIANPAINT',
          'Aurobindo Pharma Ltd.': 'AUROPHARMA',
          'Avenue Supermarts Ltd.': 'DMART',
          'Axis Bank Ltd.': 'AXISBANK',
          'Bajaj Auto Ltd.': 'BAJAJ-AUTO',
          'Bajaj Finance Ltd.': 'BAJFINANCE',
          'Bajaj Finserv Ltd.': 'BAJAJFINSV',
          'Bajaj Holdings & Investment Ltd.': 'BAJAJHLDNG',
          'Balkrishna Industries Ltd.': 'BALKRISIND',
          'Bandhan Bank Ltd.': 'BANDHANBNK',
          'Bank of Baroda': 'BANKBARODA',
          'Bank of India': 'BANKINDIA',
          'Bata India Ltd.': 'BATAINDIA',
          'Berger Paints India Ltd.': 'BERGEPAINT',
          'Bharat Electronics Ltd.': 'BEL',
          'Bharat Forge Ltd.': 'BHARATFORG',
          'Bharat Heavy Electricals Ltd.': 'BHEL',
          'Bharat Petroleum Corporation Ltd.': 'BPCL',
          'Bharti Airtel Ltd.': 'BHARTIARTL',
          'Biocon Ltd.': 'BIOCON',
          'Bombay Burmah Trading Corporation Ltd.': 'BBTC',
          'Bosch Ltd.': 'BOSCHLTD',
          'Britannia Industries Ltd.': 'BRITANNIA',
          'CESC Ltd.': 'CESC',
          'Cadila Healthcare Ltd.': 'CADILAHC',
          'Canara Bank': 'CANBK',
          'Castrol India Ltd.': 'CASTROLIND',
          'Cholamandalam Investment and Finance Company Ltd.': 'CHOLAFIN',
          'Cipla Ltd.': 'CIPLA',
          'City Union Bank Ltd.': 'CUB',
          'Coal India Ltd.': 'COALINDIA',
          'Coforge Ltd.': 'COFORGE',
          'Colgate Palmolive (India) Ltd.': 'COLPAL',
          'Container Corporation of India Ltd.': 'CONCOR',
          'Coromandel International Ltd.': 'COROMANDEL',
          'Crompton Greaves Consumer Electricals Ltd.': 'CROMPTON',
          'Cummins India Ltd.': 'CUMMINSIND',
          'DLF Ltd.': 'DLF',
          'Dabur India Ltd.': 'DABUR',
          'Dalmia Bharat Ltd.': 'DALBHARAT',
          'Dhani Services Ltd.': 'DHANI',
          'Divis Laboratories Ltd.': 'DIVISLAB',
          'Dr. Lal Path Labs Ltd.': 'LALPATHLAB',
          'Dr. Reddys Laboratories Ltd.': 'DRREDDY',
          'Edelweiss Financial Services Ltd.': 'EDELWEISS',
          'Eicher Motors Ltd.': 'EICHERMOT',
          'Emami Ltd.': 'EMAMILTD',
          'Endurance Technologies Ltd.': 'ENDURANCE',
          'Escorts Ltd.': 'ESCORTS',
          'Exide Industries Ltd.': 'EXIDEIND',
          'Federal Bank Ltd.': 'FEDERALBNK',
          'Fortis Healthcare Ltd.': 'FORTIS',
          'Future Retail Ltd.': 'FRETAIL',
          'GAIL (India) Ltd.': 'GAIL',
          'GMR Infrastructure Ltd.': 'GMRINFRA',
          'General Insurance Corporation of India': 'GICRE',
          'Glenmark Pharmaceuticals Ltd.': 'GLENMARK',
          'Godrej Agrovet Ltd.': 'GODREJAGRO',
          'Godrej Consumer Products Ltd.': 'GODREJCP',
          'Godrej Industries Ltd.': 'GODREJIND',
          'Godrej Properties Ltd.': 'GODREJPROP',
          'Grasim Industries Ltd.': 'GRASIM',
          'Gujarat Gas Ltd.': 'GUJGASLTD',
          'Gujarat State Petronet Ltd.': 'GSPL',
          'HCL Technologies Ltd.': 'HCLTECH',
          'HDFC Asset Management Company Ltd.': 'HDFCAMC',
          'HDFC Bank Ltd.': 'HDFCBANK',
          'HDFC Life Insurance Company Ltd.': 'HDFCLIFE',
          'Havells India Ltd.': 'HAVELLS',
          'Hero MotoCorp Ltd.': 'HEROMOTOCO',
          'Hindalco Industries Ltd.': 'HINDALCO',
          'Hindustan Petroleum Corporation Ltd.': 'HINDPETRO',
          'Hindustan Unilever Ltd.': 'HINDUNILVR',
          'Hindustan Zinc Ltd.': 'HINDZINC',
          'Housing & Urban Development Corporation Ltd.': 'HUDCO',
          'Housing Development Finance Corporation Ltd.': 'HDFC',
          'ICICI Bank Ltd.': 'ICICIBANK',
          'ICICI Lombard General Insurance Company Ltd.': 'ICICIGI',
          'ICICI Prudential Life Insurance Company Ltd.': 'ICICIPRULI',
          'ICICI Securities Ltd.': 'ISEC',
          'IDFC First Bank Ltd.': 'IDFCFIRSTB',
          'ITC Ltd.': 'ITC',
          'Indiabulls Housing Finance Ltd.': 'IBULHSGFIN',
          'Indian Hotels Co. Ltd.': 'INDHOTEL',
          'Indian Oil Corporation Ltd.': 'IOC',
          'Indian Railway Catering And Tourism Corporation Ltd.': 'IRCTC',
          'Indraprastha Gas Ltd.': 'IGL',
          'Indus Towers Ltd.': 'INDUSTOWER',
          'IndusInd Bank Ltd.': 'INDUSINDBK',
          'Info Edge (India) Ltd.': 'NAUKRI',
          'Infosys Ltd.': 'INFY',
          'InterGlobe Aviation Ltd.': 'INDIGO',
          'Ipca Laboratories Ltd.': 'IPCALAB',
          'JSW Energy Ltd.': 'JSWENERGY',
          'JSW Steel Ltd.': 'JSWSTEEL',
          'Jindal Steel & Power Ltd.': 'JINDALSTEL',
          'Jubilant Foodworks Ltd.': 'JUBLFOOD',
          'Kotak Mahindra Bank Ltd.': 'KOTAKBANK',
          'L&T Finance Holdings Ltd.': 'L&TFH',
          'L&T Technology Services Ltd.': 'LTTS',
          'LIC Housing Finance Ltd.': 'LICHSGFIN',
          'Larsen & Toubro Infotech Ltd.': 'LTI',
          'Larsen & Toubro Ltd.': 'LT',
          'Lupin Ltd.': 'LUPIN',
          'MRF Ltd.': 'MRF',
          'Mahanagar Gas Ltd.': 'MGL',
          'Mahindra & Mahindra Financial Services Ltd.': 'M&MFIN',
          'Mahindra & Mahindra Ltd.': 'M&M',
          'Manappuram Finance Ltd.': 'MANAPPURAM',
          'Marico Ltd.': 'MARICO',
          'Maruti Suzuki India Ltd.': 'MARUTI',
          'Max Financial Services Ltd.': 'MFSL',
          'MindTree Ltd.': 'MINDTREE',
          'Motherson Sumi Systems Ltd.': 'MOTHERSUMI',
          'MphasiS Ltd.': 'MPHASIS',
          'Muthoot Finance Ltd.': 'MUTHOOTFIN',
          'NATCO Pharma Ltd.': 'NATCOPHARM',
          'NMDC Ltd.': 'NMDC',
          'NTPC Ltd.': 'NTPC',
          'National Aluminium Co. Ltd.': 'NATIONALUM',
          'Navin Fluorine International Ltd.': 'NAVINFLUOR',
          'Nestle India Ltd.': 'NESTLEIND',
          'Nippon Life India Asset Management Ltd.': 'NAM-INDIA',
          'Oberoi Realty Ltd.': 'OBEROIRLTY',
          'Oil & Natural Gas Corporation Ltd.': 'ONGC',
          'Oil India Ltd.': 'OIL',
          'Oracle Financial Services Software Ltd.': 'OFSS',
          'PI Industries Ltd.': 'PIIND',
          'Page Industries Ltd.': 'PAGEIND',
          'Petronet LNG Ltd.': 'PETRONET',
          'Pfizer Ltd.': 'PFIZER',
          'Pidilite Industries Ltd.': 'PIDILITIND',
          'Piramal Enterprises Ltd.': 'PEL',
          'Polycab India Ltd.': 'POLYCAB',
          'Power Finance Corporation Ltd.': 'PFC',
          'Power Grid Corporation of India Ltd.': 'POWERGRID',
          'Prestige Estates Projects Ltd.': 'PRESTIGE',
          'Procter & Gamble Hygiene & Health Care Ltd.': 'PGHH',
          'Punjab National Bank': 'PNB',
          'RBL Bank Ltd.': 'RBLBANK',
          'REC Ltd.': 'RECLTD',
          'Rajesh Exports Ltd.': 'RAJESHEXPO',
          'Reliance Industries Ltd.': 'RELIANCE',
          'SBI Cards and Payment Services Ltd.': 'SBICARD',
          'SBI Life Insurance Company Ltd.': 'SBILIFE',
          'SRF Ltd.': 'SRF',
          'Sanofi India Ltd.': 'SANOFI',
          'Shree Cement Ltd.': 'SHREECEM',
          'Shriram Transport Finance Co. Ltd.': 'SRTRANSFIN',
          'Siemens Ltd.': 'SIEMENS',
          'State Bank of India': 'SBIN',
          'Steel Authority of India Ltd.': 'SAIL',
          'Sun Pharmaceutical Industries Ltd.': 'SUNPHARMA',
          'Sun TV Network Ltd.': 'SUNTV',
          'Syngene International Ltd.': 'SYNGENE',
          'TVS Motor Company Ltd.': 'TVSMOTOR',
          'Tata Chemicals Ltd.': 'TATACHEM',
          'Tata Consultancy Services Ltd.': 'TCS',
          'Tata Consumer Products Ltd.': 'TATACONSUM',
          'Tata Motors Ltd.': 'TATAMOTORS',
          'Tata Power Co. Ltd.': 'TATAPOWER',
          'Tata Steel Ltd.': 'TATASTEEL',
          'Tech Mahindra Ltd.': 'TECHM',
          'The Ramco Cements Ltd.': 'RAMCOCEM',
          'Titan Company Ltd.': 'TITAN',
          'Torrent Pharmaceuticals Ltd.': 'TORNTPHARM',
          'Torrent Power Ltd.': 'TORNTPOWER',
          'Trent Ltd.': 'TRENT',
          'UPL Ltd.': 'UPL',
          'UltraTech Cement Ltd.': 'ULTRACEMCO',
          'Union Bank of India': 'UNIONBANK',
          'United Breweries Ltd.': 'UBL',
          'United Spirits Ltd.': 'MCDOWELL-N',
          'V-Guard Industries Ltd.': 'VGUARD',
          'Varun Beverages Ltd.': 'VBL',
          'Vodafone Idea Ltd.': 'IDEA',
          'Voltas Ltd.': 'VOLTAS',
          'Whirlpool of India Ltd.': 'WHIRLPOOL',
          'Wipro Ltd.': 'WIPRO',
          'Yes Bank Ltd.': 'YESBANK',
          'Zee Entertainment Enterprises Ltd.': 'ZEEL',
          }
symbols = dict((v, k) for k, v in my_map.items())