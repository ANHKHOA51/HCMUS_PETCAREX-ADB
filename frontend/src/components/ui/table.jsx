import React from "react"
import { twMerge } from "tailwind-merge"

export const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={twMerge("w-full caption-bottom text-sm", className)} {...props} />
  </div>
))
Table.displayName = "Table"

export const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={twMerge("border-b bg-gray-50", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

export const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={twMerge("[&_tr:last-child]:border-0", className)} {...props} />
))
TableBody.displayName = "TableBody"

export const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={twMerge("bg-gray-50 font-medium", className)} {...props} />
))
TableFooter.displayName = "TableFooter"

export const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={twMerge("border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-100", className)}
    {...props}
  />
))
TableRow.displayName = "TableRow"

export const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={twMerge(
      "h-12 px-4 text-left align-middle font-medium text-gray-700 [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

export const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={twMerge("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
))
TableCell.displayName = "TableCell"

export const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption ref={ref} className={twMerge("mt-4 text-sm text-gray-500", className)} {...props} />
))
TableCaption.displayName = "TableCaption"
