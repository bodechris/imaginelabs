import Link from "next/link";

type Props = {
  searchParams: Promise<{ reference?: string; reason?: string }>;
};

export default async function AiSprintCancelledPage({ searchParams }: Props) {
  const params = await searchParams;
  const captureFailed = params.reason === "capture_failed";

  return (
    <main className="paymentResultPage cancelled">
      <section>
        <p>Imaginelabs AI Business Sprint</p>
        <h1>{captureFailed ? "Payment needs attention." : "Payment was not completed."}</h1>
        <span>Reference</span>
        <strong>{params.reference || "Not created"}</strong>
        <p>
          {captureFailed
            ? "PayPal returned without a verified completed payment. Please contact us before trying again so we can check the order."
            : "Your registration details were received, but PayPal payment was cancelled. You can return to the form and try again or contact us for help."}
        </p>
        <div>
          <Link href="/#register">Return to payment</Link>
          <a href="https://wa.me/27733110149" target="_blank" rel="noreferrer">
            Get help on WhatsApp
          </a>
        </div>
      </section>
      <style>{`
        .paymentResultPage{min-height:100vh;display:grid;place-items:center;padding:32px;background:#fffdf2;color:#15101e;font-family:var(--il-body,Arial,sans-serif)}
        .paymentResultPage section{width:min(720px,100%);padding:clamp(32px,7vw,72px);border-radius:32px;background:#15101e;color:white;box-shadow:0 30px 80px rgba(21,16,30,.18)}
        .paymentResultPage section>p:first-child{margin:0 0 28px;text-transform:uppercase;letter-spacing:.14em;font-size:12px;color:#51e6e3}
        .paymentResultPage h1{margin:0 0 32px;font-size:clamp(44px,8vw,82px);line-height:.95;letter-spacing:-.05em}
        .paymentResultPage span{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.13em;color:#ffe01b}
        .paymentResultPage strong{display:block;margin:8px 0 28px;font-size:clamp(22px,4vw,34px);word-break:break-word}
        .paymentResultPage section>p:last-of-type{max-width:580px;font-size:18px;line-height:1.6;color:rgba(255,255,255,.76)}
        .paymentResultPage div{display:flex;gap:12px;flex-wrap:wrap;margin-top:34px}
        .paymentResultPage a{display:inline-flex;padding:14px 20px;border-radius:999px;background:#ffe01b;color:#15101e;text-decoration:none;font-weight:700}
        .paymentResultPage a+a{background:transparent;color:white;border:1px solid rgba(255,255,255,.28)}
      `}</style>
    </main>
  );
}
