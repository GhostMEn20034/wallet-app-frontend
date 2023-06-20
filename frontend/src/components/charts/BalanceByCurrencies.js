import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
let CanvasJS = CanvasJSReact.CanvasJS;
let CanvasJSChart = CanvasJSReact.CanvasJSChart;

class BalanceByCurrencies extends Component {
	render() {
		const options = {
            backgroundColor: "#f5fffe",
            height: 300,
			animationEnabled: true,
			theme: "light2",
			axisY: {
				title: "Balance",
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
					...this.props.data.map((item) => (
                        {"y": item.balance_by_currency, "label": item._id, "currency": item._id}
                    ))
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

export default BalanceByCurrencies;