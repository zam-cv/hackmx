import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BreadcrumbInEvent } from "@/components/Breadcrumb";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DeleteWrapper } from '@/components/Delete';
import api, { Image } from "@/utils/api"
import { SERVER } from '@/utils/constants';

export default function Gallery() {
  const [images, setImages] = useState<Image[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();

  useEffect(() => {
    api.gallery.list(parseInt(id)).then((res) => {
      setImages(res)
    })
  }, [id])

  function handleDelete(imageId: number) {
    api.gallery.delete(imageId).then(() => {
      setImages((prevState) => prevState.filter(({ id }) => imageId !== id))
    })
  }

  function handleUpload() {
    if (!inputRef.current?.files?.length) {
      return
    }

    const file = inputRef.current.files[0]
    api.gallery.upload(parseInt(id), file, {
      name: file.name,
    })
      .then((newImage) => {
        inputRef.current.value = ''
        setImages([...images, newImage])
      })
  }

  return <div>
    <BreadcrumbInEvent id={id} name="Gallery" />
    <h1 className="text-4xl font-bold text-center py-5">Gallery</h1>
    <div className="flex justify-center gap-5">
      <Input ref={inputRef} type="file" className="w-1/2" placeholder="File" />
      <Button
        className="font-bold py-2 px-4 rounded text-foreground"
        onClick={handleUpload}>Add Image</Button>
    </div>
    <div className='flex flex-wrap p-10 gap-10 justify-center'>
      {images.map((image, i) => {
        return (
          <div key={i} className="flex justify-center items-center h-80 w-80 rounded-md relative">
            <img src={`${SERVER}/${image.name}`} alt={image.name} className="rounded-lg object-contain w-full h-full" />
            <DeleteWrapper del={() => handleDelete(image.id)} message='Are you sure you want to delete this image?'>
              <Button className="absolute top-0 right-0 font-bold py-2 px-4 rounded text-foreground">Delete</Button>
            </DeleteWrapper>
          </div>
        )
      })}
    </div>
  </div>
}