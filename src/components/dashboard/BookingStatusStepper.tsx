"use client";

import { cn } from "@/lib/utils";
import { Check, Package, Truck, Undo2, Hourglass } from "lucide-react";

type Status = "pending payment" | "confirmed" | "shipped" | "delivered" | "returned";

const steps: {
  id: Status;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "pending payment", label: "Pending", icon: Hourglass },
  { id: "confirmed", label: "Confirmed", icon: Check },
  { id: "shipped", label: "Shipped", icon: Truck },
  { id: "delivered", label: "Delivered", icon: Package },
  { id: "returned", label: "Returned", icon: Undo2 },
];

const BookingStatusStepper = ({ currentStatus }: { currentStatus: Status }) => {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStatus);

  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => {
        const isActive = index <= currentStepIndex;
        return (
          <div key={step.id} className="flex items-center w-full relative">
            <div className="flex flex-col items-center gap-1 text-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300",
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                <step.icon className="w-4 h-4" />
              </div>
              <p
                className={cn(
                  "text-xs transition-colors duration-300",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 bg-muted absolute top-4 left-1/2 -z-10">
                <div
                  className={cn(
                    "h-full bg-primary transition-all duration-500",
                    isActive ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BookingStatusStepper;
