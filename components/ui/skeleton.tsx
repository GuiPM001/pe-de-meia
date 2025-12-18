function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-400 ${
        className || ""
      }`}
      {...props}
    />
  );
}

export { Skeleton };
