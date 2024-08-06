import {useEffect, useState} from 'react';
import axios from 'axios';
import Select from 'react-select';
import { NumericFormat } from 'react-number-format';
import './App.css';

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState({value: 'USD', label: 'USD'});
  const [toCurrency, setToCurrency] = useState({value: 'VND', label: 'VND'});
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState({
    amount: 0,
    fromCurrency: '',
    toCurrency: '',
    conversionResult: 0,
  });

  const [rate, setRate] = useState({
    amount: 0,
    fromCurrency: '',
    toCurrency: '',
    rate: 0,
  });

  useEffect(() => {
    axios.get('https://api.exchangerate-api.com/v4/latest/USD')
      .then(response => {
        const currencyArray = Object.keys(response.data.rates).map(key => ({
          value: key,
          label: key,
        }));
        setCurrencies(currencyArray);
      });
  }, []);

  const isWithinRange = (values) => {
    const { floatValue } = values;
    return floatValue >= 0.01;
  };

  const formatNumber = (value) => {
    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(2) + ' B';
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(2) + ' M';
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(2) + ' K';
    } else {
      return value.toFixed(2);
    }
  };
  const swapCurrencies = () => {
    setFromCurrency(prevFrom => toCurrency);
    setToCurrency(prevTo => fromCurrency);
  };

  useEffect(() => {
    if (fromCurrency && toCurrency && amount) {
      axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`)
        .then(response => {
          const rate = response.data.rates[toCurrency.value];
          setResult((prev) => ({
            ...prev,
            "amount": amount,
            "fromCurrency": fromCurrency.label,
            "toCurrency": toCurrency.label,
            "conversionResult": amount * rate,
          }));

          setRate((prev) => ({
            ...prev,
            "amount": 1,
            "fromCurrency": fromCurrency.label,
            "toCurrency": toCurrency.label,
            "rate": rate,
          }));
        });
    }
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="App">
      <div className='App-header'>
        <div className='App-name'>
          <img src='/logo.png' alt='logo website' className='App-header__logo'/>
          <h1 className='App-header__name'>CoinRate</h1>
        </div>
      </div>
      <div className='App-content'>
        <div className='App-content__swap_form'>
          <h1 className='App-content__title'>Currency conversion</h1>
          <div className='swap_form__input'>
            <div className='App-content__currencies_selection'>
              <Select
                options={currencies}
                value={fromCurrency}
                onChange={setFromCurrency}
                className='select_from_currency'
                placeholder="From Currency"
              />
              <button onClick={swapCurrencies} className='swap-button'>
                <i className="fa fa-exchange"></i>
              </button>
              <Select
                options={currencies}
                value={toCurrency}
                onChange={setToCurrency}
                className='select_to_currency'
                placeholder="To Currency"
              />
            </div>
            <div className='Amount_input__wrapper'>
              <NumericFormat
                  value={amount}
                  onValueChange={(values) => {
                    const { value } = values;
                    setAmount(Number(value));
                  }}
                  isAllowed={isWithinRange}
                  allowNegative={false}
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator
                  customInput="input"
                  className='Amount_input'
                />
              {/* <button onClick={convertCurrency} className='Convert_btn'>
                Convert <i className="fa fa-refresh"></i>
                </button> */}
            </div>
          </div>
          <div className='App-content__conversion_result'>
            {result.amount !==0 && (
              <div className='conversion_result'>
                <h3>Conversion Result</h3>
                <p>{result.amount} {result.fromCurrency} = {formatNumber(result.conversionResult)} {result.toCurrency}</p>
                <h3>Rate</h3>
                <p>{rate.amount} {rate.fromCurrency} = {rate.rate} {result.toCurrency}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
