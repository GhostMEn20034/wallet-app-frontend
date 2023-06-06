import { Stack } from "@mui/material";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
import { 
    LineController, 
    PointElement, 
    LineElement, 
    CategoryScale, 
    LinearScale, 
    Title, 
    Tooltip, 
    Legend,
    Chart
  } from "chart.js"; // import CategoryScale and Chart

  Chart.register(
    LineController, 
    PointElement, 
    LineElement, 
    CategoryScale, 
    LinearScale, 
    Title, 
    Tooltip, 
    Legend
  );



 export default function BalanceChart({data}) {

      // Extract the dates and balances from the data
      let current_period = data
  
      const datesCurrentPeriod = current_period.map((item) => item.date.slice(0, 10));
      const formatedDates = current_period.map((item) => dayjs(item.date).format("MM/DD")) 
      const balancesCurrentPeriod = current_period.map((item) => item.balance);
  

      // Define the chart options
      const options = {
        scales: {
          x: {
            ticks: {
                autoSkip: true,
                maxRotation: 0,
                callback: function(val, index) {
                    // Hide every 2nd tick label
                    return index % 4 === 0 ? this.getLabelForValue(val) : '';
                  },// it should work
              }
            },
        },
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,// make the legend icon circle form
              filter: function(item) {
                // return false to hide the item, true to show it
                return item.datasetIndex !== 1; 
            }}
          },
          tooltip: {
            // add this property
            mode: "index", // set the mode to 'index'
            intersect: false,
            backgroundColor: "white",
            titleColor: "black",
            bodyColor: "black",
            bodyFont: {size: 18},
            padding: 15,
            yAlign: "bottom",
            usePointStyle: true,
            callbacks: {
              label: function (context) {
                // get the dataset index and data index from the context
                const dataIndex = context.dataIndex;
                // get the value from the context
                const value = context.dataset.data[dataIndex];
                // if the dataset index is 1 (the second dataset), get the date from the datesPastPeriod array
                const date = dayjs(datesCurrentPeriod[dataIndex]).format("LL")
                // otherwise, return the default string with the date and value
                // use the <strong> tag to make the value bold
                return `   ${date}   ${value}`;
              },
              labelColor: function (context) {
                // get the dataset index from the context
                const datasetIndex = context.datasetIndex;
                // if the dataset index is 1 (the second label), return transparent colors
                if (datasetIndex === 1) {
                  return {
                    borderColor: "transparent",
                    backgroundColor: "transparent",
                  };
                } else {
                  // otherwise, return the default colors from the dataset
                  return {
                    borderColor: context.dataset.borderColor,
                    backgroundColor: context.dataset.backgroundColor,
                  };
                }
              },
              labelTextColor: function(context) {
                return '#000000';
              },
              title: function() {
                return null;
              } 
            }
          }
        },
        aspectRatio: 3,
      };
      
      // Define the chart data
      const chartData = {
        labels: formatedDates,
        datasets: [
          {
            label: "Balance",
            data: balancesCurrentPeriod,
            fill: false,
            borderColor: "#426cf5",
            backgroundColor: "#426cf5", // change the line color
            pointStyle: "circle", // change the legend icon
            tension: 0.4, // make the line curly
            pointRadius: 5, // hide the points by default
            borderCapStyle: 'round', // make the line have round caps
            borderJoinStyle: 'bevel' // make the line have bevel joins
          },

        ],
        
      };

      return (
        <Stack sx={{height: "50%",width: "100%"}}>
         <Line data={chartData} options={options} />
        </Stack>
      )
 }
// The data provided by the user