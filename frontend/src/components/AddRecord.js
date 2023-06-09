import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Box, Stack, Typography } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { InputLabel, Select, MenuItem, Checkbox } from "@mui/material";
import { useState, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import useAxios from '../utils/useAxios';

const CategorySelect = ({ onChoose, onReset, categories }) => {
  // The state variables for the selected category and subcategory
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  // The handler function for changing the category
  const handleCategoryChange = (event) => {
    // Set the category state to the selected value
    setCategory(event.target.value);
    // Reset the subcategory state to an empty string
    setSubcategory("");
    onReset();
  };

  // The handler function for changing the subcategory
  const handleSubcategoryChange = (event) => {
    // Set the subcategory state to the selected value
    setSubcategory(event.target.value);
    onChoose(event.target.value);

  };

  // The JSX element that renders the select menu
  return (
    <div>
      {categories && (
        <div>
          {!category ? (
            <div>
              <FormControl sx={{ "width": "40%", mt: "2%", mr: "2%" }} variant='standard'>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={handleCategoryChange}
                >
                  {/* Map over the response data and create a menu item for each category */}
                  {categories.map((item) => (
                    <MenuItem key={item._id} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          ) : null}
          {/* Only render the subcategory select menu if a category is selected */}
          {category && (
            <div>
              <Button sx={{ mt: "4.5%", width: "10px" }} onClick={(e) => { setCategory(""); setSubcategory(""); onReset(); }}><ArrowBackIcon sx={{ color: "green" }}></ArrowBackIcon></Button>
              <FormControl sx={{ "width": "40%", mt: "2%", mr: "2%" }} variant='standard'>
                <InputLabel id="subcategory-label">Subcategory</InputLabel>
                <Select
                  labelId="subcategory-label"
                  value={subcategory}
                  onChange={handleSubcategoryChange}
                >
                  {/* Find the subcategories array that matches the selected category and create a menu item for each subcategory */}
                  {categories
                    .find((item) => item.name === category)
                    .subcategories.map((subitem) => (
                      <MenuItem key={subitem.name} value={subitem.name}>
                        {subitem.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default function FormDialog({ opened, onClose, onSubmit, accounts, categories }) {

  let [open, setOpen] = useState(opened);

  let [recordType, setRecordType] = useState("Expense");
  let [from, setFrom] = useState('');
  let [to, setTo] = useState('');
  let [amount, setAmount] = useState(null);
  let [category, setCategory] = useState("");
  let [loading, setLoading] = useState(false);
  let [useOwnExchangeRate, setUseOwnExchangeRate] = useState(false);
  let [customExchangeRate, setCustomExchangeRate] = useState(null);

  let api = useAxios();

  useEffect(() => {
    setTo('');
  }, [from, recordType]);

  let handleFromField = (e) => {
    setFrom(e.target.value)
  }

  let handleToField = (e) => {
    setTo(e.target.value)
  }

  const handleClose = () => {
    onClose();
  };

  let handleAmountChange = (e) => {
    setAmount(e.target.value);
  }

  let handleCategoryChoose = (category) => {
    setCategory(category)
  }


  let isFormValid = () => {
    // Check if the common fields are valid
    let commonValid = recordType.trim() && from.trim() && amount && amount >= 0.01;
    // If the recordType is not Transfer, return the commonValid value
    if (recordType !== "Transfer") return commonValid && category.trim();
    // If the recordType is Transfer, check if the to field is also valid
    let transferValid = to.trim() || (useOwnExchangeRate && customExchangeRate && customExchangeRate > 0);;
    // Return the result of combining the commonValid and transferValid values
    return commonValid && transferValid;
  }

  let createRecord = async () => {
    try {
      let data = { "account_id": from, "amount": amount, "record_type": recordType };
      if (recordType === 'Transfer') {
        data["receiver"] = to; // add receiver only if recordType is Transfer
        if (customExchangeRate && customExchangeRate > 0) { // check if customExchangeRate is not null or 0 or undefined
          data["conversion_rate"] = customExchangeRate; // add conversion_rate only if customExchangeRate is valid
        }
      } else {
        data["category"] = category; // add category only if recordType is not Transfer
      }
      let response = await api.post("/records/create", data); // use the same endpoint and data for both cases
      onSubmit();
    } catch (e) {
      console.log("Something went wrong")
    }
  }

  let handleSubmit = () => {
    setLoading(true);
    try {
      createRecord().then(
        () => {
          setLoading(false); // set loading to false only after createRecord is executed
          onClose();
        }
      );
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      {accounts && (
        <div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add record</DialogTitle>
            <DialogContent>
              {accounts.length > 0 ? (
                <div>
                  <FormControl sx={{ mt: "5%" }}>
                    <FormLabel id="demo-row-radio-buttons-group-label">Record type</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={recordType}
                      onChange={(e) => setRecordType(e.target.value)}
                    >
                      <FormControlLabel value="Expense" control={<Radio />} label="Expense" />
                      <FormControlLabel value="Income" control={<Radio />} label="Income" />
                      <FormControlLabel value="Transfer" control={<Radio />} label="Transfer" />
                    </RadioGroup>
                  </FormControl>
                  {accounts.length < 2 && recordType === 'Transfer' ? (<Typography variant='h6'>To create records with type "Transfer" you must have at least 2 accounts. <a href='/accounts'>Create another one</a> </Typography>) : (
                    <div>
                    <FormControl fullWidth sx={{ mt: "4%", width: "550px" }}>
                      <InputLabel id="account-select-label">{recordType === 'Income' ? "To" : "From"}</InputLabel>
                      <Select
                        name="from"
                        value={from}
                        onChange={handleFromField}
                        labelId="account-select-label"
                        id="account-select"
                        label="Account"
                        hidden
                      >
                        {accounts.map((account) => (
                          <MenuItem key={account._id} value={account._id}>
                            {account.name} ({account.balance} {account.currency})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  {recordType === 'Transfer' && ( // check if the record type is transfer
                    <Stack sx={{ width: "550px" }}>
                      <FormControl fullWidth sx={{ mt: '4%' }}>
                        <InputLabel id="account-select-label">To</InputLabel>
                        <Select
                          name="to"
                          value={to}
                          onChange={handleToField}
                          labelId="account-select-label"
                          id="account-select"
                          label="Account"
                          hidden
                        >
                          {accounts
                            .filter((account) => account._id !== from) // filter out the selected account from the first form
                            .map((account) => (
                              <MenuItem key={account._id} value={account._id}>
                                {account.name} ({account.balance} {account.currency})
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <FormControlLabel control={<Checkbox checked={useOwnExchangeRate} onChange={() => setUseOwnExchangeRate(!useOwnExchangeRate)} />} label="Use own exchange rate" sx={{ padding: 0 }} />
                      {useOwnExchangeRate && (
                        <NumericFormat
                          value={customExchangeRate}
                          onChange={(e) => setCustomExchangeRate(e.target.value)}
                          decimalScale={2}
                          decimalSeparator="."
                          allowNegative={false}
                          // Use customInput prop to pass TextField component
                          customInput={TextField}
                          // Pass any additional props to TextField component
                          label="Exchange rate"
                          name="exchange_rate"
                          fullWidth
                          variant="standard"
                          sx={{ "mt": "1%" }}
                        /> 
                      )}
                    </Stack>
                  )}
                  <NumericFormat
                    value={amount}
                    onChange={handleAmountChange}
                    decimalScale={2}
                    decimalSeparator="."
                    allowNegative={false}
                    // Use customInput prop to pass TextField component
                    customInput={TextField}
                    // Pass any additional props to TextField component
                    label="Amount"
                    name="amount"
                    fullWidth
                    variant="standard"
                    sx={{ "mt": "1%" }}
                  />
                  <Box sx={{ display: recordType === "Transfer" ? "none" : "block" }}>
                    <CategorySelect onChoose={handleCategoryChoose} onReset={() => setCategory("")} categories={categories} />
                  </Box>
                  </div> 
                  )}
                </div>
              ) : (
                <Typography variant='h6'>To create records with type "Expense" or "Income" you must have at least one account. <a href='/accounts'>Create One</a></Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <LoadingButton onClick={handleSubmit} variant='outlined' sx={{ color: "green", width: "22%" }} loading={loading} loadingPosition="start"
                disabled={!isFormValid()}>
                <span>Submit</span>
              </LoadingButton>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}