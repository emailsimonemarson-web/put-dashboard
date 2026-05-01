export default async function handler(req, res) {
  try {

    let prezzo = null;
    let vix = null;

    // --------- TRY YAHOO ---------
    try {
      const yahooRes = await fetch(
        "https://query1.finance.yahoo.com/v7/finance/quote?symbols=SPY,^VIX",
        {
          headers: {
            "User-Agent": "Mozilla/5.0"
          }
        }
      );

      const yahoo = await yahooRes.json();

      if (yahoo?.quoteResponse?.result?.length > 0) {
        const results = yahoo.quoteResponse.result;

        const spy = results.find(x => x.symbol === "SPY");
        const vixData = results.find(x => x.symbol === "^VIX");

        if (spy && spy.regularMarketPrice) {
          prezzo = spy.regularMarketPrice;
        }

        if (vixData && vixData.regularMarketPrice) {
          vix = vixData.regularMarketPrice;
        }
      }

    } catch (e) {
      console.log("Yahoo fallito:", e);
    }

    // --------- FALLBACK ALPHA (SOLO SPY SICURO) ---------
    if (!prezzo) {
      try {
        const spyRes = await fetch(
          "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=BZA9QRHAZCY7I419"
        );
        const spyData = await spyRes.json();

        const raw = spyData["Global Quote"]?.["05. price"];
        prezzo = raw ? parseFloat(raw) : null;

      } catch (e) {
        console.log("Alpha SPY fallito:", e);
      }
    }

    // ⚠️ VIX su Alpha NON è affidabile → se manca lo lasciamo N/A

    // --------- CHECK FINALE ---------
    if (!prezzo || isNaN(prezzo)) {
      return res.status(500).json({
        error: "Dati SPY non disponibili"
      });
    }

    res.status(200).json({
      prezzo,
      vix: vix && !isNaN(vix) ? vix : "N/A"
    });

  } catch (err) {
    console.log("Errore generale:", err);

    res.status(500).json({
      error: "Errore generale API"
    });
  }
}
