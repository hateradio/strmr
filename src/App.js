import React, { Component } from 'react';
import Episode from './components/Episode'
import Selector from './components/Selector'
import { slugify } from 'transliteration';
import './App.css';

class App extends Component {
  initialState = {
    show: 'temp',
    season: 1,
    quality: '720p',
    episodes: 1,
    protocol: '',
    threads: 1,
    extras: '',
    episodeData: [],
    browser: false
  }

  static protocols = ['akamaihd', 'hds', 'hls', 'hlsvariant', 'httpstream', 'rtmp', 'rtmpe', 'rtmps', 'rtmpt', 'rtmpte']

  static browser = '--http-header "User-Agent=Mozilla/5.0 (Windows NT 10.0; WOW64; rv:60.0) Gecko/20100101 Firefox/60.0"'

  constructor(props) {
    super(props)

    const saved = JSON.parse(localStorage.getItem('streamer'))

    this.state = saved ? {
      ...this.initialState,
      ...saved
    } : this.initialState
  }

  pad(num = 0) {
    return (num).toString().padStart(2, '0')
  }

  /**
   * @param {string} name A name to clean up
   */
  escapeName = (name) => {
    const esc = slugify(name)
      .trim()
      .split('-')
      .map(s => s ? s[0].toUpperCase() + s.slice(1) : '')
      .join('.')
    return esc
  }

  getCommand = () => {
    const { show, season, quality, episodes, protocol, episodeData, extras, browser, threads } = this.state

    const titles = episodeData.slice(0, episodes >= 0 ? episodes : 0).map((ep) => {
      if (!ep) {
        return ''
      }
      const { number, title, uri = '' } = ep
      let t = title && title.trim() ? `.${this.escapeName(title)}` : ''
      let link = uri

      if (protocol === 'hls')
        link = uri.replace(/(?:https?:\/\/)/, '')
      // debugger
      let browserCmd = browser ? App.browser : ''

      let id = `S${this.pad(season)}E${this.pad(number)}`
      return `# ${id}\nlivestreamer ${browserCmd} "${protocol}://${link.trim()}" "best" --hls-segment-threads ${threads} -f -o ${this.escapeName(show)}.${id}${t}.${quality}.${extras}`.replace(/(?:\w.m3u8)/g, 'i.m3u8')
    })

    return titles
  }

  componentDidUpdate() {
    localStorage.setItem('streamer', JSON.stringify(this.state))
  }

  /**
   * @param {string} property
   */
  inputToState = (property) => {
    return e => {
      const { type, checked, value } = e.target
      this.setState({
        [property]: type === 'checkbox' ? checked : value
      })
    }
  }

  episodeState = (ep) => {
    const update = [...this.state.episodeData]
    update[ep.id] = ep
    this.setState({
      episodeData: update
    })
  }

  render() {
    const { show, season, quality, episodes, protocol, threads, extras, episodeData, browser } = this.state

    const seasons = Array(20).fill(1).map((e, i) => i + 1)

    const commands = this.getCommand().join('\n\n') //.map((c, i) => (<div key={i}>{c}</div>))

    const episodeInputs = Array(+episodes).fill(1).map((e, i) => {
      const d = episodeData[i] || {}
      return <Episode key={i} id={i} title={d.title} number={d.number || (i + 1)} uri={d.uri} update={this.episodeState} />
    })

    return (<React.Fragment>
      <div className="App">
        <h1>Livestreamer</h1>
        <div>
          <label>Show Name:
            <input id="name" placeholder="name" onChange={this.inputToState('show')} defaultValue={show} />
          </label>
        </div>
        <div>
          <Selector label="Season" onChange={this.inputToState('season')} list={seasons} defaultValue={season} />
        </div>
        <div>
          <Selector label="Quality" onChange={this.inputToState('quality')} list={['720p', '1080p']} defaultValue={quality} />
        </div>
        <div>
          <label>Extras/Extension:
            <input id="name" placeholder="name" onChange={this.inputToState('extras')} defaultValue={extras} />
          </label>
        </div>
        <label>Browser:
            <input id="name" type="checkbox" onChange={this.inputToState('browser')} defaultChecked={browser} />
        </label>
        <div>
          <Selector label="Protocol" onChange={this.inputToState('protocol')} list={App.protocols} defaultValue={protocol} />
        </div>
        <div>
          <label>Threads:
              <input id="episodes" placeholder="#" defaultValue={threads} type="number" onChange={this.inputToState('threads')} />
          </label>
        </div>
        <div>
          <label>Episodes:
              <input id="episodes" placeholder="#" defaultValue={episodes} type="number" onChange={this.inputToState('episodes')} />
          </label>
        </div>
        <h2>Episode Data</h2>
        {episodeInputs}
      </div>
      {commands.length > 0 ? <h1>Command (replacing [fghi] to i)</h1> : ''}
      <textarea id="out" style={{ fontFamily: "'Lucida Mono', 'Courier New', Courier, monospace", width: '95%', height: '500px' }} defaultValue={commands} value={commands} />
    </React.Fragment>);
  }
}

export default App;
