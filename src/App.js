import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const tokenFile = require("./apikey.json")
let URL =
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=VFIAX&outputsize=compact&apikey=${tokenFile.key}`;

const Chart = () => {
    const [rawData, setRawData] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        console.log("loading data");
        fetch(URL)
            .then(r => r.json())
            .then(resp => {
                // console.log(resp);
                setRawData(resp);
                console.log("loaded data");
            })
            .catch(err => console.error(`Could not load data, ${err}`));
    }, []);

    useEffect(() => {
        if (rawData) {
            const oldData = rawData["Time Series (Daily)"];
            const keys = Object.keys(oldData);
            let newData = [];

            keys.forEach(date => {
                // console.log(date)
                // console.log(oldData[date]["5. adjusted close"])
                newData.push({
                    Date: date,
                    ClosePrice: oldData[date]["5. adjusted close"],
                    y: oldData[date]["5. adjusted close"]
                });
            });
            // console.log(newData);
            setData({
                labels: keys,
                datasets: [
                    {
                        label: "VFIAX - Adjusted Closing prices, USD",
                        data: newData,
                        backgroundColor: ["rgba(65,175,255, 0.5)"],
                        borderColor: ["rgba(65,175,255, 1)"],
                        borderWidth: 3
                    }
                ]
            });
        }
    }, [rawData]);

    return (
        <div>
            {data && (
                <Line
                    data={data}
                    height={512}
                    options={{
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [
                                {
                                    stacked: false
                                }
                            ]
                        }
                    }}
                />
            )}
        </div>
    );
};

function App() {
    return (
        <div>
            <h1 className="text-center">Stonks</h1>
            <p className="text-center">
                <strong>VFIAX</strong> stock prices for the past 100 days
            </p>
            <hr />
            <Chart />
        </div>
    );
}

export default App;
