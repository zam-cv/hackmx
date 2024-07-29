import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { useEffect, useState } from "react";
import api from "@/utils/api";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  event_id: number;
}

export function DataTableToolbar<TData>({
  table,
  event_id,
}: DataTableToolbarProps<TData>) {
  const [teams, setTeams] = useState<string[]>([]);
  const [campuses, setCampuses] = useState<string[]>([]);
  const isFiltered = table.getState().columnFilters.length > 0;

  useEffect(() => {
    api.events.getTeamsNames(event_id).then(setTeams);
    api.tec.getCampus().then(setCampuses);
  }, [event_id]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter users..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("team") && (
          <DataTableFacetedFilter
            column={table.getColumn("team")}
            title="Team"
            options={teams.map((team) => ({
              value: team,
              label: team,
            }))}
          />
        )}
        {table.getColumn("campus") && (
          <DataTableFacetedFilter
            column={table.getColumn("campus")}
            title="Campus"
            options={campuses.map((campus) => ({
              value: campus,
              label: campus,
            }))}
          />
        )}
        {table.getColumn("with_bus") && (
          <DataTableFacetedFilter
            column={table.getColumn("with_bus")}
            title="With Bus"
            options={[
              {
                value: true as any,
                label: "Yes",
              },
              {
                value: false as any,
                label: "No",
              }
            ]}
          />
        )}
        {table.getColumn("confirmed") && (
          <DataTableFacetedFilter
            column={table.getColumn("confirmed")}
            title="Confirmed"
            options={[
              {
                value: true as any,
                label: "Yes",
              },
              {
                value: false as any,
                label: "No",
              }
            ]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
