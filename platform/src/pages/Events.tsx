import moment from "moment"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import api, { SimpleEvent } from "@/utils/api"

import {
  SquareGanttChart
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function Event(
  { id, title, startDate, endDate, location }:
    { id: number, title: string, startDate: string, endDate: string, location: string }
) {
  const navigate = useNavigate()

  function handleClick() {
    navigate(`/events/${id}`)
  }

  return (
    <Card x-chunk="event" className="cursor-pointer select-none" onClick={handleClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          {title}
        </CardTitle>
        <SquareGanttChart className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">{moment(startDate).format("DD/MM/YYYY")} - {moment(endDate).format("DD/MM/YYYY")}</div>
        <p className="text-xs text-muted-foreground">
          {location}
        </p>
      </CardContent>
    </Card>
  )
}

export default function Events() {
  const [events, setEvents] = useState<SimpleEvent[]>([])

  useEffect(() => {
    api.events.list()
      .then((events) => {
        setEvents(events)
      })
  }, [])

  function handleCreateEvent() {
    api.events.create()
      .then((event) => {
        setEvents([...events, event])
      })
  }

  return <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
    <div className="flex justify-end">
      <Button className="font-bold py-2 px-4 rounded text-foreground" onClick={handleCreateEvent}>
        Create Event
      </Button>
    </div>
    {
      events.length !== 0 ?
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {events.map((event) => {
            return <Event
              key={event.id}
              id={event.id}
              title={event.title}
              startDate={event.start_date}
              endDate={event.end_date}
              location={event.location}
            />
          })}
        </div> :
        <div className="flex flex-1 justify-center">
          <div className="text-muted-foreground text-center">
            Not available events
          </div>
        </div>
    }
  </main>
}