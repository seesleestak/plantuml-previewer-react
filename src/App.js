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

class App extends React.Component {
  state = {
    value: defaultValue,
    keybindingValue: keybindingOptions[0].value,
    graphUrl: ""
  };

  updateValue = (v) => this.setState({ value: v });
  changeKeybindingValue = (v) => this.setState({ keybindingValue: v });

  updateUrl = () => {
    const { value } = this.state;
    const encodedMarkup = plantumlEncoder.encode(value);
    const url = `http://www.plantuml.com/plantuml/img/${encodedMarkup}`;
    console.log("url --- ", url);
    this.setState({ graphUrl: url });
  };

  render() {
    const { value, keybindingValue, graphUrl } = this.state;
    return (
      <div className="app">
        <h1>PlantUML Previewer</h1>
        <Row className="options-row">
          <Col xs={12} sm={2}>
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
          <Col xs={12} sm={2}>
            <label>Orientation</label>
            <br />
            <select>
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
        </Row>
        <Row>
          <Col xs={12}>
            <div className="graph-con">
              <img alt="plantuml-graph" src={graphUrl} />
            </div>
          </Col>
        </Row>
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
        <Row style={{ marginTop: "20px" }}>
          <Col xs={12}>
            <button onClick={this.updateUrl}>Submit</button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
