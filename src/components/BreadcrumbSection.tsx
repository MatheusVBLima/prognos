import Link from "next/link"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"

interface BreadcrumbsProps {
  items: {
    label: string
    href?: string
  }[]
}

export function BreadcrumbSection({ items }: BreadcrumbsProps) {
  if (items.length <= 1) {
    return null
  }
  
  return (
    <div className="min-w-0 overflow-hidden">
      <Breadcrumb>
        <BreadcrumbList className="flex-wrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <React.Fragment key={item.label}>
                <BreadcrumbItem className="min-w-0">
                  {isLast ? (
                    <BreadcrumbPage className="truncate">{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href!} className="truncate">{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}