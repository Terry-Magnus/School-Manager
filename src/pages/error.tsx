import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ErrorTypes {
  errorCode?: number;
  title?: string;
  message?: string;
}

export default function NotFound(props: ErrorTypes) {
  const navigate = useNavigate();
  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <img src="/notfound.png" alt="not-found" className="w-48" />
        <h2 className="text-[6rem] font-bold leading-tight">
          {props.errorCode || 404}
        </h2>
        <span className="font-medium">{props.title || "Page Not Found!"}</span>
        <p className="text-center text-muted-foreground">
          {props.message ||
            `It seems like the page you're looking for 
              does not exist or might have been removed.`}
        </p>
        <div className="mt-6 flex gap-4">
          <Button onClick={() => navigate(-1)}>Go Back</Button>
          {/* <Button onClick={() => navigate("/login")}>Back to Home</Button> */}
        </div>
      </div>
    </div>
  );
}
