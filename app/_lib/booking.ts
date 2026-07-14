export type BookingInput = {
  programmeId: unknown;
  planId: unknown;
  offerToken: unknown;
  parentName: unknown;
  parentEmail: unknown;
  phone: unknown;
  childName: unknown;
  childAge: unknown;
  grade: unknown;
  country: unknown;
  city: unknown;
};

export type ValidBookingInput = {
  programmeId: string;
  planId: string;
  offerToken: string;
  parentName: string;
  parentEmail: string;
  phone: string;
  childName: string;
  childAge: string;
  grade: string;
  country: string;
  city: string;
};

function clean(value: unknown, max = 160) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function validateBookingInput(input: BookingInput): ValidBookingInput | null {
  const value = {
    programmeId: clean(input.programmeId, 40),
    planId: clean(input.planId, 20),
    offerToken: clean(input.offerToken, 600),
    parentName: clean(input.parentName),
    parentEmail: clean(input.parentEmail).toLowerCase(),
    phone: clean(input.phone, 60),
    childName: clean(input.childName, 80),
    childAge: clean(input.childAge, 3),
    grade: clean(input.grade, 40),
    country: clean(input.country, 80),
    city: clean(input.city, 100),
  };

  const age = Number(value.childAge);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.parentEmail);
  if (
    !value.programmeId ||
    !value.planId ||
    !value.offerToken ||
    value.parentName.length < 2 ||
    !emailValid ||
    value.phone.length < 7 ||
    value.childName.length < 2 ||
    !Number.isFinite(age) ||
    age < 8 ||
    age > 17 ||
    value.grade.length < 1 ||
    value.country.length < 2 ||
    value.city.length < 2
  ) {
    return null;
  }

  return value;
}

export function createBookingReference(shortCode: string) {
  const now = new Date();
  const stamp = [
    now.getUTCFullYear().toString().slice(-2),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    String(now.getUTCDate()).padStart(2, "0"),
  ].join("");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `IL-${shortCode}-${stamp}-${random}`;
}
