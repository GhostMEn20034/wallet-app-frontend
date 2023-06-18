import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Slide, FormControl, Stack, MenuItem, Select, InputLabel, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState, forwardRef, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';
import CircleIcon from '@mui/icons-material/Circle';
import useAxios from '../utils/useAxios';


const colors = [
    "#26c6da",
    "#0097a7",
    "#0d47a1",
    "#1565c0",
    "#039be5",
    "#64b5f6",
    "#ff6f00",
    "#ffa000",
    "#ffb300",
    "#ce9600",
    "#8d6e63",
    "#6d4c41",
    "#d32f2f",
    "#ff1744",
    "#f44336",
    "#ec407a",
    "#AD1457",
    "#6a1b9a",
    "#ab47bc",
    "#ba68c8",
    "#00695c",
    "#00897b",
    "#4db6ac",
    "#2e7d32",
    "#43a047",
    "#64dd17",
    "#212121",
    "#5f7c8a",
    "#b0bec5",
    "#455A64",
    "#607d8b",
    "#90a4ae"
];


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddAccount({ open, setOpen, onSubmit }) {
    let [color, setColor] = useState("#26c6da");
    let [name, setName] = useState("");
    let [balance, setBalance] = useState(null);
    let [selectedCurrency, setSelectedCurrency] = useState("USD");
    let [loading, setLoading] = useState(false);
    let [currencies, setCurrencies] = useState([]);
    let [error, setError] = useState(null);


    let handleColorChange = (e) => {
        setColor(e.target.value);
    }

    let handleCurrencyChange = (e) => {
        setSelectedCurrency(e.target.value)
    }

    let api = useAxios();

    const handleClose = () => {
        setOpen(false);
    };

    let isFormValid = () => {
        return color.trim() && name.trim() && balance && selectedCurrency.trim();
    }

    let getCurrencies = async () => {
        let response = await api.get("/currencies/")
        let data = await response.data
        setCurrencies(data)
    }

    let createAccount = async () => {
        setLoading(true);
        try {
            let data = {"name": name, "balance": Number(balance), "currency": selectedCurrency, "color": color};
            let response = await api.post('/accounts/create', {...data});
            onSubmit();
            handleClose();
        } catch (error) {
            console.log(error)
            setError(error.response.data.detail)
        } finally {
            setLoading(false);
        }
        
    }

    useEffect(() => {
        getCurrencies();
    }, []);

    return (
        <div>
            <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
                <DialogTitle>Add account</DialogTitle>
                <Stack sx={{ "width": "550px", padding: 1 }}>
                    <DialogContent>
                        <Stack>
                            <Stack direction="row">
                                <TextField label="Name" sx={{ width: "75%" }} value={name} onChange={(e) => setName(e.target.value)} />
                                <Stack sx={{ marginLeft: "auto" }}>
                                    <FormControl sx={{ ml: "auto", width: "100%" }} fullWidth>
                                        <InputLabel id="color-label">Color</InputLabel>
                                        <Select value={color} label="Color" size="small" sx={{ height: "100%" }} onChange={handleColorChange}>
                                            {colors.map((color, index) => (
                                                <MenuItem value={color} key={index}>
                                                    <CircleIcon fontSize="large" sx={{ color: color, fontSize: 33 }} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Stack>
                            <Stack direction="row" sx={{ mt: "5%" }}>
                                <NumericFormat
                                    decimalScale={2}
                                    decimalSeparator="."
                                    allowNegative={false}
                                    // Use customInput prop to pass TextField component
                                    customInput={TextField}
                                    // Pass any additional props to TextField component
                                    label="Balance"
                                    name="balance"
                                    variant="standard"
                                    sx={{ "mt": "1%" }}
                                    fullWidth
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                />
                            </Stack>
                            <Stack sx={{ width: "50%", mt: "5%"}}>
                                    <FormControl sx={{ width: "100%", mt: "6%", ml: "auto" }}>
                                        <InputLabel id="color-label">Currrency</InputLabel>
                                        <Select value={selectedCurrency} label="Currency" size="small" sx={{ height: "100%" }} onChange={handleCurrencyChange}>
                                            {currencies.map((currency, index) => (
                                                <MenuItem value={currency.code} key={index}>
                                                    {`${currency.code} (${currency.name})`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Stack>
                                {error && (<Alert severity="error" sx={{mt: "5%"}} onClose={() => setError(null)}>{error}</Alert>)}        
                        </Stack>
                    </DialogContent>
                </Stack>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <LoadingButton disabled={!isFormValid()} loading={loading} onClick={createAccount} variant='outlined' sx={{ color: "green", width: "22%" }}>Submit</LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}