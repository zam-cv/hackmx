import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BreadcrumbInEvent } from "@/components/Breadcrumb";
import {
  ShieldHalf,
  UsersRound,
  File,
  Building2,
  LayoutList
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React from 'react';
import { format } from "date-fns"
import api, { Message } from '@/utils/api';

function Detail({ title, value, description, children }: { title: string, value: any, description: string, children: React.ReactNode }) {
  return <Card x-chunk="dashboard-01-chunk-0">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        {title}
      </CardTitle>
      {children}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">
        {description}
      </p>
    </CardContent>
  </Card>
}

function Messsage({
  message,
  team,
  username,
}: {
  message: Message,
  team: string,
  username: string
}) {
  return <TableRow>
    <TableCell>
      <div className="text-sm inline">
        {message.content}
      </div>
    </TableCell>
    <TableCell>
      <div className="text-sm inline">
        {username}
      </div>
    </TableCell>
    <TableCell className="text-sm max-sm:hidden">
      <div>
        {team}
      </div>
    </TableCell>
    <TableCell className="text-right">
      {format(new Date(message.date), "PPP HH:mm:ss")}
    </TableCell>
  </TableRow>
}

export default function Dashboard() {
  const [messages, setMessages] = useState<[Message, string, string | null][]>([]);
  const [participants, setParticipants] = useState(0);
  const [tasks, setTasks] = useState(0);
  const [sponsors, setSponsors] = useState(0);
  const [teams, setTeams] = useState(0);
  const [documents, setDocuments] = useState(0);
  const [publications, setPublications] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    let _id = parseInt(id);

    api.events.getParticipantsCount(_id)
      .then(setParticipants)

    api.events.getTasksCount(_id)
      .then(setTasks)

    api.events.getSponsorsCount(_id)
      .then(setSponsors)

    api.events.getTeamsCount(_id)
      .then(setTeams)

    api.events.getDocumentsCount(_id)
      .then(setDocuments)

    api.events.getPublicationsCount(_id)
      .then(setPublications)

    api.messages.list(_id)
      .then(setMessages)
  }, [id]);

  return (
    <div>
      <BreadcrumbInEvent id={id} name="Dashboard" />
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Charts, graphs and tables.
            </p>
          </div>
        </div>
        <main className="flex flex-1 flex-col gap-4 md:gap-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-6">
            <Detail title="Total Paticipants" value={participants} description="Event participants">
              <UsersRound className="h-4 w-4 text-muted-foreground" />
            </Detail>
            <Detail title="Total Teams" value={teams} description="Event teams">
              <ShieldHalf className="h-4 w-4 text-muted-foreground" />
            </Detail>
            <Detail title="Total documents" value={documents} description="Documents uploaded">
              <File className="h-4 w-4 text-muted-foreground" />
            </Detail>
            <Detail title="Total Sponsors" value={sponsors} description="Event sponsors">
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </Detail>
            <Detail title="Total Posts" value={publications} description="Uploaded posts">
              <LayoutList className="h-4 w-4 text-muted-foreground" />
            </Detail>
            <Detail title="Total Tasks" value={tasks} description="Event scheduling">
              <LayoutList className="h-4 w-4 text-muted-foreground" />
            </Detail>
          </div>
          <div className="flex justify-center">
            <Card
              className="xl:col-span-2 w-full h-fit" x-chunk="dashboard-01-chunk-4"
            >
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                  <CardTitle>
                    Messages
                  </CardTitle>
                  <CardDescription>
                    Messages sent by participants
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Messages</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead className='max-sm:hidden'>Team</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map(([message, username, team], index) => {
                      return <Messsage
                        key={index}
                        message={message}
                        username={username}
                        team={team}
                      />
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}