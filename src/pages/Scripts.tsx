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
  const [lang, setLang] = useState<Lang>("EN");
  const langs: Lang[] = ["EN", "FR", "HE"];

  const filterScripts = (section: Section) => {
    return section.scripts.filter((s) => !s.badge || s.badge === lang);
  };

  return (
    <div className="px-5 pt-4 pb-28 max-w-md md:max-w-4xl mx-auto md:px-10 flex flex-col gap-6">
      <div className="flex gap-2">
        {langs.map((l) => {
          const active = l === lang;
          return (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-wide rounded-none border ${
                active
                  ? "bg-sh-text text-sh-bg border-sh-text"
                  : "bg-transparent text-sh-muted border-sh-border"
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
          <section key={section.title}>
            <h3 className="text-[10px] uppercase tracking-widest text-sh-muted border-b border-sh-border pb-2 mb-3">
              {section.title}
            </h3>
            <div className="flex flex-col gap-3">
              {visible.map((s, i) => (
                <ScriptCard key={i} script={s} />
              ))}
            </div>
          </section>
        );
      })}

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
