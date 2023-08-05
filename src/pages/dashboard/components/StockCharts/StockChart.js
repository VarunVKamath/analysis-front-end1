import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const StockChart = ({ data }) => {
    console.log(data);
  const formattedData = data?data.map((entry) => ({
    time: new Date(entry['Buy Time']),
    buyPrice: entry['Buy Price'],
    sellPrice: entry['Sell Price'],
  })):[]

  return (
    <LineChart width={800} height={400} data={formattedData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="buyPrice" stroke="#8884d8" name="Buy Price" />
      <Line type="monotone" dataKey="sellPrice" stroke="#82ca9d" name="Sell Price" />
    </LineChart>
  );
};

export default StockChart;
