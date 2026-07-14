import Link from "next/link";

type Props = {
  searchParams: Promise<{ reference?: string }>;
};

export default async function AiSprintConfirmedPage({ searchParams }: Props) {
  const params = await searchParams;
  const reference = params.reference || "Imaginelabs booking";

  return (
    <main className="paymentResultPage">
      <section>
        <p>Imaginelabs AI Business Sprint</p>
        <h1>Your seat is confirmed.</h1>
        <span>Reference</span>
        <strong>{reference}</strong>
        <p>
          Your PayPal payment was completed successfully. We will email the class link,
          preparation checklist and onboarding information before the session.
        </p>
        <div>
          <Link href="/">Return to the class page</Link>
          <a href="https://wa.me/27733110149" target="_blank" rel="noreferrer">
            Contact Imaginelabs
          </a>
        </div>
      </section>
      <style>{`
        .paymentResultPage{min-height:100vh;display:grid;place-items:center;padding:32px;background:#fffdf2;color:#15101e;font-family:var(--il-body,Arial,sans-serif)}
        .paymentResultPage section{width:min(720px,100%);padding:clamp(32px,7vw,72px);border-radius:32px;background:#582998;color:white;box-shadow:0 30px 80px rgba(50,20,95,.18)}
        .paymentResultPage section>p:first-child{margin:0 0 28px;text-transform:uppercase;letter-spacing:.14em;font-size:12px;color:#51e6e3}
        .paymentResultPage h1{margin:0 0 32px;font-size:clamp(46px,8vw,88px);line-height:.94;letter-spacing:-.05em}
        .paymentResultPage span{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.13em;color:#ffe01b}
        .paymentResultPage strong{display:block;margin:8px 0 28px;font-size:clamp(22px,4vw,34px);word-break:break-word}
        .paymentResultPage section>p:last-of-type{max-width:580px;font-size:18px;line-height:1.6;color:rgba(255,255,255,.8)}
        .paymentResultPage div{display:flex;gap:12px;flex-wrap:wrap;margin-top:34px}
        .paymentResultPage a{display:inline-flex;padding:14px 20px;border-radius:999px;background:white;color:#32145f;text-decoration:none;font-weight:700}
        .paymentResultPage a+a{background:transparent;color:white;border:1px solid rgba(255,255,255,.35)}
      `}</style>
    </main>
  );
}
