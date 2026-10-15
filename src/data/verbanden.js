// The bonds of the catalog: their course rules (the one input of
// bricks.js) and every claim the page makes about them, field by field.
// Each claim has a strength and its sources:
//   verified  a source opened on its opened date says it;
//   reported  a source says it, but this catalog did not find the words in
//             the copy it opened (an OCR text, a drawing read by another);
//   assumed   this catalog's own reading or derivation (source 'afleiding'
//             where nothing else carries it).
// A field no opened source gives is a gap, with the sources searched.
// Kept: a bond with an opened source that gives its rule. The candidate
// bonds and why each is in or out: CANDIDATES. Kettingverbanden is the
// thesaurus's group of Noords and Engels verband, so those two stand for it.

import { EXAMPLES } from './voorbeelden.js';

// The edition: the day this catalog's sources were last opened. Every
// source below was opened again on this day.
export const SESSION_DATE = '2026-10-15';

const CHT = 'https://data.cultureelerfgoed.nl/term/id/cht/';
const cht = (title, id, status = 'definitief') => ({ title: `Cultuurhistorische Thesaurus: ${title}${status === 'kandidaat' ? ' (kandidaatbegrip)' : ''}`, publisher: 'Rijksdienst voor het Cultureel Erfgoed', url: CHT + id, opened: SESSION_DATE, rce: true, status });
const K = 'kandidaat';
const aat = (title, id) => ({ title: `Art & Architecture Thesaurus: ${title}`, publisher: 'Getty Research Institute', url: `https://vocab.getty.edu/aat/${id}`, opened: SESSION_DATE, rce: false });
const doc = (title, publisher, url, rce = false, lang = null) => ({ title, publisher, url, opened: SESSION_DATE, rce, ...(lang ? { lang } : {}) });
const kb = (title, urn) => doc(title, 'Delpher, Koninklijke Bibliotheek', `https://resolver.kb.nl/resolve?urn=${urn}:ocr`);
const zeno = (title, path) => doc(title, 'zeno.org', `http://www.zeno.org/${path}`, false, 'de');

export const SOURCES = {
  'cht-metselverbanden': cht('metselverbanden', 'bfd5c192-f890-4bbf-b8aa-e2dc7410fa27'),
  'cht-halfsteens': cht('halfsteens verband', '8d48a27c-7a1d-40ba-8882-ef86308f3cf3'),
  'cht-klezoorverband': cht('klezoorverband', 'dfb94340-364b-433c-b1f8-8450c0d181a2'),
  'cht-staand': cht('staand verband', 'ccb8dfff-a534-4cfd-b7ec-bc9284fc654f'),
  'cht-kruis': cht('kruisverband', '6ac6ef04-4eb0-4b53-bb53-415b23d410a5'),
  'cht-vlaams': cht('Vlaams verband', '0aef58a9-cc99-40cd-b828-3e23cb4ae72a'),
  'cht-koppen': cht('koppenverband', '2e8dc442-b9c9-4c0e-bce9-ef41baa2a36c'),
  'cht-wild': cht('wild verband', 'e1789729-a80a-4379-aa6d-01158f6e67e3'),
  'cht-ketting': cht('kettingverbanden', '11e3fefd-12d5-4d95-98ba-a9daab30d409'),
  'cht-noords': cht('Noords verband', '87a6cfb4-5051-4906-a766-f9c8c39037c3'),
  'cht-engels': cht('Engels verband', 'ddc25cd3-b4e4-42df-b553-bd077670c879'),
  'cht-klezoor': cht('klezoren', 'b4414732-ba4d-4a5f-b42f-12d49332c211', K),
  'cht-drieklezoor': cht('drieklezoren', 'd0272820-bd41-4e3d-878a-64face0e0909', K),
  'cht-klisklezoor': cht('klisklezoren', '12fc649d-f11f-496b-9901-f039f832e09f', K),
  'cht-kop-baksteen': cht('koppen (baksteen)', 'b36e8bf0-871d-4db7-98c8-918a47eb1056', K),
  'cht-strek-baksteen': cht('strekken (baksteen)', 'da54a8d4-7ae3-48be-a170-75609d4726b2', K),
  'cht-lagen': cht('lagen', 'fb082808-4325-49b6-a068-ec7e4ed1a887'),
  'cht-koppenlagen': cht('koppenlagen', 'ebdcedb4-d7cc-418a-85f3-cf9626d1672b'),
  'cht-strekkenlagen': cht('strekkenlagen', '51da96e2-71a3-414a-88a2-bdf00370f970'),
  'cht-patijts': cht('patijts', 'c47af0cd-04de-4454-b282-88242d97d79c', K),
  'cht-stootvoeg': cht('stootvoegen', 'a3c2345f-de0a-448a-baee-3d3eab83b92d'),
  'cht-lintvoeg': cht('lintvoegen', '738271c0-fec4-472e-b1c9-93af7944a612'),
  'cht-voegen': cht('voegen (voegwerk)', 'da86ef1a-eb29-4439-9fb7-b50246bca801'),
  'cht-voegwerk': cht('voegwerk', '05b0856e-82b3-41ab-8185-468be1fc8568'),
  'cht-platvol': cht('platvol voegen', '7fd70532-5d2f-4b5c-b287-94835da39f74'),
  'cht-verdiept': cht('verdiept voegen', '8915fa7c-9dd9-44ba-8a65-0ce349fdc241'),
  'cht-knipvoeg': cht('knipvoegen', '5e1e7716-1eb9-4834-93f1-832c980c55ac'),
  'cht-spouwmuur': cht('spouwmuren', '035120de-d3a4-407f-9125-0f3ea2860c2f', K),
  'cht-buitenblad': cht('buitenbladen', 'f31ac8e0-23ee-4e27-baba-35bde36ca8cc', K),
  'cht-staande-tand': cht('staande tand', '790caac2-b823-4f13-b6ea-8262c9535ca6'),
  'cht-vallende-tand': cht('vallende tand', '4fa3204f-6404-4d68-9756-efc116a15e21'),
  'cht-hoekverband': cht('hoekverband', 'e7848540-104c-4876-907e-0a22f4b726bd'),
  'cht-speklagen': cht('speklagen', '5030d921-18e5-49f7-83f8-8d3fd763e0a1', K),
  'cht-blokverband': cht('blokverband', 'fbffd19d-229a-4c29-a68a-3cfbd5b402a0'),
  'cht-siermetselwerk': cht('siermetselwerk', 'd9206cdd-5dbc-493a-9b4c-ba40bcff3bb9', K),
  'cht-silezische-steen': cht('Silezische steen', 'd2bf79e7-f179-46e2-b821-ba0478917938', K),
  'cht-waalformaat': cht('waalformaat', '9679fc59-c68d-41c5-8ee0-356896f1a363', K),
  'cht-waaldikformaat': cht('Waaldikformaat', '8a3f5ce2-14d3-4add-834a-75d108dded99', K),
  'cht-vechtformaat': cht('vechtformaat', '9ffe5366-9af3-443a-894e-6e22eb085e78', K),
  'cht-ijselformaat': cht('IJselformaat', '149cbfbe-757f-4bab-a5f4-58d142b1e027', K),
  'cht-rijnvorm': cht('Rijnvorm', '88a1e410-9c7f-49e2-8ca2-f20f14450778', K),
  'cht-kloostermop': cht('kloostermop', '7c556686-e7d7-4681-81f2-b2a2b73af01a', K),
  'aat-english-bond': aat('English bond (staand verband)', '300175506'),
  'aat-flemish-bond': aat('Flemish bond (Vlaams verband)', '300175511'),
  'aat-running-bond': aat('running bond (halfsteensverband)', '300175515'),
  'aat-monk-bonds': aat('monk bonds', '300417346'),
  'aat-stack-bond': aat('stack bond (ook block bond)', '300175520'),
  'sikb-leidraad': doc('KNA-Leidraad Stenen Gebouwstructuren, versie 1.0 (2025), hoofdstuk 3.3, pdf-pagina\'s 153-162; de tekeningen afb. 3.3.2 tot 3.3.7 komen uit Inleiding in de bouwhistorie (tekeningen R. van Genabeek)', 'SIKB', 'https://sikb.nl/doc/archeo/SIKB%20KNA-Leidraad%20Stenen%20Gebouwstructuren%20def.%20versie%201.0.pdf'),
  'tham-hoofdstuk14': doc('A.H.L.G. Bone, Algemene Bouwkunde voor makelaars, deel A, hoofdstuk 14: Gebakken en niet-gebakken stenen en steenconstructies, paragraaf 14.7 tot 14.9 (een druk van voor de vijfde; in deze catalogus "het lesboek")', 'ThiemeMeulenhoff', 'https://cdn.tham.thiememeulenhoff.nl/document-output/tham.prod.4be870ce-6a82-441f-8822-32192c5cd1d8/originaldocument'),
  'abm-5e-druk': doc('A.H.L.G. Bone, Algemene Bouwkunde voor makelaars, deel A, vijfde druk (2021), ISBN 978 90 06 43280 0: inkijkexemplaar met colofon en inhoud. Hoofdstuk 14 draagt daar dezelfde titel; de nummering van de paragrafen wijkt af van het geopende hoofdstuk, dat dus uit een eerdere druk komt.', 'ThiemeMeulenhoff, via Boekhuis', 'https://download.boekhuis.nl/9789006432800_fragm-docb.pdf'),
  'knb-infoblad-15': doc('Infoblad 15: Materiaalhoeveelheden voor baksteenmetselwerk (2008)', 'KNB', 'https://www.knb-keramiek.nl/media/35742/knb_infoblad_15_materiaalhoeveelheden_voor_baksteenmetselwerk.pdf'),
  'knb-infoblad-28': doc('Infoblad 28: Voegwerk in baksteenmetselwerk', 'KNB', 'https://www.knb-keramiek.nl/media/36089/knb_infoblad_28_voegwerk_in_baksteenmetselwerk.pdf'),
  'knb-info-32': doc('Info 32: Wildverband metselwerk (2018)', 'KNB', 'https://www.knb-keramiek.nl/media/266345/knb-info-32-wildverband-metselwerk-2018-05.pdf'),
  'kooij-1996': doc('B. Kooij, De spouwmuur in oude Nederlandse buitenhuizen, Jaarboek Monumentenzorg 1996', 'Rijksdienst voor de Monumentenzorg (voorganger van de RCE), via DBNL', 'https://www.dbnl.org/tekst/_jaa030199601_01/_jaa030199601_01_0013.php', true),
  'kamphuis-1996': doc('J. Kamphuis, Vreemd gaan in kruisverband?, Jaarboek Monumentenzorg 1996', 'Rijksdienst voor de Monumentenzorg (voorganger van de RCE), via DBNL', 'https://www.dbnl.org/tekst/_jaa030199601_01/_jaa030199601_01_0012.php', true),
  'dbnl-monumenten-utrecht': doc('Monumenten in Nederland: Utrecht (1996), verklarende woordenlijst', 'Rijksdienst voor de Monumentenzorg, via DBNL', 'https://www.dbnl.org/tekst/sten009monu01_01/sten009monu01_01_0089.php', true),
  'dbnl-biekorf-1934': doc('Biekorf, jaargang 40 (1934), blz. 112', 'DBNL', 'https://www.dbnl.org/tekst/_bie001193401_01/_bie001193401_01_0043.php'),
  'jb-1929-06': kb('De jonge bouwer, juni 1929, "Metselen", les VI', 'MMIISG15:004455006:00006'),
  'jb-1929-07': kb('De jonge bouwer, juli 1929, "Metselen", les VII', 'MMIISG15:004455007:00008'),
  'jb-1929-09': kb('De jonge bouwer, september 1929, "Bouwkunst" (vervolg), blz. 4', 'MMIISG15:004455009:00004'),
  'jb-1929-09-ix': kb('De jonge bouwer, september 1929, "Metselen", les IX: Kettingverband, blz. 5 en 6', 'MMIISG15:004455009:00006'),
  'jb-1930-03': kb('De jonge bouwer, maart 1930, "Metselen", les XV', 'MMIISG15:004456003:00008'),
  'oudheidkundig-1924': kb('Oudheidkundig jaarboek 1924, over de Bovenkerk te Kampen', 'MMUBVU08:001244001:00028'),
  'bouwbedrijf-1925': kb('Het bouwbedrijf, december 1925, blz. 449', 'MMHNI01:000400013:00031'),
  'ksz-1939': kb('Kerk, school en ziekenhuis, 23 oktober 1939', 'MMKDC07:006848008:00009'),
  'meyers-1909': zeno('Meyers Großes Konversations-Lexikon, Bd. 18 (1909), Steinverband', 'Meyers-1905/A/Steinverband'),
  'lueger-kreuzverband': zeno('Lueger, Lexikon der gesamten Technik (1904-1920), Kreuzverband', 'Lueger-1904/A/Kreuzverband'),
  'lueger-blockverband': zeno('Lueger, Lexikon der gesamten Technik (1904-1920), Blockverband', 'Lueger-1904/A/Blockverband'),
  'lueger-gotischer-verband': zeno('Lueger, Lexikon der gesamten Technik (1904-1920), Gotischer Verband', 'Lueger-1904/A/Gotischer+Verband'),
  'lueger-hollaendischer-verband': zeno('Lueger, Lexikon der gesamten Technik (1904-1920), Holländischer Verband', 'Lueger-1904/A/Holl%C3%A4ndischer+Verband'),
  'lueger-binderverband': zeno('Lueger, Lexikon der gesamten Technik (1904-1920), Binderverband', 'Lueger-1904/A/Binderverband'),
  'lueger-laeuferverband': zeno('Lueger, Lexikon der gesamten Technik (1904-1920), Läuferverband', 'Lueger-1904/A/L%C3%A4uferverband'),
  'rivington-1904': doc('Rivington\'s Notes on Building Construction, Part I (1904)', 'Internet Archive', 'https://archive.org/details/RivingtonsPart1NewRevisedEd1904', false, 'en'),
  'lueger-englischer-verband': zeno('Lueger, Lexikon der gesamten Technik (1904-1920), Englischer Verband', 'Lueger-1904/A/Englischer+Verband'),
  'wiki-en-brickwork': doc('Wikipedia (Engels): Brickwork, met de handboeken van Lloyd en Brunskill als bron', 'Wikipedia', 'https://en.wikipedia.org/wiki/Brickwork'),
  'wiki-de-mauerwerksverband': doc('Wikipedia (Duits): Mauerwerksverband', 'Wikipedia', 'https://de.wikipedia.org/wiki/Mauerwerksverband'),
  'wiki-fr-brique': doc('Wikipedia (Frans): Brique (matériau), deel Appareils', 'Wikipedia', 'https://fr.wikipedia.org/wiki/Brique_(mat%C3%A9riau)'),
  'rce-register': doc('Rijksmonumentenregister: de pagina van elk voorbeeldgebouw', 'Rijksdienst voor het Cultureel Erfgoed', 'https://monumentenregister.cultureelerfgoed.nl/', true),
  'rce-linkeddata': doc('Linked data van de RCE, dataset rce/cho: omschrijving, bouwjaren en punt van elk voorbeeld', 'Rijksdienst voor het Cultureel Erfgoed', 'https://api.linkeddata.cultureelerfgoed.nl/datasets/rce/cho/services/cho/sparql', true),
  afleiding: { title: 'Afgeleid in deze catalogus, niet in een bron gevonden', publisher: 'deze catalogus', kind: 'afleiding' },
};

const c = (text, strength, ...sources) => ({ text, strength, sources });
const named = (names, strength, ...sources) => ({ text: names.join(', '), names, strength, sources });
const gap = (...searched) => ({ gap: true, searched });

// The bricks the model can lay: a strek is two koppen and a head joint,
// so a format whose sizes do not keep that is shown as near as it goes.
const knb = (size) => `De KNB rekent ${size} mm.`;
export const FORMATS = {
  waalformaat: {
    name: 'Waalformaat', length: 210, width: 100, height: 50, joint: 10, bed: 10,
    claim: c(`${knb('210 x 100 x 50')} Volgens de RCE-thesaurus in gebruik sinds de 17e eeuw, en eind 19e eeuw het belangrijkste formaat in Nederland geworden.`, 'verified', 'knb-infoblad-15', 'cht-waalformaat'),
  },
  kloostermop: {
    name: 'Kloostermop', length: 300, width: 140, height: 85, joint: 20, bed: 20,
    claim: c('Volgens de RCE-thesaurus ca. 28 tot 34 cm lang, 14 tot 16 cm breed en 7 tot 10 cm dik, vanaf het midden van de 13e eeuw; ook kloostersteen of monniksteen. De KNB rekent 280 x 105 x 80 mm. Het model neemt 300 x 140 x 85 mm met voegen van 20 mm, binnen de maten van de thesaurus, zodat een strek twee koppen en een voeg is. Primitief voegwerk heeft zeer dikke voegen, tot 5 cm, zegt de thesaurus.', 'verified', 'cht-kloostermop', 'knb-infoblad-15', 'cht-voegwerk'),
  },
  vechtformaat: {
    name: 'Vechtformaat', length: 210, width: 100, height: 40, joint: 10, bed: 10,
    claim: c(`${knb('210 x 100 x 40')} De RCE-thesaurus: ca. 22 x 10 x 4 cm, in de 18e eeuw veel bij Utrechtse stenen.`, 'verified', 'knb-infoblad-15', 'cht-vechtformaat'),
  },
  dikformaat: {
    name: 'Waaldikformaat', length: 210, width: 100, height: 65, joint: 10, bed: 10,
    claim: c(`${knb('210 x 100 x 65')} De RCE-thesaurus: verwant aan het waalformaat, maar iets hoger.`, 'verified', 'knb-infoblad-15', 'cht-waaldikformaat'),
  },
  rijnformaat: {
    name: 'Rijnformaat', length: 181, width: 87, height: 41, joint: 7, bed: 10,
    claim: c(`${knb('181 x 87 x 41')} De RCE-thesaurus: ca. 18 x 8,7 x 4,1 cm. Het model legt de stootvoegen 7 mm, zodat een strek twee koppen en een voeg is.`, 'verified', 'knb-infoblad-15', 'cht-rijnvorm'),
  },
  ijsselformaat: {
    name: 'IJsselformaat', length: 160, width: 75, height: 41, joint: 10, bed: 10,
    claim: c(`${knb('160 x 78 x 41')} De RCE-thesaurus: ca. 16,5 x 8 x 4 cm, bij de IJsselsteentjes. Het model neemt 75 mm breed, zodat een strek twee koppen en een voeg is.`, 'verified', 'knb-infoblad-15', 'cht-ijselformaat'),
  },
  lilliputformaat: {
    name: 'Lilliputformaat', length: 160, width: 75, height: 35, joint: 10, bed: 10,
    claim: c(knb('160 x 75 x 35'), 'verified', 'knb-infoblad-15'),
  },
};

// The joints the 3D view can show: how far the mortar lies behind the
// faces, in mm. Shapes it cannot draw (a knipvoeg standing proud, a holle
// or bolle voeg) are named in the glossary.
export const JOINTS = {
  platvol: {
    name: 'Platvol', recess: 0.5,
    claim: c('De voegen zo volgestreken dat hun voorkant gelijk ligt met die van de stenen. Fors werk werd platvol of verdiept gevoegd, zegt de RCE-thesaurus.', 'verified', 'cht-platvol', 'cht-voegwerk'),
  },
  'licht-verdiept': {
    name: 'Licht verdiept', recess: 4, default: true,
    claim: c('De voeg ligt enkele millimeters achter de stenen; volgens de KNB kan voegwerk zonder bezwaar 5 mm verdiept. Het model legt de voeg 4 mm terug.', 'verified', 'knb-infoblad-28', 'cht-verdiept'),
  },
  verdiept: {
    name: 'Verdiept', recess: 10,
    claim: c('Verdiepte voegen liggen terug ten opzichte van de stenen; de KNB noemt 15 mm het meeste bij een steen van 100 mm breed. Het model legt de voeg 10 mm terug.', 'verified', 'cht-verdiept', 'knb-infoblad-28'),
  },
};

// Courses of the rules: per course which leg runs through the corner, and
// per leg its pieces from the corner (head, unit repeated, tail; back: a
// back row laid apart; cornerBack: the leg fills the corner square itself).
const kopLaag = { head: ['klezoor'], unit: ['kop'], tail: ['klezoor', 'kop'] };
const vlaamseLaag = { unit: ['kop', 'strek'], tail: ['kop'] };
const kruisLaag = { head: ['strek', 'kop'], unit: ['strek'], tail: ['kop', 'strek'] };
const vlaamsP = { head: ['strek'], unit: ['kop', 'strek'] };
const vlaamsQ = { head: ['klezoor'], unit: ['strek', 'kop'], tail: ['strek', 'klezoor', 'kop'] };
// Noords verband as a chain: under and over each kop a joint.
const noordsP = { head: ['kop'], unit: ['strek', 'strek', 'kop'], tail: ['strek', 'strek'] };
const noordsQ = { head: ['klezoor', 'kop'], unit: ['strek', 'strek', 'kop'], tail: ['klezoor', 'kop'] };
// The lesboek's start: one course with a kop, the other with a drieklezoor
// and a strek; then each kop lies on the middle of a strek below.
const noordsLesP = { head: ['kop'], unit: ['strek', 'strek', 'kop'] };
const noordsLesQ = { head: ['drieklezoor'], unit: ['kop', 'strek', 'strek'], tail: ['kop', 'drieklezoor'] };
const engelsP = { unit: ['strek', 'strek', 'strek', 'kop'], tail: ['strek', 'strek', 'strek'] };
const engelsQ = { head: ['drieklezoor'], unit: ['kop', 'strek', 'strek', 'strek'], tail: ['kop', 'drieklezoor', 'kop'] };
// Two drieklezoren on the corner, front and back, in every other course.
const koppenDrie = { head: ['drieklezoor'], unit: ['kop'], tail: ['drieklezoor'], cornerBack: true };
const kl = [
  { unit: ['strek'] },
  { head: ['drieklezoor'], unit: ['strek'], tail: ['drieklezoor'] },
  { head: ['strek', 'halve'], unit: ['strek'], tail: ['halve'] },
  { head: ['drieklezoor', 'halve'], unit: ['strek'], tail: ['halve', 'drieklezoor'] },
];
// The younger corner: no klezoor in the koppenlaag; the strekkenlaag
// begins with two drieklezoren side by side, front and back, so its back
// row runs past the inner corner and ties the two walls in every other
// course; the shifted strekkenlaag puts a kop after them.
const koppen = { unit: ['kop'] };
const strekDrie = { head: ['drieklezoor'], unit: ['strek'], tail: ['drieklezoor'], cornerBack: true };
const strekDrieVerschoven = { head: ['drieklezoor', 'kop'], unit: ['strek'], tail: ['kop', 'drieklezoor'], cornerBack: true };
// A halfsteens leaf that shows a bond with koppen: each kop a half brick,
// a klezoor beside the corner head.
const halveLaag = { head: ['klezoor'], unit: ['halve'], tail: ['klezoor', 'halve'] };
const strekLaagVerschoven = { head: ['strek', 'halve'], unit: ['strek'], tail: ['halve', 'strek'] };
// A rule laid as a halfsteens leaf: each kop a half brick.
const halfsteens = (rule) => ({ ...JSON.parse(JSON.stringify(rule).replace(/"kop"/g, '"halve"')), thickness: 'halfsteens' });
const SIER = 'Als sierverband ook in halfsteense muren, zegt een lesboek. Daar kan een kop alleen een halve steen zijn; zo legt het model hem (afgeleid).';

const FR = gap('aat-english-bond', 'aat-flemish-bond', 'aat-running-bond', 'aat-monk-bonds', 'wiki-fr-brique');

const BOND_LIST = [
  {
    id: 'kruisverband',
    ownVariant: 'Hoek met klezoor',
    name: 'Kruisverband',
    pattern: 'strekken- en koppenlagen; de strekkenlagen verspringen',
    periodShort: 'vanaf de 15e eeuw',
    format: FORMATS.waalformaat,
    rule: {
      thickness: 'steens',
      courses: [
        { pass: 'A', A: { unit: ['strek'] }, B: kopLaag },
        { pass: 'B', A: kopLaag, B: { unit: ['strek'] } },
        { pass: 'A', A: kruisLaag, B: kopLaag },
        { pass: 'B', A: kopLaag, B: kruisLaag },
      ],
      repeat: { courses: 4, modules: 4 },
    },
    fields: {
      names: gap('cht-kruis', 'cht-metselverbanden', 'sikb-leidraad', 'tham-hoofdstuk14'),
      en: { text: 'English cross bond: "Stretchers breaking joint. The second brick of alternate stretching courses is a header" (Lloyd, in de Engelse Wikipedia). Dutch bond heet daar de vorm met drieklezoren op de hoek en zonder klisklezoren, de hoek met drieklezoor van deze catalogus. Let op: English bond is staand verband (Getty AAT); een West-Vlaams tijdschrift (1934) schrijft nog "Met het English bond stemt ons Kruisverband en Staande verband overeen".', names: ['English cross bond', 'Dutch bond'], strength: 'verified', sources: ['wiki-en-brickwork', 'aat-english-bond', 'dbnl-biekorf-1934'] },
      de: named(['Kreuzverband'], 'verified', 'meyers-1909', 'lueger-kreuzverband'),
      fr: FR,
      rule: c('Afwisselend strekken- en koppenlagen; de strekken in opvolgende strekkenlagen verspringen een halve steen of kop. De koppenlagen liggen recht boven elkaar.', 'verified', 'cht-kruis', 'sikb-leidraad', 'tham-hoofdstuk14'),
      repeat: c('Na vier lagen; langs de muur na een strek.', 'assumed', 'cht-kruis', 'afleiding'),
      thickness: c('Steens of dikker; het model is steens. Een anderhalfsteense muur in kruisverband tekent de SIKB-leidraad (afb. 3.3.14); dit model tekent die niet.', 'verified', 'tham-hoofdstuk14', 'sikb-leidraad'),
      corner: c('Naast de kop op de hoek ligt in de koppenlaag een klezoor, de oudere oplossing; de verschoven strekkenlaag begint met een strek en een kop, zoals de SIKB-leidraad het tekent (afb. 3.3.9). Vanaf het eind van de 17e eeuw kwam daarvoor een drieklezoor in de strekkenlaag.', 'verified', 'sikb-leidraad', 'cht-klezoor'),
      end: c('Een vrij eind zoals de SIKB-leidraad het tekent (afb. 3.3.7): in de koppenlaag een kop en een klezoor, in de ene strekkenlaag een strek en een kop, in de andere alleen strekken.', 'verified', 'sikb-leidraad'),
      recognise: c('Om de laag alleen strekken of alleen koppen. Kijk naar twee strekkenlagen boven elkaar, met een koppenlaag ertussen: hun stootvoegen liggen een halve steen verschoven.', 'verified', 'cht-kruis'),
      lookalikes: c('Staand verband heeft dezelfde strekken- en koppenlagen, maar daar liggen de strekken recht boven elkaar.', 'verified', 'cht-kruis', 'cht-staand'),
      period: c('De bronnen verschillen in hoe vroeg. De SIKB-leidraad: vanaf het eind van de 15e eeuw, in Leiden al in 1463, op gezag van een mondelinge mededeling. Kamphuis: de overgang van staand- naar kruisverband omstreeks het midden van de 16e eeuw.', 'verified', 'sikb-leidraad', 'kamphuis-1996'),
      region: c('In Holland lijkt het over het algemeen iets eerder voor te komen dan in de rest van Nederland, schrijft de SIKB-leidraad op gezag van een mondelinge mededeling.', 'verified', 'sikb-leidraad'),
      use: c('Gevelmetselwerk; de voorbeelden in het register zijn gebouwd tussen 1570 en 1935.', 'verified', 'rce-register', 'rce-linkeddata'),
      variants: c('Twee hoeken: de oudere met een klezoor naast de kop op de hoek in de koppenlaag, de jongere met een drieklezoor in de strekkenlaag. De klezoor verdween ca. 1670 tot 1720 uit het metselverband, eerst bij de gevelhoeken; de drieklezoor kwam eerst in Holland, later in Oost-Nederland (18e eeuw) en Zuid-Nederland (19e eeuw). Ook halfsteense muren worden in het register "in kruisverband" genoemd.', 'verified', 'sikb-leidraad', 'kamphuis-1996', 'rce-register'),
    },
    lookalikes: [
      { id: 'staand-verband', difference: c('In staand verband liggen de strekken van de strekkenlagen recht boven elkaar; in kruisverband verspringen ze om de andere strekkenlaag een halve steen.', 'verified', 'cht-kruis', 'cht-staand') },
    ],
    variants: [
      {
        id: 'drieklezoor', name: 'Hoek met drieklezoor', kind: 'hoek',
        claim: c('De jongere hoek, vanaf het eind van de 17e eeuw: de koppenlaag loopt zonder klezoor tot de hoek, elke strekkenlaag begint met een drieklezoor, de verschoven strekkenlaag met een drieklezoor en een kop (SIKB-leidraad, afb. 3.3.10; een lesboek: "de ene strekkenlaag met een drieklezoor en de andere strekkenlaag met een drieklezoor en een kop"). In het register: Beetsterzwaag, Kerkepad West 2 (1733, rijksmonument 528458). Achter het gezicht legt het model op de hoek een tweede drieklezoor, zodat de binnenhoek in verband ligt; de bronnen tekenen alleen het gezicht.', 'verified', 'sikb-leidraad', 'tham-hoofdstuk14', 'rce-register'),
        rule: {
          thickness: 'steens',
          courses: [
            { pass: 'A', A: strekDrie, B: koppen }, { pass: 'B', A: koppen, B: strekDrie },
            { pass: 'A', A: strekDrieVerschoven, B: koppen }, { pass: 'B', A: koppen, B: strekDrieVerschoven },
          ],
          repeat: { courses: 4, modules: 4 },
        },
        fields: {
          corner: c('De koppenlaag loopt zonder klezoor tot de hoek; elke strekkenlaag begint met een drieklezoor, de verschoven strekkenlaag met een drieklezoor en een kop (SIKB-leidraad, afb. 3.3.10).', 'verified', 'sikb-leidraad', 'tham-hoofdstuk14'),
          end: c('Aan een vrij eind loopt de koppenlaag door tot het eind; de strekkenlaag eindigt met een drieklezoor, de verschoven strekkenlaag met een kop en een drieklezoor. Zo legt het model het, als spiegelbeeld van de hoek.', 'assumed', 'sikb-leidraad', 'afleiding'),
        },
      },
      {
        id: 'halfsteens', name: 'Halfsteens, met halve stenen als koppen', kind: 'dikte',
        claim: c('Het register noemt ook halfsteense muren in kruisverband, zoals een klampmuur (rijksmonument 523155). In een halfsteense muur kan een kop alleen een halve steen zijn; het model legt die, met een klezoor naast de kop op de hoek.', 'assumed', 'rce-register', 'afleiding'),
        rule: {
          thickness: 'halfsteens',
          courses: [
            { pass: 'A', A: { unit: ['strek'] }, B: halveLaag }, { pass: 'B', A: halveLaag, B: { unit: ['strek'] } },
            { pass: 'A', A: strekLaagVerschoven, B: halveLaag }, { pass: 'B', A: halveLaag, B: strekLaagVerschoven },
          ],
          repeat: { courses: 4, modules: 4 },
        },
        fields: {
          thickness: c('Halfsteens: een kop dik. Elke kop is een halve steen.', 'assumed', 'rce-register', 'afleiding'),
          corner: c('Naast de kop op de hoek een klezoor, als in de steense muur; in een halfsteense muur is de klezoor een kwart steen, zo diep als de muur. Afgeleid.', 'assumed', 'afleiding'),
        },
      },
    ],
    map: { provinces: [] },
  },
  {
    id: 'staand-verband',
    ownVariant: 'Hoek met klezoor',
    name: 'Staand verband',
    pattern: 'strekken- en koppenlagen; de strekken recht boven elkaar',
    periodShort: 'vanaf begin 14e eeuw',
    format: FORMATS.waalformaat,
    rule: {
      thickness: 'steens',
      courses: [
        { pass: 'A', A: { unit: ['strek'] }, B: kopLaag },
        { pass: 'B', A: kopLaag, B: { unit: ['strek'] } },
      ],
      repeat: { courses: 2, modules: 4 },
    },
    fields: {
      names: gap('cht-staand', 'cht-metselverbanden', 'sikb-leidraad', 'tham-hoofdstuk14'),
      en: { text: 'English bond: "alternating courses of headers and stretchers" (Getty AAT; Smeaton in de Engelse Wikipedia).', names: ['English bond'], strength: 'verified', sources: ['aat-english-bond', 'wiki-en-brickwork'] },
      de: { text: 'Blockverband (Meyers, Lueger). Lueger noemt hele lagen strekken en koppen om en om ook Englischer Verband. Let op: Englischer Verband is dus staand verband, niet Engels verband.', names: ['Blockverband', 'Englischer Verband'], strength: 'verified', sources: ['lueger-blockverband', 'meyers-1909', 'lueger-englischer-verband'] },
      fr: { text: "Appareil à la française: \"un lit de boutisses et un lit de panneresses\" om en om (Franse Wikipedia).", names: ['appareil à la française'], strength: 'verified', sources: ['wiki-fr-brique'] },
      rule: c('Afwisselend strekken- en koppenlagen; de strekken liggen recht boven elkaar.', 'verified', 'cht-staand', 'sikb-leidraad'),
      repeat: c('Na twee lagen; langs de muur na een strek.', 'assumed', 'cht-staand', 'afleiding'),
      thickness: c('Steens of dikker; ook een halfsteense muur in staand verband komt voor (SIKB-leidraad, afb. 3.3.13). Het model is steens.', 'verified', 'tham-hoofdstuk14', 'sikb-leidraad'),
      corner: c('Naast de kop op de hoek ligt in de koppenlaag een klezoor, de oudere oplossing; later begint elke strekkenlaag met een drieklezoor.', 'verified', 'sikb-leidraad', 'cht-klezoor', 'tham-hoofdstuk14'),
      end: c('Een vrij eind zoals de SIKB-leidraad het tekent (afb. 3.3.6): in de koppenlaag een kop en een klezoor, in de strekkenlaag een hele strek.', 'verified', 'sikb-leidraad'),
      recognise: c('Om de laag alleen strekken of alleen koppen, en de stootvoegen van de strekkenlagen staan recht boven elkaar.', 'verified', 'cht-staand'),
      lookalikes: c('Kruisverband heeft dezelfde lagen, maar daar verspringen de strekkenlagen een halve steen.', 'verified', 'cht-kruis', 'cht-staand'),
      period: c('Vanaf het begin van de 14e eeuw (SIKB-leidraad). Omstreeks het midden van de 16e eeuw ging men volgens Kamphuis over op kruisverband, maar staand verband bleef in gebruik: de voorbeelden in het register zijn van 1692 tot 1934, de meeste van rond 1900.', 'verified', 'sikb-leidraad', 'kamphuis-1996', 'rce-linkeddata'),
      region: gap('sikb-leidraad', 'cht-staand'),
      use: c('Gevels en torens; de voorbeelden in het register zijn gebouwd tussen 1692 en 1934.', 'verified', 'rce-register', 'rce-linkeddata'),
      variants: c('De oudere hoek met een klezoor naast de kop op de hoek, de jongere met een drieklezoor aan het begin van elke strekkenlaag; en de halfsteense muur in staand verband. Een vakblad (1929) noemt ook kettinglagen: "legt men tegen den achter-drieklezoor een kop"; dat tekent het model niet.', 'verified', 'sikb-leidraad', 'tham-hoofdstuk14', 'jb-1929-07'),
    },
    lookalikes: [
      { id: 'kruisverband', difference: c('In kruisverband verspringen de strekken om de andere strekkenlaag een halve steen; in staand verband liggen ze recht boven elkaar.', 'verified', 'cht-kruis', 'cht-staand') },
      { id: 'hollands-verband', difference: c('Hollands verband wisselt de koppenlagen af met lagen waarin strek en kop afwisselen, niet met strekkenlagen.', 'verified', 'tham-hoofdstuk14', 'cht-staand') },
    ],
    variants: [
      {
        id: 'drieklezoor', name: 'Hoek met drieklezoor', kind: 'hoek',
        claim: c('De jongere hoek: elke strekkenlaag begint met een drieklezoor, de koppenlaag zonder klezoor. In het register: "staand verband met gebruik van drie klezoren voor de hoeken" (Houten, rijksmonument 454995). Achter het gezicht legt het model op de hoek een tweede drieklezoor, zodat de binnenhoek in verband ligt; de bronnen tekenen alleen het gezicht.', 'verified', 'sikb-leidraad', 'tham-hoofdstuk14', 'rce-register'),
        rule: {
          thickness: 'steens',
          courses: [{ pass: 'A', A: strekDrie, B: koppen }, { pass: 'B', A: koppen, B: strekDrie }],
          repeat: { courses: 2, modules: 4 },
        },
        fields: {
          corner: c('Elke strekkenlaag begint met een drieklezoor; de koppenlaag loopt zonder klezoor tot de hoek.', 'verified', 'sikb-leidraad', 'tham-hoofdstuk14'),
          end: c('Aan een vrij eind eindigt elke strekkenlaag met een drieklezoor; de koppenlaag loopt door tot het eind. Zo legt het model het, als spiegelbeeld van de hoek.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
        },
      },
      {
        id: 'halfsteens', name: 'Halfsteens, met halve stenen als koppen', kind: 'dikte',
        claim: c('Een halfsteense muur in staand verband tekent de SIKB-leidraad (afb. 3.3.13); het register noemt "halfsteensmuren ... in staand verband" (Zaandam, rijksmonument 530316). In een halfsteense muur kan een kop alleen een halve steen zijn; het model legt die, met een klezoor naast de kop op de hoek.', 'verified', 'sikb-leidraad', 'rce-register'),
        rule: {
          thickness: 'halfsteens',
          courses: [{ pass: 'A', A: { unit: ['strek'] }, B: halveLaag }, { pass: 'B', A: halveLaag, B: { unit: ['strek'] } }],
          repeat: { courses: 2, modules: 4 },
        },
        fields: {
          thickness: c('Halfsteens: een kop dik, zoals de SIKB-leidraad tekent (afb. 3.3.13). Elke kop is een halve steen.', 'verified', 'sikb-leidraad'),
        },
      },
    ],
    map: { provinces: [] },
  },
  {
    id: 'hollands-verband',
    name: 'Hollands verband',
    pattern: 'koppenlagen om en om met lagen van strek en kop; alleen in een lesboek',
    periodShort: null,
    format: FORMATS.waalformaat,
    rule: {
      thickness: 'steens',
      courses: [
        { pass: 'A', A: koppenDrie, B: vlaamseLaag },
        { pass: 'B', A: vlaamseLaag, B: koppenDrie },
      ],
      repeat: { courses: 2, modules: 6 },
    },
    fields: {
      names: { text: 'Hollands tuinmurenverband (lesboek). De RCE-thesaurus en de SIKB-leidraad kennen geen Hollands verband, en drie bronnen geven drie regels: Meyers (1909) een koppenlaag om en om met een laag strek en kop, Lueger meer koppenlagen na elkaar, het lesboek een vrije combinatie; het model volgt het lesboek. Let op: een vakblad (1925) noemt oud-Hollandsch als naam die sommigen aan Noords verband gaven, en het Engelse Dutch bond is kruisverband.', names: ['Hollands tuinmurenverband'], strength: 'verified', sources: ['tham-hoofdstuk14', 'cht-metselverbanden', 'sikb-leidraad', 'meyers-1909', 'lueger-hollaendischer-verband', 'bouwbedrijf-1925', 'wiki-en-brickwork'] },
      en: gap('aat-english-bond', 'rivington-1904'),
      de: { text: 'Holländischer Verband. Meyers (1909): een koppenlaag om en om met een laag waarin strek en kop afwisselen, de regel van het lesboek; Lueger: meer koppenlagen na elkaar, afgewisseld met zulke lagen.', names: ['Holländischer Verband'], strength: 'verified', sources: ['meyers-1909', 'lueger-hollaendischer-verband'] },
      fr: FR,
      rule: c('Koppenlagen afgewisseld met lagen in Vlaams verband; in plaats van Vlaams kan ook Engels of Noors verband.', 'verified', 'tham-hoofdstuk14'),
      repeat: c('Na twee lagen; langs de muur na een strek en een kop.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
      thickness: c('Alleen voor steense muren, zegt een lesboek; het model is steens.', 'verified', 'tham-hoofdstuk14'),
      corner: c('Op de hoek in elke laag drieklezoren, zoals deze catalogus de tekening van een lesboek leest (figuur 14.77); de tekst noemt de hoek niet.', 'assumed', 'tham-hoofdstuk14'),
      end: c('Aan een vrij eind legt het model in de koppenlaag twee drieklezoren naast elkaar, zoals bij koppenverband; afgeleid.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
      recognise: c('Om de laag alleen koppen; de lagen ertussen wisselen strek en kop af.', 'verified', 'tham-hoofdstuk14'),
      lookalikes: c('Staand en kruisverband wisselen koppenlagen af met lagen van alleen strekken; Vlaams verband heeft in elke laag strek en kop. Met zo veel combinaties zou je bijna van wild verband spreken, maar Hollands verband blijft regelmatig.', 'verified', 'tham-hoofdstuk14', 'cht-staand', 'cht-vlaams'),
      period: c('Geen Nederlandse bron geeft een periode. Meyers (1909) rekent zijn Holländische Verband, een koppenlaag om en om met een laag strek en kop, tot "drei mittelalterlichen, jetzt weniger gebräuchlichen Verbänden"; dat zegt niets over het tuinmurenverband van het lesboek.', 'verified', 'meyers-1909', 'tham-hoofdstuk14'),
      region: gap('tham-hoofdstuk14', 'sikb-leidraad'),
      use: c('Nogal eens voor tuinmuren die aan een zijde in schoonwerk worden uitgevoerd; daarom heet het ook Hollands tuinmurenverband.', 'verified', 'tham-hoofdstuk14'),
      variants: c('In plaats van de Vlaamse laag kan ook een laag in Engels of Noors verband komen; daarom zijn er veel combinaties.', 'verified', 'tham-hoofdstuk14'),
    },
    lookalikes: [
      { id: 'staand-verband', difference: c('Staand verband wisselt koppenlagen af met lagen van alleen strekken; Hollands verband met lagen waarin strek en kop afwisselen.', 'verified', 'tham-hoofdstuk14', 'cht-staand') },
      { id: 'vlaams-verband', difference: c('Vlaams verband heeft in elke laag strek en kop; Hollands verband heeft om de laag alleen koppen.', 'verified', 'tham-hoofdstuk14', 'cht-vlaams') },
    ],
    variants: [],
    examplesNote: c('Geen beschrijving in het Rijksmonumentenregister noemt Hollands verband of schrijft zijn regel uit; gezocht op de naam in drie spellingen en op koppenlagen met Vlaamse lagen.', 'reported', 'rce-linkeddata', 'rce-register'),
    map: { provinces: [] },
  },
  {
    id: 'vlaams-verband',
    ownVariant: 'Steens',
    name: 'Vlaams verband',
    pattern: 'in elke laag om en om een strek en een kop',
    periodShort: '13e en begin 14e eeuw, weer in de 20e',
    format: FORMATS.kloostermop,
    rule: {
      thickness: 'steens',
      courses: [
        { pass: 'B', A: vlaamsQ, B: vlaamsP },
        { pass: 'A', A: vlaamsP, B: vlaamsQ },
      ],
      repeat: { courses: 2, modules: 6 },
    },
    fields: {
      names: { text: 'Brabants verband, Gotisch verband (RCE-thesaurus); Poolsch verband (een oudheidkundig jaarboek, 1924, en een vakblad, 1929); in West-Vlaanderen (België) Spaansch, Kokkenhane- of Tijkenhaneverband', names: ['Brabants verband', 'Gotisch verband', 'Poolsch verband', 'Pools verband', 'Spaansch verband', 'Kokkenhaneverband', 'Tijkenhaneverband'], strength: 'verified', sources: ['cht-vlaams', 'oudheidkundig-1924', 'jb-1929-09', 'dbnl-biekorf-1934'] },
      en: named(['Flemish bond'], 'verified', 'aat-flemish-bond'),
      de: { text: 'Gotischer of Polnischer Verband (Lueger, Meyers); Flämischer Verband (Duitse Wikipedia).', names: ['Gotischer Verband', 'Polnischer Verband', 'Flämischer Verband'], strength: 'verified', sources: ['lueger-gotischer-verband', 'meyers-1909', 'wiki-de-mauerwerksverband'] },
      fr: named(['appareillage flamand'], 'verified', 'aat-flemish-bond'),
      rule: c('In iedere laag afwisselend een strek en een kop; de koppen liggen juist boven de strekken van de laag eronder.', 'verified', 'cht-vlaams'),
      repeat: c('Na twee lagen; langs de muur na een strek en een kop.', 'assumed', 'cht-vlaams', 'afleiding'),
      thickness: c('Een verband voor steense muren, zegt een lesboek, dat als sierverband ook in halfsteense muren wordt gemetseld; het model is steens.', 'verified', 'tham-hoofdstuk14'),
      corner: c('Een hoek met klezoren, zoals de SIKB-leidraad die tekent voor Vlaams verband en kruisverband; een lesboek laat om de andere laag met een drieklezoor beginnen.', 'verified', 'sikb-leidraad', 'tham-hoofdstuk14'),
      end: c('Een vrij eind zoals de SIKB-leidraad het tekent (afb. 3.3.2): de ene laag kop, klezoor, strek; de andere strek, kop, strek.', 'verified', 'sikb-leidraad'),
      recognise: c('In elke laag om en om een strek en een kop; de koppen liggen juist boven de strekken van de laag eronder.', 'verified', 'cht-vlaams'),
      lookalikes: c('Noords verband heeft twee strekken tussen de koppen, Engels verband drie; Hollands verband heeft om de laag alleen koppen.', 'verified', 'cht-vlaams', 'cht-noords', 'cht-engels', 'tham-hoofdstuk14'),
      period: c('Gebruikelijk in de 13e eeuw en het eerste kwart van de 14e eeuw, later incidenteel; volgens de SIKB-leidraad tot het begin van de 14e eeuw. In de 20e eeuw weer gebruikt: de voorbeelden in het register zijn op een torenrest uit de 14e eeuw na gevels uit 1920 tot 1941.', 'verified', 'cht-vlaams', 'sikb-leidraad', 'rce-register'),
      region: c('De bronnen verschillen: de RCE-thesaurus noemt Vlaanderen en het westen van Nederland, de SIKB-leidraad vooral het zuiden. Ook elders: de toren van de Bovenkerk te Kampen is "in z.g. gothisch verband" (1924), en een vakblad (1929) noemt Vlaamsch verband al in romaans baksteenwerk. De bronnen noemen een streek en spreken elkaar tegen; de kaart arceert dus geen provincie.', 'verified', 'cht-vlaams', 'sikb-leidraad', 'oudheidkundig-1924', 'jb-1929-09'),
      use: c('Bakstenen muren van die tijd; in het register een ronde torenrest uit de 14e eeuw en gevels uit 1920 tot 1941. Let op: bij ronde muren, zoals torens, werd ook later om en om kop en strek gemetseld, omdat dat een ronding makkelijker maakt (SIKB-leidraad). Nu voor een muur die aan beide zijden schoon metselwerk moet zijn.', 'verified', 'rce-register', 'rce-linkeddata', 'sikb-leidraad', 'tham-hoofdstuk14'),
      variants: c(SIER, 'verified', 'tham-hoofdstuk14'),
    },
    lookalikes: [
      { id: 'noords-verband', difference: c('Noords verband heeft twee strekken tussen twee koppen, Vlaams verband een.', 'verified', 'cht-vlaams', 'cht-noords') },
      { id: 'hollands-verband', difference: c('Hollands verband heeft om de laag alleen koppen; Vlaams verband heeft in elke laag strek en kop.', 'verified', 'tham-hoofdstuk14', 'cht-vlaams') },
    ],
    variants: [
      { id: 'halfsteens', name: 'Halfsteens, met halve stenen als koppen', kind: 'dikte', claim: c(SIER, 'verified', 'tham-hoofdstuk14'), fields: { thickness: c('Halfsteens: een kop dik; elke kop is een halve steen.', 'assumed', 'tham-hoofdstuk14', 'afleiding') }, rule: halfsteens({ courses: [{ pass: 'B', A: vlaamsQ, B: vlaamsP }, { pass: 'A', A: vlaamsP, B: vlaamsQ }], repeat: { courses: 2, modules: 6 } }) },
    ],
    map: { provinces: [] },
  },
  {
    id: 'noords-verband',
    name: 'Noords verband',
    pattern: 'in elke laag twee strekken en een kop',
    periodShort: null,
    format: FORMATS.waalformaat,
    rule: {
      thickness: 'steens',
      courses: [
        { pass: 'A', A: noordsP, B: noordsQ },
        { pass: 'B', A: noordsQ, B: noordsP },
      ],
      repeat: { courses: 2, modules: 10 },
      minA: 50,
    },
    fields: {
      names: { text: 'Noors verband, Noors of kettingverband (lesboek); Noorsch verband (vakblad, 1925); Wendisch verband (vakblad, 1929); noordsverband en kettingverband heten in de RCE-thesaurus ook alle kettingverbanden samen. Over de naam bestond verwarring: "wat bij den een als Noorsch verband bekend staat, [wordt] door den ander oud-Hollandsch of Engelsch verband genoemd" (vakblad, 1925); die namen gelden hier niet als namen van Noords verband.', names: ['Noors verband', 'Noorsch verband', 'kettingverband', 'Wendisch verband', 'noordsverband'], strength: 'verified', sources: ['tham-hoofdstuk14', 'bouwbedrijf-1925', 'jb-1929-09', 'cht-ketting'] },
      en: { text: 'Monk bond: "Two stretchers are followed by one header in every course" (Stratton, in de Engelse Wikipedia); de Getty AAT beschrijft monk bonds zo, zonder Nederlandse naam.', names: ['monk bond'], strength: 'verified', sources: ['wiki-en-brickwork', 'aat-monk-bonds'] },
      de: { text: 'Märkischer of Wendischer Verband (Meyers), ook Kirchenverband (Duitse Wikipedia). Het Schlesischer Verband is volgens de Duitse Wikipedia Gotischer Verband met minstens twee strekken tussen de koppen: Noords of Engels verband.', names: ['Märkischer Verband', 'Wendischer Verband', 'Kirchenverband', 'Schlesischer Verband'], strength: 'verified', sources: ['meyers-1909', 'wiki-de-mauerwerksverband'] },
      fr: { text: "Appareil des moines: \"alternance d'une boutisse et de deux panneresses\" in elke laag (Franse Wikipedia).", names: ["appareil des moines"], strength: 'verified', sources: ['wiki-fr-brique'] },
      rule: c('In iedere laag afwisselend twee strekken en een kop. "De hoofdzaak is echter dat onder en boven elke kop een voeg is geplaatst waaraan dan ook de naam kettingverband zal ontleend zijn", schrijft een vakblad in 1929; zo tekent ook de SIKB-leidraad het (afb. 3.3.3).', 'verified', 'cht-noords', 'jb-1929-09-ix', 'sikb-leidraad'),
      repeat: c('Na twee lagen; langs de muur na twee strekken en een kop.', 'assumed', 'afleiding'),
      thickness: c('Koppen reiken door de muur, dus steens; het model is steens.', 'assumed', 'afleiding'),
      corner: c('Het model legt de ene laag met een kop op de hoek, de andere met een klezoor naast de kop van de muur haaks erop, zoals de SIKB-leidraad een vrij eind tekent (afb. 3.3.3). Een lesboek zegt dat Noors verband "begint met twee koppen op de hoek" en begint de ene laag met een kop, de andere met een drieklezoor en een strek; een vakblad (1930) legt op de hoek twee drieklezoren. De hoek van het model is afgeleid.', 'assumed', 'sikb-leidraad', 'tham-hoofdstuk14', 'jb-1930-03', 'afleiding'),
      end: c('Aan het vrije eind eindigt de ene laag met twee strekken, de andere met een klezoor en een kop; zo begint de SIKB-leidraad haar tekening van een eind (afb. 3.3.3: kop, klezoor, kop). Afgeleid.', 'assumed', 'sikb-leidraad', 'afleiding'),
      recognise: c('In elke laag telkens twee strekken en dan een kop; boven en onder elke kop staat een stootvoeg.', 'verified', 'cht-noords', 'jb-1929-09-ix'),
      lookalikes: c('Vlaams verband heeft een strek tussen de koppen, Engels verband drie.', 'verified', 'cht-vlaams', 'cht-engels', 'cht-noords'),
      period: c('Een vakblad uit 1929 noemt het, als Wendisch verband, het oudste verband in romaans baksteenwerk, vóór het Vlaams verband in de loop van de 13e eeuw; van beide zegt het dat ze "nooit systematisch over een geheel bouwwerk doorgevoerd" werden. Een ander vakblad (1925) rekent Noorsch verband tot de "buitenlandsche of weinig toegepaste steenverbanden". De voorbeelden in het register zijn gebouwd tussen 1897 en 1936; geen ervan is middeleeuws.', 'verified', 'jb-1929-09', 'bouwbedrijf-1925', 'rce-linkeddata'),
      region: c('De SIKB-leidraad noemt Noords en Engels verband "in onder meer noordelijk Nederland": ook elders komt het voor. De bronnen noemen geen provincie; de kaart arceert er dus geen.', 'verified', 'sikb-leidraad'),
      use: c('In het register onder meer kerken, een watertoren en een columbarium.', 'verified', 'rce-register'),
      variants: c('De bronnen leggen de koppen op twee manieren: boven en onder elke kop een voeg (SIKB-leidraad, vakblad 1929), of, met de begin van een lesboek, elke kop midden op een strek van de laag eronder. Als sierverband ook in halfsteense muren, zegt het lesboek; het model legt het alleen steens.', 'verified', 'sikb-leidraad', 'jb-1929-09-ix', 'tham-hoofdstuk14'),
    },
    lookalikes: [
      { id: 'engels-verband', difference: c('Engels verband heeft drie strekken tussen twee koppen, Noords verband twee.', 'verified', 'cht-engels', 'cht-noords') },
      { id: 'vlaams-verband', difference: c('Vlaams verband heeft een strek tussen twee koppen, Noords verband twee.', 'verified', 'cht-vlaams', 'cht-noords') },
    ],
    variants: [
      {
        id: 'lesboek', name: 'Koppen midden op de strekken', kind: 'patroon',
        claim: c('Zoals een lesboek het begint: de eerste laag met een kop, de andere met een drieklezoor en een strek. Daardoor komt elke kop midden op een strek van de laag eronder; dat volgt uit dat begin.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
        rule: { thickness: 'steens', courses: [{ pass: 'A', A: noordsLesP, B: noordsLesQ }, { pass: 'B', A: noordsLesQ, B: noordsLesP }], repeat: { courses: 2, modules: 10 } },
        fields: {
          corner: c('Het lesboek zegt dat Noors verband "begint met twee koppen op de hoek", en dat de ene laag begint met een kop, de andere met een drieklezoor en een strek; het tekent die hoek niet steen voor steen. Aan de hoek van het model ligt in de ene laag een kop; in de andere eerst de zijkant van de kop van de muur haaks erop, dan een drieklezoor en een kop, zodat elke kop midden op een strek blijft. Afgeleid.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
          end: c('Het lesboek: "De eerste laag begint met een kop, de andere laag met een drieklezoor en een strek." Het model eindigt die andere laag met een kop en een drieklezoor: de hoek aan het andere eind legt de lengte van de muur vast, en dan sluit de regel van het lesboek niet in beide lagen. Zie de tekening van het vrije eind.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
        },
      },
    ],
    map: { provinces: [] },
  },
  {
    id: 'engels-verband',
    ownVariant: 'Steens',
    name: 'Engels verband',
    pattern: 'in elke laag drie strekken en een kop',
    periodShort: null,
    format: FORMATS.waalformaat,
    rule: {
      thickness: 'steens',
      courses: [
        { pass: 'A', A: engelsP, B: engelsQ },
        { pass: 'B', A: engelsQ, B: engelsP },
      ],
      repeat: { courses: 2, modules: 14 },
      minA: 50,
    },
    fields: {
      names: { text: 'Een van de kettingverbanden (RCE-thesaurus). Let op: een vakblad (1925) zegt dat sommigen Noords verband "Engelsch verband" noemden, en het Duitse Englischer Verband is staand verband (Lueger).', names: ['kettingverband'], strength: 'verified', sources: ['cht-ketting', 'bouwbedrijf-1925', 'lueger-englischer-verband'] },
      en: { text: 'Sussex bond of Flemish garden wall bond: "Three stretchers, then one header in every course" (Lloyd, in de Engelse Wikipedia); Flemish garden bond: een kop op drie of vier strekken (Rivington, 1904). Let op: English bond is staand verband.', names: ['Sussex bond', 'Flemish garden wall bond', 'Flemish garden bond'], strength: 'verified', sources: ['wiki-en-brickwork', 'rivington-1904', 'aat-english-bond'] },
      de: { text: 'Schlesischer Verband: Gotischer Verband met minstens twee strekken tussen de koppen (Duitse Wikipedia); dat dekt ook Noords verband. Let op: Englischer Verband is staand verband.', names: ['Schlesischer Verband'], strength: 'verified', sources: ['wiki-de-mauerwerksverband', 'lueger-englischer-verband'] },
      fr: FR,
      rule: c('In iedere laag afwisselend drie strekken en een kop; de koppen van de volgende laag liggen midden boven de middelste strek.', 'verified', 'cht-engels', 'tham-hoofdstuk14'),
      repeat: c('Na twee lagen; langs de muur na drie strekken en een kop.', 'assumed', 'afleiding'),
      thickness: c('Koppen reiken door de muur, dus steens; het model is steens.', 'assumed', 'afleiding'),
      corner: c('Een lesboek begint een steense muur met drie koppen op de hoek; de hoek van het model, een strek met een drieklezoor erboven, is afgeleid.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
      end: c('Het model eindigt de lagen om en om met drie strekken en met een kop, een drieklezoor en een kop; afgeleid.', 'assumed', 'afleiding'),
      recognise: c('In elke laag telkens drie strekken en dan een kop. Let op: "English bond" is de Engelse naam van staand verband, niet van dit verband.', 'verified', 'cht-engels', 'aat-english-bond'),
      lookalikes: c('Noords verband heeft twee strekken tussen de koppen, Vlaams verband een.', 'verified', 'cht-noords', 'cht-vlaams', 'cht-engels'),
      period: c('Geen jaartal in de geopende bronnen; de voorbeelden in het register zijn gebouwd tussen 1930 en 1940.', 'verified', 'sikb-leidraad', 'rce-linkeddata'),
      region: c('De SIKB-leidraad noemt Noords en Engels verband "in onder meer noordelijk Nederland". Een lesboek zegt dat Engels verband in Engeland wordt toegepast en sterk lijkt op het Noorse of kettingverband dat in Nederland wordt toegepast. De bronnen noemen geen provincie; de kaart arceert er dus geen.', 'verified', 'sikb-leidraad', 'tham-hoofdstuk14'),
      use: gap('rce-linkeddata', 'tham-hoofdstuk14', 'sikb-leidraad'),
      variants: c(SIER, 'verified', 'tham-hoofdstuk14'),
    },
    lookalikes: [
      { id: 'noords-verband', difference: c('Noords verband heeft twee strekken tussen twee koppen, Engels verband drie.', 'verified', 'cht-engels', 'cht-noords') },
      { id: 'staand-verband', difference: c('De Engelse naam English bond hoort bij staand verband, met lagen van alleen strekken en alleen koppen; Engels verband heeft in elke laag strekken en een kop.', 'verified', 'aat-english-bond', 'cht-engels') },
    ],
    variants: [
      { id: 'halfsteens', name: 'Halfsteens, met halve stenen als koppen', kind: 'dikte', claim: c(SIER, 'verified', 'tham-hoofdstuk14'), fields: { thickness: c('Halfsteens: een kop dik; elke kop is een halve steen.', 'assumed', 'tham-hoofdstuk14', 'afleiding') }, rule: halfsteens({ courses: [{ pass: 'A', A: engelsP, B: engelsQ }, { pass: 'B', A: engelsQ, B: engelsP }], repeat: { courses: 2, modules: 14 }, minA: 50 }) },
    ],
    examplesNote: c('Het register noemt Engels verband maar bij twee gebouwen: het ene op naam, zonder te zeggen welk verband bedoeld is, het andere met zijn regel uitgeschreven. Ruim tweehonderd beschrijvingen zeggen alleen "kettingverband", zonder Noords en Engels verband te onderscheiden.', 'reported', 'rce-linkeddata', 'rce-register'),
    map: { provinces: [] },
  },
  {
    id: 'koppenverband',
    name: 'Koppenverband',
    pattern: 'alleen koppen',
    periodShort: null,
    format: FORMATS.waalformaat,
    rule: {
      thickness: 'steens',
      courses: [
        { pass: 'A', A: koppenDrie, B: koppen },
        { pass: 'B', A: koppen, B: koppenDrie },
      ],
      repeat: { courses: 2, modules: 2 },
    },
    fields: {
      names: named(['patijts verband', 'patijtsverband', 'koppen- of patijtsverband'], 'verified', 'cht-koppen', 'tham-hoofdstuk14', 'dbnl-monumenten-utrecht'),
      en: { text: 'Header bond (Engelse Wikipedia); heading bond: "Heading Bond consists entirely of headers", "chiefly useful in working round sharp curves" (Rivington, 1904).', names: ['header bond', 'heading bond'], strength: 'verified', sources: ['wiki-en-brickwork', 'rivington-1904'] },
      de: { text: 'Binderverband: alle stenen overbinden een kwart steen, dezelfde regel', names: ['Binderverband'], strength: 'verified', sources: ['lueger-binderverband'] },
      fr: { text: "Appareil en boutisses: alleen koppen (Franse Wikipedia, bij een foto).", names: ["appareil en boutisses"], strength: 'verified', sources: ['wiki-fr-brique'] },
      rule: c('Uitsluitend koppenlagen, dus zonder strekken; opvolgende lagen verspringen een klezoor.', 'verified', 'cht-koppen', 'tham-hoofdstuk14'),
      repeat: c('Na twee lagen; langs de muur na een kop.', 'assumed', 'afleiding'),
      thickness: c('Alleen voor steense muren, zegt een lesboek; het model is steens.', 'verified', 'tham-hoofdstuk14'),
      corner: c('"In elke laag op den hoek twee drieklezoors, om en om", schrijft een vakblad in 1930: twee drieklezoren naast elkaar, om de laag in de ene of de andere muur. Zo legt het model het.', 'verified', 'jb-1930-03'),
      end: c('Aan een muureinde begint de ene laag met een kop, de andere met een drieklezoor; zo verspringen de lagen een klezoor.', 'verified', 'tham-hoofdstuk14'),
      recognise: c('Alleen koppen in het gezicht; van laag tot laag verspringen ze een klezoor, een kwart steen.', 'verified', 'cht-koppen'),
      lookalikes: c('Lijkt veel op halfsteensverband, maar de stenen liggen niet achter elkaar maar naast elkaar: koppen, die een klezoor verspringen in plaats van een halve steen.', 'verified', 'tham-hoofdstuk14'),
      period: c('De RCE-thesaurus noemt geen periode; de voorbeelden in het register zijn gebouwd tussen 1884 en 1929.', 'verified', 'cht-koppen', 'rce-linkeddata'),
      region: gap('cht-koppen', 'sikb-leidraad'),
      use: c('Ronde torens, ronde hoeken en putten, fabrieksschoorstenen.', 'verified', 'cht-koppen'),
      variants: gap('cht-koppen', 'tham-hoofdstuk14', 'jb-1930-03'),
    },
    lookalikes: [
      { id: 'halfsteensverband', difference: c('Halfsteensverband toont alleen strekken, die een halve steen verspringen; koppenverband alleen koppen, die een klezoor verspringen.', 'verified', 'tham-hoofdstuk14', 'cht-halfsteens', 'cht-koppen') },
    ],
    variants: [],
    map: { provinces: [] },
  },
  {
    id: 'halfsteensverband',
    name: 'Halfsteensverband',
    pattern: 'alleen strekken, een halve steen verspringend',
    periodShort: null,
    format: FORMATS.waalformaat,
    rule: {
      thickness: 'halfsteens',
      courses: [
        { pass: 'A', A: { unit: ['strek'] }, B: { unit: ['strek'], tail: ['halve'] } },
        { pass: 'B', A: { unit: ['strek'], tail: ['halve'] }, B: { unit: ['strek'] } },
      ],
      repeat: { courses: 2, modules: 4 },
    },
    fields: {
      names: named(['halfsteens verband', 'halfsteens'], 'verified', 'cht-halfsteens'),
      en: named(['running bond', 'stretcher bond'], 'verified', 'aat-running-bond', 'wiki-en-brickwork'),
      de: named(['Läuferverband', 'Schornsteinverband'], 'verified', 'lueger-laeuferverband', 'meyers-1909'),
      fr: { text: "Appareil en panneresses: alleen strekken, \"n'a qu'une brique d'épaisseur, il convient aux cloisons\" (Franse Wikipedia).", names: ["appareil en panneresses"], strength: 'verified', sources: ['wiki-fr-brique'] },
      rule: c('Alleen strekken in het gezicht; de stenen verspringen een halve steen ten opzichte van de laag eronder.', 'verified', 'cht-halfsteens', 'tham-hoofdstuk14'),
      repeat: c('Om de andere laag liggen de stootvoegen precies boven elkaar, zegt een lesboek; langs de muur herhaalt het na een strek.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
      thickness: c('Halfsteens: een kop dik.', 'verified', 'cht-halfsteens', 'sikb-leidraad'),
      corner: c('Eenvoudige hoekoplossingen, zegt een lesboek; op de hoek loopt om de laag de strek van de ene of van de andere muur door, zo legt het model het.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
      end: c('Aan een vrij eind om de andere laag een halve steen, zodat het eind te lood kan worden opgetrokken; zo schrijft een vakblad in 1929.', 'verified', 'jb-1929-06'),
      recognise: c('Alleen strekken; elke stootvoeg staat midden op de strek eronder.', 'verified', 'cht-halfsteens'),
      lookalikes: c('In klezoorverband verspringen de strekken een klezoor, een kwart steen, in plaats van een halve steen.', 'verified', 'cht-klezoorverband', 'cht-halfsteens', 'tham-hoofdstuk14'),
      period: c('De bronnen geven geen periode voor het verband zelf. Halfsteense muren zijn er vooral voor binnenwanden, een voorzetmuur of een klamp, zegt de SIKB-leidraad; het grootste deel van de buitenbladen van spouwmuren is halfsteens, zegt het lesboek, en de spouwmuur kreeg pas vanaf het begin van de 20e eeuw brede erkenning (Kooij). De voorbeelden in het register zijn gebouwd tussen 1872 en 1942.', 'verified', 'sikb-leidraad', 'tham-hoofdstuk14', 'kooij-1996', 'rce-linkeddata'),
      region: gap('cht-halfsteens', 'sikb-leidraad'),
      use: c('Vroeger vooral binnenwanden, voorzetmuren en klampen; nu vooral buitenspouwbladen.', 'verified', 'sikb-leidraad', 'tham-hoofdstuk14'),
      variants: gap('cht-halfsteens', 'tham-hoofdstuk14'),
    },
    lookalikes: [
      { id: 'klezoorverband', difference: c('In klezoorverband verspringen de strekken een klezoor, een kwart steen; in halfsteensverband een halve steen.', 'verified', 'cht-klezoorverband', 'cht-halfsteens', 'tham-hoofdstuk14') },
      { id: 'koppenverband', difference: c('Koppenverband toont alleen koppen, die een klezoor verspringen; halfsteensverband alleen strekken, die een halve steen verspringen.', 'verified', 'tham-hoofdstuk14', 'cht-halfsteens') },
    ],
    variants: [],
    map: { provinces: [] },
  },
  {
    id: 'klezoorverband',
    ownVariant: 'Lopend, rechtsvallend',
    name: 'Klezoorverband',
    pattern: 'alleen strekken, een klezoor verspringend',
    periodShort: null,
    format: FORMATS.waalformaat,
    rule: {
      thickness: 'halfsteens',
      courses: [
        { pass: 'A', A: kl[0], B: kl[1] },
        { pass: 'B', A: kl[1], B: kl[0] },
        { pass: 'A', A: kl[2], B: kl[3] },
        { pass: 'B', A: kl[3], B: kl[2] },
      ],
      repeat: { courses: 4, modules: 4 },
    },
    fields: {
      names: named(['staand klezoorverband', 'lopend klezoorverband', 'wisselend klezoorverband'], 'verified', 'tham-hoofdstuk14'),
      en: { text: 'Raking stretcher bond: zo noemt de Engelse Wikipedia elk strekkenverband waarin de lagen anders verspringen dan een halve steen; klezoorverband is er een vorm van.', names: ['raking stretcher bond'], strength: 'verified', sources: ['wiki-en-brickwork'] },
      de: { text: 'Schleppender Läuferverband: lagen strekken die een kwart steen verspringen (Duitse Wikipedia).', names: ['Schleppender Läuferverband'], strength: 'verified', sources: ['wiki-de-mauerwerksverband'] },
      fr: FR,
      rule: c('Een halfsteense muur waarin de stootvoegen tussen de strekken per laag een klezoor verspringen.', 'verified', 'cht-klezoorverband'),
      repeat: c('Het model toont lopend klezoorverband, dat steeds dezelfde kant op verspringt; daardoor herhaalt het na vier lagen, en langs de muur na een strek. Afgeleid.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
      thickness: c('Halfsteens.', 'verified', 'cht-klezoorverband'),
      corner: c('Geen geopende bron tekent een hoek in klezoorverband. Het model laat de muren om de laag door de hoek lopen en vult aan met een drieklezoor en een halve steen, zoals het lesboek een muur beëindigt, en zo dat beide gevels dezelfde kant op vallen. Afgeleid.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
      end: c('Aan het einde van een muur wordt niet met een klezoor gestopt: een laag eindigt met een drieklezoor, een andere met een halve steen.', 'verified', 'tham-hoofdstuk14'),
      recognise: c('Alleen strekken; de stootvoegen verspringen per laag een klezoor, een kwart steen, zodat ze schuine lijnen vormen.', 'verified', 'cht-klezoorverband'),
      lookalikes: c('In halfsteensverband verspringen de strekken een halve steen.', 'verified', 'cht-halfsteens', 'cht-klezoorverband', 'tham-hoofdstuk14'),
      period: c('De geopende bronnen noemen geen periode; de voorbeelden in het register zijn gebouwd tussen 1909 en 1946.', 'verified', 'cht-klezoorverband', 'rce-linkeddata'),
      region: gap('cht-klezoorverband', 'sikb-leidraad'),
      use: gap('cht-klezoorverband', 'tham-hoofdstuk14'),
      variants: c('Staand klezoorverband, lopend klezoorverband rechtsvallend en linksvallend, en wisselend klezoorverband, een combinatie van die twee die een levendig verband geeft (lesboek, figuur 14.65 tot 14.68). Welke richting rechts- en welke linksvallend heet, leest deze catalogus uit de tekeningen.', 'verified', 'tham-hoofdstuk14'),
    },
    lookalikes: [
      { id: 'halfsteensverband', difference: c('In halfsteensverband verspringen de strekken een halve steen; in klezoorverband een klezoor, een kwart steen.', 'verified', 'cht-halfsteens', 'cht-klezoorverband', 'cht-klezoor', 'tham-hoofdstuk14') },
    ],
    variants: [
      { id: 'linksvallend', name: 'Lopend, linksvallend', kind: 'patroon', fields: { repeat: c('Na vier lagen; langs de muur na een strek. Afgeleid.', 'assumed', 'afleiding') }, claim: c('Lopend klezoorverband linksvallend (lesboek, figuur 14.67): de stootvoegen schuiven laag voor laag een klezoor naar de hoek toe.', 'verified', 'tham-hoofdstuk14'), rule: { thickness: 'halfsteens', courses: [{ pass: 'A', A: kl[0], B: kl[3] }, { pass: 'B', A: kl[3], B: kl[0] }, { pass: 'A', A: kl[2], B: kl[1] }, { pass: 'B', A: kl[1], B: kl[2] }], repeat: { courses: 4, modules: 4 } } },
      { id: 'staand', name: 'Staand', kind: 'patroon', fields: { repeat: c('Na twee lagen; langs de muur na een strek. Afgeleid.', 'assumed', 'afleiding') }, claim: c('Staand klezoorverband (lesboek, figuur 14.65): de stootvoegen springen een klezoor heen en weer, zodat ze om de andere laag recht boven elkaar staan.', 'verified', 'tham-hoofdstuk14'), rule: { thickness: 'halfsteens', courses: [{ pass: 'A', A: kl[0], B: kl[0] }, { pass: 'B', A: kl[1], B: kl[1] }], repeat: { courses: 2, modules: 4 } } },
      { id: 'wisselend', name: 'Wisselend', kind: 'patroon', fields: { repeat: c('Na vier lagen; langs de muur na een strek. Afgeleid.', 'assumed', 'afleiding') }, claim: c('Wisselend klezoorverband (lesboek, figuur 14.68): rechts- en linksvallend door elkaar, wat een levendig verband geeft. Het model wisselt na twee lagen van richting.', 'verified', 'tham-hoofdstuk14'), rule: { thickness: 'halfsteens', courses: [{ pass: 'A', A: kl[0], B: kl[1] }, { pass: 'B', A: kl[1], B: kl[0] }, { pass: 'A', A: kl[2], B: kl[3] }, { pass: 'B', A: kl[1], B: kl[0] }], repeat: { courses: 4, modules: 4 } } },
    ],
    map: { provinces: [] },
  },
  {
    id: 'wild-verband',
    name: 'Wild verband',
    pattern: 'strekken en koppen zonder vaste regel',
    periodShort: 'muren uit het zicht, later zichtwerk',
    format: FORMATS.waalformaat,
    rule: { thickness: 'steens', wild: { seed: 7, maxStrekken: 5, maxKoppen: 3, maxStair: 6, maxShared: 0.7 }, repeat: null },
    fields: {
      names: named(['wildverband', 'vrij verband', 'vrijverband'], 'verified', 'knb-info-32', 'tham-hoofdstuk14'),
      en: gap('rivington-1904', 'aat-running-bond'),
      de: { text: 'Wilder Verband (Duitse Wikipedia).', names: ['Wilder Verband'], strength: 'verified', sources: ['wiki-de-mauerwerksverband'] },
      fr: FR,
      rule: c('Geen herkenbaar verband, mede door sloopmateriaal of gebroken stenen; alleen staan de stootvoegen niet boven elkaar. Het verband is oorspronkelijk bedacht om stenen met grote maatafwijkingen te kunnen verwerken, zegt de KNB (2018). Voor nieuw werk citeert de KNB een richtlijn die het naar verwachting zo zal omschrijven: strekken, drieklezoren en koppen, met een overlap van minstens een klezoor; niet meer dan zes sprongen van een klezoor boven of schuin boven elkaar, en het mag op geen regelmatig verband lijken.', 'verified', 'cht-wild', 'knb-info-32', 'tham-hoofdstuk14'),
      repeat: c('Geen herhaling. Het model trekt de lagen uit een vaste reeks toevalsgetallen en blijft binnen de grenzen van de bronnen (het lesboek: hoogstens vijf strekken of drie koppen naast elkaar; de KNB: niet meer dan zes sprongen), en voegt eigen grenzen toe: geen twee drieklezoren naast elkaar, geen trap van meer dan zes stootvoegen een klezoor uit elkaar, geen laag die voor zeven tiende of meer de stootvoegen heeft van de laag twee lager, en aan het vrije eind om en om een kop en een drieklezoor. Afgeleid.', 'assumed', 'cht-wild', 'knb-info-32', 'tham-hoofdstuk14', 'afleiding'),
      thickness: c('Het model is steens; een lesboek noemt wild verband bij de halfsteense muren.', 'verified', 'tham-hoofdstuk14'),
      corner: c('Hoeken en muurbeëindigingen beginnen met een strek, drieklezoor of kop; het model begint elke hoek met een strek.', 'verified', 'knb-info-32'),
      end: c('Muurbeëindigingen beginnen met een strek, drieklezoor of kop, zegt de KNB. Het model eindigt de lagen om en om met een kop en een drieklezoor, zoals de Duitse Wikipedia het eind beschrijft, zodat geen voeg door het eind loopt.', 'verified', 'knb-info-32', 'wiki-de-mauerwerksverband'),
      recognise: c('Strekken, koppen en drieklezoren zonder herkenbare regel; alleen staan de stootvoegen niet boven elkaar.', 'verified', 'cht-wild', 'knb-info-32'),
      lookalikes: c('Een stuk dat op Vlaams verband lijkt, meer dan vijf strekken of drie koppen naast elkaar, of stootvoegen boven elkaar: dat noemt een lesboek fouten in wildverband.', 'verified', 'tham-hoofdstuk14'),
      period: c('Vroeger bij muren uit het zicht, zoals funderingen en bepleisterde muren, of bij hergebruik van oude stenen; de voorbeelden in het register zijn gebouwd van de 18e eeuw tot 1956. Ook de oudste muren zijn vaak onregelmatig: "Bij de oudste muren zitten in dezelfde laag zowel koppen als strekken" (SIKB-leidraad), en een vakblad (1929) noemt de metselwijze van het romaanse werk "onregelmatig verband".', 'verified', 'sikb-leidraad', 'rce-linkeddata', 'jb-1929-09'),
      region: gap('cht-wild', 'knb-info-32', 'sikb-leidraad'),
      use: c('Funderingen, bepleisterde muren en muren van hergebruikte stenen; in de 20e eeuw ook zichtwerk, zoals in de voorbeelden.', 'verified', 'sikb-leidraad', 'rce-register'),
      variants: gap('knb-info-32', 'cht-wild', 'tham-hoofdstuk14'),
    },
    lookalikes: [
      { id: 'vlaams-verband', difference: c('Een stuk wild verband dat op Vlaams verband lijkt, noemt een lesboek een fout: wild verband lijkt op geen enkel regelmatig verband.', 'verified', 'tham-hoofdstuk14') },
    ],
    variants: [],
    map: { provinces: [] },
  },
];

export const BONDS = BOND_LIST.map((bond) => ({
  ...bond,
  map: { ...bond.map, examples: EXAMPLES[bond.id] ?? [] },
}));

// The candidate bonds of the prompt for this run: in, as a bond or a name
// of one, or out, and why.
export const CANDIDATES = [
  { name: 'monnikenverband', status: 'out', see: 'noords-verband', reason: c('Geen Nederlandse bron in deze catalogus noemt een monnikenverband. Engels monk bond (Getty AAT, Engelse Wikipedia) en Frans appareil des moines (Franse Wikipedia) zijn twee strekken en een kop in elke laag: Noords verband.', 'verified', 'aat-monk-bonds', 'wiki-en-brickwork', 'wiki-fr-brique', 'cht-metselverbanden', 'rce-linkeddata') },
  { name: 'Frans verband', status: 'out', see: 'staand-verband', reason: c('In Nederlandse bronnen alleen gevonden als manier van leien dekken ("het fransch en duitsch verband", 1939). Het Franse appareil à la française, een laag koppen om en om met een laag strekken (Franse Wikipedia), is staand verband.', 'verified', 'ksz-1939', 'wiki-fr-brique', 'cht-metselverbanden', 'rce-linkeddata') },
  { name: 'Duits verband', status: 'out', reason: c('Alleen gevonden als manier van leien dekken ("het fransch en duitsch verband", 1939), niet als metselverband.', 'verified', 'ksz-1939', 'cht-metselverbanden', 'rce-linkeddata') },
  { name: 'Silezisch verband', status: 'out', see: 'noords-verband', reason: c('Niet gevonden in de RCE-thesaurus, het register, het lesboek, de SIKB-leidraad of de KNB-bladen; de thesaurus kent alleen de Silezische steen, een witte siersteen. Het Duitse Schlesischer Verband is volgens de Duitse Wikipedia Gotischer Verband met minstens twee strekken tussen de koppen: Noords of Engels verband.', 'verified', 'cht-silezische-steen', 'cht-metselverbanden', 'rce-linkeddata', 'tham-hoofdstuk14', 'sikb-leidraad', 'knb-infoblad-15', 'knb-info-32', 'wiki-de-mauerwerksverband') },
  { name: 'Wendisch of Vandaals verband', status: 'in', bond: 'noords-verband', reason: c('Wendisch verband is een andere naam voor Noords verband: twee strekken en een kop in elke laag (Meyers 1909; een Nederlands vakblad van 1929). Vandaals verband is in geen bron gevonden.', 'verified', 'meyers-1909', 'jb-1929-09', 'oudheidkundig-1924') },
  { name: 'blokverband', status: 'out', reason: c('Een sierverband van groepen koppen en strekken in blokken; "eigenlijk kan men niet van verband spreken", zegt de RCE-thesaurus. Het heeft geen laagregel. Let op: hetzelfde woord noemt drie dingen. Het Duitse Blockverband is staand verband (Lueger, Meyers); het Engelse block bond is stapelverband (Getty AAT).', 'verified', 'cht-blokverband', 'lueger-blockverband', 'aat-stack-bond') },
  { name: 'sierverbanden en patroonmetselwerk', status: 'out', reason: c('Siermetselwerk is gevelmetselwerk met patronen, vaak met anders gekleurde stenen (RCE-thesaurus). Zonder eigen laagregel is het in deze catalogus geen verband. Een lesboek noemt Vlaams, Noors en Engels verband in halfsteense muren ook sierverband; die staan bij hun verband.', 'verified', 'cht-siermetselwerk', 'tham-hoofdstuk14') },
  { name: 'stapelverband', status: 'out', reason: c('Stapel- of tegelverband, zonder overlap tussen de stenen: de stootvoegen staan recht boven elkaar. Een lesboek beschrijft het; de Getty AAT kent het als stack bond. Maar "essentieel is dat in opvolgende lagen stootvoegen niet boven elkaar staan", zegt de RCE-thesaurus van een metselverband.', 'verified', 'tham-hoofdstuk14', 'cht-metselverbanden') },
  { name: 'keperverband en visgraatverband', status: 'out', reason: c('Sierverbanden van stenen in blokken of schuin, die de RCE-thesaurus onder blokverband rekent; zonder laagregel.', 'verified', 'cht-blokverband') },
  { name: 'speklagen', status: 'out', reason: c('Speklagen zijn banden van natuursteen in een bakstenen gevel, veel tussen 1400 en 1650; geen metselverband.', 'verified', 'cht-speklagen') },
  { name: 'verbandswisseling', status: 'out', see: 'kruisverband', reason: c('Geen eigen verband: bij vensters gaat kruisverband plaatselijk over in staand verband, met een "verbandswisselingskop" en een "parallelkop", zoals Kamphuis het beschrijft (Huis Doorn, 1796; Warnsveld, 1832). Het model tekent het niet.', 'verified', 'kamphuis-1996') },
  { name: 'kistwerk', status: 'out', reason: c('Geen verband van de gevel: de buitenste schillen van een muur worden regelmatig gemetseld en de ruimte ertussen wordt volgestort met gebroken stenen en mortel, zegt de SIKB-leidraad; de schillen kunnen in een verband liggen, zoals Vlaams verband (afb. 3.3.5).', 'verified', 'sikb-leidraad') },
  { name: 'kruislagen of zwaailagen', status: 'out', reason: c('Geen verband van de gevel: stenen die in de kern van een muur schuin op de richting van de muur staan, onder meer bij vestingwerken, kademuren en waterkelders (SIKB-leidraad).', 'verified', 'sikb-leidraad') },
  { name: 'rollagen', status: 'out', reason: c('Een rollaag is een laag stenen op hun kant, vaak als afdekking van een muur; een laag, geen metselverband.', 'verified', 'cht-lagen', 'tham-hoofdstuk14') },
];
