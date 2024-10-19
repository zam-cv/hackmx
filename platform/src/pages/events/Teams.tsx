import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BreadcrumbInEvent } from "@/components/Breadcrumb";
import api, { Team, Project } from "@/utils/api";
import { downloadServer } from "@/utils/methods";
// import { DeleteWrapper } from "@/components/Delete";
// import { Trash2 } from "lucide-react";

export default function Teams() {
  const [teams, setTeams] = useState<
    [Team, [Project, string] | null, [string, string][]][]
  >([]);
  const { id } = useParams();

  useEffect(() => {
    api.teams.getTeams(parseInt(id)).then((res) => {
      setTeams(res);
    });
  }, [id]);

  // function del(team_id: number) {
  //   api.teams.deleteTeam(team_id).then(() => {
  //     setTeams(teams.filter((team) => team[0].id !== team_id));
  //   });
  // }

  return (
    <div>
      <BreadcrumbInEvent id={id} name="Teams" />
      <div>
        <h1 className="text-4xl font-bold text-center py-5">Teams</h1>
        <div className="flex flex-wrap gap-5 p-5">
          {teams.map(([team, project, members], i) => {
            return (
              <div
                key={i}
                className="group/team bg-card rounded-md shadow-md p-5 min-w-[480px] max-sm:min-w-full flex flex-col gap-5 cursor-pointer relative"
              >
                <div>
                  <h2 className="text-2xl font-bold">{team.name}</h2>
                  <p className="text-sm text-gray-400">{team.description}</p>
                </div>
                {project && (
                  <div>
                    <h3 className="text-lg font-bold">Project</h3>
                    <div className="flex flex-col pt-2 gap-1">
                      <p className="font-bold text-sm text-gray-400">
                        Sponsor: {project[1]}
                      </p>
                      <p className="font-bold text-sm text-gray-400">
                        Project:{" "}
                        <span
                          className="text-blue-400 cursor-pointer"
                          onClick={() => downloadServer(project[0].zip)}
                        >
                          {project[0].name}
                        </span>
                      </p>
                      <p className="font-bold text-sm text-gray-400">
                        URL: {project[0].url}
                      </p>
                      <p className="font-bold text-sm text-gray-400">
                        Description: {project[0].description}
                      </p>
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold">Members</h3>
                  <ul>
                    {members.map((member, i) => (
                      <li key={i}>
                        <div className="flex justify-between">
                          <div>
                            {member[0].replace(/\b\w/g, (l) => l.toUpperCase())}
                          </div>
                          <div>{member[1]}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* <div className="absolute top-5 right-5 hidden group-hover/team:block">
                  <DeleteWrapper
                    del={() => del(team.id)}
                    message="You want to delete the team?"
                  >
                    <span className="group/trash cursor-pointer relative z-40">
                      <div className="p-3 bg-white rounded-md shadow-md">
                        <Trash2 className="w-5 h-5 group-hover/trash:text-red-500 text-black" />
                      </div>
                    </span>
                  </DeleteWrapper>
                </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
