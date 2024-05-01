"use client";

import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import deficitTable from "@/data/deficit-table.json";

export function DeficitCalculator() {
  const [currentCp, setCurrentCp] = useState<string | null>(null);
  const [recommendedCp, setRecommendedCp] = useState<string | null>(null);

  const onCurrentCpChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentCp(value ?? null);
  };

  const onRecommendedCpChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecommendedCp(value ?? null);
  };

  const percentageDeficit = getPercentageDeficit(currentCp, recommendedCp);
  const statPenalty = getStatPenalty(percentageDeficit);

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="space-y-1.5">
          <Label>Current CP</Label>
          <Input
            placeholder="Current CP"
            type="number"
            onChange={onCurrentCpChange}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Recommended CP</Label>
          <Input
            placeholder="Recommended CP"
            type="number"
            onChange={onRecommendedCpChange}
          />
        </div>
      </div>
      <div className="text-center">
        {currentCp && recommendedCp ? (
          <div className="h-8">
            Deficit: {percentageDeficit}
            {percentageDeficit && !percentageDeficit.startsWith("-") ? (
              <div>
                Your Nikke are affected by a {statPenalty} stat penalty.
              </div>
            ) : (
              <div>
                You are not below the recommended CP and do not have a stat
                penalty.
                <br />
              </div>
            )}
          </div>
        ) : (
          <div className="h-8">
            Enter your current and recommended CP to see the deficit
          </div>
        )}
      </div>
    </div>
  );
}

function getPercentageDeficit(
  currentCp: string | null,
  recommendedCp: string | null,
) {
  if (!currentCp || !recommendedCp) {
    return null;
  }
  const deficit = Number(recommendedCp) - Number(currentCp);
  const percentageDeficit = (deficit / Number(recommendedCp)) * 100;
  return percentageDeficit.toFixed(2) + "%";
}

function getStatPenalty(percentageDeficit: string | null) {
  if (!percentageDeficit) {
    return null;
  }
  for (const row of deficitTable) {
    if (percentageDeficit >= row["Deficit Percentage"]) {
      return row["New Stat Penalty"];
    }
  }
  return null;
}
