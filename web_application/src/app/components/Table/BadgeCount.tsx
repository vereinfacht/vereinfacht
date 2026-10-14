import React from 'react'
import { Badge } from '../ui/badge'

export default function BadgeCount({count}: {count: number | string}) {
  return <Badge
        className="absolute top-0 -right-1 -translate-y-1/2 flex items-center justify-center rounded-full text-[9px] font-semibold pt-0.25 pb-[0.03125rem] px-0.5 leading-none"
        variant="primary"
    >
        {count}
    </Badge>
}