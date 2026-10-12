
import { useState, useEffect } from "react";

const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
];

function App() {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("PKR");
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getRates = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://open.er-api.com/v6/latest/${from}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch rates");
        }

        const data = await response.json();

        if (data.result !== "success") {
          throw new Error("Rates unavailable");
        }

        setRates(data.rates);
      } catch (err) {
        setError("Rates load nahi huay. Internet check karo.");
      } finally {
        setLoading(false);
      }
    };

    getRates();
  }, [from]);

  const result =
    amount.trim() !== "" &&
      Number.isFinite(Number(amount)) &&
      Number(amount) >= 0 &&
      rates[to] !== undefined
      ? (Number(amount) * rates[to]).toLocaleString("en-US", {
        maximumFractionDigits: 4,
      })
      : "—";

  const selectedFrom = currencies.find((c) => c.code === from);
  const selectedTo = currencies.find((c) => c.code === to);

  const swapCurrency = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl shadow-indigo-200/60">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-4xl text-white shadow-lg shadow-indigo-200">
            ⇄
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            Currency Converter
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Convert your money around the world
          </p>
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Enter Amount
          </label>

          <input
            id="amount"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-lg font-semibold text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        {/* Currency Selectors */}
        <div className="flex items-center gap-2 sm:gap-3">

          <div className="min-w-0 flex-1">
            <label
              htmlFor="from"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              From
            </label>

            <select
              id="from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-2 py-3 text-sm font-semibold outline-none focus:border-indigo-500 sm:px-3"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code}
                </option>
              ))}
            </select>

            <p className="mt-2 truncate text-xs text-gray-500">
              {selectedFrom?.name}
            </p>
          </div>

          <button
            type="button"
            onClick={swapCurrency}
            aria-label="Swap currencies"
            className="mt-5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-2xl text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
          >
            ⇄
          </button>

          <div className="min-w-0 flex-1">
            <label
              htmlFor="to"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              To
            </label>

            <select
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-2 py-3 text-sm font-semibold outline-none focus:border-indigo-500 sm:px-3"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code}
                </option>
              ))}
            </select>

            <p className="mt-2 truncate text-xs text-gray-500">
              {selectedTo?.name}
            </p>
          </div>
        </div>

        {/* Result */}
        <div className="mt-7 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-5">
          <p className="text-sm font-medium text-gray-500">
            Converted Amount
          </p>
          <h2 className="mt-3 break-words text-2xl sm:text-3xl font-extrabold text-indigo-700">
            {selectedTo?.flag} {result} {to}
          </h2>
          {loading ? (
            <p className="mt-3 text-sm text-gray-500">
              Loading exchange rates...
            </p>
          ) : error ? (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          ) : rates[to] !== undefined ? (
            <p className="mt-3 text-xs leading-5 text-gray-500">
              1 {from} ={" "}
              {rates[to].toLocaleString("en-US", {
                maximumFractionDigits: 6,
              })}{" "}
              {to}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
