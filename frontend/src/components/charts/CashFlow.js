import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
let CanvasJS = CanvasJSReact.CanvasJS;
let CanvasJSChart = CanvasJSReact.CanvasJSChart;

class CashFlow extends Component {
	render() {
		const options = {
            height: 200,
			animationEnabled: true,
			theme: "light2",
			axisY: {
				title: "Amount",
				includeZero: true,
				labelFormatter: this.addSymbols,
                fontFamily: "Arial"
			},
            dataPointWidth: 30, 
            toolTip: {
                fontSize: 16,
                fontFamily: "Arial"
            },
			data: [{
				type: "bar",
                
                toolTipContent: "{y} {currency}",
				dataPoints: [
					{ y:  this.props.expense, label: "Expense", color: "red", currency: this.props.currency },
                    { y:  this.props.income, label: "Income", color: "green", currency: this.props.currency },
				]
			}]
		}
		return (
		<div>
			<CanvasJSChart options = {options}/>
		</div>
		);
    }
}    

export default CashFlow;