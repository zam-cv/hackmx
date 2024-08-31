import { useState, useEffect } from "react";
import api, { type Project } from "@/utils/api";
import Card from "./Card";

function Project({ project }: { project: Project }) {
  return (
    <Card>
      <div className="w-full h-full p-5 grid grid-rows-[auto_1fr_auto] gap-1 min-w-72 max-sm:min-w-full max-sm:w-full">
        <h1 className="text-2xl">{project.name}</h1>
        <div>
          <p className="text-p-secondary-text font-normal line-clamp-4">
            {project.description}
          </p>
        </div>
        <div className="grid grid-cols-[1fr_auto]">
          <p className="text-end text-p-secondary-text">{project.url}</p>
        </div>
      </div>
    </Card>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    api.projects.myProjects().then(setProjects);
  }, []);

  return (
    <div className="flex flex-wrap gap-4 pt-10 max-sm:flex-col">
      {projects.map((project, i) => (
        <Project key={i} project={project} />
      ))}
    </div>
  );
}
