import React from 'react'
import jikanjs from 'jikanjs'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      animes: [],
      activeItem: 0,
      wrapperStyle: { marginTop: 0 }
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
        if (activeItem > 0) {
          newActiveItem -= 1
        }
        break

      case 39: // right
        if (activeItem + 1 < animes.length) {
          newActiveItem += 1
        }
        break

      case 40: // down
        this.animate(40)
        newActiveItem = (activeItem + 4 > animes.length)
          ? animes.length - 1
          : activeItem + 4
        break
      case 38: // up
        this.animate(38)
        newActiveItem = (activeItem - 4 < 0)
          ? 0
          : activeItem - 4
        break
      default:
        break
    }
    this.setState({ activeItem: newActiveItem })
  }

  componentDidMount () {
    jikanjs.loadSeasonLater()
      .then(res => {
        const animes = res.anime.filter(anime => anime.type === 'TV')
        this.setState({ animes })
      })
      .catch(console.error)

    this.enableKeyEvent()
  }

  componentWillUnmount () {
    this.disableKeyEvent()
  }

  animate(keyCode) {
    if (keyCode === 40) {
      this.setState(prevState => ({
        wrapperStyle: {
          marginTop: `${parseInt(prevState.wrapperStyle.marginTop, 10) - 390}px`,
        }
      }))
    }

    if (keyCode === 38) {
      this.setState(prevState => ({
        wrapperStyle: {
          marginTop: `${parseInt(prevState.wrapperStyle.marginTop, 10) + 390}px`,
        }
      }))
    }
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
    const { animes, wrapperStyle } = this.state

    return (
      <div className="wrapper" style={wrapperStyle}>
        {
          animes.map((anime, i) => this.tmpl(anime, i))
        }
      </div>
    )
  }
}

export default App;
