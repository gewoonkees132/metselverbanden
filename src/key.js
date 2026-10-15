// The key: from what a facade shows to the bond's name, by short
// questions, each answer with a drawing of a wall that shows it. The
// questions follow the course rules of data/verbanden.js; each answer
// leads to the next question or to a bond; under every question one answer
// is a way out, for a wall that fits none of the others (out: a candidate
// this catalog leaves out, or 'anders'). Pure: no browser objects.
//
// A path is the ids of the answers given, joined by a dot; 'begin' is the
// key before any answer.

export const KEY = Object.freeze({
  start: 'gezicht',
  questions: {
    gezicht: {
      text: 'Wat laat de muur zien?',
      help: 'Kijk naar een stuk muur zonder ramen, een paar lagen hoog. Een strek is de lange zijde van een steen, een kop de korte.',
      answers: [
        { id: 'strekken', text: 'Alleen strekken: de lange zijden van de stenen', drawing: 'halfsteensverband', next: 'verspringen' },
        { id: 'koppen', text: 'Alleen koppen: de korte zijden van de stenen', drawing: 'koppenverband', next: 'koppen' },
        { id: 'beide', text: 'Strekken en koppen in een vast patroon: dezelfde lagen keren steeds terug', drawing: 'kruisverband', next: 'lagen' },
        { id: 'wild', text: 'Strekken en koppen zonder vaste regel: geen twee lagen gelijk', drawing: 'wild-verband', bond: 'wild-verband' },
        { id: 'anders', text: 'Geen van deze', out: 'anders' },
      ],
    },
    verspringen: {
      text: 'Hoe ver verspringen de stootvoegen van laag tot laag?',
      help: 'De stootvoegen zijn de staande voegen tussen twee stenen in een laag.',
      answers: [
        { id: 'half', text: 'Een halve steen', drawing: 'halfsteensverband', bond: 'halfsteensverband' },
        { id: 'klezoor', text: 'Een klezoor: een kwart steen', drawing: 'klezoorverband', bond: 'klezoorverband' },
        { id: 'recht', text: 'Niet: de stootvoegen staan recht boven elkaar', out: 'stapelverband' },
      ],
    },
    koppen: {
      text: 'Hoe ver verspringen de koppen van laag tot laag?',
      help: 'De stootvoegen zijn de staande voegen tussen twee stenen in een laag.',
      answers: [
        { id: 'klezoor', text: 'Een klezoor: een kwart steen', drawing: 'koppenverband', bond: 'koppenverband' },
        { id: 'recht', text: 'Niet: de stootvoegen staan recht boven elkaar', out: 'stapelverband' },
      ],
    },
    lagen: {
      text: 'Hoe liggen de strekken en de koppen?',
      help: 'Een laag is een rij stenen van de ene horizontale voeg tot de volgende.',
      answers: [
        { id: 'om-en-om', text: 'Een laag met alleen strekken, dan een laag met alleen koppen, en zo verder', drawing: 'staand-verband', next: 'strekkenlagen' },
        { id: 'in-elke-laag', text: 'In elke laag strekken en koppen afgewisseld', drawing: 'vlaams-verband', next: 'tellen' },
        { id: 'koppenlagen', text: 'Een laag met alleen koppen, dan een laag met strekken en koppen om en om', drawing: 'hollands-verband', bond: 'hollands-verband' },
        { id: 'anders', text: 'Geen van deze', out: 'anders' },
      ],
    },
    strekkenlagen: {
      text: 'Liggen de stootvoegen van de strekkenlagen recht boven elkaar?',
      help: 'Vergelijk een strekkenlaag met de strekkenlaag twee lagen hoger.',
      answers: [
        { id: 'recht', text: 'Ja, recht boven elkaar', drawing: 'staand-verband', bond: 'staand-verband' },
        { id: 'verschoven', text: 'Nee, om de andere strekkenlaag een halve steen verschoven', drawing: 'kruisverband', bond: 'kruisverband' },
        { id: 'anders', text: 'Geen van deze', out: 'anders' },
      ],
    },
    tellen: {
      text: 'Hoeveel strekken liggen er in een laag tussen twee koppen?',
      help: 'Tel in een laag midden in de muur, niet aan de hoek.',
      answers: [
        { id: 'een', text: 'Een strek', drawing: 'vlaams-verband', bond: 'vlaams-verband' },
        { id: 'twee', text: 'Twee strekken', drawing: 'noords-verband', bond: 'noords-verband' },
        { id: 'drie', text: 'Drie strekken', drawing: 'engels-verband', bond: 'engels-verband' },
        { id: 'anders', text: 'Meer, of geen vast aantal', out: 'anders' },
      ],
    },
  },
});

export const BEGIN = 'begin';

// Where a path leads: the answers given, and the next question, the bond
// or the way out. null when the path does not exist.
export function walk(path, key = KEY) {
  if (path === BEGIN) return { trail: [], question: key.start, bond: null, out: null };
  if (typeof path !== 'string' || !path) return null;
  const trail = [];
  let question = key.start;
  let bond = null;
  let out = null;
  for (const id of path.split('.')) {
    if (!question) return null;
    const answer = key.questions[question].answers.find((a) => a.id === id);
    if (!answer) return null;
    trail.push({ question, answer });
    question = answer.next ?? null;
    bond = answer.bond ?? null;
    out = answer.out ?? null;
  }
  return { trail, question, bond, out };
}

export const isPath = (path, key = KEY) => walk(path, key) !== null;

// The path one answer further, and one answer back.
export function extend(path, answerId) {
  return path === BEGIN ? answerId : `${path}.${answerId}`;
}
export function back(path) {
  if (path === BEGIN || !path.includes('.')) return BEGIN;
  return path.slice(0, path.lastIndexOf('.'));
}

// Every bond the key ends on, with the shortest path to it.
export function leaves(key = KEY) {
  const out = new Map();
  const visit = (question, path) => {
    for (const a of key.questions[question].answers) {
      const p = path ? `${path}.${a.id}` : a.id;
      if (a.bond && (!out.has(a.bond) || out.get(a.bond).split('.').length > p.split('.').length)) out.set(a.bond, p);
      if (a.next) visit(a.next, p);
    }
  };
  visit(key.start, '');
  return out;
}

// The bonds still possible under a question.
export function remaining(question, key = KEY) {
  const out = new Set();
  const visit = (q) => {
    for (const a of key.questions[q].answers) {
      if (a.bond) out.add(a.bond);
      if (a.next) visit(a.next);
    }
  };
  if (question) visit(question);
  return [...out];
}
