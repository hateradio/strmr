import { slugify } from 'transliteration'

class Formatter {
    static pad = (num = 0) => num.toString().padStart(2, '0')

    static lower = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'for', 'from', 'in', 'into', 'near', 'nor', 'of', 'on', 'onto', 'or', 'the', 'to', 'with']

    static titleCase(word, index, last) {
        if (index === 0 || index === last) return word

        return Formatter.lower.find(s => s === word.toLowerCase()) || word
    }

    /**
     * @param {string} name Escapes a title
     */
    static escape = name => slugify(name.replace(/['"]/g, ''))
        .split('-')
        .map((s, i, a) => s ? Formatter.titleCase(s[0].toUpperCase() + s.slice(1), i, a.length - 1) : '')
        .join('.')

    static showTitle = name => name && name.trim() ? `.${Formatter.escape(name)}` : ''
}

export default Formatter