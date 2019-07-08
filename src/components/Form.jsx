import React from 'react';

import Livestreamer from './Livestreamer'
import Ytdl from './Ytdl'
import Selector from './Selector'

export const downloaders = {livestreamer: Livestreamer, 'youtube-dl': Ytdl}

const protocols = ['akamaihd', 'hds', 'hls', 'hlsvariant', 'httpstream', 'rtmp', 'rtmpe', 'rtmps', 'rtmpt', 'rtmpte']


const Form = props => {

    const { title, season, quality, episodes, protocol, threads, extras, browser, downloader, log, subs, inputToState } = props

    const seasons = Array(20).fill(1).map((e, i) => i + 1)

    return (<React.Fragment>
        <h3>Settings</h3>
        <div className="columns small-2">
          <Selector label="Downloader" onChange={inputToState('downloader')} list={Object.keys(downloaders)} value={downloader} />
        </div>
        <div className="columns small-5">
          <label>Show Name
            <input id="title" type="text" placeholder="Show" onChange={inputToState('title')} value={title} />
          </label>
        </div>
        <div className="columns small-5">
          <label>Extras/Extension
            <input id="name" type="text" placeholder="name" onChange={inputToState('extras')} value={extras} />
          </label>
        </div>

        <div className="columns small-1">
          <Selector label="Season" onChange={inputToState('season')} list={seasons} value={season} />
        </div>
        <div className="columns small-1">
          <label>Episodes
              <input id="episodes" placeholder="#" value={episodes} type="number" onChange={inputToState('episodes')} />
          </label>
        </div>
        <div className="columns small-2">
          <Selector label="Quality" onChange={inputToState('quality')} list={['720p', '1080p']} value={quality} />
        </div>
        <div className="columns small-3">
          <Selector label="Protocol" onChange={inputToState('protocol')} list={protocols} value={protocol} />
        </div>
        <div className="columns small-2">
          <label>Threads
              <input id="threads" placeholder="#" value={threads} type="number" onChange={inputToState('threads')} />
          </label>
        </div>
        <div className="columns small-3">
          <input id="subs" type="checkbox" onChange={inputToState('subs')} checked={subs} />
          <label htmlFor="subs">Subtitles</label>
        </div>
        <div className="columns small-3">
          <input id="browser" type="checkbox" onChange={inputToState('browser')} checked={browser} />
          <label htmlFor="browser">Browser Header</label>
        </div>
        <div className="columns small-3">
          <input id="log" type="checkbox" onChange={inputToState('log')} checked={log} />
          <label htmlFor="log">Save to log</label>
        </div>
    </React.Fragment>)
}

export default Form