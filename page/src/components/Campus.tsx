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

export default function Campus({ defaultValue = "__none", onChangeValue }: { defaultValue?: string, onChangeValue?: (value: string) => void }) {
  const [campus, setCampus] = useState<string[]>([]);
  const selectRef = useRef<HTMLButtonElement>(null);
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  useEffect(() => {
    api.tec.campus().then(setCampus);
  }, []);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  return <div className="h-full">
    <button ref={selectRef} className="hidden" id="campus" value={selectedValue}></button>
    <Select value={selectedValue} onValueChange={(value) => {setSelectedValue(value); onChangeValue?.(value)}}>
      <SelectTrigger className="h-12 outline-none focus-visible:ring-0 select-none">
        <SelectValue placeholder="Selecciona un Campus" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Campus</SelectLabel>
          <SelectItem value={"__none"}>No especificado</SelectItem>
          {campus.map((c, i) => <SelectItem key={i} value={c}>{c}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
}