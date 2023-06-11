import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from "react-router-dom";
import useAxios from '../utils/useAxios';
import { useState } from 'react';

export default function DeleteAccount({opened, setOpened, data}) {

  let api = useAxios();
  const navigate = useNavigate();

  const handleClose = () => {
    setOpened();
  };

  let deleteRecords = async () => {
    let response = await api.delete(`/accounts/${data._id}/delete`)

    let status = await response.status

    if (status === 204) {
        navigate('/accounts/');
    }
  } 

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
            {`Do you realy want to delete the account`} <b>{data.name}</b>?{` The account will removed from your budgets.
            All data related with this account will be lost forever.
            `}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus variant='contained' onClick={handleClose}>
            No
          </Button>
          <Button onClick={deleteRecords} autoFocus variant='contained' sx={{backgroundColor: "red", ":hover": { bgcolor: "#db0804", color: "white" }}}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}