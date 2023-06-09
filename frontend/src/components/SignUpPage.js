import axios from 'axios';
import { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { baseUrl } from '../APIBaseURL';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ConfirmCode from './ConfirmCode';




function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        Wallet App
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



export function ErrorOrNothing(props) {
  let error;
  if (props.error === null) {
    error = null;
  } else {
    error = props.error;
  }

  console.log(error)

  return error ? (
    <Alert variant="outlined" severity="error" sx={{ "mt": "4%" }} {...props}>
      {props.error}
    </Alert>
  ) : null;
}




const theme = createTheme();

export default function SignUp() {
  // const navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [primaryCurrency, setPrimaryCurrency] = useState("USD");
  const [currencies, setCurrencies] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  let getCurrencies = async () => {
    let response = await axios.get(`${baseUrl}/currencies/`)
    let data = await response.data
    setCurrencies(data)
  }

  useEffect(() => {
    getCurrencies();
  }, [])

  const isFormValid = () => {
    return (
      email.trim() &&
      password1.trim() &&
      password2.trim()
    );
  };


  const handleBack = () => {
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios.post(`${baseUrl}/signup/validate-credentials`, {
      email: data.get('email'),
      primary_currency: primaryCurrency,
      password1: data.get('password1'),
      password2: data.get('password2')
    }).then(response => {
      setSubmitted(true)
      console.log(submitted)
    })
      .catch(error => {
        if (error.response.status === 422) {
          // console.log(error.response.data.detail[0].msg)
          let errorTitle = error.response.data.detail[0].msg;
          let CapitalizedError = errorTitle.charAt(0).toUpperCase() + errorTitle.slice(1);
          setError(CapitalizedError)
        } else {
          setError(error.response.data.detail);
        }
      })
  };

  return (
    <div>
      {!submitted ? (
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl sx={{ width: "100%", mt: "6%", ml: "auto" }}>
                      <InputLabel id="color-label">Primary currrency</InputLabel>
                      <Select value={primaryCurrency} label="Primary currency" size="small" sx={{ height: "100%" }} onChange={(e) => setPrimaryCurrency(e.target.value)}>
                        {currencies.map((currency, index) => (
                          <MenuItem value={currency.code} key={index}>
                            {`${currency.code} (${currency.name})`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={password1}
                      onChange={(e) => setPassword1(e.target.value)}
                      required
                      fullWidth
                      name="password1"
                      label="Password"
                      type="password"
                      id="password1"
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                      required
                      fullWidth
                      name="password2"
                      label="Confirm password"
                      type="password"
                      id="password2"
                      autoComplete="new-password"
                    />
                  </Grid>
                </Grid>

                <ErrorOrNothing error={error} onClose={() => setError(null)} />

                <Button
                  disabled={!isFormValid()}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href={window.location.origin + "/login"} variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Container>
        </ThemeProvider>
      ) : (
        <ConfirmCode onBack={handleBack} email={email} password1={password1} password2={password2} primaryCurrency={primaryCurrency} />
      )}
    </div>
  );
}