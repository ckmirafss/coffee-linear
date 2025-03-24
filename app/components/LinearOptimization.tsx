"use client"
import { Chart, registerables } from "chart.js";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

Chart.register(...registerables);

type Attributes = "Aroma" | "Flavor" | "Aftertaste" | "Acidity" | "Body" | "Balance";

const coefficients: Record<Attributes, number> = {
    Aroma: 1.160547466,
    Flavor: 1.237281464,
    Aftertaste: 1.078977677,
    Acidity: 1.19430757,
    Body: 1.038680792,
    Balance: 1.258261504,
};

export default function LinearOptimization() {
    const [attributes, setAttributes] = useState<Record<Attributes, number>>({
        Aroma: 7,
        Flavor: 7,
        Aftertaste: 7,
        Acidity: 7,
        Body: 7,
        Balance: 7,
    });

    const predictedScore = useMemo(() => {
        let score = 28.93;
        Object.keys(attributes).forEach((key) => {
            score += attributes[key as Attributes] * coefficients[key as Attributes];
        });
        return score;
    }, [attributes]);

    const futurePredictions = useMemo(() => {
        const trendSlope = 0.5;
        return Array.from({ length: 5 }, (_, i) => predictedScore + trendSlope * (i + 1));
    }, [predictedScore]);

    const contributionData = {
        labels: Object.keys(attributes),
        datasets: [
            {
                label: "Attribute Contribution to Score",
                data: Object.keys(attributes).map((key) => attributes[key as Attributes] * coefficients[key as Attributes]),
                borderColor: "#ff7300",
                backgroundColor: "rgba(255, 115, 0, 0.5)",
                fill: true,
            },
        ],
    };

    const trendData = {
        labels: ["Now", "+1 Year", "+2 Years", "+3 Years", "+4 Years", "+5 Years"],
        datasets: [
            {
                label: "Predicted Quality Score",
                data: [predictedScore, ...futurePredictions],
                borderColor: "#007bff",
                backgroundColor: "rgba(0, 123, 255, 0.5)",
                fill: true,
            },
        ],
    };

    const handleChange = (key: Attributes, value: number) => {
        setAttributes((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="container mx-auto">
            <div className="p-5 bg-black shadow-lg rounded-lg">
                <h2 className="text-xl font-bold mb-4">Coffee Quality Optimization</h2>
                <p className="mb-2">Predicted Total Cup Points: {predictedScore.toFixed(2)}</p>

                <div className="grid grid-cols-3 gap-4">
                    {Object.keys(attributes).map((key) => (
                        <div key={key} className="flex flex-col">
                            <label className="font-semibold">{key}</label>
                            <input
                                type="range"
                                min="5"
                                max="10"
                                step="0.1"
                                value={attributes[key as Attributes]}
                                onChange={(e) => handleChange(key as Attributes, parseFloat(e.target.value))}
                                className="w-full"
                            />
                            <span>{attributes[key as Attributes]}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-5">
                    <h3 className="text-lg font-bold mb-3">Attribute Contribution to Score</h3>
                    <Line data={contributionData} />
                </div>

                <div className="mt-5">
                    <h3 className="text-lg font-bold mb-3">Future Quality Trend</h3>
                    <Line data={trendData} />
                </div>
            </div>
        </div>
    );
}
