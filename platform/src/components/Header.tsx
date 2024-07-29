import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  CircleUser,
  Menu,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function LinkC({ to, children, route }: { to: string, children: React.ReactNode, route: string }) {
  return (
    <Link
      to={to}
      className={`transition-colors hover:text-foreground ${route === to.split("/")[1]
        ? "text-foreground" : "text-muted-foreground"}`}
    >
      {children}
    </Link>
  )
}

function LinkL({ to, children, route }: { to: string, children: React.ReactNode, route: string }) {
  return (
    <Link
      to={to}
      className={`hover:text-foreground ${route === to.split("/")[1]
        ? "text-foreground" : "text-muted-foreground"}`}
    >
      {children}
    </Link>
  )
}

export default function Header() {
  const { signout } = useAuth();
  const { pathname } = useLocation();
  const route = pathname.split("/")[1];

  return <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40 select-none">
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      <Link
        to="/events"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <h1>HackMx</h1>
        <span className="sr-only">HackMx</span>
      </Link>
      <LinkC to="/events" route={route}>Events</LinkC>
      <LinkC to="/storage" route={route}>Storage</LinkC>
    </nav>
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            to=""
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <h1>HackMx</h1>
            <span className="sr-only">HackMx</span>
          </Link>
          <LinkL to="/events" route={route}>Events</LinkL>
          <LinkL to="/storage" route={route}>Storage</LinkL>
        </nav>
      </SheetContent>
    </Sheet>
    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <div className="ml-auto flex-1 sm:flex-initial"></div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem onClick={signout}
          >Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
}