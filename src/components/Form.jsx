import React from 'react';

import Livestreamer from './Livestreamer'
import Ytdl from './Ytdl'
import Selector from './Selector'

export const downloaders = {livestreamer: Livestreamer, 'youtube-dl': Ytdl}

const protocols = ['akamaihd', 'hds', 'hls', 'hlsvariant', 'httpstream', 'rtmp', 'rtmpe', 'rtmps', 'rtmpt', 'rtmpte']


const Form = props => {

    const { title, season, quality, episodes, protocol, threads, extras, browser, downloader, log } = props


    const seasons = Array(20).fill(1).map((e, i) => i + 1)

    return (<React.Fragment>
        <h3>Settings</h3>
        <div className="columns small-2">
          <Selector label="Downloader" onChange={props.inputToState('downloader')} list={Object.keys(downloaders)} defaultValue={downloader} />
        </div>
        <div className="columns small-5">
          <label>Show Name
            <input id="title" type="text" placeholder="Show" onChange={props.inputToState('title')} defaultValue={title} />
          </label>
        </div>
        <div className="columns small-5">
          <label>Extras/Extension
            <input id="name" type="text" placeholder="name" onChange={props.inputToState('extras')} defaultValue={extras} />
          </label>
        </div>

        <div className="columns small-1">
          <Selector label="Season" onChange={props.inputToState('season')} list={seasons} defaultValue={season} />
        </div>
        <div className="columns small-1">
          <label>Episodes
              <input id="episodes" placeholder="#" defaultValue={episodes} type="number" onChange={props.inputToState('episodes')} />
          </label>
        </div>
        <div className="columns small-2">
          <Selector label="Quality" onChange={props.inputToState('quality')} list={['720p', '1080p']} defaultValue={quality} />
        </div>
        <div className="columns small-3">
          <Selector label="Protocol" onChange={props.inputToState('protocol')} list={protocols} defaultValue={protocol} />
        </div>
        <div className="columns small-2">
          <label>Threads
              <input id="threads" placeholder="#" defaultValue={threads} type="number" onChange={props.inputToState('threads')} />
          </label>
        </div>
        <div className="columns small-3">
          <input id="subs" type="checkbox" onChange={props.inputToState('subs')} defaultChecked={browser} />
          <label htmlFor="subs">Subtitles</label>
        </div>
        <div className="columns small-3">
          <input id="browser" type="checkbox" onChange={props.inputToState('browser')} defaultChecked={browser} />
          <label htmlFor="browser">Browser Header</label>
        </div>
        <div className="columns small-3">
          <input id="log" type="checkbox" onChange={props.inputToState('log')} defaultChecked={log} />
          <label htmlFor="log">Save to log</label>
        </div>
    </React.Fragment>)
}

export default Form