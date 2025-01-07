import { ReactNode } from "react";

interface PageHeadingProps {
  className?: string; // Custom className for styling
  children: ReactNode; // Content of the heading
}

export default function PageHeading({
  className = "",
  children,
}: PageHeadingProps) {
  return (
    <PageHeading
      className={`text-2xl font-bold tracking-tight mb-3 ${className}`}
    >
      {children}
    </PageHeading>
  );
}
