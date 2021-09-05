const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {

  constructor(type){
    this.type = type;
  }

  translate(sentence, type){
    

    let vocabularies = sentence.split(' ');
    let vlength = vocabularies.length;

    //address last vocabulary with punctuation
    let endPunctuation = vocabularies[vlength - 1].slice(-1);
    vocabularies[vlength - 1] = vocabularies[vlength - 1].slice(0, -1);
    // console.log(vocabularies);

    let numberRe = new RegExp('^[\\d]+[\\:\\.][\\d\\:\\.]+$', 'i');
    let hlPrefix = '<span class="highlight">';
    let hlPostfix = '</span>';

    vocabularies.forEach((vocabulary, idx, arr) => {
      if(numberRe.test(vocabulary)){
        arr[idx] = hlPrefix + this.timeTranslator(vocabulary) + hlPostfix;
        return;
      }
      let lowerCaseWord = vocabulary.toLowerCase()


      if(this.type === 'american-to-british'){
          let titleVal = americanToBritishTitles[lowerCaseWord];
          if(titleVal !== undefined){
            arr[idx] = hlPrefix + titleVal[0].toUpperCase() + titleVal.substring(1) + hlPostfix;
          }

          let spellingVal = americanToBritishSpelling[lowerCaseWord];
          if(spellingVal !== undefined){
            arr[idx] = hlPrefix + spellingVal + hlPostfix;
          }

          let americanOnlyVal = americanOnly[lowerCaseWord];

          if(americanOnlyVal !== undefined){
            arr[idx] = hlPrefix + americanOnlyVal + hlPostfix;
          }


      }else if(this.type === 'british-to-american'){
          let titleVal = this.getKeyByValue(americanToBritishTitles, lowerCaseWord);
          if(titleVal !== undefined){
            
            arr[idx] = hlPrefix + titleVal[0].toUpperCase() + titleVal.substring(1)  + hlPostfix;
          } 
           
          let spellingVal = this.getKeyByValue(americanToBritishSpelling,  lowerCaseWord);
          if(spellingVal !== undefined){
            arr[idx] = hlPrefix + spellingVal + hlPostfix;
          }
          
          let britishOnlyVal = britishOnly[lowerCaseWord];

          if(britishOnlyVal !== undefined){
            arr[idx] = hlPrefix + britishOnlyVal + hlPostfix;
          }
      }

    })
    
    // console.log(vocabularies);

    let newSentence = vocabularies.join(' ');
    // console.log(newSentence);

    let lowerCaseSentence = newSentence.toLowerCase();
    let compoundKeys;
    let compoundDict;
    if(this.type === 'american-to-british'){
      compoundDict = americanOnly;
    }else if(this.type === 'british-to-american'){
      compoundDict = britishOnly;
    }

    compoundKeys = Object.keys(compoundDict).filter(key => key.indexOf(' ') != -1);
    compoundKeys.forEach((key, i)=> {
      let keyRe = new RegExp(`(?<=^|[.'"\\s])${key}(?=[.'"\\s]|$)`, 'gi')

      newSentence = newSentence.replace(keyRe, hlPrefix + compoundDict[key] + hlPostfix)
      // if(lowerCaseSentence.includes(key)){
      //   let startIdx = lowerCaseSentence.indexOf(key);
      //   let endIdx = startIdx + key.length;
      //   newSentence = newSentence.substring(0, startIdx)
      //     + hlPrefix + compoundDict[key] + hlPostfix + newSentence.substring(endIdx);
      // }
    });

    
    return newSentence + endPunctuation;
  }

  timeTranslator(time){
    if(!(time.includes(':')||time.includes('.'))){
      return time;
    }
    let idx;

    if(this.type === 'american-to-british'){
      idx = time.indexOf(':');
      return time.slice(0,idx) + "." + time.slice(idx+1)
    }else if(this.type === 'british-to-american'){
      idx = time.indexOf('.');
      return time.slice(0,idx) + ":" + time.slice(idx+1)
    }
    

  }

  getKeyByValue(object, val){
    return Object.keys(object).find(key => object[key] === val);
  }


}

module.exports = Translator;