// src/App.js
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const StockChart = ({ data }) => {
  // Create a data object for counting occurrences of days of the week
  const dayOfWeekData = data
    ? data.reduce((acc, entry) => {
        const day = entry["Day"];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {})
    : [];

  // Assign numerical values to days of the week for sorting
  const dayOrder = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  // Convert data object to array of objects and sort by day of the week
  const dayOfWeekChartData = Object.keys(dayOfWeekData)
    .map((day) => ({
      dayOfWeek: day,
      count: dayOfWeekData[day],
      dayOrder: dayOrder[day],
    }))
    .sort((a, b) => a.dayOrder - b.dayOrder);

  // Create a data object for counting occurrences of time slots from 9:30 AM to 3:15 PM for each day of the week
  const timeDataByDay = data
    ? data.reduce((acc, entry) => {
        const day = entry["Day"];
        const time = entry["Buy Time"];
        const timeHours = parseInt(time.split(":")[0], 10);
        const timeMinutes = parseInt(time.split(":")[1], 10);
        if (
          (timeHours === 9 && timeMinutes >= 30) ||
          (timeHours === 10 && timeMinutes <= 15) ||
          (timeHours > 9 && timeHours < 15)
        ) {
          acc[day] = acc[day] || {};
          acc[day][time] = (acc[day][time] || 0) + 1;
        }
        return acc;
      }, {})
    : [];

  // Convert timeDataByDay object to arrays of objects and sort by time
  const timeChartDataByDay = Object.keys(timeDataByDay).map((day) => {
    const dayData = timeDataByDay[day];
    const timeChartData = Object.keys(dayData).map((time) => {
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return {
        timeSlot: date,
        count: dayData[time],
        dayOfWeek: day,
      };
    });
    timeChartData.sort((a, b) => a.timeSlot - b.timeSlot);
    return timeChartData;
  });

  // Convert time back to formatted time strings for each day of the week
  const formattedTimeChartDataByDay = timeChartDataByDay.map((timeChartData) =>
    timeChartData.map((data) => ({
      timeSlot: data.timeSlot.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      count: data.count,
      dayOfWeek: data.dayOfWeek,
    })),
  );

  // Create a data object for counting occurrences of time slots from 9:30 AM to 3:15 PM
  const timeData = data.reduce((acc, entry) => {
    const time = entry["Buy Time"];
    const timeHours = parseInt(time.split(":")[0], 10);
    const timeMinutes = parseInt(time.split(":")[1], 10);
    if (
      (timeHours === 9 && timeMinutes >= 30) ||
      (timeHours === 10 && timeMinutes <= 15) ||
      (timeHours > 9 && timeHours < 15)
    ) {
      acc[time] = (acc[time] || 0) + 1;
    }
    return acc;
  }, {});
  // Convert timeData object to array and sort by time
  const timeChartData = Object.keys(timeData).map((time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return {
      timeSlot: date,
      count: timeData[time],
    };
  });

  timeChartData.sort((a, b) => a.timeSlot - b.timeSlot);

  // Convert time back to formatted time strings
  const formattedTimeChartData = timeChartData.map((data) => ({
    timeSlot: data.timeSlot.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    count: data.count,
  }));
  return (
    <div>
      {/* Bar Chart for Stock Transaction Data by Day of the Week */}
      <h2>Stock Transaction Data by Day of the Week</h2>
      <BarChart width={600} height={300} data={dayOfWeekChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dayOfWeek" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
      <h2>Stock Transaction Data by Time from 9:30 AM to 3:15 PM</h2>
      <BarChart width={800} height={400} data={formattedTimeChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timeSlot" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
      {/* Bar Charts for Stock Transaction Data by Time for Each Day of the Week */}
      {formattedTimeChartDataByDay.map((timeChartData, index) => (
        <div key={index}>
          <h2>{timeChartData[0].dayOfWeek} - Stock Transaction Data by Time</h2>
          <BarChart width={800} height={400} data={timeChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeSlot" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </div>
      ))}
    </div>
  );
};
function App() {
  const [files, setFiles] = useState([]);
  const [data, setData] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles([...selectedFiles]);
  };

  const handleUpload = () => {
    if (files.length === 0) {
      console.log("No files selected.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          setData(data.data);
        } else {
          console.log("Error: No data received from the server.");
        }
      })
      .catch((error) => {
        console.error("Error occurred during file upload:", error);
      });
  };

  return (
    <div className="App">
      <h1>CSV File Upload</h1>
      <input type="file" name="files" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <div>
        <h1>Stock Transaction Data Chart</h1>
        <StockChart data={data} />
      </div>
    </div>
  );
}

export default App;
