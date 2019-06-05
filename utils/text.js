/**
 * Text Util
 */

/* https://gist.github.com/codeguy/6684588 */
export function stringToSlug(str) {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from = 'åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;'
  const to = 'aaaaaaeeeeiiiioooouuuunc------'

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-+/, '') // trim - from start of text
    .replace(/-+$/, '') // trim - from end of text

  return str
}

export function insertLines(str, noOfWords = 3) {
  const a_split = str.split(' ')
  let res = ''
  for (let i = 0; i < a_split.length; i++) {
    res += a_split[i] + ' '
    if ((i + 1) % noOfWords === 0) res += '\n'
  }
  return res
}
