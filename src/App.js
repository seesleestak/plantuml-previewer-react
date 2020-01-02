import React from "react";
import AceEditor from "react-ace";
import plantumlEncoder from "plantuml-encoder";
import { Row, Col } from "react-flexbox-grid";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/keybinding-vim";
import "./App.css";

const defaultValue = `@startuml
title Example

Frontend -> Middletier: GET /posts

Middletier -> Backend: GET /comments
Backend -> Service: comments
Service --> Backend: return(comments)
Backend --> Middletier: return(comments)

alt links not provided
  Middletier -> Backend: GET /thumbnails
  Backend --> Middletier: return(thumbnails)
  Middletier -> Backend: GET /likes
  Backend --> Middletier: return(likes)
else  links provided
    Middletier -> Backend: POST /links
    Backend --> Middletier: return(links)
end

Middletier --> Frontend: return(posts)
@enduml`;

const keybindingOptions = [
  { label: "Normal", value: "normal" },
  { label: "Vim", value: "vim" },
  { label: "Emacs", value: "emacs" }
];

const orientationOptions = [
  { label: "Vertical", value: "vertical" },
  { label: "Horizontal", value: "horizontal" }
];

const graphTypeOptions = [
  { label: "SVG", value: "svg" },
  { label: "PNG", value: "img" }
];

class App extends React.Component {
  state = {
    value: defaultValue,
    graphTypeValue:
      localStorage.getItem("graphTypeValue") || graphTypeOptions[0].value,
    keybindingValue:
      localStorage.getItem("keybindingValue") || keybindingOptions[0].value,
    orientationValue:
      localStorage.getItem("orientationValue") || orientationOptions[0].value,
    graphUrl: ""
  };

  updateValue = v => this.setState({ value: v });
  changeKeybindingValue = v => {
    localStorage.setItem("keybindingValue", v);
    this.setState({ keybindingValue: v });
  };
  changeGraphType = v => {
    localStorage.setItem("graphTypeValue", v);
    this.setState({ graphTypeValue: v });
  };
  changeOrientation = v => {
    localStorage.setItem("orientationValue", v);
    this.setState({ orientationValue: v });
  };

  updateUrl = () => {
    const { value, graphTypeValue } = this.state;
    const encodedMarkup = plantumlEncoder.encode(value);
    const url = `http://www.plantuml.com/plantuml/${graphTypeValue}/${encodedMarkup}`;
    this.setState({ graphUrl: url });
  };

  componentDidMount() {
    this.updateUrl();
  }

  render() {
    const {
      value,
      keybindingValue,
      orientationValue,
      graphTypeValue,
      graphUrl
    } = this.state;
    return (
      <div className="app">
        <h1>PlantUML Previewer</h1>
        <Row className="options-row" bottom="xs">
          <Col className="option-item">
            <label>Keybinding</label>
            <br />
            <select
              value={keybindingValue}
              onChange={e => this.changeKeybindingValue(e.target.value)}
            >
              {keybindingOptions.map(option => (
                <option
                  key={`keybinding-options-${option.value}`}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </Col>
          <Col className="option-item">
            <label>Orientation</label>
            <br />
            <select
              value={orientationValue}
              onChange={e => this.changeOrientation(e.target.value)}
            >
              {orientationOptions.map(option => (
                <option
                  key={`orientation-options-${option.value}`}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </Col>
          <Col className="option-item">
            <label>Graph Type</label>
            <br />
            <select
              value={graphTypeValue}
              onChange={e => this.changeGraphType(e.target.value)}
            >
              {graphTypeOptions.map(option => (
                <option
                  key={`graph-type-options-${option.value}`}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </Col>
          <Col xs>
            <Row end="xs">
              <Col>
                <button onClick={this.updateUrl}>Submit (Shift + Enter)</button>
              </Col>
            </Row>
          </Col>
        </Row>
        {orientationValue === "horizontal" ? (
          <>
            <Row>
              <Col xs={12}>
                <div className="ace-con">
                  <AceEditor
                    theme="github"
                    fontSize={14}
                    onChange={v => {
                      this.updateValue(v);
                    }}
                    keyboardHandler={keybindingValue}
                    value={value}
                    name="plantuml-input"
                    width="100%"
                    height="425px"
                    editorProps={{ $blockScrolling: true }}
                    commands={[
                      {
                        name: "updateUrl",
                        bindKey: { win: "Shift-Enter", mac: "Shift-Enter" },
                        exec: () => this.updateUrl()
                      }
                    ]}
                    className="plantuml-input"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className="graph-con">
                  <a
                    alt="plantuml-graph-a"
                    href={graphUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img alt="plantuml-graph" src={graphUrl} />
                  </a>
                </div>
              </Col>
            </Row>
          </>
        ) : (
          <Row>
            <Col xs={12} sm={6} md={5}>
              <div className="ace-con">
                <AceEditor
                  theme="github"
                  fontSize={14}
                  onChange={v => {
                    this.updateValue(v);
                  }}
                  keyboardHandler={keybindingValue}
                  value={value}
                  name="plantuml-input"
                  width="100%"
                  height="425px"
                  editorProps={{ $blockScrolling: true }}
                  commands={[
                    {
                      name: "updateUrl",
                      bindKey: { win: "Shift-Enter", mac: "Shift-Enter" },
                      exec: () => this.updateUrl()
                    }
                  ]}
                  className="plantuml-input"
                />
              </div>
            </Col>
            <Col xs={12} sm={6} md={7}>
              <div className="graph-con">
                <a
                  alt="plantuml-graph-a"
                  href={graphUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img alt="plantuml-graph" src={graphUrl} />
                </a>
              </div>
            </Col>
          </Row>
        )}
        <div>
          <a href="https://github.com/seesleestak/plantuml-previewer-react">
            View on github
          </a>
        </div>
      </div>
    );
  }
}

export default App;
