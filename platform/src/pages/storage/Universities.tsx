import { useState, useEffect, useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api, { University as IUniversity } from "@/utils/api";
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

function EditUniversity({
  university,
  setUniversity,
}: {
  university: IUniversity;
  setUniversity: (fn: (s: IUniversity[]) => IUniversity[]) => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(university.name);
  const [description, setDescription] = useState(university.description);
  const [email_extension, setEmailExtension] = useState(
    university.email_extension
  );

  function Cancel() {
    cancelRef.current?.click();
  }

  function Submit() {
    api.storage
      .updateUniversity({
        id: university.id,
        name,
        image: "",
        description,
        email_extension,
      })
      .then(() => {
        setUniversity((universities) =>
          universities.map((u) =>
            u.id === university.id
              ? {
                  ...u,
                  name,
                  description,
                  email_extension,
                }
              : u
          )
        );
      });

    if (inputRef.current?.files?.length) {
      api.storage
        .uploadUniversityImage(university.id, inputRef.current.files[0], {
          name: inputRef.current.files[0].name,
        })
        .then((university) => {
          setUniversity((universities) =>
            universities.map((u) =>
              u.id === university.id
                ? {
                    ...u,
                    name,
                    description,
                    email_extension,
                    image: university.image,
                  }
                : u
            )
          );
          Cancel();
        });
    } else {
      Cancel();
    }
  }

  function DeleteImage() {
    api.storage.deleteUniversityImage(university.id).then((_) => {
      setUniversity((universities) =>
        universities.map((u) =>
          u.id === university.id
            ? {
                ...u,
                image: "",
              }
            : u
        )
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
            <DrawerTitle>Edit University</DrawerTitle>
            <DrawerDescription>Update the university details</DrawerDescription>
          </DrawerHeader>
          <form className="grid gap-4 p-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                defaultValue={university.name}
                onChange={(e) => {
                  setName(e.currentTarget.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex gap-3 items-center">
                <Input ref={inputRef} id="file" type="file" />
                {university.image === "" ? null : (
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
                defaultValue={university.description}
                onChange={(e) => {
                  setDescription(e.currentTarget.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email_extension">Email Extension</Label>
              <Input
                type="text"
                id="email_extension"
                placeholder="example.com"
                defaultValue={university.email_extension}
                onChange={(e) => {
                  setEmailExtension(e.currentTarget.value);
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

function University({
  name,
  image,
  description,
  email_extension,
  del,
  university,
  setUniversity,
}: {
  name: string;
  image: string;
  description: string;
  email_extension: string;
  del: () => void;
  university: IUniversity;
  setUniversity: (fn: (s: IUniversity[]) => IUniversity[]) => void;
}) {
  return (
    <div className="cursor-pointer h-fit group relative select-none">
      <div className="absolute right-0 top-0 p-5 group-hover:block hidden">
        <div className="flex gap-3">
          <EditUniversity
            university={university}
            setUniversity={setUniversity}
          />
          <DeleteWrapper del={del} message="You want to delete the sponsor?">
            <span className="group/trash cursor-pointer relative z-40">
              <div className="p-3 bg-background rounded-md shadow-md">
                <Trash2 className="w-5 h-5 group-hover/trash:text-red-500" />
              </div>
            </span>
          </DeleteWrapper>
        </div>
      </div>
      <div className="h-[170px] bg-card rounded-t-sm p-5 border border-border">
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
            <p className="font-bold text-sm">{email_extension}</p>
          </div>
        </div>
      </div>
      <div className="w-full h-1 bg-slate-500 group-hover:bg-cyan-500"></div>
    </div>
  );
}

export default function Universities() {
  const [universitys, setUniversity] = useState<IUniversity[]>([]);

  useEffect(() => {
    api.storage.listUniversities().then((universities) => {
      setUniversity(universities);
    });
  }, []);

  function handleCreateUniversity() {
    api.storage.createUniversity().then((university) => {
      setUniversity([...universitys, university]);
    });
  }

  function handleDeleteUniversity(id: number) {
    api.storage.deleteUniversity(id).then(() => {
      setUniversity(universitys.filter((university) => university.id !== id));
    });
  }

  return (
    <div className="p-8">
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-3">
          <div>Storage</div>
          <div className="text-muted-foreground">|</div>
          <span className="text-muted-foreground">
            <h1 className="text-xl font-bold text-center flex">Universities</h1>
          </span>
        </h1>
      </div>
      <div className="flex justify-end mt-8">
        <Button
          className="font-bold py-2 px-4 rounded text-foreground"
          onClick={handleCreateUniversity}
        >
          Add University
        </Button>
      </div>
      {universitys.length !== 0 ? (
        <div className="py-10 grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {universitys.map((university) => {
            return (
              <University
                key={university.id}
                name={university.name}
                image={university.image}
                description={university.description}
                email_extension={university.email_extension}
                del={() => handleDeleteUniversity(university.id)}
                university={university}
                setUniversity={(fn: (s: IUniversity[]) => IUniversity[]) =>
                  setUniversity(fn(universitys))
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-1 justify-center py-5">
          <div className="text-muted-foreground text-center">
            Not available universities
          </div>
        </div>
      )}
    </div>
  );
}
