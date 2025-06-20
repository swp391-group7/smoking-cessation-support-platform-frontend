import React, { useState } from "react";
import { PlanTypeSelector } from "../../components/PlanTypeSelector";
import { PlanForm } from "../../components/PlanForm";
import { ColdTurkeyConfirmDialog } from "../../components/ColdTurkeyConfirmDialog";
import type { PlanType } from "@/api/plantype";

export default function QuitPlanPage() {
  const [planType, setPlanType] = useState<PlanType | null>(null);
  const [showColdTurkeyDialog, setShowColdTurkeyDialog] = useState(false);

  const handleSelectPlanType = (type: PlanType) => {
    setPlanType(type);
  };

  const handleColdTurkeySelect = () => {
    setShowColdTurkeyDialog(true);
  };

  const handleBack = () => {
    setPlanType(null);
  };

  const handleDialogClose = () => {
    setShowColdTurkeyDialog(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!planType ? (
        <PlanTypeSelector 
          onSelectPlanType={handleSelectPlanType} 
          onColdTurkeySelect={handleColdTurkeySelect}
        />
      ) : (
        <PlanForm planType={planType} onBack={handleBack} />
      )}
      
      <ColdTurkeyConfirmDialog 
        isOpen={showColdTurkeyDialog}
        onClose={handleDialogClose}
      />
    </div>
  );
}