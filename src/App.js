import React from 'react'
import jikanjs from 'jikanjs'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      animes: [],
      activeItem: 0
    }
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  enableKeyEvent() {
    document.addEventListener('keydown', this.onKeyDown, true)
  }

  disableKeyEvent() {
    document.removeEventListener('keydown', this.onKeyDown, true)
  }

  onKeyDown(e) {
    const { activeItem, animes } = this.state
    let newActiveItem = activeItem
    switch (e.keyCode) {
      case 37: // left
        if (activeItem !== 0) {
          newActiveItem -= 1
        }
        break

      case 39: // right
        if (activeItem < animes.length) {
          newActiveItem += 1
        }
        break

      case 40: // down
        if (activeItem < animes.length) {
          if (activeItem + 4 > animes.length) {
            newActiveItem = animes.length
          } else {
            newActiveItem += 4
          }
        }
        break
      case 38: // up
        if (activeItem < animes.length) {
          if (activeItem - 4 < 0) {
            newActiveItem = 0
          } else {
            newActiveItem -= 4
          }
        }
        break
      default:
        break
    }
    this.setState({ activeItem: newActiveItem })
  }

  componentDidMount () {
    jikanjs.loadSeasonLater()
      .then(res => {
        const animes = res.anime.map(anime => anime)
        this.setState({ animes })
      })
      .catch(console.error)

    this.enableKeyEvent()
  }

  componentWillUnmount () {
    this.disableKeyEvent()
  }

  tmpl ({ image_url = '', title = '', mal_id = '', type = '' }, index) {
    return (
      <div
        className={`poster-wrapper ${this.state.activeItem === index && 'poster-wrapper--active'}`}
        id={mal_id}
        key={mal_id}
      >
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

    return animes.filter(anime => anime.type === 'TV').map((anime, i) => this.tmpl(anime, i))
  }
}

export default App;
