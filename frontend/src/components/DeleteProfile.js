import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DeleteProfile({opened, setOpened, onSubmit}) {
  
    const handleClose = () => {
      setOpened(false);
    };
  
    return (
      <div>
        <Dialog
          open={opened}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Delete account"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Do you realy want to delete the profile`}? {` Profile and All data related with your profile will be lost forever.`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant='contained' onClick={handleClose}>
              No
            </Button>
            <Button onClick={onSubmit} autoFocus variant='contained' sx={{backgroundColor: "red", ":hover": { bgcolor: "#db0804", color: "white" }}}>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }