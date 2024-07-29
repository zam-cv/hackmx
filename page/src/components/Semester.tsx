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

export default function Semester({ defaultValue = "1", onChangeValue }: { defaultValue?: string, onChangeValue?: (value: string) => void }) {
  const selectRef = useRef<HTMLButtonElement>(null);
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  return <>
    <button ref={selectRef} className="hidden" id="semester" value={selectedValue}></button>
    <Select value={selectedValue} onValueChange={(value) => {setSelectedValue(value); onChangeValue?.(value)}}>
      <SelectTrigger className="outline-none focus-visible:ring-0 select-none h-12">
        <SelectValue placeholder="Selecciona un Semestre" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Semestre</SelectLabel>
          <SelectItem value="1">1er Semestre</SelectItem>
          <SelectItem value="2">2do Semestre</SelectItem>
          <SelectItem value="3">3er Semeste</SelectItem>
          <SelectItem value="4">4to Semestre</SelectItem>
          <SelectItem value="5">5to Semestre</SelectItem>
          <SelectItem value="6">6to Semestre</SelectItem>
          <SelectItem value="7">7mo Semestre</SelectItem>
          <SelectItem value="8">8vo Semestre</SelectItem>
          <SelectItem value="9">9no Semestre</SelectItem>
          <SelectItem value="10">10mo Semestre</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </>
}