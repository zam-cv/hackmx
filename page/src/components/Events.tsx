import { useState, useEffect } from "react";
import Event from "./Event";
import api, { type Event as IEvent } from "@/utils/api";

export default function Events() {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    api.events.list()
      .then(setEvents)
      .then(() => document.getElementById("loading")?.classList.add("hidden"));
  }, []);

  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {events.map((event, i) => <Event key={i} event={event} />)}
  </div>
}