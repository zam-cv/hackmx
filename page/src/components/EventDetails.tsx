import { useEffect, useState } from "react";
import Timer from "@/components/Timer";
import Button from "@/components/Button";
import { getQueryParam } from "@/utils";
import api, { type RegistrationDetails, type Event } from "@/utils/api";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import Tasks from "@/components/Tasks";
import { ButtonDisabled } from "@/components/Button";
import FQA from "./FQA";
import SponsorsInEvent from "./SponsorsInEvent";

export default function EventDetails() {
  const [registrationDetails, setRegistrationDetails] = useState<RegistrationDetails | null>(null);
  const [participants, setParticipants] = useState<number>(0);
  const [quota, setQuota] = useState<number>(0);
  const [id, setId] = useState<number | null>(null);
  const [event, setEvent] = useState<Event>({
    id: 0,
    title: "HackMx ...",
    description: "...",
    quota_per_team: 4,
    start_date: "2022-01-01T00:00:00Z",
    end_date: "2022-01-01T00:00:00Z",
    location: "Campus Estado de México",
    map_url: "...",
  });

  const [withBus, setWithBus] = useState<boolean>(false);

  useEffect(() => {
    const eventId = getQueryParam("id");
    if (eventId) {
      setId(parseInt(eventId));
    }
  }, []);

  useEffect(() => {
    if (id || id === 0) {
      api.events.get(id).then((data) => {
        if (!data) {
          window.location.href = "/dashboard";
        }

        setEvent(data);
        document.getElementById("loading")?.classList.add("hidden");

        api.events.getParticipantsCount(id).then(setParticipants);

        api.events.getQuota(id).then(setQuota);
      }).catch(() => {
        window.location.href = "/dashboard";
      })

      api.events.getRegistrationDetails(id).then((data) => {
        if (!data) {
          window.location.href = "/dashboard";
        }

        setRegistrationDetails(data);
      }).catch(() => {
        window.location.href = "/dashboard";
      })
    }
  }, [id]);

  function handleInscription() {
    api.events.registerToEvent(id ?? 0, withBus).then(() => {
      if (registrationDetails) {
        setRegistrationDetails({
          ...registrationDetails,
          user_in_event: true,
        });
      }

      handleViewTeams();
    });
  }

  function handleViewTeams() {
    window.location.href = `/teams?id=${id}`;
  }

  return (
    <>
      <div>
        <div
          className="md:w-[40rem] bg-p-secondary-background p-10 pt-16 rounded-sm flex flex-col gap-5 relative"
        >
          <div className="absolute top-0 left-0 p-2 bg-[#4a4d82] rounded-br-md px-3">
            <p className="text-sm">Tecnológico de Monterrey</p>
          </div>
          <div>
            <p className="text-p-secondary-text">{event.location}</p>
          </div>
          <h1 className="text-4xl font-bold">{event.title}</h1>
          <div className="flex flex-col gap-1">
            <p className="text-p-secondary-text text-sm">
              <span className="font-bold">Inicio:</span> {format(new Date(event.start_date), "dd - MM - yyyy HH:mm")}
            </p>
            <p className="text-p-secondary-text text-sm">
              <span className="font-bold">Fin:</span> {format(new Date(event.end_date), "dd - MM - yyyy HH:mm")}
            </p>
            <p className="text-p-secondary-text text-sm">
              <span className="font-bold">Participantes:</span> {participants} / {quota}
            </p>
          </div>
          <div className="flex justify-end">
            <div className="w-56 flex justify-end">
              {
                registrationDetails === null ? <Button>...</Button> : (
                  registrationDetails.user_in_event ? (
                    <div className="w-40 flex justify-end">
                      <Button onClick={handleViewTeams}>Ver equipos</Button>
                    </div>
                  ) : (
                    registrationDetails.quota_available ? (
                      <div className="flex flex-col gap-3">
                        <p className="text-p-secondary-text text-sm flex items-center justify-center gap-2">
                          <span className="font-bold">¿Requieres autobús? </span> <Checkbox checked={withBus} onClick={() => setWithBus(!withBus)} />
                        </p>
                        <Button onClick={handleInscription}>Inscribirme</Button>
                      </div>
                    ) : (
                      <div>
                        <ButtonDisabled>Evento no Disponible</ButtonDisabled>
                      </div>
                    )
                  )
                )
              }
            </div>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 lg:gap-10 gap-16">
        <div className="flex flex-col gap-10">
          <h1 className="text-3xl font-semibold">Resumen</h1>
          <p className="text-p-secondary-text">
            {event.description}
          </p>
        </div>
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-10">
            <h1 className="text-3xl text-center font-semibold">Tiempo Restante</h1>
            <div>
              <Timer duration={Math.floor((new Date(event.start_date).getTime() - new Date().getTime()) / 1000)} pause={false} />
            </div>
          </div>
        </div>
      </div>
      <SponsorsInEvent />
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <FQA eventId={id} />
        </div>
        <div>
          <Tasks eventId={id} />
        </div>
      </div>
      <div className="h-96 w-full">
        <iframe
          src={event.map_url}
          width="100%" height="100%" style={{ border: "0", filter: "contrast(0.9) invert(1) sepia(0.5) saturate(1.2) hue-rotate(180deg)" }}
          allowFullScreen={false} loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </>
  );
}