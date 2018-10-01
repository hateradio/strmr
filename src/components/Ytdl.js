import Formatter from '../Formatter'

class Ytdl {
    static make(state) {
        const { title, season, quality, episodes, episodeData, extras, subs, threads } = state

        const commands = episodeData.slice(0, episodes > 0 ? episodes : 0).filter(ep => ep).map(ep => {
            const { number, uri = '' } = ep

            let id = `S${Formatter.pad(season)}E${Formatter.pad(number)}`

            let subcmd = subs ? '--write-sub --sub-format ttml --convert-subtitles srt --embed-subs --merge-output-format mkv' : ''

            // --external-downloader aria2c --external-downloader-args "-c -j ${threads} -x ${threads} -s ${threads} -k 10M"
            // --external-downloader aria2c --external-downloader-args "-j 16 -s 16 -x 16 -k 5M"

            const cmd = `# ${id}\nyoutube-dl -f "bestvideo[height<=${quality.replace('p', '')}]+bestaudio/best[height<=${quality.replace('p', '')}]" ${subcmd} ${uri} -o "${Formatter.escape(title)}.${id}${Formatter.showTitle(ep.title)}.${quality}.${extras}.%(ext)s" --cookies cookies.txt`

            return cmd
        })

        return commands
    }

    static getFormatted(state) {
        return Ytdl.make(state).join('\n\n')
    }
}

export default Ytdl