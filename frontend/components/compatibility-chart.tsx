"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface CompatibilityChartProps {
  data: {
    category: string;
    value: number;
    color?: string;
  }[];
  size?: number;
  className?: string;
  animated?: boolean;
}

export function CompatibilityChart({
  data,
  size = 300,
  className,
  animated = true,
}: CompatibilityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = size * 2; // For retina displays
    canvas.height = size * 2;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(2, 2); // Scale for retina

    // Calculate total for percentage
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Draw chart
    let startAngle = 0;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    data.forEach((item, index) => {
      // Calculate angles
      const segmentAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = startAngle + segmentAngle;

      // Set colors
      const defaultColors = [
        "#4F46E5", // primary
        "#E11D48", // secondary
        "#06B6D4", // cyan
        "#8B5CF6", // violet
        "#10B981", // emerald
      ];

      const color = item.color || defaultColors[index % defaultColors.length];

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Draw segment label
      const labelRadius = radius * 0.7;
      const labelAngle = startAngle + segmentAngle / 2;
      const labelX = centerX + labelRadius * Math.cos(labelAngle);
      const labelY = centerY + labelRadius * Math.sin(labelAngle);

      ctx.font = "bold 12px sans-serif";
      ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Only show percentage for segments that are large enough
      if (segmentAngle > 0.2) {
        ctx.fillText(
          `${Math.round((item.value / total) * 100)}%`,
          labelX,
          labelY
        );
      }

      startAngle = endAngle;
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI);
    ctx.fillStyle = theme === "dark" ? "#1f1f23" : "#ffffff";
    ctx.fill();
    ctx.strokeStyle = theme === "dark" ? "#ffffff33" : "#00000033";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw total compatibility in center
    const avgCompatibility = Math.round(
      data.reduce((sum, item) => sum + item.value, 0) / data.length
    );

    ctx.font = "bold 24px sans-serif";
    ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${avgCompatibility}%`, centerX, centerY - 10);

    ctx.font = "12px sans-serif";
    ctx.fillStyle = theme === "dark" ? "#ffffff99" : "#00000099";
    ctx.fillText("Match", centerX, centerY + 15);
  }, [data, size, theme]);

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        className={cn("rounded-full", animated && "animate-pulse-slow")}
      />
    </div>
  );
}
