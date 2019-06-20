import * as React from "react";
import { withRouter } from "next/router";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";

import Container from "../components/container";
import Form, { FormState } from "../components/form";
import Submitdialog from "../components/Submitdialog";

type Props = {
  router: {
    query: {
      token?: string;
    };
  };
  classes: any;
};

type Guest = {
  persons: Array<{
    name: string;
    female: boolean;
  }>;
  token: string;
  confirmed: boolean;
  coming: boolean;
  form: FormState;
};

type State = {
  guest: Guest | null;
  salutation: string;
  isSingel: boolean;
  loading: boolean;
  clickedYes: boolean;
  clickedNo: boolean;
  showSubmitDialog: boolean;
};

const styles = (theme: any) => ({
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

class Index extends React.Component<Props, State> {
  state: State = {
    guest: null,
    loading: true,
    isSingel: true,
    salutation: "",
    clickedYes: false,
    clickedNo: false,
    showSubmitDialog: false
  };

  componentDidMount = () => {
    const { router } = this.props;
    const token = router && router.query && router.query.token;
    if (token) {
      this.getUserData(token);
    }
  };

  private getUserData = async (token: string) => {
    try {
      const res = await fetch(`/api/${token}`);
      const json = await res.json();
      const guest: Guest = json.guest;
      const salutation = `${guest.persons
        .sort((personA, personB) => {
          if (personA.female && !personB.female) {
            return -1;
          } else if (!personA.female && personB.female) {
            return 1;
          } else {
            return 0;
          }
        })
        .reduce((acc, person, index) => {
          if (person.female) {
            return `${acc}${index == 0 ? "Liebe" : ", liebe"} ${person.name}`;
          } else {
            return `${acc}${index == 0 ? "Lieber" : ", lieber"} ${person.name}`;
          }
        }, "")},`;

      this.setState({
        isSingel: guest.persons.length <= 1,
        salutation,
        guest,
        loading: false
      });
    } catch (error) {
      console.log("could not fetch guest data: ", error);
      this.setState({
        loading: false
      });
    }
  };

  private updateUserData = async (guest: Guest) => {
    try {
      const res = await fetch(`/api/${guest.token}`, {
        method: "POST",
        body: JSON.stringify(guest),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const json = await res.json();
      this.setState({
        guest: json.guest,
        loading: false
      });
    } catch (error) {
      console.log("could update userdata: ", error);
      this.setState({
        loading: false
      });
    }
  };

  private handleClickedNo = (): void =>
    this.setState(({ clickedNo, clickedYes }) => ({
      clickedNo: !clickedNo,
      clickedYes: !clickedNo ? false : clickedYes
    }));

  private handleClickedYes = (): void =>
    this.setState(({ clickedNo, clickedYes }) => ({
      clickedNo: !clickedYes ? false : clickedNo,
      clickedYes: !clickedYes
    }));

  private handleConfirm = (): void => {
    this.setState({ showSubmitDialog: true });
  };

  private handleSubmit = async (): Promise<void> => {
    const { guest, clickedYes } = this.state;
    if (guest) {
      await this.updateUserData({
        ...guest,
        confirmed: true,
        coming: clickedYes
      });
      location.reload();
    }
  };

  renderForm = (): JSX.Element => {
    const {
      guest,
      loading,
      clickedYes,
      clickedNo,
      isSingel,
      salutation,
      showSubmitDialog
    } = this.state;
    const { classes } = this.props;
    if (!guest && loading) {
      return <div />;
    } else if (!guest && !loading) {
      return (
        <React.Fragment>
          <Typography variant="title" align="center" gutterBottom>
            {"Leider konnten wir dich mit deinem QR-Code nicht finden."}
          </Typography>
          <Typography variant="subtitle1" align="center" gutterBottom>
            {"Du kannst uns aber auch einfach per E-Mail Antworten."}
          </Typography>
        </React.Fragment>
      );
    } else if (guest && guest.confirmed) {
      return (
        <React.Fragment>
          <Typography variant="title" align="center" gutterBottom>
            {"Vielen Dank für deine Antwort!"}
          </Typography>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          {showSubmitDialog && (
            <Submitdialog
              isSingel={isSingel}
              onSubmit={this.handleSubmit}
              onBack={() => this.setState({ showSubmitDialog: false })}
            />
          )}
          <Typography variant="title" align="center" gutterBottom>
            {salutation}
          </Typography>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" align="center" gutterBottom>
                {isSingel
                  ? "Kommst du zu unserer Hochzeit?"
                  : "Kommt ihr zu unserer Hochzeit?"}
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                display: "flex",
                justifyContent: "center",
                verticalAlign: "center"
              }}
            >
              <Button
                variant="contained"
                color={clickedYes ? "secondary" : "primary"}
                className={classes.button}
                onClick={this.handleClickedYes}
                style={{
                  margin: "0px"
                }}
              >
                Ja
              </Button>
            </Grid>
            <Grid
              item
              xs={6}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                color={clickedNo ? "secondary" : "primary"}
                className={classes.button}
                onClick={this.handleClickedNo}
                style={{
                  margin: "0px"
                }}
              >
                Nein
              </Button>
            </Grid>
            {clickedYes && (
              <Form
                isSingel={isSingel}
                callbackstate={state => {
                  this.setState(({ guest }) => {
                    if (guest) {
                      guest.form = state;
                      return {
                        guest
                      };
                    }
                  });
                }}
              />
            )}
            {(clickedYes || clickedNo) && (
              <Grid
                item
                xs={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={this.handleConfirm}
                >
                  Antwort bestätigen
                </Button>
              </Grid>
            )}
          </Grid>
        </React.Fragment>
      );
    }
  };

  render() {
    return <Container>{this.renderForm()}</Container>;
  }
}

export default withRouter(withStyles(styles)(Index));
