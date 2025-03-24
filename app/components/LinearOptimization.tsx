"use client";
import { Chart, registerables } from "chart.js";
import { useCallback, useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";

Chart.register(...registerables);

type Attributes = "Aroma" | "Flavor" | "Aftertaste" | "Acidity" | "Body" | "Balance";

const coefficients: Record<Attributes, number> = {
    Aroma: 1.1605,
    Flavor: 1.2373,
    Aftertaste: 1.0790,
    Acidity: 1.1943,
    Body: 1.0387,
    Balance: 1.2583,
};

const generateRandomAttributes = (): Record<Attributes, number> =>
    Object.fromEntries(
        Object.keys(coefficients).map((key) => [key, (Math.random() * 5 + 5).toFixed(2)])
    ) as unknown as Record<Attributes, number>;

export default function LinearOptimization() {
    const [attributes, setAttributes] = useState(generateRandomAttributes);

    const predictedScore = useMemo(() => {
        return (
            28.93 +
            Object.entries(attributes).reduce(
                (sum, [key, value]) => sum + value * coefficients[key as Attributes],
                0
            )
        );
    }, [attributes]);

    const futurePredictions = useMemo(() => {
        return Object.fromEntries(
            Object.keys(attributes).map((key) => [
                key,
                Array.from({ length: 5 }, (_, i) => predictedScore + Math.random() * (i + 1)),
            ])
        ) as Record<Attributes, number[]>;
    }, [attributes, predictedScore]);

    const colors = useMemo(
        () =>
            Object.keys(attributes).map((_, index) => {
                const hue = (index * 60) % 360;
                return {
                    borderColor: `hsl(${hue}, 70%, 50%)`,
                    backgroundColor: `hsla(${hue}, 70%, 50%, 0.5)`,
                };
            }),
        [attributes]
    );

    const contributionData = {
        labels: ["Now"],
        datasets: Object.keys(attributes).map((key, index) => ({
            label: key,
            data: [attributes[key as Attributes] * coefficients[key as Attributes]],
            ...colors[index],
            borderWidth: 1,
        })),
    };

    const trendData = {
        labels: ["Now", "+1 Year", "+2 Years", "+3 Years", "+4 Years", "+5 Years"],
        datasets: [
            {
                label: "Predicted Quality Score",
                data: [predictedScore, ...Array.from({ length: 5 }, () => predictedScore + Math.random() * 2)],
                borderColor: "#007bff",
                backgroundColor: "rgba(0, 123, 255, 0.5)",
                fill: true,
            },
            ...Object.keys(attributes).map((key, index) => ({
                label: key,
                data: [predictedScore, ...futurePredictions[key as Attributes]],
                ...colors[index],
                fill: true,
            })),
        ],
    };

    const handleChange = useCallback((key: Attributes, value: number) => {
        setAttributes((prev) => ({ ...prev, [key]: value.toFixed(2) }));
    }, []);


    return (
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

            {/* Attribute Contribution Chart */}
            <div className="mt-5">
                <h3 className="text-lg font-bold mb-3">Attribute Contribution to Score</h3>
                <Bar data={contributionData} options={{ responsive: true }} />
            </div>

            {/* Future Quality Trend Chart */}
            <div className="mt-5">
                <h3 className="text-lg font-bold mb-3">Future Quality Trend</h3>
                <Line data={trendData} options={{ responsive: true }} />
            </div>
        </div>
    );
}
