import React from "react";
import { Container, Grid, Header, Icon, Image } from "semantic-ui-react";
import Legend from "./Legend";


const Documentation = () =>
  <Container style={{ padding: "40px 0 40px 0" }}>
    <Grid columns={1}>
      <Grid.Column>
        <center><p>
          Network Visualization Powered by <a href='http://www.mapequation.org/code.html'>MapEquation</a> available under MIT License.
        </p></center>
      </Grid.Column>
      </Grid>
  </Container>;

export default Documentation;
