import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/utils/api";
import {
  CircleUser,
} from "lucide-react"

export default function Avatar({ visible }: { visible?: boolean }) {
  function Navigation(route: string) {
    window.location.href = route;
  }

  function Logout() {
    api.auth.logout().then(() => {
      window.location.href = "/";
    });
  }

  return (
    <div className={`flex items-center h-full px-7 cursor-pointer ${visible === undefined || visible === false ? "max-lg:hidden" : ""}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="rounded-full bg-p-secondary-background focus-visible:ring-0 select-none">
            <CircleUser size={40} strokeWidth={1.25} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => { Navigation("/dashboard") }}>Dashboard</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { Navigation("/profile") }}>Mi Perfil</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { Navigation("/projects") }}>Mis Proyectos</DropdownMenuItem>
          <DropdownMenuItem onClick={Logout}>Cerrar Sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}