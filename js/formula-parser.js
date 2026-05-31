/* === FORMULA PARSER === */
window.ChemParser = (function() {

  const ELEMENTS = [
    'H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar',
    'K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr',
    'Rb','Sr','Y','Zr','Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn','Sb','Te','I','Xe',
    'Cs','Ba','La','Ce','Pr','Nd','Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb','Lu',
    'Hf','Ta','W','Re','Os','Ir','Pt','Au','Hg','Tl','Pb','Bi','Po','At','Rn',
    'Fr','Ra','Ac','Th','Pa','U','Np','Pu','Am','Cm','Bk','Cf','Es','Fm','Md','No','Lr'
  ];
  const ELEM_SET = new Set(ELEMENTS.map(e => e.toLowerCase()));

  function tokenize(formula) {
    let tokens = [];
    let i = 0;
    while (i < formula.length) {
      let ch = formula[i];
      if (ch === '(' || ch === ')' || ch === '[' || ch === ']') {
        tokens.push({ type: 'paren', value: ch });
        i++;
      } else if (ch >= 'A' && ch <= 'Z') {
        let start = i;
        i++;
        while (i < formula.length && formula[i] >= 'a' && formula[i] <= 'z') i++;
        let sym = formula.slice(start, i);
        if (ELEM_SET.has(sym.toLowerCase())) {
          tokens.push({ type: 'element', value: sym });
        } else {
          return null; // unknown element
        }
      } else if (ch >= '0' && ch <= '9') {
        let start = i;
        while (i < formula.length && formula[i] >= '0' && formula[i] <= '9') i++;
        tokens.push({ type: 'number', value: parseInt(formula.slice(start, i)) });
      } else {
        return null; // invalid char
      }
    }
    return tokens;
  }

  // Parse tokens into element -> count map
  // Grammar: group = ( element | '(' group ')' ) number?
  let pos, tokens;

  function parseGroup() {
    let counts = {};
    while (pos < tokens.length) {
      let tok = tokens[pos];
      if (tok.type === 'paren' && (tok.value === ')' || tok.value === ']')) break;
      if (tok.type === 'element') {
        pos++;
        let num = 1;
        if (pos < tokens.length && tokens[pos].type === 'number') {
          num = tokens[pos].value;
          pos++;
        }
        counts[tok.value] = (counts[tok.value] || 0) + num;
      } else if (tok.type === 'paren' && (tok.value === '(' || tok.value === '[')) {
        pos++;
        let inner = parseGroup();
        if (pos < tokens.length && tokens[pos].type === 'paren' && (tokens[pos].value === ')' || tokens[pos].value === ']')) {
          pos++;
        } else {
          return null;
        }
        let num = 1;
        if (pos < tokens.length && tokens[pos].type === 'number') {
          num = tokens[pos].value;
          pos++;
        }
        for (let el in inner) {
          counts[el] = (counts[el] || 0) + inner[el] * num;
        }
      } else {
        break;
      }
    }
    return counts;
  }

  function parseFormula(formula) {
    if (!formula || typeof formula !== 'string') return null;
    formula = formula.trim();
    if (!formula) return null;
    tokens = tokenize(formula);
    if (!tokens) return null;
    pos = 0;
    let result = parseGroup();
    if (pos !== tokens.length) return null;
    return result;
  }

  // Smart case normalization: uppercase first letter of each element,
  // then check if first+second letter forms a valid element; if not,
  // capitalize the second letter as a separate element.
  function normalizeCase(input) {
    let result = '';
    let i = 0;
    function isLetter(c) { return (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z'); }
    while (i < input.length) {
      let ch = input[i];
      if (ch >= 'A' && ch <= 'Z') {
        result += ch;
        i++;
        if (i < input.length && input[i] >= 'a' && input[i] <= 'z') {
          // Check if 2-letter combo is a valid element
          let twoLetter = result[result.length - 1] + input[i];
          if (ELEM_SET.has(twoLetter.toLowerCase())) {
            result += input[i];
            i++;
          } else {
            // Not a valid 2-letter element, so this is a new element
            result += input[i].toUpperCase();
            i++;
          }
        }
      } else if (ch >= 'a' && ch <= 'z') {
        result += ch.toUpperCase();
        i++;
        if (i < input.length && input[i] >= 'a' && input[i] <= 'z') {
          let prev = result[result.length - 1];
          let twoLetter = prev + input[i];
          if (ELEM_SET.has(twoLetter.toLowerCase())) {
            result += input[i];
            i++;
          } else {
            result += input[i].toUpperCase();
            i++;
          }
        }
      } else {
        result += ch;
        i++;
      }
    }
    return result;
  }

  // Compare two parsed formulas (element count maps)
  function countsEqual(a, b) {
    if (!a || !b) return false;
    let keysA = Object.keys(a), keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (let k of keysA) {
      if (a[k] !== b[k]) return false;
    }
    return true;
  }

  // Check if input matches expected formula (strict ordering: cation then anion)
  function checkFormula(input, expected) {
    if (!input || !expected) return false;
    let normalized = normalizeCase(input);
    let expectedNorm = normalizeCase(expected);
    return normalized === expectedNorm;
  }

  // Canonicalize: parse and rebuild formula string
  function canonFormula(input) {
    let parsed = parseFormula(input);
    if (!parsed) return null;
    let elements = Object.keys(parsed).sort();
    return elements.map(el => el + (parsed[el] > 1 ? parsed[el] : '')).join('');
  }

  return {
    parseFormula,
    normalizeCase,
    checkFormula,
    canonFormula,
    countsEqual
  };
})();
