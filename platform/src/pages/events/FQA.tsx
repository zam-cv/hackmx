import { useEffect, useState, useRef } from "react";
import api, { QuestionAndAnswer } from "@/utils/api";
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

function Item({ item, del }: { item: QuestionAndAnswer; del: () => void }) {
  return (
    <TableRow className="relative">
      <TableCell>
        <div className="absolute w-full h-full top-0 left-0">
          <DeleteWrapper
            del={del}
            message="You want to delete the item?"
            className="w-full h-full"
          >
            <span></span>
          </DeleteWrapper>
        </div>
        <div className="font-medium">{item.question}</div>
        <div className="text-sm text-muted-foreground inline">
          {item.answer}
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function FQA() {
  const questionRef = useRef<HTMLInputElement>(null);
  const answerRef = useRef<any>(null);

  const [fqa, setFqa] = useState<QuestionAndAnswer[]>([]);
  const { id } = useParams();

  useEffect(() => {
    api.fqa.list(parseInt(id || "")).then((publications: any) => {
      setFqa(publications);
    });
  }, [id]);

  function HandleAddItem() {
    const question = questionRef.current?.value;
    const answer = answerRef.current?.value;

    if (!question || !answer) return;

    api.fqa.create(parseInt(id || ""), question, answer).then((id) => {
      const item = { id, question, answer };
      setFqa([...fqa, item]);
    });
  }

  function handleDelete(id: number) {
    api.fqa.delete(id).then(() => {
      setFqa(fqa.filter((item) => item.id !== id));
    });
  }

  return (
    <div className="grid grid-rows-[auto_1fr] h-full">
      <BreadcrumbInEvent id={id} name="FQA" />
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">FQA</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of items for this event.
            </p>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-[5fr_6fr] md:h-full">
          <Card x-chunk="dashboard-07-chunk-0" className="h-fit">
            <CardHeader>
              <CardTitle>Add New Item</CardTitle>
              <CardDescription>
                Add a new item to the event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="question">Question</Label>
                  <Input
                    ref={questionRef}
                    id="question"
                    type="text"
                    onKeyDown={(e) => handleKeyDown(e, answerRef)}
                    className="w-full"
                    placeholder="Event question"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea
                    ref={answerRef}
                    id="answer"
                    placeholder="Answer of the question"
                    className="min-h-32"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={HandleAddItem} className="text-foreground font-bold">Send Item</Button>
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
                      <CardTitle>FQA</CardTitle>
                      <CardDescription>
                        List of items for this event
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Items</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="w-full">
                        {fqa.map((item, i) => (
                          <Item
                            key={i}
                            item={item}
                            del={() => handleDelete(item.id)}
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
