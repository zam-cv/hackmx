import { useNavigate } from "react-router-dom"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  University,
  Building2
} from "lucide-react"

function Section({
  title,
  description,
  children,
  message,
  route
}: {
  title: string,
  description: string,
  children: React.ReactNode,
  message: string,
  route: string
}) {
  const navigate = useNavigate()

  function handleClick() {
    navigate(`/storage/${route}`)
  }

  return <Card x-chunk="dashboard-01-chunk-0" className="cursor-pointer select-none" onClick={handleClick}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-2xl font-bold">
        {title}
      </CardTitle>
      {children}
    </CardHeader>
    <CardContent>
      <div className="text-sm font-medium">{description}</div>
      <p className="text-xs text-muted-foreground">
        {message}
      </p>
    </CardContent>
  </Card>
}

export default function Storage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className='flex flex-col gap-2'>
        <div className='flex justify-center'>
          <h1 className="text-2xl font-bold text-center">
            Storage
          </h1>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Section title="Sponsors" description="Sponsor characteristics" message="Google, Facebook, Microsoft, Apple ..." route="sponsors">
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </Section>
        <Section title="Universities" description="University characteristics" message="Image, Description ..." route="universities">
          <University className="h-4 w-4 text-muted-foreground" />
        </Section>
      </div>
    </main>
  )
}