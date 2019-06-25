import Formatter from '../Formatter'

class Ytdl {
    static make(state) {
        const { title, season, quality, episodes, episodeData, extras, subs, log } = state

        const download = episodeData.slice(0, episodes > 0 ? episodes : 0).filter(ep => ep).map(ep => {
            const { number, uri = '' } = ep

            let id = `S${Formatter.pad(season)}E${Formatter.pad(number)}`

            let subcmd = subs ? '--write-sub --sub-format ttml --convert-subtitles srt --embed-subs --merge-output-format mkv' : ''

            const epCmd = `${Formatter.escape(title)}.${id}${Formatter.showTitle(ep.title)}.${quality}.${extras}`

            const cmd = `youtube-dl -f "bestvideo[height<=${quality.replace('p', '')}]+bestaudio/best[height<=${quality.replace('p', '')}]" ${subcmd} ${uri} -o "${epCmd}.%(ext)s" --cookies cookies.txt ${log ? '&> ytdl.log' : ''}`.trim()

            return {title: `# ${id}`, cmd}
        })

        const mkv = episodeData.slice(0, episodes > 0 ? episodes : 0).filter(ep => ep).map(ep => {
            const { number } = ep

            let id = `S${Formatter.pad(season)}E${Formatter.pad(number)}`
            const name = `${Formatter.escape(title)}.${id}${Formatter.showTitle(ep.title)}.${quality}.${extras}`

            return {title: `# ${id}`, name}
        })

        return {download, mkv}
    }

    static windows(mkv) {
        return {
            title: mkv.title,
            cmd: `"C:\\Program Files\\MKVToolNix\\mkvmerge.exe" --ui-language en --output ^"${mkv.name}.mkv^" --language 0:eng --default-track 0:no ^"^(^" ^"${mkv.name}.srt^" ^"^)^" --language 0:eng --language 1:eng --default-track 1:yes ^"^(^" ^"${mkv.name}.mp4^" ^"^)^" --track-order 1:0,1:1,0:0`
        }
    }

    static nix(title) {
        return `mkvmerge --ui-language en --output '${title}.mkv' --language 0:eng --default-track 0:yes --language 1:eng --default-track 1:yes --sub-charset 2:UTF-8 --language 2:eng '(' '${title}.mkv' ')' --track-order 0:0,0:1,0:2`
    }

    static getRaw(state) {
        const cms = Ytdl.make(state)
        cms.mkv = cms.mkv.map(Ytdl.windows)
        return cms
    }

    static getFormatted(state) {
        const cmds = Ytdl.make(state)
        return cmds.download.join('\n\n') + '\n\n' + cmds.mkv.map(Ytdl.windows).join('\n\n')
    }
}

export default Ytdl