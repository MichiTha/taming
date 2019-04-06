import * as React from "react";
import { withRouter } from "next/router";

type Props = {
  router: {
    query: {
      token?: string;
    };
  };
};

type Guest = {
  firstname: string;
  lastname: string;
  token: string;
  confirmed: boolean | null;
  people: number | null;
};

type State = {
  guest: Guest | null;
  loading: boolean;
};

class Index extends React.Component<Props, State> {
  state: State = {
    guest: null,
    loading: true
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
      this.setState({
        guest: json.guest,
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
      this.setState({
        loading: true
      });
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

  private handleChangeConfirmed = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const confirmed = event.target.checked;
    const { guest } = this.state;
    if (guest && typeof confirmed === "boolean") {
      this.setState({
        guest: {
          ...guest,
          confirmed
        }
      });
    }
  };

  private handleChangePeople = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { guest } = this.state;
    const people = parseInt(event.target.value);
    if (guest && typeof people === "number" && people < 10 && people > 0) {
      this.setState({
        guest: {
          ...guest,
          people
        }
      });
    }
  };

  private handleSubmit = (): void => {
    const { guest } = this.state;
    if (guest) {
      this.updateUserData(guest);
    }
  };

  render() {
    const { guest, loading } = this.state;

    if (loading) {
      return (
        <div>
          <p>loading</p>
        </div>
      );
    } else if (guest) {
      const { firstname = "", lastname = "" } = guest;
      return (
        <div>
          <p>
            Hallo lieber {firstname} {lastname}!
          </p>
          <form onSubmit={this.handleSubmit}>
            <p>
              <label>
                Ich/Wir kommen:
                <input
                  type="checkbox"
                  checked={guest.confirmed || false}
                  name="name"
                  onChange={this.handleChangeConfirmed}
                />
              </label>
            </p>
            <p>
              {" "}
              <label>
                Mit{" "}
                <input
                  type="number"
                  size={1}
                  name="Anzahl Personen"
                  value={guest.people || 0}
                  onChange={this.handleChangePeople}
                />{" "}
                Personen
              </label>
            </p>
            <input type="submit" value="Submit" />
          </form>
        </div>
      );
    } else if (!guest) {
      return (
        <div>
          <p>leider haben wir dich nicht gefunden :(</p>
        </div>
      );
    }
  }
}

export default withRouter(Index);
