// Racine du site : la langue se choisit ici, côté serveur, avant d'envoyer
// quoi que ce soit. Avant, index.html le faisait en JavaScript : le robot de
// Google, réglé en anglais, voyait la racine afficher la page anglaise, la
// prenait pour la même page que /en/ et n'indexait plus /en/. Une redirection
// n'est pas un doublon : /fr/ et /en/ sont indexées chacune de leur côté.
//
// La première langue du navigateur parmi celles du site (fr, en, de),
// l'anglais pour toutes les autres. Seule la racine passe par ici ; les autres
// adresses restent des fichiers statiques.

const LANGUES = ['fr', 'en', 'de'];

export function langueDe(acceptLanguage) {
  for (const partie of (acceptLanguage || '').split(',')) {
    const [code, ...params] = partie.trim().toLowerCase().split(';');
    if (params.some((p) => /^\s*q=0(\.0*)?\s*$/.test(p))) continue;
    const principale = code.split('-')[0];
    if (LANGUES.includes(principale)) return principale;
  }
  return 'en';
}

export async function onRequest(context) {
  const { request } = context;
  if (request.method !== 'GET' && request.method !== 'HEAD') return context.next();
  try {
    const url = new URL(request.url);
    const cible = `/${langueDe(request.headers.get('Accept-Language'))}/${url.search}`;
    return new Response(null, {
      status: 302,
      headers: {
        Location: cible,
        Vary: 'Accept-Language',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (e) {
    // En cas de souci, la page statique et son script prennent le relais.
    return context.next();
  }
}
