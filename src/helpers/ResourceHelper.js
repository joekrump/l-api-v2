/**
 * A helper with methods related to resources
 */


export function pluralizeName(wordToPluralize){
  if(wordToPluralize === undefined || wordToPluralize.length === 0) {
    return ''
  } else {
    wordToPluralize = wordToPluralize.toLowerCase();
    switch(wordToPluralize){
      case 'user': 
        return 'users'
      case 'book': 
        return 'books'
      default: {
        if(wordToPluralize[wordToPluralize.length - 1] === 'y'){
          return wordToPluralize.slice(0, -1) + 'ies'
        } else {
          return wordToPluralize + 's'
        }
      }
    }
  }
}


export function singularizeName(wordToSingularize){
  if(wordToSingularize === undefined || wordToSingularize.length === 0) {
    return ''
  } else {
    wordToSingularize = wordToSingularize.toLowerCase();
    switch(wordToSingularize){
      case 'users': 
        return 'user'
      case 'books': 
        return 'book'
      default: {
        var lastThreeChars = pluralName.slice(-3).toLowerCase();

        if(lastThreeChars === 'ies') {
          return pluralName.slice(0, -3) + 'y'
        } else {
          return wordToSingularize.slick(0, -1)
        }
      }
    }
  }
}