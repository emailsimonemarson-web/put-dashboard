export default async function handler(req, res) {
  try {
    // SP500 (SPY)
    const spyRes = await fetch(
      "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=BZA9QRHAZCY7I419"
    );
    const spyData = await spyRes.json();

    const prezzo = parseFloat(
      spyData["Global Quote"]["05. price"]
    );

    // VIX
    const vixRes = await fetch(
      "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=^VIX&apikey=BZA9QRHAZCY7I419"
    );
    const vixData = await vixRes.json();

    const vix = parseFloat(
      vixData["Global Quote"]["05. price"]
    );

    res.status(200).json({
      prezzo,
      vix
    });

  } catch (err) {
    res.status(500).json({ error: "Errore dati API" });
  }
}
