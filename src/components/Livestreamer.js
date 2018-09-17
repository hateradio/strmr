import Formatter from '../Formatter'

class Livestreamer {
    static browserHeader = '--http-header "User-Agent=Mozilla/5.0 (Windows NT 10.0; WOW64; rv:60.0) Gecko/20100101 Firefox/60.0"'

    static browser = checked => checked ? ' ' + Livestreamer.browserHeader : ''

    static link = (link, protocol) => {
        if (protocol === 'hls')
            link = link.replace(/(?:https?:\/\/)/, '')

        return link
    }

    //Livestreamer.getCommand().join('\n\n') //.map((c, i) => (<div key={i}>{c}</div>))
    static make(state) {
        const { title, season, quality, episodes, protocol, episodeData, extras, browser, threads } = state

        const commands = episodeData.slice(0, episodes > 0 ? episodes : 0).filter(ep => ep).map(ep => {
            const { number, uri = '' } = ep

            let id = `S${Formatter.pad(season)}E${Formatter.pad(number)}`
            return `# ${id}\nlivestreamer${Livestreamer.browser(browser)} '${protocol}://${Livestreamer.link(uri, protocol)}' 'best' --hls-segment-threads ${threads} -f -o ${Formatter.escape(title)}.${id}${Formatter.showTitle(ep.title)}.${quality}.${extras}` //.replace(/(?:\w.m3u8)/g, 'i.m3u8')
        })

        return commands
    }

    static getFormatted(state) {
        return Livestreamer.make(state).join('\n\n')
    }
}

export default Livestreamer