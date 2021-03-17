import mplfinance as fplt
import yfinance as yf
df = yf.download("TCS.NS")

fplt.plot(
    df.tail(100),
    type='candle',
    style='charles',
    #title='Apple, March - 2020',
    #ylabel='Price ($)',
    figratio=(12, 8),
    volume=True,
    # ylabel_lower='Shares\nTraded',
    show_nontrading=True,
    savefig='apple_march_2020.png'
)
