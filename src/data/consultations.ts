export interface PricingItem {
  name: string;
  duration?: string;
  price: string;
}

export const CONSULTATION_DATA = {
  title: 'Osobní konzultace',
  subtitle: 'Pokud dáváte přednost osobnímu setkání a cítíte, že některé věci je snazší říct tváří v tvář, jsem tu pro vás.',
  intro: 'Nabízím konzultace pro páry i jednotlivce. Pomohu vám hledat cestu k řešení vašich obtíží. Nemohu je vyřešit za vás, ale mohu vás na cestě k vašemu cíli provázet. Nejdůležitější část práce však zůstává na vás.',
  formatInfo: 'Konzultace probíhají osobně (v České republice v Praze/Kamenném Újezdě nebo v Norsku) i online přes šifrovaný videohovor. Máte-li zájem, napište mi prostřednictvím kontaktního formuláře níže.',
  topics: [
    'Řešení partnerských potíží ve všech oblastech intimity – 6 pilířů intimity',
    'Bolest při pohlavním styku a vaginizmus',
    'Nízká nebo vymizelá chuť na sex (libido)',
    'Pooperační stavy – císařský řez, nástřih hráze, jizvy',
    'Traumata, bolestivé vzpomínky a zranění z minulosti',
    'Otevírání témat intimity a sexuality bez studu a tabu',
    'Problémy s erekcí a předčasná ejakulace',
    'Komunikační bloky a odcizení v partnerství',
    'Sebeláska, znovupřijetí a zdravý vztah k vlastnímu tělu'
  ],
  pricing: [
    { name: '1x Bodywork / Somatická masáž', duration: '2–4 hodiny', price: '3 990 Kč' },
    { name: 'Balíček 5x (Bodywork sezení)', duration: '5x 2–4 hodiny', price: '18 000 Kč' },
    { name: 'Výuka a provázení', duration: '4–6 hodin', price: '6 500 Kč' },
    { name: 'Balíček 5x (Výuka)', duration: '5x 4–6 hodin', price: '30 000 Kč' },
    { name: 'Online konzultace', duration: '60–90 min', price: '2 300 Kč' },
    { name: 'Balíček 5x (Online konzultace)', duration: '5x 60–90 min', price: '10 500 Kč' }
  ],
  pricingNote: 'Zvýhodněné balíčky se hradí jednorázově a lze je využít pro jednotlivce i v páru. Všechna sezení probíhají v přísné diskrétnosti a bezpečí.'
};
