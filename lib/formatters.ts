// lib/formatters.ts

/**
 * Format large numbers with Indian/International abbreviations
 * @param num - Number to format
 * @param locale - 'in' for Indian (Lakh/Crore) or 'intl' for International (K/M)
 */
export function formatViewCount(num: number | undefined, locale: 'in' | 'intl' = 'intl'): {
  formatted: string;
  full: string;
} {
  if (!num || num === 0) {
    return { formatted: '0', full: '0' };
  }

  const full = num.toLocaleString('en-IN'); // "1,23,456"

  if (locale === 'in') {
    // Indian format: Lakh, Crore
    if (num >= 10000000) { // 1 Crore
      return { formatted: `${(num / 10000000).toFixed(1)}Cr`, full };
    }
    if (num >= 100000) { // 1 Lakh
      return { formatted: `${(num / 100000).toFixed(1)}L`, full };
    }
    if (num >= 1000) { // 1 Thousand
      return { formatted: `${(num / 1000).toFixed(1)}K`, full };
    }
  } else {
    // International format: K, M, B
    if (num >= 1000000000) { // 1 Billion
      return { formatted: `${(num / 1000000000).toFixed(1)}B`, full };
    }
    if (num >= 1000000) { // 1 Million
      return { formatted: `${(num / 1000000).toFixed(1)}M`, full };
    }
    if (num >= 1000) { // 1 Thousand
      return { formatted: `${(num / 1000).toFixed(1)}K`, full };
    }
  }

  return { formatted: num.toString(), full };
}