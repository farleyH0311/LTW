"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface PersonalityTraitData {
  trait: string;
  value: number;
  color?: string;
}

interface PersonalityRadarChartProps {
  data: PersonalityTraitData[];
  size?: number;
  className?: string;
  animated?: boolean;
}

export function PersonalityRadarChart({
  data,
  size = 400,
  className,
  animated = true,
}: PersonalityRadarChartProps) {
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

    // Calculate center and radius
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 67;
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw radar background
    const levels = 5;
    const angleStep = (Math.PI * 2) / data.length;

    // Draw level circles and spokes
    for (let level = 1; level <= levels; level++) {
      const levelRadius = (radius * level) / levels;

      // Draw level circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, levelRadius, 0, Math.PI * 2);
      ctx.strokeStyle =
        theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
      ctx.stroke();

      // Draw spokes
      for (let i = 0; i < data.length; i++) {
        const angle = i * angleStep - Math.PI / 2; // Start from top

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        ctx.lineTo(x, y);
        ctx.strokeStyle =
          theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
        ctx.stroke();

        // Draw trait labels
        const labelRadius = radius + 15;
        const labelX = centerX + labelRadius * Math.cos(angle);
        const labelY = centerY + labelRadius * Math.sin(angle);

        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(data[i].trait, labelX, labelY);
      }
    }

    // Draw data points and connect them
    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const angle = i * angleStep - Math.PI / 2; // Start from top
      const value = data[i].value;
      const pointRadius = (radius * value) / 100;

      const x = centerX + pointRadius * Math.cos(angle);
      const y = centerY + pointRadius * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    // Close the path
    ctx.closePath();

    // Fill with gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(
      0,
      theme === "dark" ? "rgba(79, 70, 229, 0.4)" : "rgba(79, 70, 229, 0.2)"
    );
    gradient.addColorStop(
      1,
      theme === "dark" ? "rgba(236, 72, 153, 0.4)" : "rgba(236, 72, 153, 0.2)"
    );

    ctx.fillStyle = gradient;
    ctx.fill();

    // Stroke the outline
    ctx.strokeStyle =
      theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data points
    for (let i = 0; i < data.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const value = data[i].value;
      const pointRadius = (radius * value) / 100;

      const x = centerX + pointRadius * Math.cos(angle);
      const y = centerY + pointRadius * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = data[i].color || "#4F46E5";
      ctx.fill();
      ctx.strokeStyle = theme === "dark" ? "#ffffff" : "#000000";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }, [data, size, theme]);

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        className={cn(animated && "animate-pulse-slow")}
      />
    </div>
  );
}
