import { useState } from "react";
import { toast } from "sonner";

type Lang = "EN" | "FR" | "HE";
type Script = { text: string; badge?: string };
type Section = { title: string; scripts: Script[]; onlyLangs?: Lang[] };

const SECTIONS: Section[] = [
  {
    title: "Greeting",
    scripts: [
      {
        badge: "EN",
        text: `Good [evening/afternoon], welcome to Soho House.\nMy name's Elie — I'll be looking after you today.\nCan I start you off with something to drink?`,
      },
      {
        badge: "FR",
        text: `Bonsoir, bienvenue au Soho House.\nJe m'appelle Élie — je vais m'occuper de vous.\nJe vous apporte quelque chose à boire ?`,
      },
      {
        badge: "HE",
        text: `ערב טוב, ברוכים הבאים לסוהו האוס.\nקוראים לי אלי — אני אטפל בכם.\nמה תרצו לשתות?`,
      },
    ],
  },
  {
    title: "Wine (most important upsell)",
    scripts: [
      { text: `Can I suggest something from the wine list to start?\nWe have some really nice bottles by the glass —\nwhat do you usually enjoy, red or white?` },
      { text: `That dish pairs really well with a lighter white —\nthe [wine] is a great match, a lot of guests love it.` },
      { text: `Would a bottle make more sense for the table?\nBetter value and I'll keep your glasses topped up.` },
      { text: `Can I get you a coffee to finish?\nWe have espresso, cappuccino, flat white —\nand a good selection of digestifs if you fancy one.` },
    ],
  },
  {
    title: "Tapas-style service",
    scripts: [
      { text: `Feel free to order as you go —\neverything comes out as it's ready.\nTake your time and just wave me over whenever.` },
      { text: `Can I bring a couple more dishes for the table,\nor are you happy with what you have for now?` },
      { text: `That one's great for sharing —\nwould you like me to bring an extra plate?` },
      { text: `How is everything so far?\nCan I bring you anything else while you're settled?` },
    ],
  },
  {
    title: "Pool & garden",
    scripts: [
      { text: `Can I get you something cold to drink?\nWe have still and sparkling water,\nfresh juices, and the full wine list.` },
      { text: `I'll keep an eye on you from here —\njust catch my eye whenever you need anything.` },
      { text: `A few small plates to share while you're\nby the pool? The [dish] is perfect for this.` },
    ],
  },
  {
    title: "Recovery",
    scripts: [
      { text: `I sincerely apologize — let me sort that right now\nand make sure the rest of your time here\nis exactly right.` },
      { text: `Great question — let me check that for you\nright away.` },
      { text: `I appreciate your patience — it's coming right up.` },
    ],
  },
];

const ALLERGENS = ["Gluten", "Dairy", "Fish", "Crustaceans", "Egg", "Sesame", "Soya", "Mustard"];

const ScriptCard = ({ script }: { script: Script }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script.text);
      toast("Copied", { duration: 1500, position: "bottom-center" });
    } catch {
      toast("Copy failed", { duration: 1500, position: "bottom-center" });
    }
  };

  const isHebrew = script.badge === "HE";

  return (
    <button
      onClick={handleCopy}
      className="w-full text-left bg-sh-surface border border-sh-border border-l-2 border-l-sh-text rounded-none p-4"
    >
      {script.badge && (
        <span className="inline-block mb-3 px-2 py-1 text-[9px] uppercase tracking-wide bg-sh-bg border border-sh-text text-sh-text rounded-none">
          {script.badge}
        </span>
      )}
      <p
        className="font-serif text-[18px] font-normal italic text-sh-text whitespace-pre-line"
        style={{ lineHeight: 1.7, direction: isHebrew ? "rtl" : "ltr" }}
      >
        {script.text}
      </p>
    </button>
  );
};

const Scripts = () => {
  return (
    <div className="px-5 pt-4 pb-8 max-w-md mx-auto flex flex-col gap-6">
      {SECTIONS.map((section) => (
        <section key={section.title}>
          <h3 className="text-[10px] uppercase tracking-widest text-sh-muted border-b border-sh-border pb-2 mb-3">
            {section.title}
          </h3>
          <div className="flex flex-col gap-3">
            {section.scripts.map((s, i) => (
              <ScriptCard key={i} script={s} />
            ))}
          </div>
        </section>
      ))}

      <section>
        <h3 className="text-[10px] uppercase tracking-widest text-sh-muted border-b border-sh-border pb-2 mb-3">
          Allergen quick reference
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {ALLERGENS.map((a) => (
            <div
              key={a}
              className="px-3 py-1.5 text-[11px] bg-sh-btn text-sh-bg rounded-none text-center"
            >
              {a}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] italic text-sh-muted">
          When in doubt — always check with the kitchen.
        </p>
      </section>
    </div>
  );
};

export default Scripts;
