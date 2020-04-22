import React from "react";
import AceEditor from "react-ace";
import plantumlEncoder from "plantuml-encoder";
import { Row, Col } from "react-flexbox-grid";
import {
  Icon,
  Message,
  Segment,
  Header,
  Button,
  Form,
  Select
} from "semantic-ui-react";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/keybinding-vim";
import "ace-builds/src-min-noconflict/ext-language_tools";
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
  { text: "Normal", value: "normal", key: "normal" },
  { text: "Vim", value: "vim", key: "vim" },
  { text: "Emacs", value: "emacs", key: "emacs" }
];

const orientationOptions = [
  { text: "Vertical", value: "vertical", key: "vertical" },
  { text: "Horizontal", value: "horizontal", key: "horizontal" }
];

const graphTypeOptions = [
  { text: "SVG", value: "svg", key: "svg" },
  { text: "PNG", value: "img", key: "img" }
];

const appendNamespace = str => {
  return `plantuml-previewer-${str}`;
};
const setItem = (key, value) => {
  return localStorage.setItem(appendNamespace(key), value);
};
const getItem = key => {
  return localStorage.getItem(appendNamespace(key));
};

class App extends React.Component {
  state = {
    value: getItem("uml") || defaultValue,
    graphTypeValue: getItem("graph-type-value") || graphTypeOptions[0].value,
    keybindingValue: getItem("keybinding-value") || keybindingOptions[0].value,
    orientationValue:
      getItem("orientation-value") || orientationOptions[0].value,
    graphUrl: ""
  };

  updateValue = v => this.setState({ value: v });
  changeKeybindingValue = v => {
    setItem("keybinding-value", v);
    this.setState({ keybindingValue: v });
  };
  changeGraphType = v => {
    setItem("graph-type-value", v);
    this.setState({ graphTypeValue: v });
  };
  changeOrientation = v => {
    setItem("orientation-value", v);
    this.setState({ orientationValue: v });
  };

  updateUrl = () => {
    const { value, graphTypeValue } = this.state;
    const encodedMarkup = plantumlEncoder.encode(value);
    const url = `http://www.plantuml.com/plantuml/${graphTypeValue}/${encodedMarkup}`;
    setItem("uml", value);
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
        <Header as="h1">PlantUML Previewer</Header>
        <Form>
          <Row bottom="xs">
            <Col xs={12} md={2} lg={1} className="option-item">
              <Form.Field
                label="Keybinding"
                control={Select}
                fluid
                value={keybindingValue}
                onChange={(e, { value }) => {
                  this.changeKeybindingValue(value);
                }}
                options={keybindingOptions}
              />
            </Col>
            <Col xs={12} md={3} lg={2} className="option-item">
              <Form.Field
                label="Orientation"
                control={Select}
                fluid
                value={orientationValue}
                onChange={(e, { value }) => this.changeOrientation(value)}
                options={orientationOptions}
              />
            </Col>
            <Col xs={12} md={2} lg={1} className="option-item">
              <Form.Field
                label="Graph Type"
                control={Select}
                fluid
                value={graphTypeValue}
                onChange={(e, { value }) => this.changeGraphType(value)}
                options={graphTypeOptions}
              />
            </Col>
            <Col xs={12} md={4} lg={3}>
              <Button primary fluid onClick={this.updateUrl}>
                Submit (Shift + Enter)
              </Button>
            </Col>
          </Row>
          <Row className="help-row">
            <Col>
              <Message info icon>
                <Icon name="help circle" />
                <Message.Content>
                  <Message.Header>
                    Need some help with the syntax?
                  </Message.Header>
                  Take a look at the{" "}
                  <a
                    href="https://plantuml.com/sequence-diagram"
                    alt="uml syntax documentation"
                  >
                    PlantUML Sequence Diagram documentation
                  </a>
                  .
                </Message.Content>
              </Message>
            </Col>
          </Row>
        </Form>
        {orientationValue === "horizontal" ? (
          <>
            <Row>
              <Col xs={12}>
                <Segment className="ace-container">
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
                </Segment>
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={12}>
                <Segment>
                  <a
                    alt="plantuml-graph-a"
                    href={graphUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img alt="plantuml-graph" src={graphUrl} />
                  </a>
                </Segment>
              </Col>
            </Row>
          </>
        ) : (
          <Row>
            <Col xs={12} md={5}>
              <Segment className="ace-container">
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
              </Segment>
            </Col>
            <Col xs={12} md={7}>
              <Segment>
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
              </Segment>
            </Col>
          </Row>
        )}
        <div className="github-link">
          <a href="https://github.com/seesleestak/plantuml-previewer-react">
            View on github
          </a>
        </div>
      </div>
    );
  }
}

export default App;
