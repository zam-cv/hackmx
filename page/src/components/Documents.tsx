import { useState, useEffect } from "react"
import api, { type Document } from "@/utils/api"
import { getQueryParam } from "@/utils"
import { SERVER } from "@/utils/constants"

function Document({ name }: { name: string }) {
  return <a href={`${SERVER}/${name}`} target="_blank">
    <h2 className="font-bold text-sm">{name.split('/').pop()?.split('-').pop()}</h2>
  </a>
}

export default function Documents() {
  const [eventId, setEventId] = useState<number | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    const eventId = parseInt(getQueryParam("id") ?? "")
    setEventId(eventId)

    if (eventId) {
      api.events.getDocuments(eventId).then(setDocuments)
    }
  }, [eventId])

  if (documents.length === 0) {
    return null
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center">Documentos</h1>
      <div className="flex flex-wrap gap-7 p-10 justify-center">
        {documents.map((document, i) => (
          <Document key={i} name={document.name} />
        ))}
      </div>
    </div>
  )
}