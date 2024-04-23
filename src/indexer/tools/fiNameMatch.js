const synonyms = {
  'the': '',
  'of': '',
  'bank': '',
  '&': 'and',
  'cu': 'creditunion',
  'fcu': 'federal credit union',
  '1st': 'first',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
  '10': 'ten',
  'AL': 'alabama',
  'KY': 'kentucky',
  'OH': 'ohio',
  'AK': 'alaska',
  'LA': 'louisiana',
  'OK': 'oklahoma',
  'AZ': 'arizona',
  'ME': 'maine',
  'OR': 'oregon',
  'AR': 'arkansas',
  'MD': 'maryland',
  'PA': 'pennsylvania',
  'AS': 'american samoa',
  'MA': 'massachusetts',
  'PR': 'puerto rico',
  'CA': 'california',
  'MI': 'michigan',
  'RI': 'rhode island',
  'CO': 'colorado',
  'MN': 'minnesota',
  'SC': 'south carolina',
  'CT': 'connecticut',
  'MS': 'mississippi',
  'SD': 'south dakota',
  'DE': 'delaware',
  'MO': 'missouri',
  'TN': 'tennessee',
  'DC': 'district of columbia',
  'MT': 'montana',
  'TX': 'texas',
  'FL': 'florida',
  'NE': 'nebraska',
  'TT': 'trust territories',
  'GA': 'georgia',
  'NV': 'nevada',
  'UT': 'utah',
  'GU': 'guam',
  'NH': 'new hampshire',
  'VT': 'vermont',
  'HI': 'hawaii',
  'NJ': 'new jersey',
  'VA': 'virginia',
  'ID': 'idaho',
  'NM': 'new mexico',
  'VI': 'virgin islands',
  'IL': 'illinois',
  'NY': 'new york',
  'WA': 'washington',
  'IN': 'indiana',
  'NC': 'north carolina',
  'WV': 'west virginia',
  'IA': 'iowa',
  'ND': 'north dakota',
  'WI': 'wisconsin',
  'KS': 'kansas',
  'MP': 'northern mariana islands',
  'WY': 'wyoming',
}

function normalize(src){
  const arrSrc = src.replaceAll('-', ' ').split(' ').map(item => item.trim()).filter(item => item);
  const arr = []
  for(let word of arrSrc){
    let s = false;
    for(let [k,v] of Object.entries(synonyms)){
      if(word === k || word.toLowerCase() === k){
        s = true;
        arr.push(v);
        break;
      }
    }
    if(!s){
      arr.push(word)
    }
  }
  return arr.join('').replaceAll(' ', '').toLowerCase();
}

function match(src, dst){
  return normalize(src) === normalize(dst)
}

module.exports = match;

console.log(match('hehe FCU', 'hehe Federal Credit Union'))
console.log(match('The hehe FCU', 'hehe Federal Credit Union'))
console.log(match('The hehe FCU', 'hehe of Federal Credit Union'))