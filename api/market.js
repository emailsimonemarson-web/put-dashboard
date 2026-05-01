export default async function handler(req, res) {

    try {
        // SP500 (SPY)
        const yahoo = await fetch(
            "https://query1.finance.yahoo.com/v7/finance/quote?symbols=SPY"
        ).then(r => r.json());

        const prezzo = yahoo.quoteResponse.result[0].regularMarketPrice;

        // VIX
        const vixData = await fetch(
            "https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5EVIX"
        ).then(r => r.json());

        const vix = vixData.quoteResponse.result[0].regularMarketPrice;

        res.status(200).json({
            prezzo,
            vix
        });

    } catch (err) {
        res.status(500).json({ error: "Errore dati" });
    }
}
