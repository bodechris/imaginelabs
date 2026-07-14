"use client";

const STORAGE_KEY = "imaginelabs_consent_v1";
const COOKIE_NAME = "imaginelabs_consent";

export default function CookieSettingsButton({
  className,
}: {
  className?: string;
}) {
  function reopenPreferences() {
    window.localStorage.removeItem(STORAGE_KEY);
    document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
    window.location.reload();
  }

  return (
    <button type="button" className={className} onClick={reopenPreferences}>
      Cookie settings
    </button>
  );
}
