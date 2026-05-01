export default async function handler(req, res) {
  try {

    let prezzo = null;
    let vix = null;

    // --------- TRY YAHOO ---------
    try {
      const yahoo = await fetch(
        "https://query1.finance.yahoo.com/v7/finance/quote?symbols=SPY,^VIX"
      ).then(r => r.json());

      const results = yahoo.quoteResponse.result;

      prezzo = results.find(x => x.symbol === "SPY")?.regularMarketPrice;
      vix = results.find(x => x.symbol === "^VIX")?.regularMarketPrice;

    } catch (e) {
      console.log("Yahoo fallito");
    }

    // --------- FALLBACK ALPHA ---------
    if (!prezzo) {
      const spyRes = await fetch(
        "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=BZA9QRHAZCY7I419"
      );
      const spyData = await spyRes.json();
      prezzo = parseFloat(spyData["Global Quote"]?.["05. price"]);
    }

    if (!vix) {
      const vixRes = await fetch(
        "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=VIX&apikey=BZA9QRHAZCY7I419"
      );
      const vixData = await vixRes.json();
      vix = parseFloat(vixData["Global Quote"]?.["05. price"]);
    }

    // --------- CHECK FINALE ---------
    if (!prezzo) {
      return res.status(500).json({ error: "Dati SPY non disponibili" });
    }

    res.status(200).json({
      prezzo,
      vix: vix || "N/A"
    });

  } catch (err) {
    res.status(500).json({ error: "Errore generale API" });
  }
}
