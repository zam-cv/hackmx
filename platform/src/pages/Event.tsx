import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '@/components/Loading';
import { formatDateWithMicroseconds } from '@/utils';
import api, { Event as IEvent } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DateTimePicker from '@/components/time-picker';
import { format } from 'date-fns';
import { Pencil, Minus, Plus } from 'lucide-react';
import EventDetails from '@/components/EventDetails';
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

export default function Event() {
  const { id } = useParams();
  const [event, setEvent] = useState<IEvent | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [title, setTitle] = useState("...");
  const [description, setDescription] = useState("...");
  const [quotaPerTeam, setQuotaPerTeam] = useState(0);
  const [startDate, setStartDate] = useState("2022-01-01T00:00:00Z");
  const [endDate, setEndDate] = useState("2022-01-01T00:00:00Z");
  const [location, setLocation] = useState("...");

  useEffect(() => {
    api.events.get(parseInt(id || ""))
      .then((event: any) => {
        setEvent(event);
        setTitle(event.title);
        setDescription(event.description);
        setQuotaPerTeam(event.quota_per_team);
        setStartDate(event.start_date);
        setEndDate(event.end_date);
        setLocation(event.location);
      })
  }, [id]);

  function handleUpdateEvent() {
    if (!event) {
      return;
    }

    const newEvent = {
      id: parseInt(id || ""),
      title,
      description,
      quota_per_team: quotaPerTeam,
      start_date: startDate,
      end_date: endDate,
      location
    };

    setEvent(newEvent);
    newEvent.start_date = formatDateWithMicroseconds(newEvent.start_date);
    newEvent.end_date = formatDateWithMicroseconds(newEvent.end_date);
    api.events.update(newEvent)
    cancelRef.current?.click();
  }

  if (!event) {
    return <Loading />
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className='flex flex-col gap-2'>
        <div className='flex justify-center'>
          <h1 className="text-2xl font-bold text-center">
            {event.title}
          </h1>
          <div className='flex justify-center items-end py-2 px-3 -mr-10'>
            <Drawer>
              <DrawerTrigger asChild>
                <Pencil className="h-5 w-5 cursor-pointer" />
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>
                      Edit Event
                    </DrawerTitle>
                    <DrawerDescription>
                      Update the event details
                    </DrawerDescription>
                  </DrawerHeader>
                  <form className="grid gap-4 p-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input type="title" id="title" defaultValue={title} onChange={(e) => { setTitle(e.currentTarget.value) }} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" defaultValue={description} onChange={(e) => { setDescription(e.currentTarget.value) }} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input type="location" id="location" defaultValue={location} onChange={(e) => { setLocation(e.currentTarget.value) }} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <DateTimePicker date={new Date(startDate)} setDate={(date) => {
                        if (!date) return;
                        setStartDate(date.toISOString());
                      }} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="end_date">End Date</Label>
                      <DateTimePicker date={new Date(endDate)} setDate={(date) => {
                        if (!date) return;
                        setEndDate(date.toISOString());
                      }} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="quota_per_team">Quota Per Team</Label>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="rounded-full" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuotaPerTeam(quotaPerTeam - 1) }}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        {quotaPerTeam}
                        <Button variant="outline" size="icon" className="rounded-full" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuotaPerTeam(quotaPerTeam + 1) }}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </form>
                  <DrawerFooter>
                    <Button onClick={handleUpdateEvent}>Submit</Button>
                    <DrawerClose asChild>
                      <Button ref={cancelRef} variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <div className="flex w-full justify-center">
          <p className="text-sm font-medium">
            {event.location}
          </p>
        </div>
        <div className="flex w-full justify-center">
          <div className='flex gap-2'>
            <p className="text-sm font-medium">
              {format(new Date(event.start_date), "PPP HH:mm:ss")}
            </p>
            <p className="text-sm font-medium">
              -
            </p>
            <p className="text-sm font-medium">
              {format(new Date(event.end_date), "PPP HH:mm:ss")}
            </p>
          </div>
        </div>
      </div>
      <div className='container'>
        <div>
          <p>
            {event.description}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm justify-end pt-3">
          <span className="font-medium">
            Quota Per Team:
          </span>
          {event.quota_per_team}
        </div>
      </div>
      <EventDetails id={parseInt(id || "")} />
    </main>
  );
}