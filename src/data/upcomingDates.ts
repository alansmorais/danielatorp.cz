import { UpcomingDateItem } from '../types';

export const DEFAULT_UPCOMING_DATES: UpcomingDateItem[] = [
  { text: "21–22.11.2026 - Trauma Workshops Ané & Daniela (Oslo)", url: "workshops/trauma-workshops-ane-daniela.html", workshopId: "trauma-workshops-ane-daniela" },
  { text: "3.10.2026 - Matka a dcera", url: "workshops/matka-a-dcera.html" },
  { text: "4.10.2026 - Umění potěšit ženu", url: "workshops/umeni-potesit-zenu.html" },
  { text: "18.10.2026 - Umění potěšit muže", url: "workshops/umeni-potesit-muze.html" },
  { text: "11-13.12.2026 - Hraj si se mnou", url: "workshops/Hraj-si-se-mnou.html" },
  { text: "9.1.2027 - Umění potěšit muže", url: "workshops/umeni-potesit-muze.html" },
  { text: "10.1.2027 - Umění potěšit ženu", url: "workshops/umeni-potesit-zenu.html" },
  { text: "15-17.1.2027 - jen pro páry", url: "workshops/jen-pro-pary.html" },
  { text: "10.4.2027 - Matka a dcera", url: "workshops/matka-a-dcera.html" },
  { text: "11.4.2027 - Byla jsem těhotná", url: "workshops/byla-jsem-tehotna-ale.html" },
  { text: "23-25.4.2027 - Ženská Esence - Beltane", url: "workshops/zenska-esence-no.html" }
];

export async function fetchLiveUpcomingDates(lang: 'CZ' | 'NO' | 'EN' = 'CZ'): Promise<UpcomingDateItem[]> {
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwrA4qfZdmzOWaRdbIgtDqL0VO5NpURvNBU-5GdnmJ__3cBPbK4Hy-b5vkn1P0FJo0F/exec?api=json";
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(WEB_APP_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) return DEFAULT_UPCOMING_DATES;
    const data = await res.json();
    const langData = data[lang] || data["CZ"] || data["CS"] || data["NO"] || data["EN"];

    if (Array.isArray(langData) && langData.length > 0) {
      const items: UpcomingDateItem[] = [];
      for (const item of langData) {
        if (typeof item === 'string' && item.trim()) {
          items.push({ text: item.trim() });
        } else if (item && typeof item === 'object' && typeof item.text === 'string' && item.text.trim()) {
          items.push({ text: item.text.trim(), url: typeof item.url === 'string' ? item.url : undefined });
        }
      }
      if (items.length > 0) {
        return items;
      }
    }
  } catch (err) {
    // Graceful fallback to default dates if network is unavailable
  }
  return DEFAULT_UPCOMING_DATES;
}
