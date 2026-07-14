import crypto from "node:crypto";
import { headers } from "next/headers";
import {
  isPlanId,
  isProgrammeId,
  programmes,
  type PlanId,
  type ProgrammeId,
} from "./programmes";

export type Market = "ZA" | "NG" | "INTL";

export type PriceOption = {
  planId: PlanId;
  sessions: number;
  localAmount: number;
  localFormatted: string;
  localCurrency: "ZAR" | "NGN" | "USD";
  paypalUsd: number;
  note: string;
};

export type PricingContext = {
  market: Market;
  country: string;
  city: string;
  locationLabel: string;
  currency: "ZAR" | "NGN" | "USD";
  options: PriceOption[];
  offerToken: string;
  exchangeRate: number;
  bankTransferAvailable: boolean;
  paypalCurrency: "USD";
  generatedAt: string;
};

type OfferPayload = {
  programmeId: ProgrammeId;
  market: Market;
  exp: number;
};

const FALLBACK_RATES = {
  ZAR: Number(process.env.FALLBACK_USD_ZAR_RATE ?? 18),
  NGN: Number(process.env.FALLBACK_USD_NGN_RATE ?? 1550),
};

const MARKET_FACTORS: Record<Market, number> = {
  ZA: 1,
  NG: 0.62,
  INTL: 1,
};

const SUPPORTED_CITY_TERMS: Record<Exclude<Market, "INTL">, string[]> = {
  ZA: [
    "johannesburg",
    "sandton",
    "randburg",
    "fourways",
    "rosebank",
    "hyde park",
    "bryanston",
  ],
  NG: [
    "lagos",
    "lekki",
    "ajah",
    "victoria island",
    "abuja",
    "federal capital territory",
    "fct",
  ],
};

function normaliseLocation(value: string) {
  return value.trim().toLowerCase().replace(/[-_]+/g, " ");
}

function isSupportedCity(market: Exclude<Market, "INTL">, city: string) {
  if (!city.trim()) return true;
  const normalisedCity = normaliseLocation(city);
  return SUPPORTED_CITY_TERMS[market].some(
    (term) =>
      normalisedCity.includes(term) || normaliseLocation(term).includes(normalisedCity),
  );
}

function resolveMarket(country: string, city: string): Market {
  if (country === "ZA" && isSupportedCity("ZA", city)) return "ZA";
  if (country === "NG" && isSupportedCity("NG", city)) return "NG";
  return "INTL";
}

function getSigningSecret() {
  return process.env.PRICING_SIGNING_SECRET || "replace-this-before-production";
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

export function createOfferToken(payload: OfferPayload) {
  const body = toBase64Url(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", getSigningSecret())
    .update(body)
    .digest("base64url");
  return `${body}.${signature}`;
}

export function verifyOfferToken(token: string): OfferPayload | null {
  try {
    const [body, signature] = token.split(".");
    if (!body || !signature) return null;
    const expected = crypto
      .createHmac("sha256", getSigningSecret())
      .update(body)
      .digest("base64url");

    if (
      signature.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ) {
      return null;
    }

    const payload = JSON.parse(fromBase64Url(body)) as OfferPayload;
    if (
      !isProgrammeId(payload.programmeId) ||
      !["ZA", "NG", "INTL"].includes(payload.market) ||
      typeof payload.exp !== "number" ||
      payload.exp < Date.now()
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

async function fetchExchangeRates() {
  const endpoint =
    process.env.EXCHANGE_RATE_API_URL ||
    "https://open.er-api.com/v6/latest/USD";

  try {
    const response = await fetch(endpoint, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error("Exchange-rate request failed");
    const data = (await response.json()) as {
      rates?: Record<string, number>;
    };
    return {
      ZAR: Number(data.rates?.ZAR) || FALLBACK_RATES.ZAR,
      NGN: Number(data.rates?.NGN) || FALLBACK_RATES.NGN,
    };
  } catch {
    return FALLBACK_RATES;
  }
}

function formatAmount(amount: number, currency: "ZAR" | "NGN" | "USD") {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: currency === "USD" ? 0 : 0,
  }).format(amount);
}

function roundLocal(amount: number, currency: "ZAR" | "NGN" | "USD") {
  if (currency === "NGN") return Math.round(amount / 5000) * 5000;
  if (currency === "ZAR") return Math.round(amount / 50) * 50;
  return Math.round(amount);
}

export function getProgrammePrice(
  programmeId: ProgrammeId,
  planId: PlanId,
  market: Market,
  rates: { ZAR: number; NGN: number },
): PriceOption {
  const programme = programmes[programmeId];
  const baseUsd = programme.baseUsd[planId];
  const paypalUsd = Number((baseUsd * MARKET_FACTORS[market]).toFixed(2));
  const localCurrency = market === "ZA" ? "ZAR" : market === "NG" ? "NGN" : "USD";
  const exchangeRate =
    localCurrency === "ZAR" ? rates.ZAR : localCurrency === "NGN" ? rates.NGN : 1;
  const localAmount = roundLocal(paypalUsd * exchangeRate, localCurrency);

  return {
    planId,
    sessions: planId === "four" ? 4 : 8,
    localAmount,
    localFormatted: formatAmount(localAmount, localCurrency),
    localCurrency,
    paypalUsd,
    note:
      planId === "four"
        ? "One live session each week"
        : "Two live sessions each week",
  };
}

export async function getPricingContext(
  programmeId: ProgrammeId,
): Promise<PricingContext> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "";
  const isLocalDevelopment =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    process.env.NODE_ENV === "development";

  const detectedCountry = (
    requestHeaders.get("x-vercel-ip-country") ||
    requestHeaders.get("cf-ipcountry") ||
    requestHeaders.get("cloudfront-viewer-country") ||
    requestHeaders.get("x-country-code") ||
    process.env.DEFAULT_COUNTRY ||
    "ZA"
  ).toUpperCase();

  const rawCity =
    requestHeaders.get("x-vercel-ip-city") ||
    requestHeaders.get("x-city") ||
    process.env.DEFAULT_CITY ||
    (isLocalDevelopment ? "Johannesburg" : "");
  let city = rawCity || "";
  try {
    city = decodeURIComponent(city);
  } catch {
    // Keep the raw header value if a proxy supplies malformed URI encoding.
  }
  const market = resolveMarket(detectedCountry, city);
  const rates = await fetchExchangeRates();
  const currency = market === "ZA" ? "ZAR" : market === "NG" ? "NGN" : "USD";
  const offerToken = createOfferToken({
    programmeId,
    market,
    exp: Date.now() + 1000 * 60 * 60 * 6,
  });

  return {
    market,
    country: detectedCountry,
    city,
    locationLabel:
      market === "ZA"
        ? city || "South Africa"
        : market === "NG"
          ? city || "Nigeria"
          : city || "International",
    currency,
    options: [
      getProgrammePrice(programmeId, "four", market, rates),
      getProgrammePrice(programmeId, "eight", market, rates),
    ],
    offerToken,
    exchangeRate:
      currency === "ZAR" ? rates.ZAR : currency === "NGN" ? rates.NGN : 1,
    bankTransferAvailable: market === "ZA",
    paypalCurrency: "USD",
    generatedAt: new Date().toISOString(),
  };
}

export async function resolveVerifiedPrice(input: {
  offerToken: string;
  programmeId: unknown;
  planId: unknown;
}) {
  if (!isProgrammeId(input.programmeId) || !isPlanId(input.planId)) {
    return null;
  }
  const offer = verifyOfferToken(input.offerToken);
  if (!offer || offer.programmeId !== input.programmeId) return null;
  const rates = await fetchExchangeRates();
  return {
    programme: programmes[input.programmeId],
    market: offer.market,
    price: getProgrammePrice(
      input.programmeId,
      input.planId,
      offer.market,
      rates,
    ),
  };
}
