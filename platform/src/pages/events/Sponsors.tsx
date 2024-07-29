import { useState, useEffect, useRef } from "react"
import { useParams } from 'react-router-dom';
import { BreadcrumbInEvent } from "@/components/Breadcrumb";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import api, { Sponsor, Award } from "@/utils/api"
import { CirclePlus } from 'lucide-react';
import Delete, { DeleteWrapper } from '@/components/Delete';
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

function AddAward({ event_id, sponsor, setSponsors }: { event_id: number, sponsor: Sponsor, setSponsors: (fn: (s: [Sponsor, Award[]][]) => [Sponsor, Award[]][]) => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [name, setName] = useState("");

  function Cancel() {
    cancelRef.current?.click();
  }

  function Submit() {
    api.sponsors.addAward(event_id, sponsor.id, name).then((id) => {
      setSponsors((sponsors) => sponsors.map(([s, a]) => s.id === sponsor.id ? [s, [...a, { id, title: name }]] : [s, a]))
      Cancel();
    })
  }

  return <Drawer>
    <DrawerTrigger asChild>
      <span className='group cursor-pointer'>
        <CirclePlus className='w-5 h-5 group-hover:text-cyan-500' />
      </span>
    </DrawerTrigger>
    <DrawerContent>
      <div className="mx-auto w-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>
            Add Award
          </DrawerTitle>
          <DrawerDescription>
            Add an award to this sponsor.
          </DrawerDescription>
        </DrawerHeader>
        <form className="grid gap-4 p-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="PlayStation 5"
              onChange={(e) => { setName(e.currentTarget.value) }}
            />
          </div>
        </form>
        <DrawerFooter>
          <Button onClick={Submit}>
            Submit
          </Button>
          <DrawerClose asChild>
            <Button ref={cancelRef} variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
}

export default function Sponsors() {
  const [selectedSponsorId, setSelectedSponsorId] = useState("");
  const [sponsorsNotInEvent, setSponsorsNotInEvent] = useState<Sponsor[]>([]);
  const [sponsors, setSponsors] = useState<[Sponsor, Award[]][]>([]);
  const { id } = useParams();

  useEffect(() => {
    api.sponsors.getSponsorsInEvent(parseInt(id))
      .then((sponsors) => {
        setSponsors(sponsors);
      })

    api.sponsors.getSponsorsNotInEvent(parseInt(id))
      .then((sponsors) => {
        setSponsorsNotInEvent(sponsors);
      })
  }, [id])

  function handleSelectChange(value: string) {
    setSelectedSponsorId(value);
  }

  function addSponsor() {
    if (selectedSponsorId === "") return;

    api.sponsors.add(parseInt(id), parseInt(selectedSponsorId))
      .then((sponsor) => {
        setSponsors([...sponsors, [sponsor, []]]);
        setSponsorsNotInEvent(sponsorsNotInEvent.filter(sponsor => sponsor.id.toString() !== selectedSponsorId));
      })
  }

  function deleteSponsor(sponsorId: number) {
    api.sponsors.delete(parseInt(id), sponsorId)
      .then(() => {
        setSponsorsNotInEvent([...sponsorsNotInEvent, sponsors.find(([sponsor, _]) => sponsor.id === sponsorId)[0]]);
        setSponsors(sponsors.filter(([sponsor, _]) => sponsor.id !== sponsorId));
      })
  }

  function deleteAward(awardId: number) {
    api.sponsors.deleteAward(awardId)
      .then(() => {
        setSponsors(sponsors.map(([sponsor, awards]) => [sponsor, awards.filter(award => award.id !== awardId)]));
      })
  }

  return (
    <div>
      <BreadcrumbInEvent id={id} name="Sponsors" />
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sponsors</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of sponsors for this event.
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-8'>
          <div className='flex gap-5'>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a sponsor" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sponsors</SelectLabel>
                  {sponsorsNotInEvent.map(sponsor => (
                    <SelectItem key={sponsor.id} value={sponsor.id.toString()}>{sponsor.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={addSponsor} className="text-foreground font-bold">Add Sponsor</Button>
          </div>
          <div className='flex flex-col gap-5'>
            {sponsors.map(([sponsor, awards]) => (
              <div key={sponsor.id} className="p-5 border border-border flex flex-col gap-3 rounded-lg bg-card">
                <div className='grid grid-cols-[1fr_auto]'>
                  <div className='flex gap-3'>
                    <h2 className="font-bold text-lg">{sponsor.name}</h2>
                    <div className='flex justify-center items-start pt-1'>
                      <AddAward event_id={parseInt(id)} sponsor={sponsor} setSponsors={setSponsors} />
                    </div>
                  </div>
                  <div>
                    <Delete del={() => deleteSponsor(sponsor.id)} message='Are you sure you want to delete this sponsor?' />
                  </div>
                </div>
                <div className="overflow-hidden">{sponsor.description}</div>
                <div className='flex gap-3'>
                  {awards.map((award, i) => (
                    <DeleteWrapper key={i} del={() => deleteAward(award.id)} message='Are you sure you want to delete this award?'>
                      <Badge key={i} variant="outline" className='cursor-pointer hover:bg-slate-500 hover:text-white'>{award.title}</Badge>
                    </DeleteWrapper>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <div>
                    <p className="font-bold text-sm">{sponsor.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}