import React, { Component } from 'react';
import Episode from './components/Episode'
import Selector from './components/Selector'
import Command from './components/Command'
import './App.css';

class App extends Component {
  initialState = {
    title: 'temp',
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

  constructor(props) {
    super(props)

    const saved = JSON.parse(localStorage.getItem('streamer'))

    this.state = saved ? {
      ...this.initialState,
      ...saved
    } : this.initialState
  }

  componentDidUpdate() {
    localStorage.setItem('streamer', JSON.stringify(this.state))
  }

  /**
   * @param {string} property
   */
  inputToState = property => {
    return e => {
      const { type, checked, value } = e.target
      this.setState({
        [property]: type === 'checkbox' ? checked : value
      })
    }
  }

  episodeToState = episode => {
    const update = [...this.state.episodeData]
    update[episode.id] = episode
    this.setState({
      episodeData: update
    })
  }

  render() {
    const { title, season, quality, episodes, protocol, threads, extras, episodeData, browser } = this.state

    const seasons = Array(20).fill(1).map((e, i) => i + 1)

    const commands = Command.getFormatted(this.state)

    const episodeInputs = Array(+episodes).fill(1).map((e, i) => {
      const d = episodeData[i] || {}
      return <Episode key={i} id={i} title={d.title} number={d.number || (i + 1)} uri={d.uri} update={this.episodeToState} />
    })

    return (<React.Fragment>
      <div className="callout large primary">
        <div className="row column text-center">
          <h1>Livestreamer</h1>
          <h2>For your viewing pleasure</h2>
        </div>
      </div>
      <div className="grid-container">
        <div className="grid-x grid-margin-x">
          <div className="cell small-7">
            <label>Show Name
              <input id="title" type="text" placeholder="Show" onChange={this.inputToState('title')} defaultValue={title} />
            </label>
          </div>
          <div className="cell small-5">
            <label>Extras/Extension
              <input id="name" type="text" placeholder="name" onChange={this.inputToState('extras')} defaultValue={extras} />
            </label>
          </div>

          <div className="cell small-1">
            <Selector label="Season" onChange={this.inputToState('season')} list={seasons} defaultValue={season} />
          </div>
          <div className="cell small-1">
            <label>Episodes
                <input id="episodes" placeholder="#" defaultValue={episodes} type="number" onChange={this.inputToState('episodes')} />
            </label>
          </div>
          <div className="cell small-2">
            <Selector label="Quality" onChange={this.inputToState('quality')} list={['720p', '1080p']} defaultValue={quality} />
          </div>
          <div className="cell small-3">
            <Selector label="Protocol" onChange={this.inputToState('protocol')} list={App.protocols} defaultValue={protocol} />
          </div>
          <div className="cell small-2">
            <label>Threads
                <input id="threads" placeholder="#" defaultValue={threads} type="number" onChange={this.inputToState('threads')} />
            </label>
          </div>
          <div className="cell small-3">
            <input id="browser" type="checkbox" onChange={this.inputToState('browser')} defaultChecked={browser} />
            <label htmlFor="browser">Browser Header</label>
          </div>
        </div>

        <h3>Episodes</h3>
        <div className="grid-x grid-margin-x">
          {episodeInputs}
        </div>
        {commands.length > 0 ? <h3>Command</h3> : ''}
        <div className="grid-x grid-margin-x">
          <div className="cell small-12">
            <textarea id="out" style={{ fontFamily: "'Lucida Mono', 'Courier New', Courier, monospace", height: '500px' }} defaultValue={commands} />
          </div>
        </div>
      </div>
    </React.Fragment>);
  }
}

export default App;
