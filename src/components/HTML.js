import React from 'react'
import Button from './Button'
import AceEditor from 'react-ace'
import 'brace/mode/html'
import 'brace/theme/terminal'
import { Container, Segment } from 'semantic-ui-react'
const SpeechRecognition = window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

recognition.continous = true
recognition.interimResults = false
recognition.lang = 'en-US'

class HTML extends React.Component {
  state = {
    listening: false,
    content: ``,
    jsxArray: [],
    backgroundColor: 'white',
    keywords: [],
    structure: null,
    textColor: null,
    justifyContent: null,
    flexDirection: null,
    flexWrap: null,
    understood: true,
    showingSavedDisplay: false,
    selectedYouTubeVideos: []
  }

  onChange = event => {
    this.setState({ content: event })
    this.setState({ showingSavedDisplay: false })
  }

  handleListen = () => {
    this.setState({ showingSavedDisplay: false })

    if (this.state.listening) {
      recognition.start()
      recognition.onend = () => {
        // recognition.start()
        this.setState({ listening: false })
      }
    } else {
      recognition.stop()
      recognition.onend = () => {}
    }

    recognition.onstart = () => {}

    let finalTranscript = ''
    recognition.onresult = event => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        }
      }

      // if (Soundex('for loop')=== Soundex('phone')) {
      // } else {
      // }
      // this.addContentToState(completeTranscript)
      this.addContentToState(finalTranscript)
    }
  }
  toggleListen = () => {
    this.setState(
      {
        listening: !this.state.listening
      },
      this.handleListen
    )
  }

  addTexttoTextArray = () => {
    this.setState({ textArray: [...this.state.textArray, this.state.codeText] })
  }

  showSavedDisplay = () => {
    this.setState({ showingSavedDisplay: true })
  }

  h1Tag = (name, className) => {
    let normalTitle = name ? `${name}` : ''

    this.setState({
      jsxArray: [
        ...this.state.jsxArray,
        () => {
          return (
            <h1 className={className} style={{}}>
              {normalTitle}
            </h1>
          )
        }
      ]
    })

    return `\n <h1 class="${className}">  ${normalTitle}  </h1> \n`
  }

  h2Tag = (name, className) => {
    let normalTitle = name ? `${name}` : ''

    this.setState({
      jsxArray: [
        ...this.state.jsxArray,
        () => {
          return <h2 className={className}>{normalTitle}</h2>
        }
      ]
    })

    return `\n <h2 class="${className}">  ${normalTitle}  </h2> \n`
  }

  h3Tag = (name, className) => {
    let normalTitle = name ? `${name}` : ''

    this.setState({
      jsxArray: [
        ...this.state.jsxArray,
        () => {
          return <h3 className={className}>{normalTitle}</h3>
        }
      ]
    })

    return `\n <h3 class="${className}">  ${normalTitle}  </h3> \n`
  }

  h4Tag = (name, className) => {
    let normalTitle = name ? `${name}` : ''

    this.setState({
      jsxArray: [
        ...this.state.jsxArray,
        () => {
          return <h4 className={className}>{normalTitle}</h4>
        }
      ]
    })

    return `\n <h4 class="${className}">  ${normalTitle}  </h4> \n`
  }

  pTag = (name, className) => {
    let normalTitle = name ? `${name}` : ''

    this.setState({
      jsxArray: [
        ...this.state.jsxArray,
        () => {
          return <p className={className}>{normalTitle}</p>
        }
      ]
    })

    return `\n <p class="${className}">  ${normalTitle}  </p> \n`
  }

  boxShape = (num, color) => {
    let result = ''
    let nums = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10
    }

    num = nums[num] || num
    for (let i = 0; i < num; i++) {
      this.setState({
        jsxArray: [
          ...this.state.jsxArray,
          () => {
            return (
              <div
                style={{
                  margin: '10px',
                  width: '100px',
                  height: '100px',
                  backgroundColor: `${color}`
                }}
              />
            )
          }
        ]
      })

      result += `<div
      style={{
        margin: '10px',
        width: '100px',
        height: '100px',
        backgroundColor: ${color}
      }}
    />`
    }
    return result
  }

  addContentToState = newFinalTranscript => {
    let text = newFinalTranscript
    let textArray = text.replace(/-/g, ' ').split(' ')
    let theClassName = null
    this.setState({ understood: true })

    if (text.includes('video')) {
      let searchTerm = textArray.slice(textArray.indexOf('video') + 1).join(' ')

      this.setState({
        content:
          this.state.content +
          '\n' +
          `<iframe  width="300px" height="200px" src=${searchTerm} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>`
      })
      searchTerm = searchTerm.split(' ').join('+')
      const YOUTUBE = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchTerm}+&key=AIzaSyBordtiyWri-OFE-6QdM1118LkDDWRHSKs`
      return fetch(YOUTUBE)
        .then(resp => resp.json())
        .then(obj =>
          this.setState({
            selectedYouTubeVideos: [
              ...this.state.selectedYouTubeVideos,
              obj.items[0]
            ]
          })
        )
    } else if (text.includes('class')) {
      theClassName = textArray[textArray.indexOf('class') + 1]
      this.setState({ keywords: [...this.state.keywords, theClassName] })
      console.table(textArray)
      textArray = textArray.filter(word => {
        return (
          word !== 'class' && word !== textArray[textArray.indexOf('class') + 1]
        )
      })
      console.table(textArray)
    }

    if (text.includes('H1')) {
      let tagContent = textArray.slice(textArray.indexOf('H1') + 2).join(' ')

      return this.setState({
        content:
          this.state.content + '\n' + this.h1Tag(tagContent, theClassName)
      })
    } else if (text.includes('H2')) {
      let tagContent = textArray.slice(textArray.indexOf('H2') + 2).join(' ')

      return this.setState({
        content:
          this.state.content + '\n' + this.h2Tag(tagContent, theClassName)
      })
    } else if (text.includes('H3')) {
      let tagContent = textArray.slice(textArray.indexOf('H3') + 2).join(' ')

      return this.setState({
        content:
          this.state.content + '\n' + this.h3Tag(tagContent, theClassName)
      })
    } else if (text.includes('H4')) {
      let tagContent = textArray.slice(textArray.indexOf('H4') + 2).join(' ')

      return this.setState({
        content:
          this.state.content + '\n' + this.h4Tag(tagContent, theClassName)
      })
    } else if (text.includes('display')) {
      let display = textArray[textArray.indexOf('display') + 1]
      this.setState({ structure: display })
    } else if (text.includes('flex-wrap')) {
      let wrap = textArray
        .slice(textArray.indexOf('wrap') + 1)
        .join(' ')
        .replace(' ', '-')
      this.setState({ flexWrap: wrap })
    } else if (text.includes('flex-direction')) {
      let direction = textArray
        .slice(textArray.indexOf('direction') + 1)
        .join(' ')
      this.setState({ flexDirection: direction })
    } else if (text.includes('p') || text.includes('tag')) {
      let tagContent = textArray.slice(textArray.indexOf('p') + 2).join(' ')

      return this.setState({
        content:
          this.state.content + '\n' + this.pTag(tagContent, theClassName)
      })
    } else if (text.includes('colour') && text.includes('text')) {
      let colour = textArray[textArray.indexOf('colour') + 1]
      this.setState({ textColor: colour })
    } else if (text.includes('colour')) {
      let colour = textArray[textArray.indexOf('colour') + 1]
      this.setState({ backgroundColor: colour })
    } else if (text.includes('clear')) {
      this.setState({ content: '', jsxArray: [], selectedYouTubeVideos: [] })
    } else if (text.includes('justify') && text.includes('content')) {
      let position = textArray[textArray.indexOf('content') + 1]
      this.setState({ justifyContent: position })
    } else if (text.includes('box') || text.includes('boxes')) {
      if (text.includes('boxes')) {
        let color = textArray[textArray.indexOf('boxes') - 1]
        let num = textArray[textArray.indexOf('boxes') - 2]
        return this.setState({
          content: this.state.content + '\n' + this.boxShape(num, color)
        })
      } else {
        let color = textArray[textArray.indexOf('box') - 1]
        let num = 1
        return this.setState({
          content: this.state.content + '\n' + this.boxShape(num, color)
        })
      }
    } else {
      this.setState({ understood: false })
    }
  }

  //   onChange = () => {

  // let someHtml = '<h1>hello</h1>'
  // let execute = () => {
  // return <div className="Container" dangerouslySetInnerHTML={{__html:
  //   someHtml}}></div>
  // }

  //   }

  renderHTML = () => {
    return this.state.jsxArray.map(fn => {
      return fn()
    })
  }

  renderVideos = () => {
    return this.state.selectedYouTubeVideos.map(video => {
      const videoSrc = `https://www.youtube.com/embed/${
        video.id.videoId
      }?autoplay=1`
      return (
        <iframe
          width='300px'
          height='200px'
          src={videoSrc}
          frameBorder='0'
          allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          title='youtube-iframe'
        />
      )
    })
  }

  render () {
    return (
      <div>
        <header
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '50px'
          }}
          className='header'
        >
          <h1 className='h1 mega montserrat bold color-emphasis-1'>Dexter</h1>
        </header>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AceEditor
            placeholder='Placeholder Text'
            mode='html'
            theme='terminal'
            name='blah2'
            onLoad={this.onLoad}
            onChange={this.onChange}
            fontSize={14}
            showPrintMargin
            showGutter
            highlightActiveLine
            value={this.state.content}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2
            }}
          />

          <Button
            toggleListen={this.toggleListen}
            listening={this.state.listening}
          />
          <Container
            style={{
              flexWrap: `${this.state.flexWrap}`,
              flexDirection: `${this.state.flexDirection}`,
              justifyContent: `${this.state.justifyContent}`,
              color: `${this.state.textColor}`,
              display: `${this.state.structure}`,
              backgroundColor: `${this.state.backgroundColor}`
            }}
            className='inverted'
          >
            {this.renderHTML()}
            {this.state.selectedYouTubeVideos.length
              ? this.renderVideos()
              : null}
          </Container>
        </div>
        {this.state.understood ? (
          <Segment
            style={{
              fontSize: '18px',
              marginTop: '50px',
              height: '300px',
              width: '500px'
            }}
            inverted
          >
            Example Commands:
            <ul>
              <p style={{ fontSize: '16px', margin: '12px' }}>
                "Dexter, background colour gold!"
              </p>
              <p style={{ fontSize: '16px', margin: '12px' }}>
                "Dexter, h1 tag website!"
              </p>
              <p style={{ fontSize: '16px', margin: '12px' }}>
                "Dexter, embed video cats!"
              </p>

              <p style={{ fontSize: '16px', margin: '12px' }}>
                "Dexter, give me five gold boxes!"
              </p>
              <p style={{ fontSize: '16px', margin: '12px' }}>
                "Dexter, display flex!"
              </p>
              <p
                style={{
                  fontSize: '16px',
                  padding: '0px',
                  margin: '0px',
                  color: 'red'
                }}
              >
                You can try more HTML and CSS commands!
              </p>

              <br />
            </ul>
          </Segment>
        ) : (
          <Segment style={{ fontSize: '50px', marginRight: '10px' }} inverted>
            {' '}
            <p style={{ fontSize: '20px', margin: '15px', color: 'red' }}>
              Dexter - "Sorry I don't understand, please try again."
            </p>{' '}
          </Segment>
        )}
      </div>
    )
  }
}

export default HTML
