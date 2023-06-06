import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../utils/useAxios";
import { Stack, Button, Typography, CircularProgress, Box } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate } from "react-router-dom";
import BalanceChart from "./charts/BalanceTrend";
import dayjs from "dayjs";
import {fillMissingDate} from "../utils/FillMissingData";


export default function AccountDetail() {
    let [account, setAccount] = useState({});
    let [loading, setLoading] = useState(false);

    let api = useAxios();
    const navigate = useNavigate();
    const params = useParams();

    let accountId = params.id;

    let getAccount = async () => {
        setLoading(true);
        let response = await api.get(`/accounts/${accountId}`);
        let data = await response.data;
        setAccount(data);
        setLoading(false);
    }

    let fillEmptyData = () => {
      // Set the start date to the first day of the current month
      let start = dayjs().subtract(30, 'days');
      // Set the end date to the last day of the current month
      let end = dayjs();

      let current_period = fillMissingDate(account.current_period, start, end);
      return current_period
    }

    let percentageColor = (value) => {
      if (value > 0) {
        return "green";
      } else if (value === 0) {
        return "black";
      } else if (value < 1) {
        return "red"
      }
    }

    useEffect(
        () => {
          getAccount();
          console.log(account)
        }, []
      )
    
    let handleBack = () => {
      navigate('/accounts')
    }  

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        </Box>
      )
    } else {
      return (
        <div>
        
          <Stack sx={{padding: "1 rem"}}>
            
            <Stack sx={{py: "0.75%", px: "1.5%", backgroundColor: "#f5fffe", boxShadow: 1}} direction="row" alignItems="center">
              <Button size="small"
              sx={{width: "3%",minWidth: "15px" ,backgroundColor: "white", ":hover": { bgcolor: "#edebec"}}}
              variant="contained"
              onClick={handleBack}
              ><ArrowBackIosNewIcon sx={{"color": "black"}}/></Button>
              <Typography variant="h5" sx={{"marginLeft": 2}}>Account details</Typography>
              <Button size="small" variant="outlined" sx={{marginLeft: "auto"}}>Edit</Button>
              <Button size="small" variant="outlined" sx={{marginLeft: "2%"}} color="error">Delete</Button>
            </Stack>
            <Stack sx={{py: "1%", px: "2%", backgroundColor: "#f5fffe", boxShadow: 3, mt: "0.25%"}} direction="row">
              {account.color && (  
              <AccountBalanceWalletIcon sx={{fontSize: "105px", color: account.color}}/>
              )}
              <Stack sx={{"marginLeft": 2}}>
                <Typography variant="overline">Name</Typography>
                <Typography variant="subtitle2"><b>{account.name}</b></Typography>
                <Typography variant="overline">Created on</Typography>
                <Typography variant="subtitle2"><b>{dayjs(account.created_at).format("LL")}</b></Typography>
              </Stack>
            </Stack>
            <Stack sx={{py: "1%", px: "2%", backgroundColor: "#f5fffe", boxShadow: 3, mt: "0.25%"}}>
                <Stack direction="row" alignItems="center">
                <Stack>
                <Typography variant="overline">Balance</Typography>
                <Typography variant="h6"><b>{account.balance}&nbsp;{account.currency}</b></Typography>
                </Stack>
                <Stack sx={{ml: "10%"}}>
                <Typography variant="overline">Vs previous period</Typography>  
                <Typography sx={{color: percentageColor(account.percentage_change)}} variant="h6"><b>{account.percentage_change}&nbsp;%</b></Typography>  
                </Stack>
                </Stack>
                <Stack sx={{width: '100%', mt: "2%"}}>  
                {account.current_period &&(
                <BalanceChart data={fillEmptyData()}/>
                )}
                </Stack>
            </Stack>
          </Stack>
        </div>   
      )
      }
}
