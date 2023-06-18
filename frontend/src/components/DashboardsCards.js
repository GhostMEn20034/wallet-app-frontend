import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { CardHeader, IconButton, CardActionArea, Checkbox } from '@mui/material';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

export default function DashboardCard({account, onClick, chooseAccount}) {

  let handleClick = (e) => {
    e.stopPropagation();
    onClick();
  }

  return (
    <Card sx={{ maxWidth: 345, backgroundColor: account.color, height: "110px"}}>
      <CardActionArea onClick={() => chooseAccount(account._id)}>
      <CardHeader
        title={account.name}
        titleTypographyProps={{ variant: 'h5', color: 'white' }}
        action={  
          <IconButton aria-label="edit" onClick={handleClick} sx={{color: "white"}}>
            <EditIcon />
          </IconButton>
        }
      />  
      <CardContent sx={{mt: "-16px"}}>
        <Typography variant="subtitle1" color="white">
         {account.balance}&nbsp;{account.currency}
        </Typography>
      </CardContent>
      </CardActionArea>
    </Card>
  );
}


export function CreateAccountCard({onClick}) { // Use a named export instead of a default export
    return (
      <Card sx={{ maxWidth: 345, backgroundColor: 'transparent', height: "109px", border: '1px solid #5E35B1'}}>
        <CardActionArea onClick={onClick}>
          <CardHeader
            title="Create Account"
            titleTypographyProps={{ variant: 'h5', color: 'purple' }}
            action={
              <IconButton aria-label="add">
                <AddIcon />
              </IconButton>
            }
          />  
          <CardContent sx={{mt: "-16px"}}>
            <Typography variant="subtitle1" color="white">
             Click here to create a new account
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }