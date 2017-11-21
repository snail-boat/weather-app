import React, { Component } from 'react';
import SearchBar from 'material-ui-search-bar';
import Typography from 'material-ui/Typography';
import Switch from 'material-ui/Switch';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import qs from 'query-string';
import WeatherCard from './components/WeatherCard';
import Debugger from './components/Debugger';

import * as data from './mock.json';
import './App.css';
import { parse, evaluate, shortcuts } from './expression-parser';

const dark = createMuiTheme({
  palette: {
    type: 'dark'
  },
});

const apiKey = '98ccab292e4156b1c4fdff58d1f6b2c8';

const examples = [
  'sunny and temp > 20',
  'sunny and not windy',
  '(rainy and temp < 10) or (windy and temp > 15)',
  'dry and cloudy and not windy'
];

class App extends Component {

  constructor() {
    super();
    this.state = {
      search: '',
      data: [],
      debug: false,
    };
    this._refs = {
      searchBar: (ref) => this.input = ref
    }
  }

  componentWillMount() {
    this.getSearchFromQuery();
  }

  componentDidMount() {
    fetch(`http://api.openweathermap.org/data/2.5/box/city?bbox=0,-90,360,90,5&appid=${apiKey}`)
      .then(res => res.json())
      .then(data => this.setState({ data: data.list }))
  }

  getSearchFromQuery() {
    const search = qs.parse(window.location.search)['q'] || '';
    this.setState({
      search
    });
    this.parseExpression(search);
  }

  handleChange = (text) => {
    window.history.replaceState(null, null, `/?q=${encodeURIComponent(text)}`)
    this.setState({ search: text, });
  }

  parseExpression = (text) => {
    if (text.trim() === '') {
      this.setState({ expression: null });
    } else {
      try {
        const expression = parse(text)
        this.setState({ expression });
      } catch (e) {
        this.setState({ expression: null });
      }
    }
  }

  handleRequestSearch = (text) => {
    this.parseExpression(text);
  }


  handleExampleClick = (e) => {
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
      return;
    }
    const href = e.target.getAttribute('href');
    window.history.pushState(null, null, href);
    this.getSearchFromQuery();
    e.preventDefault();
  }

  handleDebugToggle = () => {
    this.setState({
      debug: !this.state.debug
    });
  }

  render() {
    let results = [];
    try {
      results = this.state.expression ?
        this.state.data.filter(evaluate.bind(null, this.state.expression, shortcuts)) :
        this.state.data;
    } catch (e) {
      console.log(e);
    }
    return (
      <div className="App">
        <MuiThemeProvider theme={dark}>
          <div className="App-intro">
            <Typography type="title" component="h1">Weather App</Typography>
            <Typography component="p">
              Welcome to the weather app. You can use WQL (Weather Query Language) to look for your next vacation destination!
            </Typography>
            <Typography component="p">
              Try the following examples:
            </Typography>
            <ul>
              {examples.map((example, i) => (
                <li key={i}>
                  <Typography>
                    <a onClick={this.handleExampleClick} href={`/?q=${encodeURIComponent(example)}`} className="App-example">
                      {example}
                    </a>
                  </Typography>
                </li>
              ))}
            </ul>
            <Typography component="p">
              You can also toggle debug mode by clicking on the switch to the right
            </Typography>
          </div>
        </MuiThemeProvider>
        <header className="App-header">
          <div className="App-searchBar">
            <SearchBar
              ref={this._refs.searchBar}
              value={this.state.search}
              onChange={this.handleChange}
              onRequestSearch={this.handleRequestSearch}
            />
          </div>
          <Switch
            checked={this.state.debug}
            onChange={this.handleDebugToggle}
          />
        </header>
        {
          this.state.debug ?
            <div className="App-debugger">
              <Debugger text={this.state.search} />
            </div> : null
        }
        <div className="App-results">
          {
            results.length === 0 ?
              <Typography align="center">No results</Typography> : null
          }
          {
            results.map(result => (
              <WeatherCard key={result.id} className="App-result" data={result} />
            ))
          }
        </div>
      </div>
    );
  }
}

export default App;
