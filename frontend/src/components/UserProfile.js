import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Stack, TextField, Alert } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import BasicDatePicker from './DatePicker';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import AuthContext from '../context/AuthContext';
import dayjs from 'dayjs';
import useAxios from '../utils/useAxios';
import DeleteProfile from './DeleteProfile';




function DenseAppBar() {
  return (
    <Box sx={{ flexGrow: 1, }}>
      <AppBar position="static" sx={{ "background": "#5E35B1" }}>
        <Toolbar variant="dense" >
          <Typography variant="h6" color="inherit" component="div">
            Personal info
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}


export default function UserProfile() {
  let [firstName, setFirstName] = React.useState("");
  let [lastName, setLastName] = React.useState("");
  let [email, setEmail] = React.useState("");
  let [dateOfBirth, setDateOfBirth] = React.useState(null);
  let [gender, setGender] = React.useState("");
  let [selectedCurrency, setSelectedCurrency] = React.useState("");
  let [currencies, setCurrencies] = React.useState([]);
  let [openDeleteProfile, setOpenDeleteProfile] = React.useState(false);
  let [updated, setUpdated] = React.useState(false);

  let { logoutUser } = React.useContext(AuthContext);

  let api = useAxios()

  React.useEffect(
    () => {
      getUserData();
      getCurrencies();
    }, []
  )

  let getCurrencies = async () => {
    let response = await api.get("/currencies/")
    let data = await response.data
    setCurrencies(data)
  }

  let getUserData = async () => {
    let response = await api.get('/user/profile')

    let data = await response.data
    console.log(data)

    if (response.status === 200) {
      setFirstName(data.first_name);
      setLastName(data.last_name || '');
      setEmail(data.email);
      setDateOfBirth(dayjs(data.date_of_birth));
      setGender(data.gender);
      setSelectedCurrency(data.primary_currency);
    } else {
      console.log("Error happened")
    }

  }

  let handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
  }

  const isFormValid = () => {
    return (
      firstName.trim() &&
      email.trim()
    );
  }


  const updateUserInfo = async (e) => {
    e.preventDefault();
    let profile_data = {
      first_name: firstName,
      last_name: lastName,
      gender: gender,
      primary_currency: selectedCurrency
    }

    if (dateOfBirth.isValid()) {
      profile_data["date_of_birth"] = dateOfBirth.format("YYYY-MM-DD");
    }

    console.log(profile_data)

    let response = await api.put('/user/profile/update', { ...profile_data })

    let data = await response.data

    if (response.status === 200) {
      setUpdated(true)
      setFirstName(data.first_name);
      setLastName(data.last_name || '')
      setEmail(data.email);
      setDateOfBirth(dayjs(data.date_of_birth) || null);

      setGender(data.gender);
      setSelectedCurrency(data.primary_currency)
    } else {
      console.log("Error happened")
    }
  }

  let deleteProfile = async () => {
    let response = await api.delete("/user/profile/delete")
    let status = await response.status
    if (status === 204) {
      logoutUser();
    }
  }


  return (
    <React.Fragment>
      <DenseAppBar />
      <CssBaseline />
      <Container sx={{ width: '75%' }}>
        {openDeleteProfile && (<DeleteProfile opened={openDeleteProfile} setOpened={setOpenDeleteProfile} onSubmit={deleteProfile} />)}
        <Box sx={{ height: '50vh', 'mt': '2%', padding: 1 }} component='form' onSubmit={updateUserInfo}>
          {updated && (<Alert severity="success" onClose={() => setUpdated(false)}>User info has been updated successfully!</Alert>)}
          <Box>
            <TextField id="standard-basic" label="First name" variant="standard" name='first_name' value={firstName}
              onChange={(e) => setFirstName(e.target.value)} sx={{ m: 2, width: "50%" }} />
          </Box>
          <Box>
            <TextField id="standard-basic" label="Last Name" variant="standard" name='last_name'
              value={lastName} onChange={(e) => setLastName(e.target.value)} sx={{ m: 2, width: "50%" }} />
          </Box>
          <Box>
            <TextField id="standard-basic" label="Email address" variant="standard" name='email'
              value={email} onChange={(e) => setEmail(e.target.value)} sx={{ m: 2, width: "50%" }} disabled />
          </Box>
          <Box>
            <BasicDatePicker sx={{ 'm': 2 }} value={dateOfBirth} onChange={(NewValue) => setDateOfBirth(NewValue)} />
          </Box>
          <Box>
            <Box sx={{ width: "15%" }}>
              <FormControl fullWidth sx={{ m: 2 }}>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                  name='gender'
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Gender"
                >
                  <MenuItem value='Unspecified'>Unspecified</MenuItem>
                  <MenuItem value='Male'>Male</MenuItem>
                  <MenuItem value='Female'>Female</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: "35%" }}>
              <FormControl fullWidth sx={{ m: 2 }}>
                <InputLabel id="color-label">Primary currrency</InputLabel>
                <Select value={selectedCurrency} label="Primary Currency" size="small" sx={{ height: "10%" }} onChange={handleCurrencyChange}>
                  {currencies.map((currency, index) => (
                    <MenuItem value={currency.code} key={index}>
                      {`${currency.code} (${currency.name})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Stack direction="row" alignItems="center">
            <Button variant="contained" size="medium" sx={{ m: 2, }} type='submit' disabled={!isFormValid()}>
              Update Personal info
            </Button>
            <Button variant='contained' size='medium'
              sx={{ height: "10%", backgroundColor: "#607d8b", ":hover": { bgcolor: "#546e7a", color: "white" } }}
              onClick={logoutUser}>Log out</Button>
            <Button variant='contained' sx={{ ml: 2 }} color='error' onClick={() => setOpenDeleteProfile(!openDeleteProfile)}>Delete profile and all data</Button>
          </Stack>

        </Box>
      </Container>
    </React.Fragment>);
}
