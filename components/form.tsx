import * as React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";

type Props = {
  isSingel: boolean;
  callbackstate: (state: State) => void;
  classes: any;
};

type State = {
  people: number;
  vegetarians: number;
  vegans: number;
  intolerances: string;
};

export type FormState = State;

const styles = (theme: any) => ({
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

class Form extends React.Component<Props, State> {
  state: State = {
    people: 1,
    vegetarians: 0,
    vegans: 0,
    intolerances: ""
  };

  private handleChangePeople = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = parseInt(event.target.value);
    value >= 0 &&
      value < 10 &&
      this.setState(
        {
          people: value,
          vegetarians:
            value < this.state.vegetarians ? value : this.state.vegetarians,
          vegans: value < this.state.vegans ? value : this.state.vegans
        },
        () => this.props.callbackstate(this.state)
      );
  };

  private handleChangeVegetarians = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = parseInt(event.target.value);
    value >= 0 &&
      value <= this.state.people &&
      this.setState({ vegetarians: value }, () =>
        this.props.callbackstate(this.state)
      );
  };

  private handleChangeVegans = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = parseInt(event.target.value);
    value >= 0 &&
      value <= this.state.people &&
      this.setState({ vegans: value }, () =>
        this.props.callbackstate(this.state)
      );
  };

  private handleChangeIntolerances = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void =>
    this.setState({ intolerances: event.target.value }, () =>
      this.props.callbackstate(this.state)
    );

  render = (): JSX.Element => {
    const { classes, isSingel } = this.props;
    const { people, vegetarians, vegans, intolerances } = this.state;
    return (
      <React.Fragment>
        <Grid item xs={12}>
          <Typography variant="subtitle1" align="center" gutterBottom>
            {isSingel
              ? "Wie viele Personen nimmst du mit?"
              : "Wie viele Personen nimmt ihr mit?"}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="standard-number"
            value={people}
            onChange={this.handleChangePeople}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
              required: true
            }}
            inputProps={{ style: { textAlign: "center" } }}
            margin="normal"
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Wie viele davon sind Vegetarier?
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="standard-number"
            value={vegetarians}
            onChange={this.handleChangeVegetarians}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
            inputProps={{ style: { textAlign: "center" } }}
            margin="normal"
            style={{ display: "flex", justifyContent: "center" }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Wie viele davon sind Veganer?
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="standard-number"
            value={vegans}
            onChange={this.handleChangeVegans}
            type="number"
            className={classes.textField}
            InputLabelProps={{
              shrink: true
            }}
            inputProps={{ style: { textAlign: "center" } }}
            margin="normal"
            style={{ display: "flex", justifyContent: "center" }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Hat jemand davon Nahrungsmittel-Intoleranzen?
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="standard-multiline-flexible"
            label=""
            multiline
            rowsMax="4"
            value={intolerances}
            onChange={this.handleChangeIntolerances}
            className={classes.textField}
            margin="normal"
            style={{ display: "flex", justifyContent: "center" }}
          />
        </Grid>
      </React.Fragment>
    );
  };
}

export default withStyles(styles)(Form);
