import { useState, useEffect } from "react";
import { SERVER } from "@/utils/constants";
import api from "@/utils/api";
import { getQueryParam } from "@/utils";

export default function SponsorsInEvent() {
  const [id, setId] = useState<number | null>(null);
  const [sponsors, setSponsors] = useState<[number, string, string][]>([]);

  useEffect(() => {
    const eventId = getQueryParam("id");
    if (eventId) {
      setId(parseInt(eventId));
    }
  }, []);

  useEffect(() => {
    if (id || id === 0) {
      api.events.getSponsors(id).then(setSponsors);
    }
  }, [id]);

  return (
    sponsors.length > 0 && (
      <div>
        <h1 className="text-3xl font-semibold text-center">Patrocinadores</h1>
        <div className="flex flex-wrap gap-10 pt-10 justify-center">
          {sponsors.map(([_, name, image], index) => (
            <img
              key={index}
              src={`${SERVER}/${image}`}
              alt={name}
              className="w-40 h-36 object-scale-down rounded-md"
            />
          ))}
        </div>
      </div>
    )
  );
}
