import Button, { BtnDelete, ButtonDisabled } from "./Button"
import { useEffect, useState, useRef } from "react";
import { getQueryParam } from "@/utils";
import Input from "@/components/Input";
import api, { type ParticipantDetails, type InfoTeam } from "@/utils/api";
import Team from "@/components/Team";
import Fuse from 'fuse.js';

function Card({
  team_id,
  event_id,
  name,
  members,
  quota,
  isPrivate,
  participantDetails,
  setParticipantDetails,
  infoTeams,
  setTeams,
  joinTeam,
  currentTeamId,
  setCurrentTeamId,
  setOpen,
}: {
  team_id: number,
  event_id: number | null,
  name: string,
  members: number,
  quota: number,
  isPrivate: boolean,
  participantDetails: ParticipantDetails
  setParticipantDetails: (details: ParticipantDetails) => void,
  infoTeams: InfoTeam[],
  setTeams: (infoTeams: InfoTeam[]) => void,
  joinTeam: (team_id: number) => void,
  currentTeamId: number | null,
  setCurrentTeamId: (team_id: number) => void,
  setOpen: (open: boolean) => void
}) {
  const codeRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>("Unirme");
  const [checked, setChecked] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");

  function handleJoinTeam() {
    if (!event_id) return;

    if (isPrivate) {
      if (checked) {
        setMessage("Unirme");
      } else {
        codeRef.current?.focus();
        setMessage("Probar");
      }
    }

    if ((checked && code !== "") || !isPrivate) {
      api.events.joinTeam(event_id, team_id, code).then(() => {
        setParticipantDetails({
          has_team: true,
          is_leader: false,
          team_id: team_id,
        });

        setTeams(infoTeams.map((info) => {
          return info.id === team_id ? {
            ...info,
            members: info.members + 1,
          } : info;
        }))

        joinTeam(team_id);
      })
    }

    if (isPrivate) {
      setChecked(!checked);
    }
  }

  return <span
    className={`border-p-border border p-5 max-[875px]:h-40 max-[430px]:h-auto rounded-r-lg relative cursor-pointer transition-colors duration-200 ${currentTeamId === team_id ? "bg-[#0408225e]" : "hover:bg-[#00000054]"}`}
    onClick={() => { setCurrentTeamId(team_id); setOpen(true) }}
  >
    <div className={`top-0 left-0 h-full w-1 absolute ${participantDetails.team_id === team_id ? "bg-yellow-300" : (members == quota ? "bg-[#4b4d82]" : (isPrivate ? "bg-p-blue" : "bg-emerald-500"))}`}></div>
    <div className="grid grid-rows-[auto_1fr] h-full">
      <div>
        <h3 className="text-lg font-bold line-clamp-1">{name}</h3>
        <p className="text-p-secondary-text">Miembros: <span className="font-bold">{members} / {quota}</span></p>
      </div>
      <div className="flex justify-end">
        <div className="flex max-[430px]:flex-col items-end">
          <div className="flex max-[430px]:pb-3 max-[330px]:flex-col">
            <div className="flex items-center p-3 px-5 gap-2">
              {
                isPrivate ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    <p className="text-p-secondary-text text-sm">Privado</p>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-open"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>
                    <p className="text-p-secondary-text text-sm">Público</p>
                  </>
                )
              }
            </div>
            <div>
              <div className={`pr-5 max-[430px]:pr-0 w-28 ${isPrivate && checked ? "" : "hidden"}`}>
                <Input
                  ref={codeRef}
                  placeholder="Código"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="max-[430px]:w-28 flex justify-end">
            {
              !participantDetails.has_team && members == quota ? (
                <ButtonDisabled>No Disponible</ButtonDisabled>
              ) : !participantDetails.has_team ? (
                <Button onClick={handleJoinTeam}>{message}</Button>
              ) : null
            }
          </div>
        </div>
      </div>
    </div>
  </span>
}

export default function Teams() {
  const [open, setOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fuseOptions = {
    includeScore: true,
    keys: ['name'],
    isCaseSensitive: false,
    includeMatches: true,
    findAllMatches: true,
    threshold: 0.3
  };

  const [infoUser, setInfoUser] = useState<[number, string]>([0, "..."]);
  const [currentTeamId, setCurrentTeamId] = useState<number | null>(null);
  const [members, setMembers] = useState<[number, string][]>([]);

  const [participantDetails, setParticipantDetails] = useState<ParticipantDetails>({
    has_team: false,
    is_leader: false,
    team_id: null,
  });

  const [quota, setQuota] = useState<number>(4);
  const [infoTeams, setTeams] = useState<InfoTeam[]>([]);
  const [id, setId] = useState<number | null>(null);

  const fuse = new Fuse(infoTeams, fuseOptions);

  const results = fuse.search(searchTerm);
  const teamResults = searchTerm ? results.map(result => result.item) : infoTeams;

  useEffect(() => {
    const eventId = getQueryParam("id");
    if (eventId) {
      let id = parseInt(eventId);
      setId(id);

      api.events.getParticipantDetails(id).then((participantDetails) => {
        api.user.info().then(setInfoUser);

        if (participantDetails.has_team && participantDetails.team_id) {
          setCurrentTeamId(participantDetails.team_id);
        }

        api.events.getTeams(id).then((infoTeams) => {
          if (infoTeams.length > 0 && !participantDetails.has_team) {
            setCurrentTeamId(infoTeams[0].id);
          }

          if (participantDetails.has_team) {
            const team = infoTeams.find((info) => info.id === participantDetails.team_id);

            if (team) {
              const t = infoTeams.filter((info) => info.id !== participantDetails.team_id);
              setTeams([team, ...t]);
            }
          } else {
            setTeams(infoTeams);
          }
        });

        setParticipantDetails(participantDetails);
        api.events.getQuotaTeam(id).then(setQuota);
      }).catch(() => {
        window.location.href = `/dashboard`;
      })
    }
  }, []);

  function handleCreateTeam() {
    if (!id) return;

    api.events.createTeam(id).then((team) => {
      setTeams([{
        id: team.id,
        name: team.name,
        isPrivate: true,
        members: 1,
      }, ...infoTeams]);

      setParticipantDetails({
        has_team: true,
        is_leader: true,
        team_id: team.id,
      });

      setCurrentTeamId(team.id);
    });
  }

  function handleDeleteTeam() {
    if (!id || !participantDetails.team_id) return;

    api.events.deleteTeam(id, participantDetails.team_id).then(() => {
      if (currentTeamId === participantDetails.team_id) {
        setMembers([]);
      }

      const newTeams = infoTeams.filter((info) => info.id !== participantDetails.team_id);
      setTeams(newTeams);

      if (newTeams.length > 0) {
        setCurrentTeamId(newTeams[0].id);
      } else {
        setCurrentTeamId(null);
      }

      setParticipantDetails({
        has_team: false,
        is_leader: false,
        team_id: null,
      });
    });
  }

  function handleLeaveTeam() {
    if (!id || !participantDetails.team_id) return;

    api.events.leaveTeam(id, participantDetails.team_id).then(() => {
      setTeams(infoTeams.map((info) => {
        return info.id === participantDetails.team_id ? {
          ...info,
          members: info.members - 1,
        } : info;
      }))

      setParticipantDetails({
        has_team: false,
        is_leader: false,
        team_id: null,
      });

      if (currentTeamId === participantDetails.team_id) {
        setMembers(members.filter(([id]) => id !== infoUser[0]));
      }
    });
  }

  function joinTeam(team_id: number) {
    if (currentTeamId === team_id) {
      setMembers([infoUser, ...members]);
    } else {
      setCurrentTeamId(team_id);
    }
  }

  function isPublic(team_id: number) {
    setTeams(infoTeams.map((info) => {
      return info.id === team_id ? {
        ...info,
        isPrivate: false,
      } : info;
    }))
  }

  function isPrivate(team_id: number) {
    setTeams(infoTeams.map((info) => {
      return info.id === team_id ? {
        ...info,
        isPrivate: true,
      } : info;
    }))
  }

  function setNameTeam(team_id: number, name: string) {
    setTeams(infoTeams.map((info) => {
      return info.id === team_id ? {
        ...info,
        name,
      } : info;
    }))
  }

  function removeMember() {
    setTeams(infoTeams.map((info) => {
      if (info.id === currentTeamId) {
        return {
          ...info,
          members: info.members - 1,
        }
      }

      return info;
    }))
  }

  return <>
    <div className="grid grid-cols-[1fr_auto] max-[350px]:grid-cols-1 max-[350px]:grid-rows-2 max-[350px]:gap-5">
      <div className="flex items-center gap-5">
        <a href={`/invitation?id=${id}`} className="hover:text-p-secondary-text">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
        </a>
        <h1 className="text-2xl font-bold">Equipos</h1>
      </div>
      <div>
        {
          participantDetails.is_leader ? (
            <BtnDelete onClick={handleDeleteTeam}>Eliminar Equipo</BtnDelete>
          ) : (
            participantDetails.has_team ?
              <BtnDelete onClick={handleLeaveTeam}>Dejar mi Equipo</BtnDelete> :
              <Button onClick={handleCreateTeam}>Crear Equipo</Button>
          )
        }
      </div>
    </div>
    <div className="grid grid-cols-[30rem_1fr] gap-10 max-lg:grid-cols-[27rem_1fr] max-[875px]:grid-cols-1">
      <div className="bg-p-secondary-background rounded-lg grid grid-rows-[auto_1fr] p-10 pr-5 max-[470px]:p-5 max-[470px]:pr-0">
        <div className="pb-5 pr-5">
          <Input
            placeholder="Buscar Equipo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-auto relative">
          <div className="absolute flex flex-col gap-5 w-full pr-5">
            {
              teamResults.map((info) => (
                <Card
                  key={info.id}
                  team_id={info.id}
                  event_id={id}
                  name={info.name}
                  members={info.members}
                  quota={quota}
                  isPrivate={info.isPrivate}
                  participantDetails={participantDetails}
                  setParticipantDetails={setParticipantDetails}
                  infoTeams={infoTeams}
                  setTeams={setTeams}
                  joinTeam={joinTeam}
                  currentTeamId={currentTeamId}
                  setCurrentTeamId={setCurrentTeamId}
                  setOpen={setOpen}
                />
              ))
            }
          </div>
        </div>
      </div>
      <Team
        event_id={id}
        team_id={currentTeamId}
        participantDetails={participantDetails}
        members={members}
        setMembers={setMembers}
        isPublic={isPublic}
        isPrivate={isPrivate}
        setNameTeam={setNameTeam}
        removeMember={removeMember}
        open={open}
        setOpen={setOpen}
      />
    </div>
  </>
}