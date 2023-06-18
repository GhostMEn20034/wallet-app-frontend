import { useState, useEffect, useRef } from "react";
import useAxios from '../utils/useAxios';
import { Typography, Box, Stack, Grid, Hidden, Button, Divider, LinearProgress } from "@mui/material";
import DenseAppBar from "./AppBar";
import DashboardCard, { CreateAccountCard } from "./DashboardsCards";
import EditAccount from "./EditAccount";
import AddAccount from "./AddAccount";
import CashFlow from "./charts/CashFlow";
import ExpenseStructure from "./charts/ExpenseStructure";


export default function Dashboard() {
    const [accounts, setAccounts] = useState([]);
    const [dashboardData, setDashboardData] = useState({});
    const [chosenAccount, setChosenAccount] = useState(null);
    const [chosenForEdit, setChosenForEdit] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openedEditWindow, setOpenedEditWindow] = useState(false);
    const [openedAddAccountWindow, setOpenedAddAccountWindow] = useState(false);

    const api = useAxios();

    let getAccounts = async () => {
        let response = await api.get('/accounts/')
        let data = await response.data
        setAccounts(data)
    }

    useEffect(() => {
        getAccounts();
    }, [])

    let getDashboardData = async () => {
        setLoading(true);
        let response = await api.get('/dashboard/');
        let data = await response.data;
        setDashboardData(data);
        setLoading(false);
    }

    useEffect(() => {
        getDashboardData();
    }, [])

    console.log(dashboardData);

    let handleOpenAddAccountWindow = () => {
        setOpenedAddAccountWindow(true);

    }

    let handleOpenEditAccountWindow = (index) => {
        setOpenedEditWindow(true);
        setChosenForEdit(index);
    }

    let handleChooseAccount = (accountId) => {
        setChosenAccount(accountId);
    }

    // console.log(chosenAccount);

    return (
        <div>
            <DenseAppBar location={"Dashboard"} />
            {openedEditWindow && (<EditAccount opened={openedEditWindow} setOpened={setOpenedEditWindow} data={accounts[chosenForEdit]} onSubmit={getAccounts} />)}
            {openedAddAccountWindow && (<AddAccount open={openedAddAccountWindow} setOpen={setOpenedAddAccountWindow} onSubmit={getAccounts} />)}
            <Box sx={{ mt: "75px" }}>
                <Stack sx={{ mt: "5%", backgroundColor: "#f5fffe", padding: 1, boxShadow: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                        {accounts.map((account, index) => (
                            <Grid item xs={2} key={index}>
                                <DashboardCard account={account} onClick={() => handleOpenEditAccountWindow(index)} chooseAccount={handleChooseAccount} />
                            </Grid>
                        ))}
                        <Grid item xs={2}>
                            <CreateAccountCard onClick={handleOpenAddAccountWindow} />
                        </Grid>
                    </Grid>
                </Stack>
                {chosenAccount && (
                    <Stack sx={{ mt: "5px" }} width="100%">
                        <Button size="small" variant="contained" sx={{ width: "15%", ml: "42.5%" }} onClick={() => setChosenAccount(null)}>Select all accounts</Button>
                    </Stack>
                )}
                <Stack sx={{ mt: "2%", padding: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4} sx={{ backgroundColor: "#f5fffe", boxShadow: 1, padding: 1, mr: "20px", height: "435px" }}>

                            <Stack>
                                <Stack sx={{ mb: "2%" }}>
                                    <Typography variant="h6"><b>Cash flow</b></Typography>
                                </Stack>
                                {!dashboardData.cash_flow ? (
                                    <div><LinearProgress /></div>
                                ) : (

                                    <Stack>
                                        <Divider />
                                        <Stack>
                                            <Typography variant="subtitle1">May</Typography>
                                            <Typography variant="h5"><b>{dashboardData.cash_flow.cash_flow_diff} {dashboardData.primary_currency}</b></Typography>
                                        </Stack>
                                        <Stack sx={{ mt: "10px" }}>
                                            <CashFlow income={dashboardData.cash_flow.total_amount_income} expense={dashboardData.cash_flow.total_amount_expense} currency={dashboardData.primary_currency} />
                                        </Stack>
                                    </Stack>
                                )}
                            </Stack>

                        </Grid>
                        <Grid item xs={4} sx={{ backgroundColor: "#f5fffe", boxShadow: 1, padding: 1, height: "435px" }}>

                            <Stack>
                                <Stack sx={{ mb: "2%" }}>
                                    <Typography variant="h6"><b>Expense structure</b></Typography>
                                </Stack>
                                {!dashboardData.expense_structure ? (
                                    <div><LinearProgress /></div>
                                ) : (

                                    <Stack>
                                        <Divider />
                                        <Stack>
                                            <Typography variant="subtitle1">May</Typography>
                                            <Typography variant="h5">
                                                <b>{(dashboardData.expense_structure.total_expense > 0 ? "-" : "")} {dashboardData.expense_structure.total_expense} {dashboardData.primary_currency}</b>
                                            </Typography>
                                        </Stack>
                                        <Stack sx={{ mt: "10px" }} alignContent="start">
                                            <ExpenseStructure data={dashboardData.expense_structure.by_category} currency={dashboardData.primary_currency} />
                                        </Stack>
                                    </Stack>
                                )}
                            </Stack>

                        </Grid>
                    </Grid>
                </Stack>
            </Box>
        </div>
    )
}