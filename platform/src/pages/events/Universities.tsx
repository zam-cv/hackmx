import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BreadcrumbInEvent } from "@/components/Breadcrumb";
import api, { University, Quota } from "@/utils/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SERVER } from "@/utils/constants";

export default function Universities() {
  const [universities, setUniversities] = useState<
    [University, Quota | null][]
  >([]);
  const { id } = useParams();

  useEffect(() => {
    api.university.list(parseInt(id)).then((universities) => {
      setUniversities(universities);
    });
  }, [id]);

  function updateQuota(universityId: number, quota: number) {
    if (quota <= 0) {
      quota = 0;
    }

    api.university.addQuota(parseInt(id), universityId, quota).then(() => {
      setUniversities((universities) =>
        universities.map(([u, q]) => {
          if (u.id === universityId) {
            return [u, { quota }];
          }

          return [u, q];
        })
      );
    });
  }

  return (
    <div>
      <BreadcrumbInEvent id={id} name="Universities" />
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Universities</h2>
            <p className="text-muted-foreground">
              Restricted universities for this event
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-7">
          {universities.map(([university, quota]) => (
            <div
              key={university.id}
              className="grid grid-cols-[auto_1fr_auto] max-sm:grid-cols-1 max-sm:gap-5 p-5 border rounded-lg gap-5"
            >
              <div>
                {university.image !== "" ? (
                  <img
                    src={`${SERVER}/${university.image}`}
                    alt={university.name}
                    className="w-50 h-20 object-scale-down rounded-lg"
                  />
                ) : (
                  <div className="w-[160px] h-full max-sm:h-20 bg-card rounded-lg"></div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="font-medium text-lg">{university.name}</div>
                <div className="text-sm text-muted-foreground inline">
                  {university.description}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-5 items-center">
                  <Label className="font-bold">Quota</Label>
                  <Input
                    type="number"
                    onChange={(e) =>
                      updateQuota(university.id, parseInt(e.target.value))
                    }
                    value={quota?.quota || 0}
                  />
                </div>
                <div className="text-sm text-muted-foreground inline">
                  {university.email_extension}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
