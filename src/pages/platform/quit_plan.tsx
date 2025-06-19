// src/pages/platform/quit-plan.tsx
import React, { useState } from "react";
import { PlanTypeSelector } from "../../components/PlanTypeSelector";
import { PlanForm } from "../../components/PlanForm";
import type { PlanType } from "@/api/plantype";

export default function QuitPlanPage() {
  const [planType, setPlanType] = useState<PlanType | null>(null);

  const handleSelectPlanType = (type: PlanType) => {
    setPlanType(type);
  };

  const handleBack = () => {
    setPlanType(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!planType ? (
        <PlanTypeSelector onSelectPlanType={handleSelectPlanType} />
      ) : (
        <PlanForm planType={planType} onBack={handleBack} />
      )}
    </div>
  );
}