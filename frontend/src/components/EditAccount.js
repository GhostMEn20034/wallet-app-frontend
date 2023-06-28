import { useState, forwardRef } from "react";
import useAxios from "../utils/useAxios";
import CircleIcon from '@mui/icons-material/Circle';
import {
    Dialog,
    Slide,
    Button,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Stack,
    TextField
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { NumericFormat } from "react-number-format";


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


export default function EditAccount({ opened, setOpened, data, onSubmit }) {
    let [color, setColor] = useState(data.color);
    let [name, setName] = useState(data.name);
    let [balance, setBalance] = useState(data.balance);
    let [currency, setCurrency] = useState(data.currency);
    let [loading, setLoading] = useState(false);

    let api = useAxios();

    let handleColorChange = (e) => {
        setColor(e.target.value);
    }

    const handleClose = () => {
        setOpened();
    };

    let isFormValid = () => {
        return color.trim() && name.trim() && balance.toString().trim();
    }

    let handleSubmit = async () => {
        setLoading(true);
        let reqBody = { "name": name, "color": color, "balance": Number(balance) }

        let response = await api.put(`accounts/${data._id}/update`, {...reqBody })

        let status = await response.status

        if (status === 200) {
            onSubmit();
            handleClose();
        }
    }

    return (
        <div>
            <Dialog
                open={opened}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Edit account"}</DialogTitle>
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
                                <Stack sx={{ width: "50%", marginLeft: "auto" }}>
                                    <FormControl sx={{ width: "50%", mt: "6%", ml: "auto" }}>
                                        <InputLabel id="color-label">Currrency</InputLabel>
                                        <Select value={currency} size="small" label="currency1" sx={{ height: "100%" }} disabled={true}>
                                            <MenuItem value={currency} >
                                                {currency}
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Stack>
                        </Stack>
                    </DialogContent>
                </Stack>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <LoadingButton variant='outlined' sx={{ color: "green", width: "22%" }} 
                    onClick={handleSubmit} loadingPosition="start" disabled={!isFormValid()} loading={loading}>
                        <span>Submit</span>
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}
