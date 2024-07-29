import { useEffect, useState } from "react";
import api, { type QuestionAndAnswer } from "@/utils/api";

export default function FQA({ eventId }: { eventId: number | null }) {
  const [questions, setQuestions] = useState<QuestionAndAnswer[]>([]);

  useEffect(() => {
    if (eventId) {
      api.events.getFQAs(eventId).then(setQuestions);
    }
  }, [eventId]);

  if (questions.length === 0) {
    return null;
  }

  return <>
    <h1 className="text-3xl font-semibold text-center">Preguntas frecuentes</h1>
    <div className="py-16 flex flex-col gap-10">
      {questions.map((question, i) => (
        <div key={i} className="flex flex-col gap-3">
          <h1 className="text-xl font-semibold">{question.question}</h1>
          <p className="text-p-secondary-text text-base">{question.answer}</p>
        </div>
      ))}
    </div>
  </>
}