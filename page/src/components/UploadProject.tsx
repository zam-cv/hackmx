import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Textarea } from "@/components/ui/textarea";
import api from "@/utils/api";
import { getQueryParam } from "@/utils";

export default function UploadProject() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [withProject, setWithProject] = useState<boolean>(false);
  const [zip, setZip] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [sponsorId, setSponsorId] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [sponsors, setSponsors] = useState<[number, string][]>([]);

  useEffect(() => {
    const eventId = getQueryParam("id");
    if (eventId) {
      const id = parseInt(eventId);

      api.events.getSponsorsWithIdAndNames(id).then(setSponsors);

      api.projects.getProject(id).then((project) => {
        if (project) {
          setName(project.name);
          setUrl(project.url);
          setSponsorId(project.sponsor_id);
          setDescription(project.description);
          setZip(project.zip);
          setWithProject(true);
        }
      });
    }
  }, []);

  function uploadProject() {
    const eventId = getQueryParam("id");
    if (!eventId) return;

    if (withProject) {
      const file = fileInput.current?.files?.[0];

      api.projects.updateProject(parseInt(eventId), file as any, {
        id: 0,
        name,
        url,
        sponsor_id: sponsorId,
        zip: file ? file.name : "",
        description,
      }).then(() => {
        if (file) {
          setZip(file.name);
        }
      })
    } else {
      const file = fileInput.current?.files?.[0];
      if (!file) {
        return;
      }

      api.projects.uploadProject(parseInt(eventId), file, {
        id: 0,
        name,
        url,
        sponsor_id: sponsorId,
        zip: file.name,
        description,
      }).then(() => {
        setZip(file.name);
        setWithProject(true);
      })
    }
  }

  return (
    <div className="flex flex-col gap-5 bg-p-secondary-background p-10 rounded-lg">
      <h1 className="text-3xl font-semibold text-center">Subir Proyecto</h1>
      <Input
        id="name"
        type="text"
        placeholder="Nombre del proyecto"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        id="url"
        type="text"
        placeholder="URL del Repositorio"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Select
        onValueChange={(value) => setSponsorId(parseInt(value))}
        value={sponsorId.toString()}
      >
        <SelectTrigger className="outline-none focus-visible:ring-0 select-none h-12">
          <SelectValue placeholder="Selecciona un Patrocinador" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Patrocinador</SelectLabel>
            {sponsors.map((sponsor, i) => (
              <SelectItem key={i} value={`${sponsor[0]}`}>
                {sponsor[1]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex flex-col gap-2">
        <Input
          ref={fileInput}
          id="file"
          type="file"
          placeholder="Codigo Fuente"
          className="p-[9px] h-12 w-full rounded-md outline-none text-gray-200 bg-p-accent-background border text-base cursor-pointer border-p-border"
        />
        <div className="grid grid-cols-2">
          <div>
            {zip && (
              <p className="text-xs text-emerald-400">* Se envio {zip}</p>
            )}
          </div>
          <div className="flex justify-end">
            <p className="text-xs text-p-secondary-text text-right">
              maximo 10MB
            </p>
          </div>
        </div>
      </div>
      <Textarea
        id="project"
        placeholder="Descripción"
        className="text-base"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button id="send" onClick={uploadProject}>
        {withProject ? "Actualizar Proyecto" : "Subir Proyecto"}
      </Button>
    </div>
  );
}
