import { useState, useEffect } from "react";
import Card from "@/components/Card";
import { type Event as IEvent } from "@/utils/api";
import { format } from "date-fns";

export default function Event({ event, user_in_event }: { event: IEvent, user_in_event: boolean }) {
  const [isEventFinished, setIsEventFinished] = useState<boolean>(false);
  const [isEventActive, setIsEventActive] = useState<boolean>(false);

  useEffect(() => {
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    const now = new Date();
    setIsEventActive(startDate <= now && now <= endDate);
    setIsEventFinished(now > endDate);
  }, [event]);

  return (
    <a
      className="min-h-56 max-h-96 max-w-[30rem]" 
      href={`${isEventFinished ? "/dashboard" : (isEventActive ? (user_in_event ? `/event/?id=${event.id}` : "/dashboard") : `/invitation/?id=${event.id}`)}`}
    >
      <Card>
        <div className="w-full h-full p-5 grid grid-rows-[auto_1fr_auto] gap-2">
          <h1 className="text-2xl">{event.title}</h1>
          <div>
            <p className="text-p-secondary-text font-normal line-clamp-4">
              {event.description}
            </p>
          </div>
          <div className="grid grid-cols-[1fr_auto]">
            <p>{event.location}</p>
            <p className="text-p-secondary-text font-normal">{format(new Date(event.start_date), "dd - MM - yyyy")}</p>
          </div>
        </div>
      </Card>
    </a>
  )
}