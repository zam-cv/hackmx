import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BreadcrumbInEvent } from "@/components/Breadcrumb";
import { columns } from "@/components/table/components/columns";
import { DataTable } from "@/components/table/components/data-table";
import api, { Participant } from "@/utils/api";

export default function Users() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { id } = useParams();

  useEffect(() => {
    api.events.getParticipants(parseInt(id || "")).then((participants: any) => {
      setParticipants(participants);
    });
  }, [id]);

  return (
    <div>
      <BreadcrumbInEvent id={id} name="Users" />
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Users</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of users for this event.
            </p>
          </div>
        </div>
        <DataTable
          data={participants.map((p) => ({ ...p, event_id: id })) as any}
          columns={columns}
          event_id={parseInt(id || "")}
        />
      </div>
    </div>
  );
}
