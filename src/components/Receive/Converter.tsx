"use client";
import { useEffect, useState } from "react";
import { useClient } from "@/context";

const SATS_IN_BTC = 100_000_000;

const Converter = () => {
  const [btcPrice, setBtcPrice] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [mode, setMode] = useState<"sats" | "fiat">("sats");
 const { setInvoiceSats } = useClient();

  useEffect(() => {
    const fetchPrice = async () => {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      );
      const data = await res.json();
      setBtcPrice(data.bitcoin.usd);
    };
    fetchPrice();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

        if (mode === "sats") {
          setInvoiceSats(+e.target.value);
        } else {
          setInvoiceSats((+e.target.value / btcPrice) * SATS_IN_BTC);
        }
  };

  const getConvertedValue = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || !btcPrice) return "";



    return mode === "sats"
      ? `$${((value / SATS_IN_BTC) * btcPrice).toFixed(2)}`
      : `${((value / btcPrice) * SATS_IN_BTC).toFixed(0)} sats`;
  };

  const toggleMode = () => {
    setInputValue(""); // clear input on toggle
    setMode((prev) => (prev === "sats" ? "fiat" : "sats"));
  };

  return (
    <div className="space-y-3">
      <label className="block mb-1">
        Amount ({mode === "sats" ? "Sats" : "USD"})
      </label>
      <div className="relative">
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={mode === "sats" ? "Enter XLM" : "Enter fiat"}
          className="w-full px-4 py-2 pr-20 border rounded"
        />
        <button
          type="button"
          onClick={toggleMode}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xs bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 px-2 py-1 rounded transition"
        >
          {mode === "sats" ? "Switch to USD" : "Switch to XLM"}
        </button>
      </div>

      {/* {inputValue && (
        <p className="text-sm text-gray-500">≈ {getConvertedValue()}</p>
      )} */}

      {/* <p className="text-sm text-gray-400">BTC Price: ${btcPrice}</p> */}
    </div>
  );
};

export default Converter;
