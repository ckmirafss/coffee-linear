'use client';

import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const LinearOptimization = () => {
    const [optimizedData, setOptimizedData] = useState({
        labels: ['Aroma', 'Flavor', 'Aftertaste', 'Acidity', 'Body', 'Balance'],
        datasets: [
            {
                label: 'Optimized Scores',
                data: [8.1, 8.3, 8.2, 8.0, 7.9, 8.2],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });

    const [predictionData, setPredictionData] = useState({
        labels: ['2023', '2024', '2025', '2026', '2027'],
        datasets: [
            {
                label: 'Predicted Quality Score',
                data: [7.5, 7.8, 8.0, 8.2, 8.4],
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                tension: 0.4,
            },
        ],
    });

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <h2 className="text-xl font-bold">Linear Optimization of Coffee Quality</h2>
            <div className="bg-white p-4 shadow-lg rounded-lg">
                <Bar data={optimizedData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </div>

            <h2 className="text-xl font-bold">Predictions for Future Quality Trends</h2>
            <div className="bg-white p-4 shadow-lg rounded-lg">
                <Line data={predictionData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </div>
        </div>
    );
};

export default LinearOptimization;
