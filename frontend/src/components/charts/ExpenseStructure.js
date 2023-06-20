import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
//var CanvasJSReact = require('@canvasjs/react-charts');
 
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class ExpenseStructure extends Component {
	render() {
		const options = {
			backgroundColor: "#f5fffe",
            height: 300,
			animationEnabled: true,
			subtitles: [{
				// verticalAlign: "center",
				fontSize: 16,
				// dockInsidePlotArea: true,
                fontFamily: "Arial"
			}],
			data: [{
				type: "doughnut",
				indexLabel: "{name}",
				yValueFormatString: `#.## ${this.props.currency}`,
				dataPoints: [
					...this.props.data.map((item) => (
                        {"name": item._id, "y": item.total_amount, "currency": this.props.currency}
                    ))
				]
			}]
		}
		return (
		<div>
			<CanvasJSChart options = {options} />
		</div>
		);
	}
}

export default ExpenseStructure;