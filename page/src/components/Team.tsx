import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Input from "@/components/Input";
import api, { type Team, type ParticipantDetails } from "@/utils/api";

function Leader({ name }: { name: string }) {
  return <div className="flex p-5 gap-5 bg-[#0e143b] border border-p-border rounded-lg">
    <div className="flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    </div>
    <div>
      <h4 className="text-base font-bold line-clamp-1">{name}</h4>
    </div>
  </div>
}

function Member({
  event_id,
  team_id,
  member_id,
  name,
  participantDetails,
  deleteMember
}: {
  event_id: number | null,
  team_id: number | null,
  member_id: number,
  name: string,
  participantDetails: ParticipantDetails,
  deleteMember: (member_id: number) => void
}) {
  function handleDeleteMember() {
    if (!team_id || !event_id) return;

    api.events.deleteMember(event_id, member_id).then(() => {
      deleteMember(member_id);
    });
  }

  return <div className="grid grid-cols-[auto_1fr_auto] p-5 gap-5 bg-[#0e143b] border border-p-border rounded-lg w-full">
    <div className="flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    </div>
    <div>
      <h4 className="text-base font-bold line-clamp-1">{name}</h4>
    </div>
    <div className="flex justify-end items-center text-p-secondary-text">
      {
        participantDetails.is_leader && participantDetails.team_id === team_id ? (
          <span onClick={handleDeleteMember} className="cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </span>
        ) : null
      }
    </div>
  </div>
}

export default function Team(
  {
    event_id,
    team_id,
    participantDetails,
    members,
    setMembers,
    isPublic,
    isPrivate,
    setNameTeam,
    removeMember,
    open,
    setOpen
  }: {
    event_id: number | null,
    team_id: number | null,
    participantDetails: ParticipantDetails,
    members: [number, string][],
    setMembers: (members: [number, string][]) => void,
    isPublic: (team_id: number) => void,
    isPrivate: (team_id: number) => void,
    setNameTeam: (team_id: number, name: string) => void,
    removeMember: () => void,
    open: boolean,
    setOpen: (open: boolean) => void
  }) {
  const [name, setName] = useState<string>("...");
  const [description, setDescription] = useState<string>("...");
  const [code, setCode] = useState<string>("");
  const [leader, setLeader] = useState<[number, string]>([0, "..."]);

  useEffect(() => {
    if (team_id) {
      api.events.getMembersWithLeader(team_id).then((team) => {
        setLeader(team[0]);
        setMembers(team[1]);
      });

      api.events.getTeam(team_id).then((team) => {
        setName(team.name);
        setDescription(team.description);
      });

      if (participantDetails.is_leader && participantDetails.team_id === team_id && event_id) {
        api.events.getCode(event_id).then(setCode);
      }
    } else {
      setName("...");
      setDescription("...");
      setLeader([0, "..."]);
    }
  }, [team_id]);

  function handleUpdateTeamName(value: string) {
    if (!event_id || !team_id) return;

    setNameTeam(team_id, value);

    if (value !== "") {
      api.events.updateTeamName(event_id, value);
    }

    setName(value);
  }

  function handleUpdateTeamDescription(value: string) {
    if (!event_id || !team_id) return;

    api.events.updateTeamDescription(event_id, value);
    setDescription(value);
  }

  function handleUpdateTeamCode(value: string) {
    if (!event_id || !team_id) return;

    if (value === "") {
      isPublic(team_id);
    } else {
      isPrivate(team_id);
    }

    api.events.updateTeamCode(event_id, value);
    setCode(value);
  }

  function deleteMember(member_id: number) {
    setMembers(members.filter(([id]) => id !== member_id));
    removeMember();
  }

  return <div className={`max-[875px]:fixed ${open ? "" : "max-[875px]:hidden"} max-[875px]:fixed max-[875px]:top-0 max-[875px]:left-0 max-[875px]:z-50 max-[875px] max-[875px]:w-full max-[875px]:h-full max-[875px]:p-10`}>
    <div className="max-[875px]:absolute top-0 left-0 max-[875px]:w-full h-full max-[875px]:z-50 max-[875px]:p-10 max-[520px]:p-5">
      <div className="bg-p-secondary-background rounded-lg grid grid-rows-[auto_auto_1fr] p-10 pr-5 h-full">
        <div>
          <div className="w-fit pb-5 hidden max-[875px]:block">
            <span className="hover:text-p-secondary-text w-fit cursor-pointer" onClick={() => setOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            </span>
          </div>
        </div>
        <div className="grid grid-rows-[auto_1fr] gap-5">
          {
            participantDetails.is_leader && participantDetails.team_id === team_id ? (
              <div className="font-bold w-56">
                <Input
                  placeholder="Nombre del equipo"
                  value={name}
                  onChange={(e) => handleUpdateTeamName(e.target.value)}
                />
              </div>
            ) : (
              <h2 className="text-3xl font-bold line-clamp-1">{name}</h2>
            )
          }
        </div>
        <div className="grid grid-cols-[1fr_20rem] gap-5 max-[1250px]:grid-cols-1 max-[1250px]:grid-rows-[auto_1fr]">
          <div className="flex gap-5 flex-col max-[1250px]:pr-5">
            {
              participantDetails.is_leader && participantDetails.team_id === team_id ? (
                <>
                  <div>
                    <div className="w-44">
                      <Input
                        placeholder="Codigo de Invitación"
                        value={code}
                        onChange={(e) => handleUpdateTeamCode(e.target.value)}
                      />
                    </div>
                    <p className="text-p-secondary-text text-xs pt-1 pl-1">Si no hay, el equipo es público</p>
                  </div>
                  <Textarea
                    className="h-36"
                    placeholder="Descripción del Equipo ..."
                    value={description}
                    onChange={(e) => handleUpdateTeamDescription(e.target.value)}
                  />
                </>
              ) : <div className="flex flex-col gap-5">
                <h3 className="text-lg font-bold">Descripción</h3>
                <div className="bg-[#0e143b] p-5 rounded-lg border border-p-border min-h-40">
                  {description}
                </div>
              </div>
            }
          </div>
          <div className="w-50 relative overflow-auto">
            <div className="absolute flex flex-col gap-5 px-5 pb-5 max-[1250px]:pl-0 w-full">
              <h3 className="text-lg font-bold">Líder</h3>
              <Leader name={leader[1]} />
              {
                members.length > 1 ? (
                  <>
                    <h3 className="text-lg font-bold">Miembros</h3>
                    <div className="flex flex-col gap-5">
                      {
                        members
                          .filter(([id]) => id !== leader[0])
                          .map(([id, name]) => <Member
                            key={id}
                            event_id={event_id}
                            team_id={team_id}
                            member_id={id}
                            name={name}
                            participantDetails={participantDetails}
                            deleteMember={deleteMember}
                          />)
                      }
                    </div>
                  </>
                ) : null
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    <span
      onClick={() => setOpen(false)}
      className="max-[875px]:absolute bg-p-background top-0 left-0 max-[875px]:w-full max-[875px]:h-full opacity-50"
    ></span>
  </div>
}