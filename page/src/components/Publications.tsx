import { useState, useEffect } from "react"
import api, { type Post } from "@/utils/api"
import { getQueryParam } from "@/utils"
import { format } from "date-fns"

function Publication({
  title,
  date,
  content
}: {
  title: string,
  date: string,
  content: string
}) {
  return (
    <div className="flex flex-col gap-2 px-24 max-md:px-10">
      <div className="flex gap-5">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex items-center justify-center gap-3">
          {format(new Date(date), "dd - MM - yyyy")} 
          <span className="text-p-secondary-text text-sm">{format(new Date(date), "HH:mm")}</span>
        </div>
      </div>
      <p className="text-p-secondary-text">
        {content}
      </p>
    </div>
  )
}

export default function Publications() {
  const [eventId, setEventId] = useState<number | null>(null)
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const eventId = parseInt(getQueryParam("id") ?? "")
    setEventId(eventId)

    if (eventId) {
      api.events.getPosts(eventId).then(setPosts)
    }
  }, [eventId])

  if (posts.length === 0) {
    return null
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center">Publicaciones</h1>
      <div className="flex flex-col gap-7 p-5 pt-10">
        {posts.map((post, i) => (
          <Publication
            key={i}
            title={post.title}
            date={post.date}
            content={post.description}
          />
        ))}
      </div>
    </div>
  )
}