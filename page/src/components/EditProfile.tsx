import { useEffect, useState, useRef } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Semester from "@/components/Semester";
import Campus from "@/components/Campus";
import Majors from "@/components/Majors";
import api, { type User } from "@/utils/api";
import { handleKeyDown, handleEnter } from "@/utils";

function Label(props: React.ComponentProps<"label">) {
  return <label {...props} className="text-p-secondary-text text-sm pr-1" >
    {props.children}
  </label >
}

export default function EditProfile() {
  const firstnameRef = useRef<HTMLInputElement>(null);
  const lastnameRef = useRef<HTMLInputElement>(null);
  const motherlastnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [motherlastname, setMotherlastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [semester, setSemester] = useState<number>(1);
  const [campus, setCampus] = useState<string | undefined>("__none");
  const [major, setMajor] = useState<string | undefined>("__none");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    api.user.get().then((user) => {
      setUsername(user.username);
      setFirstname(user.firstname);
      setEmail(user.personal_email);
      setPhone(user.phone);
      setSemester(user.semester);
      setCampus(user.campus ?? "__none");
      setMajor(user.major ?? "__none");

      const lastnames = user.lastname.split(" ");
      if (lastnames.length === 1) {
        setLastname(lastnames[0]);
      }

      if (lastnames.length === 2) {
        setLastname(lastnames[0]);
        setMotherlastname(lastnames[1]);
      }
    });
  }, []);

  function HandleEditProfile() {
    const user: User = {
      username,
      firstname,
      lastname: `${lastname} ${motherlastname}`,
      personal_email: email,
      phone,
      semester,
      email,
      password,
    };

    if (campus !== "__none") {
      user.campus = campus;
    }

    if (major !== "__none") {
      user.major = major;
    }

    if (password.length > 0) {
      setPassword("")
    }

    api.user.update(user)
  }

  return <div className="w-full h-full flex items-center justify-center">
    <div className="flex flex-col gap-5 max-md:container w-[800px] p-7">
      <div
        className="flex flex-col gap-10 bg-p-secondary-background p-10 rounded-md"
      >
        <h2 className="text-xl font-bold">Editar Perfil</h2>
        <div className="flex flex-col gap-7">
          <div className="grid gap-5 w-full sm:grid-cols-4">
            <div className="flex flex-col gap-2">
              <div>
                <Label htmlFor="username">Nombre de Usuario</Label>
                <span className="text-red-500">*</span>
              </div>
              <Input
                id="username"
                type="text"
                defaultValue={username}
                onKeyDown={(e) => handleKeyDown(e, firstnameRef)}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <Label htmlFor="firstname">Nombre</Label>
                <span className="text-red-500">*</span>
              </div>
              <Input
                ref={firstnameRef}
                id="firstname"
                type="text"
                defaultValue={firstname}
                onKeyDown={(e) => handleKeyDown(e, lastnameRef)}
                onChange={(e) => setFirstname(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <Label htmlFor="lastname">Apellido Paterno</Label>
                <span className="text-red-500">*</span>
              </div>
              <Input
                ref={lastnameRef}
                id="lastname"
                type="text"
                defaultValue={lastname}
                onKeyDown={(e) => handleKeyDown(e, motherlastnameRef)}
                onChange={(e) => setLastname(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <Label htmlFor="motherlastname">Apellido Materno</Label>
                <span className="text-red-500">*</span>
              </div>
              <Input
                ref={motherlastnameRef}
                id="motherlastname"
                type="text"
                defaultValue={motherlastname}
                onKeyDown={(e) => handleKeyDown(e, emailRef)}
                onChange={(e) => setMotherlastname(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-5 w-full sm:grid-cols-6">
            <div className="flex flex-col gap-2 col-span-2">
              <div>
                <Label htmlFor="email">Correo Personal</Label>
                <span className="text-red-500">*</span>
              </div>
              <Input
                ref={emailRef}
                id="email"
                type="email"
                placeholder="m@example.com"
                defaultValue={email}
                onKeyDown={(e) => handleKeyDown(e, phoneRef)}
                onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <div>
                <Label htmlFor="phone">Número Telefónico</Label>
                <span className="text-red-500">*</span>
              </div>
              <Input
                ref={phoneRef}
                id="phone"
                type="text"
                placeholder="+52 55 1234 5678"
                defaultValue={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <div>
                <Label htmlFor="semester">Semestre</Label>
                <span className="text-red-500">*</span>
              </div>
              <Semester
                defaultValue={semester.toString()}
                onChangeValue={(value) => setSemester(parseInt(value))}
              />
            </div>
          </div>
          <div className="grid gap-5 w-full grid-cols-7 -mb-4">
            <div className="flex flex-col gap-2 col-span-2">
              <div>
                <Label htmlFor="campus">Campus</Label>
                <span></span>
              </div>
              <Campus
                defaultValue={campus ?? "__none"}
                onChangeValue={setCampus}
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <div>
                <Label htmlFor="major">Carrera</Label>
                <span></span>
              </div>
              <Majors defaultValue={major ?? "__none"} onChangeValue={setMajor} />
            </div>
            <div className="flex flex-col gap-1 col-span-3">
              <div className="flex flex-col gap-2">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <span className="text-red-500">*</span>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="•••••••••••"
                  onKeyDown={(e) => handleEnter(e, HandleEditProfile)}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <p className="text-xs text-p-secondary-text text-right">
                minimo ocho caracteres
              </p>
            </div>
          </div>
        </div>
        <Button id="register" onClick={HandleEditProfile}>Guardar cambios</Button>
      </div>
    </div>
  </div>
}