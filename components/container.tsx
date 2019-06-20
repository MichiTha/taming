import * as React from "react";
import { Container } from "next/app";
import Head from "next/head";

import CssBaseline from "@material-ui/core/CssBaseline";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";

type Props = {
  children: JSX.Element;
  classes: any;
};

const styles = (theme: any) => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(320 + theme.spacing.unit * 2 * 2)]: {
      width: 320,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(320 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3
    }
  }
});

class ComponentContainer extends React.Component<Props, void> {
  renderHead() {
    return (
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />
      </Head>
    );
  }

  render() {
    const { classes } = this.props;
    const { children } = this.props;
    return (
      <Container>
        {this.renderHead()}
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>{children}</Paper>
        </main>
      </Container>
    );
  }
}

export default withStyles(styles)(ComponentContainer);
