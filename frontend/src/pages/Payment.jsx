import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const plans = [
  {
    id: "free", name: "Free", price: 0, period: "forever", label: "Get started",
    description: "Explore the basics at your own pace.",
    features: ["Selected free episodes", "Basic market explainers", "Save learning progress"],
  },
  {
    id: "starter", name: "Starter", price: 99, period: "month", label: "Choose Starter",
    description: "A little more depth for curious learners.",
    features: ["All free features", "Starter learning collection", "Ad-free learning experience"],
  },
  {
    id: "plus", name: "Plus", price: 149, period: "month", label: "Choose Plus",
    description: "Build a consistent market-learning habit.",
    features: ["Everything in Starter", "Premium explainers", "Monthly learning summaries"],
  },
  {
    id: "pro", name: "Pro", price: 249, period: "month", label: "Choose Pro", popular: true,
    description: "For learners who want the complete experience.",
    features: ["Everything in Plus", "All premium episodes", "In-depth market stories", "Priority access to new lessons"],
  },
  {
    id: "annual", name: "Pro Annual", price: 1499, period: "year", label: "Choose Annual",
    description: "A full year of premium learning at a lower price.",
    features: ["Everything in Pro", "12 months of premium access", "One simple annual demo checkout"],
  },
  {
    id: "lifetime", name: "Lifetime", price: 2999, period: "one time", label: "Choose Lifetime",
    description: "A one-time demo option for the full project experience.",
    features: ["Everything in Pro", "Lifetime access in this demo", "One-time demo checkout"],
  },
];

const methods = [
  { id: "upi", name: "UPI", detail: "Google Pay, PhonePe, Paytm", icon: "▦" },
  { id: "card", name: "Credit / Debit Card", detail: "Visa, Mastercard, RuPay", icon: "▤" },
  { id: "netbanking", name: "Net Banking", detail: "Choose your bank", icon: "▥" },
  { id: "wallet", name: "Wallet", detail: "Popular digital wallets", icon: "▣" },
];

const money = (amount) => amount === 0 ? "Free" : new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(amount);

export default function Payment() {
  const [selectedPlanId, setSelectedPlanId] = useState("pro");
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [stage, setStage] = useState("plans");
  const [receipt, setReceipt] = useState(null);
  const selectedPlan = useMemo(() => plans.find((plan) => plan.id === selectedPlanId) || plans[0], [selectedPlanId]);

  const continueToCheckout = () => {
    if (selectedPlan.price === 0) {
      finishDemo();
      return;
    }
    setStage("checkout");
  };

  const finishDemo = () => {
    const demoReceipt = {
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      amount: selectedPlan.price,
      period: selectedPlan.period,
      method: selectedPlan.price === 0 ? "Free plan" : methods.find((method) => method.id === selectedMethod)?.name,
      status: "Demo activated",
      createdAt: new Date().toISOString(),
      reference: `DEMO-${Date.now().toString().slice(-8)}`,
    };
    localStorage.setItem("ss_demo_subscription", JSON.stringify(demoReceipt));
    setReceipt(demoReceipt);
    setStage("success");
  };

  const startAgain = () => {
    setStage("plans");
    setReceipt(null);
  };

  return (
    <section className="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <div className="text-center max-w-3xl mx-auto">
        <p className="ui text-sm font-extrabold tracking-[0.18em] text-iris">STOCK SIMPLIFIED PREMIUM</p>
        <h1 className="text-4xl md:text-6xl font-extrabold mt-3">Choose how you learn.</h1>
        <p className="mt-4 text-ink/70 md:text-xl">Simple plans for building your market knowledge, one lesson at a time.</p>
        <div className="inline-flex items-center gap-2 mt-5 rounded-full border border-amber-300 bg-amber-50 text-amber-900 px-4 py-2 text-sm ui font-bold">
          <span aria-hidden="true">✦</span> COLLEGE PROJECT · DEMO CHECKOUT ONLY
        </div>
      </div>

      {stage === "plans" && (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
            {plans.map((plan) => {
              const active = selectedPlanId === plan.id;
              return (
                <button key={plan.id} type="button" onClick={() => setSelectedPlanId(plan.id)}
                  aria-pressed={active}
                  className={`relative text-left rounded-3xl border-2 p-6 bg-white transition-all hover:-translate-y-1 hover:shadow-lift ${active ? "border-ink shadow-lift ring-2 ring-saffron" : "border-mist"}`}>
                  {plan.popular && <span className="absolute -top-3 right-5 rounded-full bg-saffron border border-ink px-3 py-1 text-xs ui font-extrabold">MOST POPULAR</span>}
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs ui font-bold ${active ? "bg-saffron text-ink" : "bg-paper text-ink/70"}`}>{active ? "SELECTED" : plan.name.toUpperCase()}</span>
                  <h2 className="text-2xl font-extrabold mt-4">{plan.name}</h2>
                  <p className="text-sm text-ink/65 mt-2 min-h-10">{plan.description}</p>
                  <p className="mt-5"><span className="text-4xl font-extrabold">{money(plan.price)}</span>{plan.price > 0 && <span className="text-sm text-ink/60"> / {plan.period}</span>}</p>
                  <div className="h-px bg-mist my-5" />
                  <ul className="space-y-3 text-sm text-ink/80">
                    {plan.features.map((feature) => <li key={feature} className="flex gap-2"><span className="text-emerald-700 font-black">✓</span><span>{feature}</span></li>)}
                  </ul>
                  <div className={`mt-6 rounded-full border-2 border-ink text-center py-2.5 ui font-bold ${active ? "bg-saffron" : "bg-white"}`}>{active ? "Selected plan" : "Select plan"}</div>
                </button>
              );
            })}
          </div>

          <div className="max-w-3xl mx-auto mt-8 rounded-3xl bg-ink text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <p className="text-white/60 text-sm ui font-bold tracking-wider">YOUR SELECTION</p>
              <h2 className="text-2xl font-extrabold mt-1">{selectedPlan.name} · {money(selectedPlan.price)}{selectedPlan.price > 0 ? ` / ${selectedPlan.period}` : ""}</h2>
              <p className="text-white/65 text-sm mt-1">No real payment will be collected.</p>
            </div>
            <button type="button" onClick={continueToCheckout} className="shrink-0 rounded-full bg-saffron text-ink border-2 border-white/20 px-7 py-3 ui font-extrabold hover:brightness-105">
              {selectedPlan.price === 0 ? "Activate free plan" : "Continue to demo checkout"} →
            </button>
          </div>
        </>
      )}

      {stage === "checkout" && (
        <div className="max-w-3xl mx-auto mt-10 grid md:grid-cols-[1.1fr_.9fr] gap-5">
          <div className="rounded-3xl border border-mist bg-white p-6 md:p-8">
            <button type="button" onClick={() => setStage("plans")} className="text-sm ui font-bold text-iris hover:underline">← Back to plans</button>
            <h2 className="text-3xl font-extrabold mt-4">Demo checkout</h2>
            <p className="text-ink/65 mt-2">Choose a display payment method for your project demonstration.</p>
            <div className="space-y-3 mt-6">
              {methods.map((method) => (
                <button key={method.id} type="button" onClick={() => setSelectedMethod(method.id)} aria-pressed={selectedMethod === method.id}
                  className={`w-full rounded-2xl border-2 p-4 flex items-center gap-4 text-left ${selectedMethod === method.id ? "border-ink bg-amber-50" : "border-mist hover:border-ink/40"}`}>
                  <span className="w-11 h-11 rounded-xl bg-paper flex items-center justify-center text-xl" aria-hidden="true">{method.icon}</span>
                  <span className="flex-1"><span className="block ui font-extrabold">{method.name}</span><span className="block text-sm text-ink/60">{method.detail}</span></span>
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? "border-ink" : "border-mist"}`}>{selectedMethod === method.id && <span className="w-2.5 h-2.5 rounded-full bg-ink" />}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-950">
              <strong>Demo mode:</strong> These are visual payment-method choices only. Do not enter card numbers, UPI PINs, passwords or other banking information.
            </div>
            <button type="button" onClick={finishDemo} className="w-full mt-6 rounded-full bg-saffron border-2 border-ink px-6 py-3 ui font-extrabold hover:brightness-105">Simulate successful payment</button>
            <p className="text-center text-xs text-ink/50 mt-3">This button only activates a local demo state. No gateway or bank is contacted.</p>
          </div>
          <aside className="rounded-3xl bg-ink text-white p-6 md:p-8 h-fit">
            <p className="text-white/60 text-sm ui font-bold tracking-wider">ORDER SUMMARY</p>
            <h3 className="text-2xl font-extrabold mt-3">{selectedPlan.name}</h3>
            <p className="text-white/60 text-sm mt-1">{selectedPlan.description}</p>
            <div className="h-px bg-white/15 my-6" />
            <div className="flex justify-between gap-3 text-sm"><span className="text-white/65">Plan</span><span>{selectedPlan.name}</span></div>
            <div className="flex justify-between gap-3 text-sm mt-3"><span className="text-white/65">Billing</span><span className="capitalize">{selectedPlan.period}</span></div>
            <div className="flex justify-between gap-3 text-sm mt-3"><span className="text-white/65">Payment method</span><span>{methods.find((m) => m.id === selectedMethod)?.name}</span></div>
            <div className="h-px bg-white/15 my-6" />
            <div className="flex justify-between items-center"><span className="font-bold">Total (demo)</span><span className="text-3xl font-extrabold">{money(selectedPlan.price)}</span></div>
            <p className="text-xs text-white/50 mt-5">For academic presentation only. This is not a purchase or a real subscription payment.</p>
          </aside>
        </div>
      )}

      {stage === "success" && receipt && (
        <div className="max-w-xl mx-auto mt-12 bg-white border-2 border-emerald-200 rounded-3xl p-7 md:p-10 text-center shadow-lift">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center text-3xl font-black">✓</div>
          <p className="mt-5 text-sm ui font-extrabold tracking-widest text-emerald-700">DEMO COMPLETE</p>
          <h2 className="text-3xl font-extrabold mt-2">{receipt.planName} selected!</h2>
          <p className="text-ink/65 mt-3">The demo subscription state has been saved in this browser. No money was charged.</p>
          <div className="rounded-2xl bg-paper p-5 mt-6 text-left space-y-3 text-sm">
            <div className="flex justify-between gap-3"><span className="text-ink/60">Demo reference</span><strong>{receipt.reference}</strong></div>
            <div className="flex justify-between gap-3"><span className="text-ink/60">Plan</span><strong>{receipt.planName}</strong></div>
            <div className="flex justify-between gap-3"><span className="text-ink/60">Amount shown</span><strong>{money(receipt.amount)}</strong></div>
            <div className="flex justify-between gap-3"><span className="text-ink/60">Method</span><strong>{receipt.method}</strong></div>
            <div className="flex justify-between gap-3"><span className="text-ink/60">Status</span><strong className="text-emerald-700">{receipt.status}</strong></div>
          </div>
          <button type="button" onClick={startAgain} className="mt-7 rounded-full bg-saffron border-2 border-ink px-7 py-3 ui font-extrabold">Back to plans</button>
          <p className="mt-4 text-xs text-ink/50"><Link to="/" className="underline">Return to homepage</Link></p>
        </div>
      )}

      <p className="max-w-3xl mx-auto text-center text-xs text-ink/50 mt-10">Stock Simplified is a student project. Plan prices and checkout screens are sample UI for demonstration and do not represent a live offer or financial service.</p>
    </section>
  );
}
