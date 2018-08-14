import { slugify } from 'transliteration';

class Command {
    static browserHeader = '--http-header "User-Agent=Mozilla/5.0 (Windows NT 10.0; WOW64; rv:60.0) Gecko/20100101 Firefox/60.0"'

    static pad = (num = 0) => num.toString().padStart(2, '0')

    static lower = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'for', 'from', 'in', 'into', 'near', 'nor', 'of', 'on', 'onto', 'or', 'the', 'to', 'with']

    static titleCase(word, index, last) {
        if (index === 0 || index === last) return word

        return Command.lower.find(s => s === word.toLowerCase()) || word
    }

    /**
     * @param {string} name Escapes a title
     */
    static escape = name => slugify(name.replace(/['"]/g, ''))
        .split('-')
        .map((s, i, a) => s ? Command.titleCase(s[0].toUpperCase() + s.slice(1), i, a.length - 1) : '')
        .join('.')

    static showTitle = name => name && name.trim() ? `.${Command.escape(name)}` : ''

    static browser = checked => checked ? ' ' + Command.browserHeader : ''

    static link = (link, protocol) => {
        if (protocol === 'hls')
            link = link.replace(/(?:https?:\/\/)/, '')

        return link
    }

    //Command.getCommand().join('\n\n') //.map((c, i) => (<div key={i}>{c}</div>))
    static make(state) {
        const { title, season, quality, episodes, protocol, episodeData, extras, browser, threads } = state

        const commands = episodeData.slice(0, episodes > 0 ? episodes : 0).filter(ep => ep).map(ep => {
            const { number, uri = '' } = ep

            let id = `S${Command.pad(season)}E${Command.pad(number)}`
            return `# ${id}\nlivestreamer${Command.browser(browser)} '${protocol}://${Command.link(uri, protocol)}' 'best' --hls-segment-threads ${threads} -f -o ${Command.escape(title)}.${id}${Command.showTitle(ep.title)}.${quality}.${extras}` //.replace(/(?:\w.m3u8)/g, 'i.m3u8')
        })

        return commands
    }

    static getFormatted(state) {
        return Command.make(state).join('\n\n')
    }
}

export default Command