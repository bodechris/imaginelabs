import { randomBytes } from "crypto";

export type AiSprintRegistrationPayload = {
  firstName?: unknown;
  lastName?: unknown;
  companyName?: unknown;
  businessType?: unknown;
  jobTitle?: unknown;
  workEmail?: unknown;
  workPhone?: unknown;
  country?: unknown;
  city?: unknown;
  websiteOrSocial?: unknown;
  goal?: unknown;
  paymentMethod?: unknown;
  consent?: unknown;
  marketingConsent?: unknown;
};

export type AiSprintRegistration = {
  firstName: string;
  lastName: string;
  companyName: string;
  businessType: string;
  jobTitle: string;
  workEmail: string;
  workPhone: string;
  country: string;
  city: string;
  websiteOrSocial: string;
  goal: string;
  paymentMethod: "paypal" | "bank";
  consent: true;
  marketingConsent: boolean;
};

function clean(value: unknown, max = 220) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanBoolean(value: unknown) {
  return value === true || value === "true" || value === "on";
}

export function validateAiSprintRegistration(
  payload: AiSprintRegistrationPayload,
): AiSprintRegistration | null {
  const firstName = clean(payload.firstName, 80);
  const lastName = clean(payload.lastName, 80);
  const companyName = clean(payload.companyName, 120);
  const businessType = clean(payload.businessType, 100);
  const jobTitle = clean(payload.jobTitle, 100);
  const workEmail = clean(payload.workEmail, 160).toLowerCase();
  const workPhone = clean(payload.workPhone, 60);
  const country = clean(payload.country, 80);
  const city = clean(payload.city, 100);
  const websiteOrSocial = clean(payload.websiteOrSocial, 240);
  const goal = clean(payload.goal, 1000);
  const paymentMethod = clean(payload.paymentMethod, 20) === "bank" ? "bank" : "paypal";
  const consent = cleanBoolean(payload.consent);
  const marketingConsent = cleanBoolean(payload.marketingConsent);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail);
  const phoneValid = /^[+()\-\s0-9]{7,30}$/.test(workPhone);

  if (
    firstName.length < 2 ||
    lastName.length < 2 ||
    companyName.length < 2 ||
    businessType.length < 2 ||
    !emailValid ||
    !phoneValid ||
    country.length < 2 ||
    city.length < 2 ||
    goal.length < 8 ||
    !consent
  ) {
    return null;
  }

  return {
    firstName,
    lastName,
    companyName,
    businessType,
    jobTitle,
    workEmail,
    workPhone,
    country,
    city,
    websiteOrSocial,
    goal,
    paymentMethod,
    consent: true,
    marketingConsent,
  };
}

export function createAiSprintReference() {
  const now = new Date();
  const date = [
    now.getUTCFullYear().toString().slice(-2),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    String(now.getUTCDate()).padStart(2, "0"),
  ].join("");
  const random = randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
  return `IL-AI-${date}-${random}`;
}

export const aiSprintConfig = {
  programme: "imaginelabs AI Business Sprint",
  classDate: process.env.AI_SPRINT_CLASS_DATE || "Saturday, 1 August 2026",
  classTime: process.env.AI_SPRINT_CLASS_TIME || "10:00 AM — 1:00 PM SAST",
  priceZar: process.env.AI_SPRINT_PRICE_ZAR || "950",
  paypalUsd: Number(process.env.AI_SPRINT_PAYPAL_USD || "55"),
};
