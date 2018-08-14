import Command from './Command'

class CommandYtdl {
    static make(state) {
        const { title, season, quality, episodes, episodeData, extras, subs, threads } = state

        const commands = episodeData.slice(0, episodes > 0 ? episodes : 0).filter(ep => ep).map(ep => {
            const { number, uri = '' } = ep

            let id = `S${Command.pad(season)}E${Command.pad(number)}`

            let subcmd = subs ? '--write-sub --sub-format ttml --convert-subtitles srt --embed-subs --merge-output-format mkv' : ''

            // --external-downloader aria2c --external-downloader-args "-c -j ${threads} -x ${threads} -s ${threads} -k 10M"

            const cmd = `# ${id}\nyoutube-dl -f "bestvideo[height<=${quality.replace('p', '')}]+bestaudio/best[height<=${quality.replace('p', '')}]" ${subcmd} --cookies cookies.txt ${uri} -o "${Command.escape(title)}.${id}${Command.showTitle(ep.title)}.${quality}.${extras}.%(ext)s"`

            return cmd
        })

        return commands
    }

    static getFormatted(state) {
        return CommandYtdl.make(state).join('\n\n')
    }
}

export default CommandYtdl