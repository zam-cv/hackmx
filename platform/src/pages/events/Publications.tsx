import { useEffect, useState, useRef } from "react";
import api, { Post as IPost } from "@/utils/api";
import { handleKeyDown } from "@/utils";
import { BreadcrumbInEvent } from "@/components/Breadcrumb";
import { DeleteWrapper } from "@/components/Delete";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

function Post({ post, del }: { post: IPost; del: () => void }) {
  return (
    <TableRow className="relative">
      <TableCell>
        <div className="absolute w-full h-full top-0 left-0">
          <DeleteWrapper
            del={del}
            message="You want to delete the post?"
            className="w-full h-full"
          >
            <span></span>
          </DeleteWrapper>
        </div>
        <div className="font-medium">{post.title}</div>
        <div className="text-sm text-muted-foreground inline">
          {post.description}
        </div>
      </TableCell>
      <TableCell className="text-right">
        {format(new Date(post.date), "PPP HH:mm:ss")}
      </TableCell>
    </TableRow>
  );
}

export default function Publications() {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<any>(null);

  const [publications, setPublications] = useState<IPost[]>([]);
  const { id } = useParams();

  useEffect(() => {
    api.posts.list(parseInt(id || "")).then((publications: any) => {
      setPublications(publications);
    });
  }, [id]);

  function HandleAddPost() {
    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;

    if (!title || !description) return;

    api.posts.create(parseInt(id || ""), title, description).then((id) => {
      const post = { id, title, description, date: new Date().toISOString() };
      setPublications([...publications, post]);
    });
  }

  function handleDelete(id: number) {
    api.posts.delete(id).then(() => {
      setPublications(publications.filter((post) => post.id !== id));
    });
  }

  return (
    <div className="grid grid-rows-[auto_1fr] h-full">
      <BreadcrumbInEvent id={id} name="Publications" />
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Publications</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of publications for this event.
            </p>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-[5fr_6fr] md:h-full">
          <Card x-chunk="dashboard-07-chunk-0" className="h-fit">
            <CardHeader>
              <CardTitle>Add New Post</CardTitle>
              <CardDescription>Add a new post to the event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    ref={titleRef}
                    id="title"
                    type="text"
                    onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
                    className="w-full"
                    placeholder="Title of the post"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    ref={descriptionRef}
                    id="description"
                    placeholder="Description of the post"
                    className="min-h-32"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={HandleAddPost} className="text-foreground">Send Post</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center h-full w-full overflow-auto relative rounded-xl border-t">
            <div className="h-fit w-full md:absolute">
              <Card
                className="xl:col-span-2 w-full border-t-0"
                x-chunk="dashboard-01-chunk-4"
              >
                <div className="grid h-full grid-rows-[auto_1fr] w-full">
                  <CardHeader className="flex flex-row items-center sticky top-0 bg-card z-10">
                    <div className="grid gap-2">
                      <CardTitle>Posts</CardTitle>
                      <CardDescription>
                        List of posts for this event
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex">
                    <Table className="max-md:h-auto overflow-auto w-full max-md:relative">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Post</TableHead>
                          <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="w-full">
                        {publications.map((post, i) => (
                          <Post
                            key={i}
                            post={post}
                            del={() => handleDelete(post.id)}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
