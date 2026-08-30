import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Genesis Research',
  description: 'About Ousmane Kolet Touré and the Genesis global macro research and trading platform.',
};

const process = [
  {
    step: '01',
    title: 'Identify the regime',
    text: 'Separate the durable growth, inflation, and policy signal from the release-day noise.',
  },
  {
    step: '02',
    title: 'Map transmission',
    text: 'Translate the reaction function through rates, the dollar, equities, commodities, and financial conditions.',
  },
  {
    step: '03',
    title: 'Express the view',
    text: 'Define the asset, horizon, catalyst, risk, and conditions that would invalidate the thesis.',
  },
  {
    step: '04',
    title: 'Document execution',
    text: 'Preserve the original evidence, positioning decision, target, and subsequent trade updates.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <a href="/" className="text-xl font-bold tracking-tight text-white hover:text-slate-200">Genesis Research</a>
          <a href="/" className="text-sm font-semibold text-slate-300 hover:text-white">Research</a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <section className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">About Genesis</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Independent macro research built for investment decisions.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Genesis Research is an independent global macro research and trading platform created by Ousmane Kolet Touré. It connects economic data and central-bank reaction functions to cross-asset views, explicit trade ideas, and a transparent execution record.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            The work is designed for investors, multi-asset teams, and hiring managers who want to evaluate the complete investment process - not only a chart or a market opinion, but the evidence, mechanism, positioning decision, and risk management behind it.
          </p>
        </section>

        <section className="mt-14 grid gap-8 border-y border-slate-200 py-10 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Founder</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">Ousmane Kolet Touré</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Global macro researcher and markets practitioner with experience spanning BCA Research Daily Insights, PSP Investments' CIO Office, CDPQ portfolio analytics, and investment-fund valuation at CACEIS.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/in/ousmane-kolet-tour%C3%A9/"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
              >
                LinkedIn
              </a>
              <a href="/" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
                View research
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">Research foundation</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                Former Global Macro Research Associate with BCA Research Daily Insights, producing economic and cross-asset chart packages, research narratives, and publication-ready analysis.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">Investment foundation</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                Portfolio-strategy experience at PSP Investments and a master's thesis on gold's strategic role in investment-risk diversification.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">Research process</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">From evidence to accountable positioning</h2>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {process.map(item => (
              <article key={item.step} className="rounded-xl border border-slate-200 p-5">
                <p className="text-xs font-bold text-emerald-700">{item.step}</p>
                <h3 className="mt-3 text-lg font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl bg-slate-900 p-7 text-white sm:p-9">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300">Purpose</p>
          <p className="mt-4 max-w-3xl text-xl font-semibold leading-relaxed">
            Genesis is being built as a useful research and trading product, a disciplined record of investment thinking, and a demonstration of the process Ousmane would bring to a global macro, asset-allocation, or multi-asset investment team.
          </p>
        </section>
      </main>
    </div>
  );
}
