import { useState, useEffect, useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api, { Sponsor as ISponsor } from "@/utils/api";
import Delete, { DeleteWrapper } from "@/components/Delete";
import { SERVER } from "@/utils/constants";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

function EditSponsor({
  sponsor,
  setSponsors,
}: {
  sponsor: ISponsor;
  setSponsors: (fn: (s: ISponsor[]) => ISponsor[]) => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(sponsor.name);
  const [description, setDescription] = useState(sponsor.description);
  const [email, setEmail] = useState(sponsor.email);

  function Cancel() {
    cancelRef.current?.click();
  }

  function Submit() {
    api.storage
      .updateSponsor({
        id: sponsor.id,
        name,
        image: "",
        description,
        email,
      })
      .then((_s) => {
        setSponsors((sponsors) =>
          sponsors.map((s) =>
            s.id === sponsor.id
              ? {
                  ...s,
                  name,
                  description,
                  email,
                }
              : s
          )
        );
      });

    if (inputRef.current?.files?.length) {
      api.storage
        .uploadSponsorImage(sponsor.id, inputRef.current.files[0], {
          name: inputRef.current.files[0].name,
        })
        .then((sponsor) => {
          setSponsors((sponsors) =>
            sponsors.map((s) =>
              s.id === sponsor.id
                ? {
                    ...s,
                    name,
                    description,
                    email,
                    image: sponsor.image,
                  }
                : s
            )
          );
          Cancel();
        });
    } else {
      Cancel();
    }
  }

  function DeleteImage() {
    api.storage.deleteSponsorImage(sponsor.id).then((_) => {
      setSponsors((sponsors) =>
        sponsors.map((s) => (s.id === sponsor.id ? { ...s, image: "" } : s))
      );
    });
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <span className="bg-background rounded-md shadow-md">
          <div className="p-3">
            <Pencil className="w-5 h-5" />
          </div>
        </span>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Edit Sponsor</DrawerTitle>
            <DrawerDescription>Update the sponsor details</DrawerDescription>
          </DrawerHeader>
          <form className="grid gap-4 p-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                defaultValue={sponsor.name}
                onChange={(e) => {
                  setName(e.currentTarget.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex gap-3 items-center">
                <Input ref={inputRef} id="file" type="file" />
                {sponsor.image === "" ? null : (
                  <Delete
                    del={DeleteImage}
                    message="You want to delete the image?"
                  />
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                defaultValue={sponsor.description}
                onChange={(e) => {
                  setDescription(e.currentTarget.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                defaultValue={sponsor.email}
                onChange={(e) => {
                  setEmail(e.currentTarget.value);
                }}
              />
            </div>
          </form>
          <DrawerFooter>
            <Button onClick={Submit}>Submit</Button>
            <DrawerClose asChild>
              <Button ref={cancelRef} variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function Sponsor({
  name,
  image,
  description,
  email,
  del,
  sponsor,
  setSponsors,
}: {
  name: string;
  image: string;
  description: string;
  email: string;
  del: () => void;
  sponsor: ISponsor;
  setSponsors: (fn: (s: ISponsor[]) => ISponsor[]) => void;
}) {
  return (
    <div className="cursor-pointer h-fit group relative select-none">
      <div className="absolute right-0 top-0 p-5 group-hover:block hidden">
        <div className="flex gap-3">
          <EditSponsor sponsor={sponsor} setSponsors={setSponsors} />
          <DeleteWrapper del={del} message="You want to delete the sponsor?">
            <span className="group/trash cursor-pointer relative z-40">
              <div className="p-3 bg-background rounded-md shadow-md">
                <Trash2 className="w-5 h-5 group-hover/trash:text-red-500" />
              </div>
            </span>
          </DeleteWrapper>
        </div>
      </div>
      <div className="h-[170px] bg-card rounded-t-sm p-5 border-border border">
        {image === "" ? (
          <div className="flex items-center justify-center text-2xl h-full">
            <h2>{name}</h2>
          </div>
        ) : (
          <img
            src={`${SERVER}/${image}`}
            alt={name}
            className="w-full h-full object-scale-down"
          />
        )}
      </div>
      <div className="p-5 border border-border">
        <h2 className="font-bold text-lg mb-3">{name}</h2>
        <div className="overflow-hidden">{description}</div>
        <div className="flex justify-end gap-2 pt-3">
          <div>
            <p className="font-bold text-sm">{email}</p>
          </div>
        </div>
      </div>
      <div className="w-full h-1 bg-slate-500 group-hover:bg-cyan-500"></div>
    </div>
  );
}

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<ISponsor[]>([]);

  useEffect(() => {
    api.storage.listSponsors().then((sponsors) => {
      setSponsors(sponsors);
    });
  }, []);

  function handleCreateSponsor() {
    api.storage.createSponsor().then((sponsor) => {
      setSponsors([...sponsors, sponsor]);
    });
  }

  function handleDeleteSponsor(id: number) {
    api.storage.deleteSponsor(id).then(() => {
      setSponsors(sponsors.filter((sponsor) => sponsor.id !== id));
    });
  }

  return (
    <div className="p-8">
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-3">
          <div>Storage</div>
          <div className="text-muted-foreground">|</div>
          <span className="text-muted-foreground">
            <h1 className="text-xl font-bold text-center flex">Sponsors</h1>
          </span>
        </h1>
      </div>
      <div className="flex justify-end mt-8">
        <Button
          className="font-bold py-2 px-4 rounded text-foreground"
          onClick={handleCreateSponsor}
        >
          Add Sponsor
        </Button>
      </div>
      {sponsors.length !== 0 ? (
        <div className="py-10 grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sponsors.map((sponsor, i) => {
            return (
              <Sponsor
                key={i}
                name={sponsor.name}
                image={sponsor.image}
                description={sponsor.description}
                email={sponsor.email}
                del={() => handleDeleteSponsor(sponsor.id)}
                sponsor={sponsor}
                setSponsors={(fn: (s: ISponsor[]) => ISponsor[]) =>
                  setSponsors(fn(sponsors))
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-1 justify-center py-5">
          <div className="text-muted-foreground text-center">
            Not available sponsors
          </div>
        </div>
      )}
    </div>
  );
}
