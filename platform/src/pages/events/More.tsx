import { useEffect, useRef, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { BreadcrumbInEvent } from "@/components/Breadcrumb";
import { Input } from "@/components/ui/input"
import { DeleteWrapper } from '@/components/Delete';
import { Separator } from "@/components/ui/separator"
import { Link, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import api, { Document } from "@/utils/api"
import { SERVER } from '@/utils/constants';

export default function More() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  // const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    api.documents.list(parseInt(id)).then((res) => {
      setDocuments(res)
    })
  }, [id])

  // function handleDelete() {
  //   api.events.delete(parseInt(id))
  //     .then(() => {
  //       navigate('/events')
  //     })
  // }

  function handleDeleteDocument(documentId: number) {
    api.documents.delete(documentId).then(() => {
      setDocuments((prevState) => prevState.filter(({ id }) => documentId !== id))
    })
  }

  function handleUpload(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()
    e.stopPropagation()

    if (!inputRef.current?.files?.length) {
      return
    }

    const file = inputRef.current.files[0]
    api.documents.upload(parseInt(id), file, {
      name: file.name,
    })
      .then((newDocument) => {
        inputRef.current.value = ''
        setDocuments([...documents, newDocument])
      })
  }

  return <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 md:gap-8">
    <BreadcrumbInEvent id={id} name="More" />
    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 px-8">
      <div className="grid gap-6">
        {/* <div className='flex justify-end'>
          <DeleteWrapper del={() => handleDelete()} message='Are you sure you want to delete this event?'>
            <Button className="font-bold py-2 px-4 rounded text-foreground">Delete Event</Button>
          </DeleteWrapper>
        </div> */}
        <Card x-chunk="dashboard-04-chunk-2">
          <CardHeader>
            <CardTitle>
              Upload Documents
            </CardTitle>
            <CardDescription>
              Upload documents for this event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-8'>
              <form className="flex flex-col gap-4">
                <div className='flex gap-5'>
                  <Input
                    ref={inputRef}
                    id="file"
                    type="file"
                  />
                  <Button onClick={handleUpload} className='text-foreground font-bold'>Upload</Button>
                </div>
              </form>
              <div className='flex flex-wrap gap-6'>
                {documents.map((doc, i) => (
                  <div key={i} className="flex h-5 items-center gap-2 text-sm">
                    <div>{doc.name.split('/').pop().split('-').pop()}</div>
                    <Separator orientation="vertical" />
                    <DeleteWrapper del={() => handleDeleteDocument(doc.id)} message={`Are you sure you want to delete ${doc.name}?`}>
                      <Trash2 className='h-4 w-4 cursor-pointer hover:text-red-500' />
                    </DeleteWrapper>
                    <Separator orientation="vertical" />
                    <div>
                      <a href={`${SERVER}/${doc.name}`} target="_blank">
                        <Link className='h-4 w-4 hover:text-cyan-400' />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>;
}