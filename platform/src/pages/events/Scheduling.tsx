import { useEffect, useState, useRef } from "react";
import api, { EventTask } from "@/utils/api";
import { handleKeyDown } from "@/utils";
import { BreadcrumbInEvent } from "@/components/Breadcrumb";
import DateTimePicker from "@/components/time-picker";
import { formatDateWithMicroseconds } from "@/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { DeleteWrapper } from "@/components/Delete";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Task({ task, del }: { task: EventTask; del: () => void }) {
  return (
    <TableRow className="relative">
      <TableCell>
        <div className="absolute w-full h-full top-0 left-0">
          <DeleteWrapper
            del={del}
            message="You want to delete the task?"
            className="w-full h-full"
          >
            <span></span>
          </DeleteWrapper>
        </div>
        <div className="font-medium">{task.title}</div>
        <div className="text-sm text-muted-foreground inline">
          {task.description}
        </div>
      </TableCell>
      <TableCell className="text-right">
        {format(new Date(task.date), "PPP HH:mm:ss")}
      </TableCell>
    </TableRow>
  );
}

export default function Scheduling() {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<any>(null);

  const [publications, setPublications] = useState<EventTask[]>([]);
  const [date, setDate] = useState("2022-01-01T00:00:00Z");
  const { id } = useParams();

  useEffect(() => {
    api.tasks.list(parseInt(id || "")).then((publications: any) => {
      setPublications(publications);
    });
  }, [id]);

  function HandleAddTask() {
    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;

    if (!title || !description) return;

    api.tasks
      .create(parseInt(id || ""), {
        title,
        description,
        date: formatDateWithMicroseconds(date),
      } as EventTask)
      .then((id) => {
        const task = { id, title, description, date };
        setPublications([...publications, task]);
      });
  }

  function handleDelete(id: number) {
    api.tasks.delete(id).then(() => {
      setPublications(publications.filter((task) => task.id !== id));
    });
  }

  return (
    <div className="grid grid-rows-[auto_1fr] h-full">
      <BreadcrumbInEvent id={id} name="Scheduling" />
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Event scheduling
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of tasks for this event.
            </p>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-[5fr_6fr] md:h-full">
          <Card x-chunk="dashboard-07-chunk-0" className="h-fit">
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>Add a new task to the event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    ref={titleRef}
                    id="title"
                    type="text"
                    onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
                    className="w-full"
                    placeholder="Title of the task"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    ref={descriptionRef}
                    id="description"
                    placeholder="Description of the task"
                    className="min-h-32"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="date">Date</Label>
                  <DateTimePicker
                    date={new Date(date)}
                    setDate={(date) => {
                      if (!date) return;
                      setDate(date.toISOString());
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={HandleAddTask} className="text-foreground font-bold">Send Task</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center h-full w-full overflow-auto relative rounded-xl border-t">
            <div className="h-fit w-full md:absolute">
              <Card
                className="xl:col-span-2 w-full border-t-0"
                x-chunk="dashboard-01-chunk-4"
              >
                <div className="grid h-full grid-rows-[auto_1fr] w-full">
                  <CardHeader className="flex flex-row items-center sticky top-0 bg-card z-10">
                    <div className="grid gap-2">
                      <CardTitle>Tasks</CardTitle>
                      <CardDescription>
                        List of tasks for this event
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex">
                    <Table className="max-md:h-auto overflow-auto w-full max-md:relative">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Task</TableHead>
                          <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="w-full">
                        {publications.map((task, i) => (
                          <Task
                            key={i}
                            task={task}
                            del={() => handleDelete(task.id)}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
