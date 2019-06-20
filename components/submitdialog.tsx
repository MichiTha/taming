import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

type Props = {
  isSingel: boolean;
  onSubmit: () => any;
  onBack: () => any;
};

type State = {
  open: boolean;
};

class Submitdialog extends React.Component<Props, State> {
  handleClickSend = () => {
    this.props.onSubmit();
  };

  handleCloseBack = () => {
    this.props.onBack();
  };

  render() {
    const { isSingel } = this.props;
    return (
      <div>
        <Dialog
          open={true}
          onClose={this.handleCloseBack}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Antworten?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {isSingel
                ? "Hast du deine Antwort abgeschickt, kannst du sie über den QR-Code nicht mehr ändern."
                : "Habt Ihr Eure Antwort abgeschickt, könnt Ihr sie über den QR-Code nicht mehr ändern."}
            </DialogContentText>
          </DialogContent>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {isSingel
                ? "Bist du dir sicher, dass du deine Antwort abschicken willst?"
                : "Seit ihr euch sicher, dass ihr eure Antwort abschicken wollt?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClickSend} color="primary">
              Abschicken
            </Button>
            <Button onClick={this.handleCloseBack} color="primary" autoFocus>
              Korrigieren
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Submitdialog;
