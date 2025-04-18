const API_KEY = "cur_live_Gi8iOgpbQRlxr1ZVIiNhEwKbLEPLJWgpm1UdlIyX"; // Replace with your real API key

const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const resultDiv = document.getElementById("result");

// Fetch available currencies and populate dropdowns
async function loadCurrencies() {
  try {
    const response = await fetch(`https://api.currencyapi.com/v3/currencies?apikey=${API_KEY}`);

    const data = await response.json();

    if (!data || !data.data) {
      throw new Error("Currency list not found");
    }

    const currencies = data.data;
    for (let code in currencies) {
      const optionFrom = document.createElement("option");
      const optionTo = document.createElement("option");
      optionFrom.value = code;
      optionTo.value = code;
      optionFrom.textContent = `${code} - ${currencies[code].name}`;
      optionTo.textContent = `${code} - ${currencies[code].name}`;
      fromCurrency.appendChild(optionFrom);
      toCurrency.appendChild(optionTo);
    }
  } catch (error) {
    console.error("Failed to load currencies:", error);
    resultDiv.textContent = "⚠️ Unable to load currency list.";
  }
}

// Convert currency using CurrencyAPI
async function convertCurrency() {
  const amount = document.getElementById("amount").value.trim();
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!amount || !from || !to || isNaN(amount)) {
    resultDiv.textContent = "⚠️ Please enter a valid amount and select currencies.";
    return;
  }

  try {
    resultDiv.textContent = "Converting...";

    const response = await fetch(
      `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=${from}&currencies=${to}`
    );

    const data = await response.json();
    console.log("Conversion Response:", data);

    if (data && data.data && data.data[to] && data.data[to].value) {
      const rate = data.data[to].value;
      const converted = amount * rate;
      resultDiv.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
    } else {
      resultDiv.textContent = "⚠️ Conversion failed. Try again later.";
    }
  } catch (error) {
    console.error("Conversion error:", error);
    resultDiv.textContent = "⚠️ Error during conversion.";
  }
}

loadCurrencies();
convertBtn.addEventListener("click", convertCurrency);

// Swap currencies
document.getElementById("swapBtn").addEventListener("click", () => {
  const tempValue = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempValue;
});

// Dark Mode Switch
const toggle = document.getElementById("modeSwitch");
const modeIcon = document.getElementById("modeIcon");
const body = document.body;

toggle.addEventListener("change", () => {
  body.classList.toggle("light-mode");
  modeIcon.textContent = body.classList.contains("light-mode") ? "☀️" : "🌙";
});
