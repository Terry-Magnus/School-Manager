import React, { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

export type IAlertProps = {
  type: "success" | "error";
  title: string;
  description: string;
  duration?: number; // Duration in milliseconds (default: 5000ms)
  onClose?: () => void; // Callback to handle closing
};

const CustomAlert: React.FC<IAlertProps> = ({
  type,
  title,
  description,
  duration = 2000,
  onClose,
}) => {
  const isSuccess = type === "success";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose!();
    }, duration); // Close the alert after the specified duration
    return () => clearTimeout(timer); // Clear timer on unmount
  }, [duration, onClose]);

  return (
    <div className="fixed z-50 top-5 right-5 shadow-md">
      <Alert className={`border ${isSuccess ? "bg-green-600" : "bg-red-600"}`}>
        <div className="flex items-center space-x-3">
          {isSuccess ? (
            <CheckCircle className="text-white w-6 h-6" />
          ) : (
            <XCircle className="text-white w-6 h-6" />
          )}
          <div className="text-white">
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
          </div>
        </div>
      </Alert>
      <button
        className="absolute top-2 right-2 text-white hover:text-gray-600"
        onClick={onClose} // Manually close alert
      >
        ✕
      </button>
    </div>
  );
};

export default CustomAlert;
