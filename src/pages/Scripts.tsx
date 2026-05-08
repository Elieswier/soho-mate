import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown, Copy } from "lucide-react";

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
        text: `Bonsoir, bienvenue au Soho House.\nJe m'appelle Élie — je vais m'occuper de vous ce soir.\nJe vous apporte quelque chose à boire ?`,
      },
      {
        badge: "HE",
        text: `ערב טוב, ברוכים הבאים לסוהו האוס.\nקוראים לי אלי — אני אטפל בכם הערב.\nמה תרצו לשתות?`,
      },
    ],
  },
  {
    title: "Wine (most important upsell)",
    scripts: [
      {
        badge: "EN",
        text: `Can I suggest something from the wine list to start?\nWe have some really nice bottles by the glass —\nwhat do you usually enjoy, red or white?`,
      },
      {
        badge: "EN",
        text: `That dish pairs really well with a lighter white —\nthe [wine] is a great match, a lot of guests love it.`,
      },
      {
        badge: "EN",
        text: `Would a bottle make more sense for the table?\nBetter value and I'll keep your glasses topped up.`,
      },
      {
        badge: "EN",
        text: `Can I get you a coffee to finish?\nWe have espresso, cappuccino, flat white —\nand a good selection of digestifs if you fancy one.`,
      },
      {
        badge: "FR",
        text: `Je peux vous suggérer quelque chose de la carte des vins ?\nNous avons de très belles bouteilles au verre —\nvous préférez plutôt le rouge ou le blanc ?`,
      },
      {
        badge: "FR",
        text: `Ce plat se marie très bien avec un blanc léger —\nle [vin] est un excellent choix, beaucoup de membres l'adorent.`,
      },
      {
        badge: "FR",
        text: `Une bouteille serait peut-être plus judicieuse pour la table ?\nMeilleur rapport qualité-prix, et je vous tiens les verres bien remplis.`,
      },
      {
        badge: "FR",
        text: `Un café pour terminer ?\nEspresso, cappuccino, flat white —\net une belle sélection de digestifs si ça vous tente.`,
      },
      {
        badge: "HE",
        text: `אפשר להמליץ על משהו מרשימת היינות להתחלה ?\nיש לנו בקבוקים מעולים בכוסות —\nמה אתם מעדיפים בדרך כלל, אדום או לבן ?`,
      },
      {
        badge: "HE",
        text: `המנה הזו מתאימה מאוד עם לבן קליל —\nה[יין] הוא שידוך מצוין, הרבה חברים מאוד אוהבים אותו.`,
      },
      {
        badge: "HE",
        text: `אולי בקבוק יהיה יותר הגיוני לשולחן ?\nשווה יותר, ואני אדאג שהכוסות תמיד יהיו מלאות.`,
      },
      {
        badge: "HE",
        text: `קפה לסיום ?\nאספרסו, קפוצ'ינו, פלט וייט —\nויש גם מבחר יפה של דיז'סטיף אם בא לכם.`,
      },
    ],
  },
  {
    title: "Tapas-style service",
    scripts: [
      {
        badge: "EN",
        text: `Feel free to order as you go —\neverything comes out as it's ready.\nTake your time and just wave me over whenever.`,
      },
      {
        badge: "EN",
        text: `Can I bring a couple more dishes for the table,\nor are you happy with what you have for now?`,
      },
      {
        badge: "EN",
        text: `That one's great for sharing —\nwould you like me to bring an extra plate?`,
      },
      {
        badge: "EN",
        text: `How is everything so far?\nCan I bring you anything else while you're settled?`,
      },
      {
        badge: "FR",
        text: `Commandez à votre rythme —\ntout sort au fur et à mesure que c'est prêt.\nPrenez votre temps, faites-moi signe quand vous voulez.`,
      },
      {
        badge: "FR",
        text: `Je vous apporte quelques plats supplémentaires,\nou vous êtes satisfaits pour l'instant ?`,
      },
      {
        badge: "FR",
        text: `C'est idéal à partager —\nje vous apporte une assiette supplémentaire ?`,
      },
      {
        badge: "FR",
        text: `Tout se passe bien ?\nJe peux vous apporter autre chose pendant que vous êtes installés ?`,
      },
      {
        badge: "HE",
        text: `תזמינו בזמן שלכם —\nהכל יוצא כשמוכן.\nקחו את הזמן, תעשו לי סימן כשתרצו משהו.`,
      },
      {
        badge: "HE",
        text: `להביא עוד כמה מנות לשולחן,\nאו שאתם בסדר עם מה שיש עכשיו ?`,
      },
      {
        badge: "HE",
        text: `זה מעולה לשיתוף —\nלהביא צלחת נוספת ?`,
      },
      {
        badge: "HE",
        text: `הכל בסדר ?\nאפשר להביא עוד משהו בזמן שאתם נינוחים ?`,
      },
    ],
  },
  {
    title: "Pool & garden",
    scripts: [
      {
        badge: "EN",
        text: `Can I get you something cold to drink?\nWe have still and sparkling water,\nfresh juices, and the full wine list.`,
      },
      {
        badge: "EN",
        text: `I'll keep an eye on you from here —\njust catch my eye whenever you need anything.`,
      },
      {
        badge: "EN",
        text: `A few small plates to share while you're\nby the pool? The [dish] is perfect for this.`,
      },
      {
        badge: "FR",
        text: `Je vous apporte quelque chose de frais ?\nNous avons de l'eau plate et gazeuse,\ndes jus frais et la carte des vins complète.`,
      },
      {
        badge: "FR",
        text: `Je reste dans les parages —\nfaites-moi signe dès que vous avez besoin de quoi que ce soit.`,
      },
      {
        badge: "FR",
        text: `Quelques petites assiettes à partager au bord de la piscine ?\nLe [plat] est parfait pour ça.`,
      },
      {
        badge: "HE",
        text: `להביא משהו קר לשתות ?\nיש לנו מים סודה ורגיל,\nמיצים טריים ורשימת יינות מלאה.`,
      },
      {
        badge: "HE",
        text: `אני כאן בשבילכם —\nתעשו לי סימן בכל פעם שתצטרכו משהו.`,
      },
      {
        badge: "HE",
        text: `כמה מנות קטנות לשיתוף ליד הבריכה ?\nה[מנה] מושלמת לזה.`,
      },
    ],
  },
  {
    title: "Recovery",
    scripts: [
      {
        badge: "EN",
        text: `I sincerely apologize — let me sort that right now\nand make sure the rest of your time here\nis exactly right.`,
      },
      {
        badge: "EN",
        text: `Great question — let me check that for you\nright away.`,
      },
      {
        badge: "EN",
        text: `I appreciate your patience — it's coming right up.`,
      },
      {
        badge: "FR",
        text: `Je vous présente mes sincères excuses —\nje règle ça immédiatement pour que la suite de votre soirée\nse passe exactement comme il faut.`,
      },
      {
        badge: "FR",
        text: `Très bonne question —\nlaissez-moi vérifier ça pour vous tout de suite.`,
      },
      {
        badge: "FR",
        text: `J'apprécie votre patience — c'est en route.`,
      },
      {
        badge: "HE",
        text: `אני מתנצל בכנות —\nאני מטפל בזה עכשיו כדי שהמשך הערב שלכם\nיהיה בדיוק כפי שצריך להיות.`,
      },
      {
        badge: "HE",
        text: `שאלה מצוינת —\nתנו לי לבדוק את זה בשבילכם עכשיו.`,
      },
      {
        badge: "HE",
        text: `תודה על הסבלנות — זה בדרך.`,
      },
    ],
  },
];

const ALLERGENS = ["Gluten", "Dairy", "Fish", "Crustaceans", "Egg", "Sesame", "Soya", "Mustard"];

const ScriptCard = ({ script }: { script: Script }) => {
  const [expanded, setExpanded] = useState(false);
  const isHebrew = script.badge === "HE";
  const lines = script.text.split("\n");
  const preview = lines[0];

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(script.text);
      toast("Copied", { duration: 1200, position: "bottom-center" });
    } catch {
      toast("Copy failed", { duration: 1200, position: "bottom-center" });
    }
  };

  return (
    <div className="bg-sh-surface border border-sh-border border-l-[3px] border-l-sh-cta rounded-xl" style={{ boxShadow: "0 2px 6px rgba(26,26,26,0.04)" }}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-4 flex items-start justify-between gap-2"
      >
        <p
          className="font-body text-[14px] italic text-sh-text leading-snug flex-1"
          style={{ direction: isHebrew ? "rtl" : "ltr" }}
        >
          {preview}{lines.length > 1 && !expanded ? " …" : ""}
        </p>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={`flex-shrink-0 mt-0.5 text-sh-muted transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          <p
            className="font-body text-[14px] italic text-sh-text whitespace-pre-line leading-relaxed"
            style={{ direction: isHebrew ? "rtl" : "ltr" }}
          >
            {script.text}
          </p>
          <button
            onClick={handleCopy}
            className="self-start flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] font-semibold text-sh-cta border border-sh-cta-light bg-sh-cta-light px-3 py-1.5 rounded-lg hover:bg-sh-cta hover:text-white transition-colors"
          >
            <Copy size={10} strokeWidth={2} />
            Copy
          </button>
        </div>
      )}
    </div>
  );
};

const AccordionSection = ({ title, scripts }: { title: string; scripts: Script[] }) => {
  const [open, setOpen] = useState(title === "Greeting");

  return (
    <section>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between pb-2 mb-1 border-b border-sh-border"
      >
        <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-sh-muted">{title}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-sh-muted">{scripts.length}</span>
          <ChevronDown
            size={13}
            strokeWidth={1.5}
            className={`text-sh-muted transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      {open && (
        <div className="flex flex-col gap-2 mt-2">
          {scripts.map((s, i) => (
            <ScriptCard key={i} script={s} />
          ))}
        </div>
      )}
    </section>
  );
};

const Scripts = () => {
  const [lang, setLang] = useState<Lang>("EN");
  const langs: Lang[] = ["EN", "FR", "HE"];

  const filterScripts = (section: Section) =>
    section.scripts.filter((s) => !s.badge || s.badge === lang);

  return (
    <div className="px-5 pt-6 pb-28 max-w-md md:max-w-4xl mx-auto md:px-10 flex flex-col gap-5">
      <h1 className="font-sans font-black text-[44px] md:text-[56px] text-sh-text leading-none tracking-tight">Scripts</h1>

      <div className="flex gap-2">
        {langs.map((l) => {
          const active = l === lang;
          return (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] font-semibold rounded-xl border transition-all duration-150 ${
                active
                  ? "bg-sh-text text-sh-bg border-sh-text shadow-sh-sm"
                  : "bg-transparent text-sh-muted border-sh-border hover:border-sh-border-strong"
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>

      {SECTIONS.map((section) => {
        if (section.onlyLangs && !section.onlyLangs.includes(lang)) return null;
        const visible = filterScripts(section);
        if (visible.length === 0) return null;
        return (
          <AccordionSection key={section.title} title={section.title} scripts={visible} />
        );
      })}

      <section>
        <button
          className="w-full flex items-center justify-between pb-2 mb-1 border-b border-sh-border"
          onClick={() => {}}
        >
          <span className="text-[10px] uppercase tracking-widest text-sh-muted">Allergen quick reference</span>
        </button>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {ALLERGENS.map((a) => (
            <div
              key={a}
              className="px-2 py-1.5 text-[10px] bg-sh-btn text-sh-bg rounded-none text-center"
            >
              {a}
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] italic text-sh-muted">
          When in doubt — always check with the kitchen.
        </p>
      </section>
    </div>
  );
};

export default Scripts;
