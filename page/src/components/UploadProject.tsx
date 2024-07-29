import { useState, useEffect } from "react";
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
  const [sponsors, setSponsors] = useState<string[]>([]);

  useEffect(() => {
    const eventId = getQueryParam("id");
    if (eventId) {
      api.events.getSponsorsNames(parseInt(eventId)).then(setSponsors);
    }
  }, []);

  return <div className="flex flex-col gap-5 bg-p-secondary-background p-10 rounded-lg">
    <h1 className="text-3xl font-semibold text-center">Subir Proyecto</h1>
    <Input id="project" placeholder="Nombre del proyecto" />
    <Input id="project" placeholder="URL del Repositorio" />
    <Select>
      <SelectTrigger className="outline-none focus-visible:ring-0 select-none h-12">
        <SelectValue placeholder="Selecciona un Patrocinador" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Patrocinador</SelectLabel>
          {sponsors.map((sponsor, i) => <SelectItem key={i} value={`${i}`}>{sponsor}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
    <Textarea id="project" placeholder="Descripción" className="text-base" />
    <Button id="send">Subir Proyecto</Button>
  </div>
}