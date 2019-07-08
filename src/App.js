import React, { Component } from 'react';
import Episode from './components/Episode'
import Form, {downloaders} from './components/Form'
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
    subs: 0,
    browser: false,
    downloader: 'youtube-dl',
    log: false
  }

  constructor(props) {
    super(props)

    this.state = this.initialState
  }

  loadStorage() {
    const saved = JSON.parse(localStorage.getItem('streamer'))
    const state = saved ? { ...this.initialState, ...saved } : this.initialState
    this.setState(state)
  }

  saveStorage = () => {
    localStorage.setItem('streamer', JSON.stringify(this.state))
  }

  componentDidMount() {
    this.loadStorage()
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.saveStorage);
    this.saveStorage()
  }

  /**
   * @param {string} property
   */
  inputToState = property => {
    return e => {
      const { type, checked, value } = e.target
      this.setState({
        [property]: type === 'checkbox' ? checked : value
      }, this.saveStorage)
    }
  }

  episodeToState = episode => {
    const update = [...this.state.episodeData]
    update[episode.id] = episode
    this.setState({episodeData: update}, this.saveStorage)
  }

  episodeDelete = index => {
    let copy = [...this.state.episodeData]
    delete copy[index]
    copy.splice(index, 1)

    console.log('episodeDelete')
    this.setState({episodeData: copy}) // this.saveStorage
  }

  render() {
    const { episodes, episodeData, downloader } = this.state

    const commands = downloaders[downloader].getRaw(this.state)

    // console.log(commands)

    console.log('render', episodeData)

    const episodeInputs = Array(+episodes).fill(1).map((e, i) => {
      const d = episodeData[i] || {}
      return <Episode key={i} id={i} title={d.title} number={d.number || (i + 1)} uri={d.uri} update={this.episodeToState} delete={this.episodeDelete.bind(this)} />
    })

    console.log('imps', episodeInputs)

    return (<React.Fragment>
      <div className="callout large primary">
        <div className="column text-center">
          <h1>Streamer</h1>
          <h2>For your viewing pleasure</h2>
        </div>
      </div>
      <div className="grid-container">
        <div className="row">
          <Form inputToState={this.inputToState} {...this.state} />
        </div>

        <div className="row">
          <h3>Episodes</h3>
          {episodeInputs}
        </div>
        <div className="row">
          {commands.download.length > 0 ? <h3>Command</h3> : ''}
          <div className="columns small-12">
            <h4>Download</h4>
            {commands.download.map((_, i) => {
              return (<React.Fragment key={i}>
                <h5>{_.title}</h5>
                <textarea onClick={e => e.target.select()} defaultValue={_.cmd}></textarea>
                </React.Fragment>)
            })}

            <h4>MKV</h4>
            {commands.mkv.map((_, i) => {
              return (<React.Fragment key={i}>
                <h5>{_.title}</h5>
                <textarea onClick={e => e.target.select()} defaultValue={_.cmd}></textarea>
                </React.Fragment>)
            })}
          </div>
        </div>
      </div>
    </React.Fragment>);
  }
}

export default App;
