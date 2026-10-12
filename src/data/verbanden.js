// The bonds of the catalog: their course rules (the one input of
// bricks.js) and every claim the page makes about them. Each claim has a
// strength and its sources:
//   verified  the source was opened on SESSION_DATE and says it;
//   reported  a source says it, but it was not opened that day;
//   assumed   this catalog's own reading or derivation (source 'afleiding'
//             where nothing else carries it).
// Kept: a bond with a source opened that day that gives its rule. Left
// out for want of such a source: monnikenverband (the Getty AAT has "monk
// bonds", two strekken and a kop per course, with no Dutch name), Frans,
// Duits and Silezisch verband. Kettingverbanden is the thesaurus's group
// of Noords and Engels verband, so those two stand for it.

import { EXAMPLES } from './voorbeelden.js';

export const SESSION_DATE = '2026-10-10';

const CHT = 'https://data.cultureelerfgoed.nl/term/id/cht/';
const cht = (title, id) => ({ title: `Cultuurhistorische Thesaurus: ${title}`, publisher: 'Rijksdienst voor het Cultureel Erfgoed', url: CHT + id, opened: SESSION_DATE, rce: true });
const aat = (title, id) => ({ title: `Art & Architecture Thesaurus: ${title}`, publisher: 'Getty Research Institute', url: `https://vocab.getty.edu/aat/${id}`, opened: SESSION_DATE, rce: false });

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
  'cht-klezoor': cht('klezoor', 'b4414732-ba4d-4a5f-b42f-12d49332c211'),
  'cht-drieklezoor': cht('drieklezoor', 'd0272820-bd41-4e3d-878a-64face0e0909'),
  'cht-waalformaat': cht('waalformaat', '9679fc59-c68d-41c5-8ee0-356896f1a363'),
  'cht-kloostermop': cht('kloostermop', '7c556686-e7d7-4681-81f2-b2a2b73af01a'),
  'cht-voegwerk': cht('voegwerk', '05b0856e-82b3-41ab-8185-468be1fc8568'),
  'aat-english-bond': aat('English bond (staand verband)', '300175506'),
  'aat-flemish-bond': aat('Flemish bond (Vlaams verband)', '300175511'),
  'aat-running-bond': aat('running bond (halfsteensverband)', '300175515'),
  'aat-monk-bonds': aat('monk bonds', '300417346'),
  'sikb-leidraad': {
    title: 'KNA-Leidraad Stenen Gebouwstructuren, versie 1.0 (2025), hoofdstuk 3.3, pdf-pagina\'s 153-162',
    publisher: 'SIKB', url: 'https://sikb.nl/doc/archeo/SIKB%20KNA-Leidraad%20Stenen%20Gebouwstructuren%20def.%20versie%201.0.pdf', opened: SESSION_DATE, rce: false,
  },
  'tham-hoofdstuk14': {
    title: 'Lesboek, hoofdstuk 14: Gebakken en niet-gebakken stenen en steenconstructies (paragraaf 14.8 en 14.9)',
    publisher: 'ThiemeMeulenhoff', url: 'https://cdn.tham.thiememeulenhoff.nl/document-output/tham.prod.4be870ce-6a82-441f-8822-32192c5cd1d8/originaldocument', opened: SESSION_DATE, rce: false,
  },
  'knb-infoblad-15': {
    title: 'Infoblad 15: Materiaalhoeveelheden voor baksteenmetselwerk (2008)',
    publisher: 'KNB', url: 'https://www.knb-keramiek.nl/media/35742/knb_infoblad_15_materiaalhoeveelheden_voor_baksteenmetselwerk.pdf', opened: SESSION_DATE, rce: false,
  },
  'knb-info-32': {
    title: 'Info 32: Wildverband metselwerk (2018)',
    publisher: 'KNB', url: 'https://www.knb-keramiek.nl/media/266345/knb-info-32-wildverband-metselwerk-2018-05.pdf', opened: SESSION_DATE, rce: false,
  },
  'kooij-1996': {
    title: 'De spouwmuur in oude Nederlandse buitenhuizen, Jaarboek Monumentenzorg 1996',
    publisher: 'Rijksdienst voor de Monumentenzorg (voorganger van de RCE), via DBNL', url: 'https://www.dbnl.org/tekst/_jaa030199601_01/_jaa030199601_01_0013.php', opened: SESSION_DATE, rce: true,
  },
  'rce-register': {
    title: 'Rijksmonumentenregister: de pagina van elk voorbeeldgebouw',
    publisher: 'Rijksdienst voor het Cultureel Erfgoed', url: 'https://monumentenregister.cultureelerfgoed.nl/', opened: SESSION_DATE, rce: true,
  },
  'rce-linkeddata': {
    title: 'Linked data van de RCE, dataset rce/cho: omschrijving, bouwjaren en punt van elk voorbeeld',
    publisher: 'Rijksdienst voor het Cultureel Erfgoed', url: 'https://api.linkeddata.cultureelerfgoed.nl/datasets/rce/cho/services/cho/sparql', opened: SESSION_DATE, rce: true,
  },
  afleiding: { title: 'Afgeleid in deze catalogus, niet in een bron gevonden', publisher: 'deze catalogus', kind: 'afleiding' },
};

const c = (text, strength, ...sources) => ({ text, strength, sources });

export const FORMATS = {
  waalformaat: {
    name: 'Waalformaat', length: 210, width: 100, height: 50, joint: 10, bed: 10,
    claim: c('Waalformaat, 210 x 100 x 50 mm, met voegen van 10 mm, zoals de KNB rekent. Volgens de RCE-thesaurus in gebruik sinds de 17e eeuw.', 'verified', 'knb-infoblad-15', 'cht-waalformaat'),
  },
  kloostermop: {
    name: 'Kloostermop', length: 300, width: 145, height: 85, joint: 10, bed: 10,
    claim: c('Kloostermop, volgens de RCE-thesaurus ca. 28 tot 34 cm lang, 14 tot 16 cm breed en 7 tot 10 cm dik, vanaf het midden van de 13e eeuw. Het model neemt 300 x 145 x 85 mm met voegen van 10 mm; oude voegen waren vaak dikker, tot 5 cm.', 'verified', 'cht-kloostermop', 'cht-voegwerk'),
  },
};

// Courses of the rules: per course which leg runs through the corner, and
// per leg its pieces from the corner (head, unit repeated, tail).
const kopLaag = { head: ['klezoor'], unit: ['kop'], tail: ['klezoor', 'kop'] };
const kopLaagHoek = { head: ['kop', 'klezoor'], unit: ['kop'], tail: ['klezoor', 'kop'] };
const vlaamseLaag = { unit: ['strek', 'kop'], tail: ['strek'] };
const kruisLaag = { head: ['strek', 'kop'], unit: ['strek'], tail: ['kop', 'strek'] };
const vlaamsP = { head: ['strek'], unit: ['kop', 'strek'] };
const vlaamsQ = { head: ['klezoor'], unit: ['strek', 'kop'], tail: ['strek', 'klezoor', 'kop'] };
const noordsP = { head: ['kop'], unit: ['strek', 'strek', 'kop'] };
const noordsQ = { head: ['drieklezoor'], unit: ['kop', 'strek', 'strek'], tail: ['kop', 'drieklezoor'] };
const engelsP = { unit: ['strek', 'strek', 'strek', 'kop'], tail: ['strek', 'strek', 'strek'] };
const engelsQ = { head: ['drieklezoor'], unit: ['kop', 'strek', 'strek', 'strek'], tail: ['kop', 'drieklezoor', 'kop'] };
const koppenP = { head: ['kop', 'klezoor'], unit: ['kop'] };
const koppenQ = { unit: ['kop'], tail: ['drieklezoor'] };
const kl = [
  { unit: ['strek'] },
  { head: ['drieklezoor'], unit: ['strek'], tail: ['drieklezoor'] },
  { head: ['strek', 'halve'], unit: ['strek'], tail: ['halve'] },
  { head: ['drieklezoor', 'halve'], unit: ['strek'], tail: ['halve', 'drieklezoor'] },
];

const none = { provinces: [], periodOnly: true, note: null };
const prov = (id, name, claim) => ({ id, name, claim });

const BOND_LIST = [
  {
    id: 'kruisverband',
    name: 'Kruisverband',
    periodShort: 'vanaf eind 15e eeuw',
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
    facts: {
      rule: c('Afwisselend strekken- en koppenlagen; de strekken in opvolgende strekkenlagen verspringen een halve steen of kop.', 'verified', 'cht-kruis', 'sikb-leidraad'),
      repeat: c('Na vier lagen; langs de muur na een strek.', 'assumed', 'cht-kruis', 'afleiding'),
      thickness: c('Steens of dikker; het model is steens.', 'verified', 'tham-hoofdstuk14'),
      corner: c('Naast de hoekkop ligt in de koppenlaag een klezoor, de oudere oplossing; vanaf het eind van de 17e eeuw kwam daarvoor een drieklezoor in de strekkenlaag. Dat het model in de verschoven strekkenlaag een kop naast de hoekstrek legt, is afgeleid.', 'assumed', 'sikb-leidraad', 'cht-klezoor', 'afleiding'),
      period: c('Vanaf het eind van de 15e eeuw; in Leiden al in 1463.', 'verified', 'sikb-leidraad'),
      use: c('Gevelmetselwerk; de voorbeelden in het register zijn gebouwd tussen 1570 en 1935.', 'verified', 'rce-register', 'rce-linkeddata'),
    },
    map: { ...none, note: c('Volgens de SIKB-leidraad kwam kruisverband in Holland iets eerder voor dan in de rest van Nederland.', 'verified', 'sikb-leidraad') },
  },
  {
    id: 'staand-verband',
    name: 'Staand verband',
    periodShort: 'vanaf begin 14e eeuw',
    english: c('English bond', 'verified', 'aat-english-bond'),
    format: FORMATS.waalformaat,
    rule: {
      thickness: 'steens',
      courses: [
        { pass: 'A', A: { unit: ['strek'] }, B: kopLaag },
        { pass: 'B', A: kopLaag, B: { unit: ['strek'] } },
      ],
      repeat: { courses: 2, modules: 4 },
    },
    facts: {
      rule: c('Afwisselend strekken- en koppenlagen; de strekken liggen recht boven elkaar.', 'verified', 'cht-staand', 'sikb-leidraad'),
      repeat: c('Na twee lagen; langs de muur na een strek.', 'assumed', 'cht-staand', 'afleiding'),
      thickness: c('Steens of dikker; ook een halfsteense muur in staand verband komt voor. Het model is steens.', 'verified', 'tham-hoofdstuk14', 'sikb-leidraad'),
      corner: c('Naast de hoekkop ligt in de koppenlaag een klezoor, de oudere oplossing; later begint elke strekkenlaag met een drieklezoor.', 'verified', 'sikb-leidraad', 'cht-klezoor', 'tham-hoofdstuk14'),
      period: c('Vanaf het begin van de 14e eeuw.', 'verified', 'sikb-leidraad'),
      use: c('Gevels en torens; de voorbeelden in het register zijn gebouwd tussen 1692 en 1934.', 'verified', 'rce-register', 'rce-linkeddata'),
    },
    map: none,
  },
  {
    id: 'hollands-verband',
    name: 'Hollands verband',
    periodShort: 'periode niet in de bronnen',
    periodKnown: false,
    format: FORMATS.waalformaat,
    rule: {
      thickness: 'steens',
      courses: [
        { pass: 'A', A: kopLaagHoek, B: vlaamseLaag },
        { pass: 'B', A: vlaamseLaag, B: kopLaagHoek },
      ],
      repeat: { courses: 2, modules: 6 },
    },
    facts: {
      rule: c('Koppenlagen afgewisseld met lagen in Vlaams verband; in plaats van Vlaams kan ook Engels of Noors verband.', 'verified', 'tham-hoofdstuk14'),
      repeat: c('Na twee lagen; langs de muur na een strek en een kop.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
      thickness: c('Koppen reiken door de muur, dus steens; het model is steens.', 'assumed', 'afleiding'),
      corner: c('De hoek van het model is afgeleid: een klezoor naast de hoekkop in de koppenlaag, de Vlaamse laag begint met een strek.', 'assumed', 'afleiding'),
      period: c('De geopende bronnen noemen geen periode; alleen een lesboek beschrijft dit verband.', 'verified', 'tham-hoofdstuk14'),
    },
    map: { ...none, note: c('Alleen een lesboek beschrijft dit verband; het noemt geen streek.', 'verified', 'tham-hoofdstuk14') },
  },
  {
    id: 'vlaams-verband',
    name: 'Vlaams verband',
    periodShort: '13e en begin 14e eeuw',
    otherNames: c('Brabants verband, Gotisch verband', 'verified', 'cht-vlaams'),
    english: c('Flemish bond', 'verified', 'aat-flemish-bond'),
    format: FORMATS.kloostermop,
    rule: {
      thickness: 'steens',
      courses: [
        { pass: 'B', A: vlaamsQ, B: vlaamsP },
        { pass: 'A', A: vlaamsP, B: vlaamsQ },
      ],
      repeat: { courses: 2, modules: 6 },
    },
    facts: {
      rule: c('In iedere laag afwisselend een strek en een kop; de koppen liggen juist boven de strekken van de laag eronder.', 'verified', 'cht-vlaams'),
      repeat: c('Na twee lagen; langs de muur na een strek en een kop.', 'assumed', 'cht-vlaams', 'afleiding'),
      thickness: c('Koppen reiken door de muur, dus steens; het model is steens.', 'assumed', 'afleiding'),
      corner: c('Een hoek met klezoren, zoals de SIKB-leidraad die tekent voor Vlaams verband en kruisverband; een lesboek laat om de andere laag met een drieklezoor beginnen.', 'verified', 'sikb-leidraad', 'tham-hoofdstuk14'),
      period: c('Gebruikelijk in de 13e eeuw en het eerste kwart van de 14e eeuw, later incidenteel; volgens de SIKB-leidraad tot het begin van de 14e eeuw.', 'verified', 'cht-vlaams', 'sikb-leidraad'),
      use: c('Bakstenen muren van die tijd; in het register een torenrest uit de 14e eeuw en gevels uit 1920 tot 1941.', 'verified', 'rce-register', 'rce-linkeddata'),
    },
    map: {
      provinces: [
        prov('noord-holland', 'Noord-Holland', c('De RCE-thesaurus: gebruikelijk in "het westelijk deel van Nederland". Welke provincies dat zijn, is een uitleg van deze catalogus.', 'assumed', 'cht-vlaams')),
        prov('zuid-holland', 'Zuid-Holland', c('De RCE-thesaurus: gebruikelijk in "het westelijk deel van Nederland". Welke provincies dat zijn, is een uitleg van deze catalogus.', 'assumed', 'cht-vlaams')),
        prov('zeeland', 'Zeeland', c('West volgens de RCE-thesaurus, zuid volgens de SIKB-leidraad. Welke provincies dat zijn, is een uitleg van deze catalogus.', 'assumed', 'cht-vlaams', 'sikb-leidraad')),
        prov('noord-brabant', 'Noord-Brabant', c('De SIKB-leidraad: "vooral in zuidelijk Nederland". Welke provincies dat zijn, is een uitleg van deze catalogus.', 'assumed', 'sikb-leidraad')),
        prov('limburg', 'Limburg', c('De SIKB-leidraad: "vooral in zuidelijk Nederland". Welke provincies dat zijn, is een uitleg van deze catalogus.', 'assumed', 'sikb-leidraad')),
      ],
      periodOnly: false,
      note: c('De bronnen verschillen: de RCE-thesaurus noemt Vlaanderen en het westen, de SIKB-leidraad vooral het zuiden. Welke provincies gearceerd zijn, is een uitleg van deze catalogus.', 'verified', 'cht-vlaams', 'sikb-leidraad'),
    },
  },
  {
    id: 'noords-verband',
    name: 'Noords verband',
    periodShort: 'noordelijk Nederland',
    otherNames: c('Noors verband, noordsverband; een van de kettingverbanden', 'verified', 'cht-ketting', 'tham-hoofdstuk14'),
    english: c('Monk bond, vermoedelijk: de Getty AAT beschrijft monk bonds als twee strekken en een kop in iedere laag, maar geeft geen Nederlandse naam.', 'assumed', 'aat-monk-bonds'),
    format: FORMATS.waalformaat,
    rule: {
      thickness: 'steens',
      courses: [
        { pass: 'A', A: noordsP, B: noordsQ },
        { pass: 'B', A: noordsQ, B: noordsP },
      ],
      repeat: { courses: 2, modules: 10 },
    },
    facts: {
      rule: c('In iedere laag afwisselend twee strekken en een kop.', 'verified', 'cht-noords', 'tham-hoofdstuk14'),
      repeat: c('Na twee lagen; langs de muur na twee strekken en een kop.', 'assumed', 'afleiding'),
      thickness: c('Koppen reiken door de muur, dus steens; het model is steens.', 'assumed', 'afleiding'),
      corner: c('De ene laag begint met een kop, de andere met een drieklezoor en een strek; op de hoek twee koppen. Het model volgt de eerste regel; zijn hoek is afgeleid.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
      period: c('Geen jaartal in de geopende bronnen; de voorbeelden in het register zijn gebouwd tussen 1897 en 1936.', 'verified', 'sikb-leidraad', 'rce-linkeddata'),
      use: c('In het register onder meer kerken, een watertoren en een columbarium.', 'verified', 'rce-register'),
    },
    map: {
      provinces: ['groningen:Groningen', 'fryslan:Fryslân', 'drenthe:Drenthe'].map((s) => {
        const [id, name] = s.split(':');
        return prov(id, name, c('De SIKB-leidraad: Noords en Engels verband "in onder meer noordelijk Nederland". Welke provincies dat zijn, is een uitleg van deze catalogus.', 'assumed', 'sikb-leidraad'));
      }),
      periodOnly: false,
      note: c('De bron zegt "onder meer": ook elders komt het voor.', 'verified', 'sikb-leidraad'),
    },
  },
  {
    id: 'engels-verband',
    name: 'Engels verband',
    periodShort: 'noordelijk Nederland',
    english: c('Niet gevonden. Let op: "English bond" is het staand verband.', 'verified', 'aat-english-bond'),
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
    facts: {
      rule: c('In iedere laag afwisselend drie strekken en een kop; de koppen van de volgende laag liggen midden boven de middelste strek.', 'verified', 'cht-engels', 'tham-hoofdstuk14'),
      repeat: c('Na twee lagen; langs de muur na drie strekken en een kop.', 'assumed', 'afleiding'),
      thickness: c('Koppen reiken door de muur, dus steens; het model is steens.', 'assumed', 'afleiding'),
      corner: c('Een lesboek begint een steense muur met drie koppen op de hoek; de hoek van het model, een strek met een drieklezoor erboven, is afgeleid.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
      period: c('Geen jaartal in de geopende bronnen; het ene voorbeeld in het register is gebouwd tussen 1930 en 1935.', 'verified', 'sikb-leidraad', 'rce-linkeddata'),
    },
    map: {
      provinces: ['groningen:Groningen', 'fryslan:Fryslân', 'drenthe:Drenthe'].map((s) => {
        const [id, name] = s.split(':');
        return prov(id, name, c('De SIKB-leidraad: Noords en Engels verband "in onder meer noordelijk Nederland". Welke provincies dat zijn, is een uitleg van deze catalogus.', 'assumed', 'sikb-leidraad'));
      }),
      periodOnly: false,
      note: c('Of het register met "Engels verband" dit verband bedoelt of het staand verband (English bond), is niet na te gaan.', 'assumed', 'rce-register', 'aat-english-bond'),
    },
  },
  {
    id: 'koppenverband',
    name: 'Koppenverband',
    periodShort: 'periode niet in de bronnen',
    periodKnown: false,
    otherNames: c('Patijts verband', 'verified', 'cht-koppen'),
    format: FORMATS.waalformaat,
    rule: {
      thickness: 'steens',
      courses: [
        { pass: 'A', A: koppenP, B: koppenQ },
        { pass: 'B', A: koppenQ, B: koppenP },
      ],
      repeat: { courses: 2, modules: 2 },
    },
    facts: {
      rule: c('Uitsluitend koppenlagen, dus zonder strekken; opvolgende lagen verspringen een klezoor.', 'verified', 'cht-koppen', 'tham-hoofdstuk14'),
      repeat: c('Na twee lagen; langs de muur na een kop.', 'assumed', 'afleiding'),
      thickness: c('Koppen reiken door de muur, dus steens; het model is steens.', 'assumed', 'afleiding'),
      corner: c('Aan een muureinde begint de ene laag met een kop, de andere met een drieklezoor; zo doet het model het ook. Zijn hoek, met een klezoor naast de hoekkop, is afgeleid.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
      period: c('De RCE-thesaurus noemt geen periode; de voorbeelden in het register zijn gebouwd tussen 1884 en 1929.', 'verified', 'cht-koppen', 'rce-linkeddata'),
      use: c('Ronde torens, ronde hoeken en putten, fabrieksschoorstenen.', 'verified', 'cht-koppen'),
    },
    map: none,
  },
  {
    id: 'halfsteensverband',
    name: 'Halfsteensverband',
    periodShort: 'vooral 20e eeuw',
    otherNames: c('Halfsteens verband, halfsteens', 'verified', 'cht-halfsteens'),
    english: c('Running bond of stretcher bond', 'verified', 'aat-running-bond'),
    format: FORMATS.waalformaat,
    rule: {
      thickness: 'halfsteens',
      courses: [
        { pass: 'A', A: { unit: ['strek'] }, B: { unit: ['strek'], tail: ['halve'] } },
        { pass: 'B', A: { unit: ['strek'], tail: ['halve'] }, B: { unit: ['strek'] } },
      ],
      repeat: { courses: 2, modules: 4 },
    },
    facts: {
      rule: c('Alleen strekken in het gezicht; de stenen verspringen een halve steen ten opzichte van de laag eronder.', 'verified', 'cht-halfsteens', 'tham-hoofdstuk14'),
      repeat: c('Om de andere laag liggen de stootvoegen precies boven elkaar; langs de muur na een strek.', 'verified', 'tham-hoofdstuk14'),
      thickness: c('Halfsteens: een kop dik.', 'verified', 'cht-halfsteens', 'sikb-leidraad'),
      corner: c('Op de hoek loopt om de laag de strek van de ene of van de andere muur door; aan een vrij eind een halve steen.', 'assumed', 'afleiding'),
      period: c('De spouwmuur kreeg pas vanaf het begin van de 20e eeuw brede erkenning, en het grootste deel van de buitenspouwbladen is halfsteens; de voorbeelden in het register zijn gebouwd tussen 1872 en 1942.', 'verified', 'kooij-1996', 'tham-hoofdstuk14', 'rce-linkeddata'),
      use: c('Vroeger vooral binnenwanden, voorzetmuren en klampen; nu vooral buitenspouwbladen.', 'verified', 'sikb-leidraad', 'tham-hoofdstuk14'),
    },
    map: none,
  },
  {
    id: 'klezoorverband',
    name: 'Klezoorverband',
    periodShort: 'periode niet in de bronnen',
    periodKnown: false,
    otherNames: c('Varianten: staand klezoorverband, lopend klezoorverband rechtsvallend en linksvallend', 'verified', 'tham-hoofdstuk14'),
    format: FORMATS.waalformaat,
    rule: {
      thickness: 'halfsteens',
      courses: [
        { pass: 'A', A: kl[0], B: kl[3] },
        { pass: 'B', A: kl[1], B: kl[0] },
        { pass: 'A', A: kl[2], B: kl[1] },
        { pass: 'B', A: kl[3], B: kl[2] },
      ],
      repeat: { courses: 4, modules: 4 },
    },
    facts: {
      rule: c('Een halfsteense muur waarin de stootvoegen tussen de strekken per laag een klezoor verspringen.', 'verified', 'cht-klezoorverband'),
      repeat: c('Het model toont het lopende verband, dat steeds dezelfde kant op verspringt: na vier lagen, langs de muur na een strek.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
      thickness: c('Halfsteens.', 'verified', 'cht-klezoorverband'),
      corner: c('Aan het einde van een muur wordt niet met een klezoor gestopt: een laag begint met een drieklezoor, een andere met een halve steen.', 'verified', 'tham-hoofdstuk14'),
      period: c('De geopende bronnen noemen geen periode; de voorbeelden in het register zijn gebouwd tussen 1910 en 1946.', 'verified', 'cht-klezoorverband', 'rce-linkeddata'),
    },
    map: none,
  },
  {
    id: 'wild-verband',
    name: 'Wild verband',
    periodShort: 'muren uit het zicht, later zichtwerk',
    otherNames: c('Wildverband', 'verified', 'knb-info-32'),
    format: FORMATS.waalformaat,
    rule: { thickness: 'steens', wild: { seed: 7, maxStrekken: 2 }, repeat: null },
    facts: {
      rule: c('Geen herkenbaar verband, mede door sloopmateriaal of gebroken stenen; alleen staan de stootvoegen niet boven elkaar. Nu: strekken, drieklezoren en koppen, met een overlap van minstens een klezoor.', 'verified', 'cht-wild', 'knb-info-32'),
      repeat: c('Geen herhaling; het model trekt de lagen uit een vaste reeks toevalsgetallen, met niet meer dan twee strekken naast elkaar.', 'assumed', 'cht-wild', 'afleiding'),
      thickness: c('Het model is steens; de bronnen noemen geen dikte.', 'assumed', 'afleiding'),
      corner: c('Hoeken en muurbeëindigingen beginnen met een strek, drieklezoor of kop; het model begint elke hoek met een strek.', 'verified', 'knb-info-32'),
      period: c('Vroeger bij muren uit het zicht, zoals funderingen en bepleisterde muren, of bij hergebruik van oude stenen; de voorbeelden in het register zijn gebouwd tussen 1923 en 1956.', 'verified', 'sikb-leidraad', 'rce-linkeddata'),
      use: c('Funderingen, bepleisterde muren en muren van hergebruikte stenen; in de 20e eeuw ook zichtwerk, zoals in de voorbeelden.', 'verified', 'sikb-leidraad', 'rce-register'),
    },
    map: none,
  },
];

export const BONDS = BOND_LIST.map((bond) => ({
  ...bond,
  map: { ...bond.map, examples: EXAMPLES[bond.id] ?? [] },
}));
