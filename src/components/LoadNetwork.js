import localforage from "localforage";
import "whatwg-fetch";
import PropTypes from "prop-types";
import React from "react";
import { Container, Divider, Image, Label, Progress, Segment, Step } from "semantic-ui-react";
import Background from "../images/Background.svg";
import parseFTree from "../io/ftree";
import networkFromFTree from "../io/network-from-ftree";
import parseFile from "../io/parse-file";


const errorState = err => ({
  progressError: true,
  progressLabel: err.toString()
});

export default class LoadNetwork extends React.Component {
  state = {
    progressVisible: false,
    progressLabel: "",
    progressValue: 0,
    progressError: false,
    ftree: null
  };

  static propTypes = {
    onLoad: PropTypes.func.isRequired
  };

  progressTimeout = null;

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const args = urlParams.get("infomap");

    localforage.config({ name: "infomap" });
    localforage.getItem("ftree")
      .then(ftree => {
        if (!ftree) {
          return;
        }

        this.setState({ ftree });
        if (args) {
          this.loadNetwork(ftree, args);
        }
      })
      .catch(err => console.error(err));
  }

  componentWillUnmount() {
    clearTimeout(this.progressTimeout);
  }

  loadNetwork = (file, name) => {
    if (!name && file && file.name) {
      name = file.name;
    }

    this.setState({
      progressVisible: true,
      progressValue: 1,
      progressLabel: "Reading file",
      progressError: false
    });

    this.progressTimeout = setTimeout(() =>
      this.setState({
        progressValue: 2,
        progressLabel: "Parsing"
      }), 400);

    return parseFile(file)
      .then((parsed) => {
        clearTimeout(this.progressTimeout);

        if (parsed.errors.length) {
          throw new Error(parsed.errors[0].message);
        }

        const ftree = parseFTree(parsed.data);

        if (ftree.errors.length) {
          throw new Error(ftree.errors[0]);
        }

        const network = networkFromFTree(ftree);

        this.setState({
          progressValue: 3,
          progressLabel: "Success"
        });

        this.progressTimeout = setTimeout(() => {
          this.setState({ progressVisible: false });
          this.props.onLoad({ network, filename: name });
        }, 200);
      })
      .catch((err) => {
        clearTimeout(this.progressTimeout);
        this.setState(errorState(err));
        console.log(err);
      });
  };

  loadExampleData = () => {
    const filename = "citation_data.ftree";

    this.setState({
      progressVisible: true,
      progressValue: 1,
      progressLabel: "Reading file",
      progressError: false
    });

    fetch(`/navigator/${filename}`)
      .then(res => res.text())
      .then(file => this.loadNetwork(file, filename))
      .catch((err) => {
        this.setState(errorState(err));
        console.log(err);
      });
  };

  loadMarch = () => {
    const filename = "march.ftree";

    this.setState({
      progressVisible: true,
      progressValue: 1,
      progressLabel: "Reading file",
      progressError: false
    });

    fetch(`/navigator/${filename}`)
      .then(res => res.text())
      .then(file => this.loadNetwork(file, filename))
      .catch((err) => {
        this.setState(errorState(err));
        console.log(err);
      });
  };

  loadAugust = () => {
    const filename = "august.ftree";

    this.setState({
      progressVisible: true,
      progressValue: 1,
      progressLabel: "Reading file",
      progressError: false
    });

    fetch(`/navigator/${filename}`)
      .then(res => res.text())
      .then(file => this.loadNetwork(file, filename))
      .catch((err) => {
        this.setState(errorState(err));
        console.log(err);
      });
  };


  render() {
    const { progressError, progressLabel, progressValue, progressVisible, ftree } = this.state;

    const disabled = progressVisible && !progressError;

    const background = {
      padding: "100px 0 100px 0",
      background: `linear-gradient(hsla(0, 0%, 100%, 0.5), hsla(0, 0%, 100%, 0.5)), url(${Background}) no-repeat`,
      backgroundSize: "cover, cover",
      backgroundPosition: "center top"
    };

    return (
      <div style={background}>
        <Segment
          as={Container}
          text
          textAlign="center"
          style={{ padding: "50px 0px" }}
          padded='very'
        >
          
          <Step.Group>
            <Step
              disabled={disabled}
              icon="book"
              title="Load Map Equation Network"
              description="March"
              link
              onClick={this.loadAugust}
            />
          </Step.Group>

          <Divider horizontal style={{ margin: "20px 0px 30px 0px" }} content=""/>

          <Step.Group>
            <Step
              disabled={disabled}
              icon="book"
              title="Load Map Equation Network"
              description="August"
              link
              onClick={this.loadMarch}
            />
          </Step.Group>

          {progressVisible &&
          <div style={{ padding: "50px 100px 0" }}>
            <Progress
              align='left'
              indicating
              total={3}
              error={progressError}
              label={progressLabel}
              value={progressValue}
            />
          </div>
          }
        </Segment>
      </div>
    );
  }
}
