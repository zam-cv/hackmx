import { useNavigate } from "react-router-dom"

import {
  Building2,
  ShieldHalf,
  History,
  Wrench
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function Detail({
  id,
  title,
  description,
  children,
  message,
  route
}: {
  id: number,
  title: string,
  description: string,
  children: React.ReactNode,
  message: string,
  route: string
}) {
  const navigate = useNavigate()

  function handleClick() {
    navigate(`/events/${id}/${route}`)
  }

  return <Card x-chunk="dashboard-01-chunk-0" className="cursor-pointer" onClick={handleClick}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-2xl font-bold">
        {title}
      </CardTitle>
      {children}
    </CardHeader>
    <CardContent>
      <div className="text-sm font-medium">{description}</div>
      <p className="text-xs text-muted-foreground">
        {message}
      </p>
    </CardContent>
  </Card>
}

export default function EventSettings({ id }: { id: number }) {
  return <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
    <Detail id={id} title="Sponsors" description="Total sponsors for this event" message="Google, Facebook, Microsoft, Apple ..." route="sponsors">
      <Building2 className="h-4 w-4 text-muted-foreground" />
    </Detail>
    <Detail id={id} title="Teams" description="Configure teams for this event" message="Quota per team, Universities ..." route="teams">
      <ShieldHalf className="h-4 w-4 text-muted-foreground" />
    </Detail>
    <Detail id={id} title="Event scheduling" description="Schedule the event" message="Timeline, Shows ..." route="scheduling">
      <History className="h-4 w-4 text-muted-foreground" />
    </Detail>
    <Detail id={id} title="More" description="More details about the event" message="Delete, Archive ..." route="more">
      <Wrench className="h-4 w-4 text-muted-foreground" />
    </Detail>
  </div>
}