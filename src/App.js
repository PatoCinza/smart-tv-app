import React from 'react'
import jikanjs from 'jikanjs'
import ReactDOM from 'react-dom'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      animes: []
    }
  }

  componentDidMount () {
    jikanjs.loadSeasonLater()
      .then(res => {
        const animes = res.anime.map(anime => anime)
        this.setState({ animes })
      })
      .catch(console.error)
  }

  tmpl ({ image_url = '', title = '', mal_id = '', type = '' }) {
    return (
      <div className="poster-wrapper" id={mal_id} key={mal_id}>
        <figure>
          <span>{type}</span>
          <img src={image_url} alt={title} />
          <p>{title}</p>
        </figure>
      </div>
    )
  }

  render () {
    let animes = this.state.animes

    return animes.filter(anime => anime.type === 'TV').map(this.tmpl)
  }
}

export default App;
