import { useEffect, useState } from "react";
import Timer from "@/components/Timer";
import api from "@/utils/api";
import { getQueryParam } from "@/utils";

export default function EventInfo() {
  const [eventId, setEventId] = useState<number | null>(null);
  const [info, setInfo] = useState<[string, string]>([
    "HackMx",
    "2022-01-01T00:00:00Z",
  ]);

  useEffect(() => {
    const eventId = parseInt(getQueryParam("id") ?? "");
    setEventId(eventId);
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      api.events.getEventInfo(eventId).then(setInfo);
    }
  }, [eventId]);

  return (
    <>
      <h1 className="text-6xl font-bold text-center uppercase">{info[0]}</h1>
      <div className="pb-4">
        <Timer
          duration={Math.floor(
            (new Date(info[1]).getTime() - new Date().getTime()) / 1000
          )}
          pause={false}
        />
      </div>
    </>
  );
}
