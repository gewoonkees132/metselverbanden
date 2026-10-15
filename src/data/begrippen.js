// The glossary: every term the page uses, each with its definition, its
// strength and its sources (ids of SOURCES in verbanden.js), the forms it
// takes in a text, and a drawing from the bricks of bricks.js: a bond (and
// a variant), and the pieces or the course to point at, or a course seen
// from above (view: 'plan').

const c = (text, strength, ...sources) => ({ text, strength, sources });

export const TERMS = [
  {
    id: 'kop', term: 'kop', forms: ['kop', 'koppen', 'kopse'],
    definition: c('Een baksteen in een metselverband die zijn smalste kant toont; de korte zijkant van de steen. Een kop in het gezicht steekt meestal met de hele steen in de dikte van de muur.', 'verified', 'cht-kop-baksteen', 'sikb-leidraad'),
    drawing: { bond: 'staand-verband', kinds: ['kop'] },
  },
  {
    id: 'strek', term: 'strek', forms: ['strek', 'strekken', 'strekse'],
    definition: c('De lange zijde van een baksteen; een steen die met die zijde in het gezicht ligt.', 'verified', 'cht-strek-baksteen', 'sikb-leidraad'),
    drawing: { bond: 'staand-verband', kinds: ['strek'] },
  },
  {
    id: 'klezoor', term: 'klezoor', forms: ['klezoor', 'klezoren'],
    definition: c('Een stuk baksteen, een kwart steen, gemaakt door een hele steen op een kwart van de lengte dwars door te slaan. Gebruikt aan het begin van een laag, zodat de stootvoegen van opeenvolgende lagen niet boven elkaar komen; in Nederland tot in de 18e eeuw. In een steense muur tekent de SIKB-leidraad er twee achter elkaar (afb. 3.3.9). Een klezoor duidt meestal op een oorspronkelijke hoek in het metselwerk, zegt de SIKB-leidraad; vanaf het eind van de 17e eeuw maakte hij aan de hoek plaats voor de drieklezoor, eerst in Holland, later in het oosten en het zuiden. Het model rekent in koppenmaten: een klezoor is een halve koppenmaat min een voeg, bij waalformaat 45 mm in het gezicht. In klezoorverband verspringen de lagen een klezoor; er liggen geen klezoren in.', 'verified', 'cht-klezoor', 'sikb-leidraad'),
    drawing: { bond: 'kruisverband', kinds: ['klezoor'] },
  },
  {
    id: 'drieklezoor', term: 'drieklezoor', forms: ['drieklezoor', 'drieklezoren'],
    definition: c('Een baksteen waarvan een kwart van de lengte is afgeslagen, een driekwart steen; bij gemetselde hoeken, waar de stootvoegen van de strekkenlagen moeten verspringen. Vooral sinds de 18e eeuw, zegt de RCE-thesaurus; vanaf het eind van de 17e eeuw kwam hij in de plaats van de klezoor, zegt de SIKB-leidraad. Bij waalformaat in het model 155 mm in het gezicht.', 'verified', 'cht-drieklezoor', 'sikb-leidraad'),
    drawing: { bond: 'staand-verband', variant: 'drieklezoor', kinds: ['drieklezoor'] },
  },
  {
    id: 'klisklezoor', term: 'klisklezoor', forms: ['klisklezoor', 'klisklezoren'],
    definition: c('Een in de lengte doorgehakte baksteen: op de kop gezien een klezoor breed, en zo lang als een strek; ook hengst. Het model gebruikt hem niet.', 'verified', 'cht-klisklezoor'),
  },
  {
    id: 'halve-steen', term: 'halve steen', forms: ['halve steen', 'halve stenen'],
    definition: c('Een steen in tweeën, in het gezicht zo breed als een kop. Een lesboek laat klezoorverband om de andere laag met een halve steen beginnen; in een halfsteense muur is elke kop een halve steen.', 'assumed', 'tham-hoofdstuk14', 'afleiding'),
    drawing: { bond: 'klezoorverband', kinds: ['halve'] },
  },
  {
    id: 'laag', term: 'laag', forms: ['laag', 'lagen'],
    definition: c('Een reeks aaneengevoegde stenen van gelijke dikte, op hun plat en horizontaal gelegd, soms schuin of op hun kant (rollaag). De hoogte van bakstenen metselwerk wordt in lagen opgegeven.', 'verified', 'cht-lagen'),
    drawing: { bond: 'kruisverband', course: 2 },
  },
  {
    id: 'koppenlaag', term: 'koppenlaag', forms: ['koppenlaag', 'koppenlagen', 'patijtse laag', 'patijtse lagen'],
    definition: c('Een laag metselwerk waarin alleen koppen in het zicht zijn; ook patijtse laag.', 'verified', 'cht-koppenlagen', 'cht-lagen', 'cht-patijts'),
    drawing: { bond: 'staand-verband', course: 1 },
  },
  {
    id: 'strekkenlaag', term: 'strekkenlaag', forms: ['strekkenlaag', 'strekkenlagen'],
    definition: c('Een laag metselwerk waarin alleen strekken in het zicht zijn.', 'verified', 'cht-strekkenlagen', 'cht-lagen'),
    drawing: { bond: 'staand-verband', course: 0 },
  },
  {
    id: 'stootvoeg', term: 'stootvoeg', forms: ['stootvoeg', 'stootvoegen'],
    definition: c('Een verticale, staande voeg tussen twee bakstenen in een laag.', 'verified', 'cht-stootvoeg', 'cht-voegen'),
    drawing: { bond: 'halfsteensverband' },
  },
  {
    id: 'lintvoeg', term: 'lintvoeg', forms: ['lintvoeg', 'lintvoegen'],
    definition: c('Een horizontale voeg tussen twee lagen metselwerk; ook liggende of strekse voeg.', 'verified', 'cht-lintvoeg', 'cht-voegen'),
    drawing: { bond: 'halfsteensverband' },
  },
  {
    id: 'voeg', term: 'voeg', forms: ['voeg', 'voegen'],
    definition: c('De naad tussen de stenen van metselwerk: staand (stootvoeg) of liggend (lintvoeg). Tot in de 18e eeuw werd gelijk met het metselen afgevoegd; de mortel wordt vaak bijgesneden en nog fijner geknipt.', 'verified', 'cht-voegen'),
  },
  {
    id: 'platvol', term: 'platvol', forms: ['platvol', 'platvolle'],
    definition: c('Voegen zo volgestreken met nog natte mortel dat hun voorkant gelijk ligt met die van de stenen.', 'verified', 'cht-platvol'),
  },
  {
    id: 'verdiept', term: 'verdiepte voeg', forms: ['verdiepte voeg', 'verdiepte voegen', 'verdiept'],
    definition: c('Een voeg die terugligt ten opzichte van de bakstenen; ook schaduwvoeg. De KNB noemt 15 mm het diepste bij een steen van 100 mm breed.', 'verified', 'cht-verdiept', 'knb-infoblad-28'),
  },
  {
    id: 'knipvoeg', term: 'knipvoeg', forms: ['knipvoeg', 'knipvoegen'],
    definition: c('Een fijn bijgeknipte voeg die voor de bakstenen uitsteekt; een snijvoeg lijkt erop, maar steekt niet uit. Het model kan zo een voeg niet tekenen.', 'verified', 'cht-knipvoeg'),
  },
  {
    id: 'koppenmaat', term: 'koppenmaat', forms: ['koppenmaat'],
    definition: c('De steenbreedte plus de dikte van de stootvoeg: de maat waarin metselwerk langs de muur wordt geteld.', 'verified', 'tham-hoofdstuk14'),
  },
  {
    id: 'lagenmaat', term: 'lagenmaat', forms: ['lagenmaat'],
    definition: c('De steendikte plus de dikte van de lintvoeg: de maat waarin metselwerk in de hoogte wordt geteld.', 'verified', 'tham-hoofdstuk14'),
  },
  {
    id: 'halfsteens', term: 'halfsteens', forms: ['halfsteens', 'halfsteense', 'halfsteensmuur', 'halfsteensmuren'],
    definition: c('Een muur zo dik als de kopbreedte van de steen, ongeveer 100 mm: een halve strek.', 'verified', 'tham-hoofdstuk14', 'sikb-leidraad'),
    drawing: { bond: 'halfsteensverband', view: 'plan', course: 0 },
  },
  {
    id: 'steens', term: 'steens', forms: ['steens', 'steense', 'steensmuur', 'steensmuren'],
    definition: c('Een muur zo dik als de lengte van de steen, ongeveer 210 mm: een strek.', 'verified', 'tham-hoofdstuk14', 'sikb-leidraad'),
    drawing: { bond: 'kruisverband', view: 'plan', course: 0 },
  },
  {
    id: 'anderhalfsteens', term: 'anderhalfsteens', forms: ['anderhalfsteens', 'anderhalfsteense'],
    definition: c('Een muur van anderhalve steen dik; een lesboek rekent 320 mm bij een koppenmaat van 110 mm. Dit model tekent geen anderhalfsteense muur.', 'verified', 'tham-hoofdstuk14', 'sikb-leidraad'),
  },
  {
    id: 'spouwmuur', term: 'spouwmuur', forms: ['spouwmuur', 'spouwmuren'],
    definition: c('Een muur van twee evenwijdige delen met een spouw ertussen. De oudst bekende spouwmuren zijn gevonden in het huis Ten Bosch te Maarssen, 1627, zegt de RCE-thesaurus; Kooij dateert de bouw 1627-1629 en schrijft dat het huis "naar alle waarschijnlijkheid" rondom een spouwmuur heeft.', 'verified', 'cht-spouwmuur', 'kooij-1996'),
  },
  {
    id: 'buitenblad', term: 'buitenblad', forms: ['buitenblad', 'buitenbladen', 'buitenspouwblad', 'buitenspouwbladen'],
    definition: c('De buitenste muur van een spouwmuur.', 'verified', 'cht-buitenblad'),
  },
  {
    id: 'metselverband', term: 'metselverband', forms: ['metselverband', 'metselverbanden'],
    definition: c('De wijze waarop stenen aan de buitenzijde van een muur zijn gerangschikt, voor een hecht metselwerk en een goed aanzien. Essentieel is dat in opvolgende lagen de stootvoegen niet boven elkaar staan.', 'verified', 'cht-metselverbanden'),
    drawing: { bond: 'kruisverband' },
  },
  {
    id: 'kettingverband', term: 'kettingverband', forms: ['kettingverband', 'kettingverbanden'],
    definition: c('Een metselverband met in iedere laag twee of drie strekken en een kop: Noords en Engels verband.', 'verified', 'cht-ketting'),
    drawing: { bond: 'noords-verband', kinds: ['kop'] },
  },
  {
    id: 'hoekverband', term: 'hoekverband', forms: ['hoekverband'],
    definition: c('Het metselverband op een hoek van een bouwdeel.', 'verified', 'cht-hoekverband'),
    drawing: { bond: 'kruisverband', view: 'plan', course: 1 },
  },
  {
    id: 'staande-tand', term: 'staande tand', forms: ['staande tand', 'staande tanden'],
    definition: c('Een manier om metselwerk verticaal af te breken, met in- en uitspringende stenen, een kwart of een halve steen per sprong.', 'verified', 'cht-staande-tand'),
  },
  {
    id: 'vallende-tand', term: 'vallende tand', forms: ['vallende tand', 'vallende tanden'],
    definition: c('Een manier om metselwerk trapvormig af te breken, in aflopende zin; de RCE-thesaurus noemt het ook liggende tand.', 'verified', 'cht-vallende-tand'),
  },
  {
    id: 'vrij-eind', term: 'vrij eind', forms: ['vrij eind', 'vrije eind', 'muurbeëindiging', 'muurbeëindigingen'],
    definition: c('Het eind van een muur dat nergens tegenaan sluit; een lesboek en de KNB spreken van een muurbeëindiging. Ook daar mogen de stootvoegen niet boven elkaar komen.', 'assumed', 'tham-hoofdstuk14', 'knb-info-32'),
    drawing: { bond: 'kruisverband', view: 'plan', course: 1, end: true },
  },
  {
    id: 'sierverband', term: 'sierverband', forms: ['sierverband', 'sierverbanden', 'siermetselwerk'],
    definition: c('Gevelmetselwerk waarin patronen zijn gemaakt, vaak met anders gekleurde bakstenen; een lesboek noemt ook Vlaams, Noors en Engels verband in een halfsteense muur een sierverband.', 'verified', 'cht-siermetselwerk', 'tham-hoofdstuk14'),
  },
  {
    id: 'snijvoeg', term: 'snijvoeg', forms: ['snijvoeg', 'snijvoegen'],
    definition: c('Een scherpe voeg die langs een rei schuin is afgesneden; anders dan een knipvoeg steekt hij niet voor de stenen uit.', 'verified', 'cht-knipvoeg'),
  },
  {
    id: 'in-verband', term: 'in verband gemetseld', forms: ['in verband gemetseld', 'in verband gemetselde', 'in verband ligt'],
    definition: c('Twee muren die tegelijk zijn gemetseld, waarbij de stenen om en om in de aansluitende muur steken; in de binnenhoek is dan nooit een doorlopende verticale naad.', 'verified', 'sikb-leidraad'),
    drawing: { bond: 'kruisverband', view: 'plan', course: 0 },
  },
  {
    id: 'rollaag', term: 'rollaag', forms: ['rollaag', 'rollagen'],
    definition: c('Een laag stenen op hun kant; een muur kan ermee worden afgedekt.', 'verified', 'cht-lagen', 'tham-hoofdstuk14'),
  },
  {
    id: 'speklaag', term: 'speklaag', forms: ['speklaag', 'speklagen'],
    definition: c('Een band van natuursteen in een bakstenen gevel; tussen 1400 en 1650 veel toegepast, eerst in witte arduin, later in zandsteen en mergel.', 'verified', 'cht-speklagen'),
  },
];
