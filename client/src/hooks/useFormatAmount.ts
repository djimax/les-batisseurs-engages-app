import { useCurrency } from '@/contexts/CurrencyContext';

interface FormatOptions {
  showEquivalent?: boolean;
  decimals?: number;
}

export const useFormatAmount = () => {
  const { currency, convertCurrency, formatAmount, exchangeRate } = useCurrency();

  const formatAmountWithConversion = (amount: number, sourceCurrency: 'EUR' | 'CFA' = 'EUR', options: FormatOptions = {}) => {
    const { showEquivalent = false, decimals = 2 } = options;

    // Convertir le montant dans la devise sélectionnée
    const convertedAmount = sourceCurrency !== currency 
      ? convertCurrency(amount, sourceCurrency, currency)
      : amount;

    const formatted = formatAmount(convertedAmount);

    if (!showEquivalent) {
      return formatted;
    }

    // Calculer l'équivalent dans l'autre devise
    const equivalentCurrency = currency === 'EUR' ? 'CFA' : 'EUR';
    const equivalentAmount = convertCurrency(convertedAmount, currency, equivalentCurrency);
    const equivalentSymbol = equivalentCurrency === 'EUR' ? '€' : 'F';

    return `${formatted} (≈ ${equivalentAmount.toFixed(decimals)} ${equivalentSymbol})`;
  };

  const formatAmountInCurrency = (amount: number, targetCurrency: 'EUR' | 'CFA', sourceCurrency: 'EUR' | 'CFA' = 'EUR', options: FormatOptions = {}) => {
    const { showEquivalent = false, decimals = 2 } = options;

    // Convertir le montant dans la devise cible
    const convertedAmount = sourceCurrency !== targetCurrency
      ? convertCurrency(amount, sourceCurrency, targetCurrency)
      : amount;

    const symbol = targetCurrency === 'EUR' ? '€' : 'F';
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(convertedAmount);

    const result = `${formatted} ${symbol}`;

    if (!showEquivalent) {
      return result;
    }

    // Calculer l'équivalent dans l'autre devise
    const equivalentCurrency = targetCurrency === 'EUR' ? 'CFA' : 'EUR';
    const equivalentAmount = convertCurrency(convertedAmount, targetCurrency, equivalentCurrency);
    const equivalentSymbol = equivalentCurrency === 'EUR' ? '€' : 'F';

    return `${result} (≈ ${equivalentAmount.toFixed(decimals)} ${equivalentSymbol})`;
  };

  const getExchangeRateInfo = () => {
    return {
      rate: exchangeRate,
      display: `1 EUR = ${exchangeRate.toFixed(3)} CFA`,
      inverse: `1 CFA = ${(1 / exchangeRate).toFixed(6)} EUR`,
    };
  };

  return {
    formatAmountWithConversion,
    formatAmountInCurrency,
    getExchangeRateInfo,
    currentCurrency: currency,
    exchangeRate,
  };
};
