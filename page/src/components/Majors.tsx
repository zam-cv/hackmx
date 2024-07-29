import { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/utils/api";

export default function Majors({ defaultValue = "__none", onChangeValue }: { defaultValue?: string, onChangeValue?: (value: string) => void }) {
  const [majors, setMajors] = useState<string[]>([]);
  const selectRef = useRef<HTMLButtonElement>(null);
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  useEffect(() => {
    api.tec.majors().then(setMajors);
  }, []);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  return <div className="h-full">
    <button ref={selectRef} className="hidden" id="major" value={selectedValue}></button>
    <Select value={selectedValue} onValueChange={(value) => {setSelectedValue(value); onChangeValue?.(value)}}>
      <SelectTrigger className="h-12 outline-none focus-visible:ring-0 select-none">
        <SelectValue placeholder="Selecciona una Carrera" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Carrera</SelectLabel>
          <SelectItem value={"__none"}>No especificado</SelectItem>
          {majors.map((major, i) => <SelectItem key={i} value={major}>{major}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
}