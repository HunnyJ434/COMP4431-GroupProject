'use client'
import React from 'react'
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const capitalizeFirstWord = (subtype: string) => {
  return subtype ? subtype.charAt(0).toUpperCase() + subtype.slice(1) : "";
};

const DoughnutChart = ({ accounts }: any) => {
  // Ensure accounts is an array before proceeding
  if (!Array.isArray(accounts) || accounts.length === 0) {
    return <p className="text-center text-gray-500">No accounts available</p>; 
  }

  const data = {
    labels: accounts.map((account: { subtype: any }) => capitalizeFirstWord(account.subtype)), 
    datasets: [{
      label: 'Bank',
      data: accounts.map((account: { balance: any }) => account.balance ?? 0), 
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
      ],
      hoverOffset: 4
    }]
  };

  return (
    <Doughnut 
      data={data} 
      options={{
        cutout: "69%",
        plugins: {
          legend: {
            display: false
          }
        }
      }} 
    />
  );
};

export default DoughnutChart;
