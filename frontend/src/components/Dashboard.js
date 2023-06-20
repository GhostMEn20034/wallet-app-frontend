import { useState, useEffect } from "react";
import useAxios from '../utils/useAxios';
import { Typography, Box, Stack, Grid, Button, Divider, LinearProgress, Paper, Link } from "@mui/material";
import DenseAppBar from "./AppBar";
import DashboardCard, { CreateAccountCard } from "./DashboardsCards";
import EditAccount from "./EditAccount";
import AddAccount from "./AddAccount";
import CashFlow from "./charts/CashFlow";
import ExpenseStructure from "./charts/ExpenseStructure";
import BalanceByCurrencies from "./charts/BalanceByCurrencies";
import formatNumber from "../utils/formatNumber";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { RecordAmount } from "./RecordsHistory";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DateRangePicker from "./DateFilter";

export default function Dashboard() {
    const [accounts, setAccounts] = useState([]);
    const [dashboardData, setDashboardData] = useState({});
    const [chosenAccount, setChosenAccount] = useState(null);
    const [chosenForEdit, setChosenForEdit] = useState(null);
    const [openedEditWindow, setOpenedEditWindow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openedAddAccountWindow, setOpenedAddAccountWindow] = useState(false);
    const [filters, setFilters] = useState({});

    const api = useAxios();

    const navigate = useNavigate();

    let getAccounts = async () => {
        let response = await api.get('/accounts/')
        let data = await response.data
        setAccounts(data)
    }

    useEffect(() => {
        getAccounts();
    }, [])

    let getDashboardData = async () => {
        setLoading(true)
        let params = {
            "account_id": filters.accountId ? filters.accountId : undefined,
            "start_date": filters.startDate ? filters.startDate : undefined,
            "end_date": filters.endDate ? filters.endDate : undefined
        }


        let response = await api.get('/dashboard/', { "params": params });
        let data = await response.data;
        setDashboardData(data);
        setLoading(false)
    }

    useEffect(() => {
        getDashboardData();
    }, [filters])

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: "#f3fffe",
        ...theme.typography.body2,
        padding: theme.spacing(1),
        // textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

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
        setFilters((prev) => {
            return { ...prev, accountId: accountId }
        })
    }

    let handleResetChosenAccount = () => {
        setChosenAccount(null);
        setFilters((prev) => {
            return { ...prev, accountId: null }
        })
    }

    let handleClickOnAccount = id => {
        navigate(`/accounts/${id}`)
    }

    let onSubmit = () => {
        getAccounts();
        getDashboardData();
    }

    console.log(filters)
    console.log(accounts)

    return (
        <div>
            <DenseAppBar location={"Dashboard"} />
            {openedEditWindow && (<EditAccount opened={openedEditWindow} setOpened={setOpenedEditWindow} data={accounts[chosenForEdit]} onSubmit={onSubmit} />)}
            {openedAddAccountWindow && (<AddAccount open={openedAddAccountWindow} setOpen={setOpenedAddAccountWindow} onSubmit={onSubmit} />)}
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
                        <Button size="small" variant="contained" sx={{ width: "15%", ml: "42.5%" }} onClick={handleResetChosenAccount}>Select all accounts</Button>
                    </Stack>
                )}
                {accounts.length > 0 ? (
                <div>
                <Stack sx={{ mt: 1 }} alignItems="center" justifyContent="center">
                    <DateRangePicker setFilters={setFilters} defaultShortcut={4} />
                </Stack>
                <Stack sx={{ mt: "1.5%", padding: 1 }}>
                    
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={4} sx={{ backgroundColor: "#f5fffe", boxShadow: 1, padding: 1, height: "435px" }}>
                                <Stack>
                                    <Stack sx={{ mb: "2%" }}>
                                        <Typography variant="h6"><b>Cash flow</b></Typography>
                                    </Stack>
                                    <Divider />
                                    {loading ? (
                                        <div><LinearProgress /></div>
                                    ) : (
                                        // Check if dashboardData and dashboardData.cash_flow are defined
                                        dashboardData.cash_flow ? (
                                            <Stack>

                                                <Stack>
                                                    <Typography variant="h5"><b>{dashboardData.cash_flow?.cash_flow_diff} {dashboardData.primary_currency}</b></Typography>
                                                </Stack>
                                                <Stack sx={{ mt: "10px" }}>
                                                    <CashFlow income={dashboardData.cash_flow?.total_amount_income} expense={dashboardData.cash_flow?.total_amount_expense} currency={dashboardData.primary_currency} />
                                                </Stack>
                                            </Stack>
                                        ) : (
                                            <Stack sx={{ mt: "150px" }} alignItems="center">
                                                <Typography variant="h6"><b>There's no data in the current period</b></Typography>
                                            </Stack>
                                        )
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={4} sx={{ backgroundColor: "#f5fffe", boxShadow: 1, padding: 1, height: "435px" }}>
                                <Stack>
                                    <Stack sx={{ mb: "2%" }}>
                                        <Typography variant="h6"><b>Expense structure</b></Typography>
                                    </Stack>
                                    <Divider />
                                    {loading ? (
                                        <div><LinearProgress /></div>
                                    ) : (
                                        dashboardData.expense_structure ? (
                                            <Stack>
                                                <Stack>
                                                    <Typography variant="h5">
                                                        <b>{(dashboardData.expense_structure.total_expense > 0 ? "-" : "")}{dashboardData.expense_structure.total_expense} {dashboardData.primary_currency}</b>
                                                    </Typography>
                                                </Stack>
                                                <Stack sx={{ mt: "10px" }} alignContent="start">
                                                    <ExpenseStructure data={dashboardData.expense_structure.by_category} currency={dashboardData.primary_currency} />
                                                </Stack>
                                            </Stack>
                                        ) : (
                                            <Stack sx={{ mt: "150px" }} alignItems="center">
                                                <Typography variant="h6"><b>There's no data in the current period</b></Typography>
                                            </Stack>
                                        )
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={4} sx={{ backgroundColor: "#f5fffe", boxShadow: 1, padding: 1, height: "435px" }}>
                                <Stack>
                                    <Stack sx={{ mb: "2%" }}>
                                        <Typography variant="h6"><b>Balance by currencies</b></Typography>
                                    </Stack>
                                    {!dashboardData.balance_by_currencies ? (
                                        <div><LinearProgress /></div>
                                    ) : (
                                        <Stack>
                                            <Divider />
                                            <Stack sx={{ mt: "10px" }}>
                                                <BalanceByCurrencies data={dashboardData.balance_by_currencies} />
                                            </Stack>
                                        </Stack>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={4} sx={{ backgroundColor: "#f5fffe", boxShadow: 1, padding: 1, height: "435px", mt: "10px" }}>
                                <Stack>
                                    <Stack sx={{ mb: "2%" }}>
                                        <Typography variant="h6"><b>Dashboard</b></Typography>
                                    </Stack>
                                    <Divider />
                                    {loading ? (
                                        <div><LinearProgress /></div>
                                    ) : (
                                        dashboardData.dashboard ? (
                                            <Stack alignItems="center">
                                                <Stack sx={{ mt: "125px", ml: "10px" }} direction="row" alignItems="center">
                                                    <Stack sx={{ mr: "20px" }} alignItems="center">
                                                        <CreditCardIcon fontSize="large" />
                                                        <Typography variant="overline">Balance</Typography>
                                                        <Typography variant="h4">{formatNumber(dashboardData.dashboard.account_sum)}</Typography>
                                                    </Stack>
                                                    <Stack sx={{ mr: "20px" }} alignItems="center">
                                                        <CreditCardIcon fontSize="large" />
                                                        <Typography variant="overline">Cash flow</Typography>
                                                        <Typography variant="h4">{dashboardData.dashboard.cash_flow ? formatNumber(dashboardData.dashboard.cash_flow) : 0}</Typography>
                                                    </Stack>
                                                    <Stack alignItems="center">
                                                        <CreditCardIcon fontSize="large" />
                                                        <Typography variant="overline">Spending</Typography>
                                                        <Typography variant="h4">{Number(dashboardData.dashboard.spending) > 0 ? "-" : ""}{dashboardData.dashboard.spending ? formatNumber(Number(dashboardData.dashboard.spending)) : 0}</Typography>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        ) : (
                                            <Stack>

                                            </Stack>
                                        )
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={4} sx={{ backgroundColor: "#f5fffe", boxShadow: 1, padding: 1, height: "435px", mt: "10px" }}>
                                <Stack>
                                    <Stack sx={{ mb: "2%" }} direction="row">
                                        <Typography variant="h6"><b>Accounts</b></Typography>
                                        <Button size="small" variant="outlined" sx={{ borderRadius: 8, ml: "auto" }}>
                                            <Link href="/accounts" underline="none">Accounts</Link>
                                        </Button>
                                    </Stack>
                                    {!dashboardData ? (
                                        <div><LinearProgress /></div>
                                    ) : (
                                        <Stack>
                                            <Divider />
                                            <Stack sx={{ mt: "10px", ml: "0px" }} alignItems="center">
                                                {accounts && accounts.map((item, index) => (
                                                    <Stack key={index}>

                                                        <Item key={item._id} sx={{ mb: "3.5%", display: "flex", width: "375px", alignItems: "center", padding: 1.5, ":hover": { "cursor": "pointer" } }}
                                                            onClick={() => handleClickOnAccount(item._id)}>
                                                            <AccountBalanceWalletIcon fontSize="large" sx={{ color: item.color }} />
                                                            <Typography sx={{ ml: "2%", color: "black" }}><b>{item.name}</b></Typography>
                                                            <Typography sx={{ ml: "auto", color: "black" }}><b>{item.balance}&nbsp;{item.currency}</b></Typography>
                                                        </Item>

                                                    </Stack>
                                                ))}
                                            </Stack>
                                        </Stack>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={4} sx={{ backgroundColor: "#f5fffe", boxShadow: 1, padding: 1, height: "435px", mt: "10px" }}>
                                <Stack>
                                    <Stack sx={{ mb: "2%" }} direction="row">
                                        <Typography variant="h6"><b>Last records</b></Typography>
                                        <Button size="small" variant="outlined" sx={{ borderRadius: 8, ml: "auto" }}>
                                            <Link href="/records" underline="none">Records</Link>
                                        </Button>
                                    </Stack>
                                    {loading ? (
                                        <div><LinearProgress /></div>
                                    ) : (
                                        dashboardData.last_records ? (
                                            <Stack>
                                                <Stack sx={{ ml: "10px" }} alignItems="center">
                                                    {dashboardData.last_records.map((record) => (
                                                        <div>
                                                            <Divider />
                                                            <Item key={record._id} sx={{ display: "flex", alignItems: "center", width: "375px", height: "45px", boxShadow: 0 }}>
                                                                <Typography sx={{ ml: "2%", mr: "2%", color: "black", width: "15%" }}><b>{record.category}</b></Typography>
                                                                <FiberManualRecordIcon fontSize='small' sx={{ color: record.account_color, ml: "5%" }} />
                                                                <Typography sx={{ ml: "2%" }}>{record.account_name}</Typography>
                                                                <RecordAmount recordType={record.record_type} amount={record.amount} currency={record.account_currency} />
                                                            </Item>
                                                        </div>
                                                    ))}
                                                </Stack>
                                            </Stack>
                                        ) : (
                                            <Stack sx={{ mt: "150px" }} alignItems="center">
                                                <Typography variant="h6"><b>There's no data in the current period</b></Typography>
                                            </Stack>
                                        )
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                    
                </Stack>
                </div>
                ) : (
                    <Stack sx={{ mt: "150px" }} alignItems="center">
                        <Typography variant="h5"><b>There's no to analyze</b></Typography>
                    </Stack>
                )}
            </Box>
        </div>
    )
}