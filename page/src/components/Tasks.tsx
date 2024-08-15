import { useEffect, useState } from "react";
import api, { type EventTask } from "@/utils/api";
import { format } from "date-fns";
import { getQueryParam } from "@/utils";

export function WrapperTasks() {
  const [eventId, setEventId] = useState<number | null>(null);

  useEffect(() => {
    const eventId = getQueryParam("id");
    if (eventId) {
      setEventId(parseInt(eventId));
    }
  }, []);

  return (
    <div className="grid grid-cols-1 gap-10">
      <Tasks eventId={eventId} />
    </div>
  )
}

export default function Tasks({ eventId }: { eventId: number | null }) {
  const [tasks, setTasks] = useState<EventTask[]>([]);

  useEffect(() => {
    if (eventId) {
      api.events.getTasks(eventId).then(setTasks);
    }
  }, [eventId]);

  if (tasks.length === 0) {
    return null;
  }

  return (
    <>
      <h1 className="text-3xl font-semibold text-center">Programación del Evento</h1>
      <div className="pt-5 m-auto max-[450px]:-ml-10 flex justify-center w-full">
        <ol className="relative border-s border-white ml-5">
          {tasks.map((task, i) => (
            <li key={i} className="mb-7 ms-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-p-background">
                <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </span>
              <h3 className="mb-1 text-lg font-semibold">{task.title}</h3>
              <p className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Acordado para el {format(new Date(task.date), "dd - MM - yyyy")} a las {format(new Date(task.date), "HH:mm")}</p>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">{task.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </>

  )
}