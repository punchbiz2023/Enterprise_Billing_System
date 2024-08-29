import React from 'react';
import { Line } from 'react-chartjs-2'; // Import Line chart from react-chartjs-2
import Navbar from '../Navbar/Navbar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required components for the chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Sample data for the chart
  const data = {
    labels: [
      'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024',
      'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025',
    ],
    datasets: [
      {
        label: 'Cash Flow',
        data: [2000, 3000, 5000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000], // Replace with real data if available
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 1, 
      },
    ],
  };

  const cashFlowData = {
    labels: [
      'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024',
      'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025',
    ],
    datasets: [
      {
        label: 'Income',
        data: [0, 500, 10000, 700, 12000, 1600, 13000, 1800, 17000, 19000, 21000, 23000],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        borderWidth: 1,
      },
      {
        label: 'Expense',
        data: [0, 3000, 8000, 4000, 3900, 14000, 5000, 15000, 13000, 1700, 18000, 12000],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
        borderWidth: 1,
      },
    ],
  };


  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Cash Flow',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + 'K'; // Customize the tick labels
          },
        },
      },
    },
  };
  const chartoptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income vs. Expense',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + 'K';
          },
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="flex justify-center gap-6 mt-20">
        {/* Total Receivables Card */}
        <div className="bg-white shadow rounded-lg p-5 w-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Receivables</h3>
          </div>
          <p className="text-md text-gray-500">Total Unpaid Invoices ₹15000.00</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className="text-blue-500 text-xl font-bold ">CURRENT</div>
              <div className="text-black text-xl font-bold">₹1500.00</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-red-500 text-xl font-bold">OVERDUE</div>
              <div className="text-black text-xl font-bold">₹2300.00</div>
            </div>
          </div>
        </div>

        {/* Total Payables Card */}
        <div className="bg-white shadow rounded-lg p-5 w-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Payables</h3>
          </div>
          <p className="text-md text-gray-500">Total Unpaid Bills ₹10000.00</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className="text-blue-500 text-xl font-bold">CURRENT</div>
              <div className="text-black text-xl font-bold">₹5000.00</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-red-500 text-xl font-bold">OVERDUE</div>
              <div className="text-black text-xl font-bold">₹4500.00</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-10 mx-auto w-[85%] bg-white shadow rounded-lg p-5">
        <Line data={data} options={options} />
      </div>
      <div className="mt-10 mx-auto w-[85%] bg-white shadow rounded-lg p-5">
        <Line data={cashFlowData} options={chartoptions} />
      </div>
    </div>
  );
};

export default Dashboard;
