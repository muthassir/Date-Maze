import { useState, useEffect } from "react";
import questionsData from "../data/questions.json";

const QuizComponent = () => {
  const [quiz, setQuiz] = useState([]);
  const [answersA, setAnswersA] = useState([]);
  const [answersB, setAnswersB] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Load quiz from JSON
  useEffect(() => {
    setQuiz(questionsData);
    setAnswersA(Array(questionsData.length).fill(""));
    setAnswersB(Array(questionsData.length).fill(""));
  }, []);

  const handleChangeA = (i, val) => {
    const newAns = [...answersA];
    newAns[i] = val;
    setAnswersA(newAns);
  };

  const handleChangeB = (i, val) => {
    const newAns = [...answersB];
    newAns[i] = val;
    setAnswersB(newAns);
  };

  const handleSubmit = () => {
    let matchCount = 0;
    quiz.forEach((_, i) => {
      if (answersA[i].trim().toLowerCase() === answersB[i].trim().toLowerCase()) {
        matchCount += 1;
      }
    });
    const total = quiz.length;
    const compatibility = Math.round((matchCount / total) * 100);
    setScore(compatibility);
    setShowResult(true);
  };

  if (!quiz.length) return <p className="text-center mt-10">Loading quiz...</p>;

  if (showResult)
    return (
      <div className="max-w-xl mx-auto mt-6  p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Compatibility Score: {score}%
        </h2>
        <ul className="space-y-3">
          {quiz.map((q, i) => (
            <li key={i} className="border-b pb-2">
              <p className="font-medium">{q}</p>
              <p className="text-sm ">Partner A: {answersA[i] || "-"}</p>
              <p className="text-sm ">Partner B: {answersB[i] || "-"}</p>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setShowResult(false)}
          className="mt-4 w-full px-6 py-2 bg-pink-500 rounded-lg hover:bg-pink-600"
        >
          Edit Answers
        </button>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg mt-6 text-error">
      <h2 className="text-xl font-bold mb-4 text-center">Couple Quiz 💕</h2>
      <p className="mb-4 text-center">
        Partner A and Partner B fill your answers below.
      </p>

      {quiz.map((q, i) => (
        <div key={i} className="mb-4">
          <p className="font-medium">{q}</p>
          <input
            type="text"
            placeholder="Partner A"
            value={answersA[i]}
            onChange={(e) => handleChangeA(i, e.target.value)}
            className="w-full p-2 border rounded-lg mt-1 mb-1 "
          />
          <input
            type="text"
            placeholder="Partner B"
            value={answersB[i]}
            onChange={(e) => handleChangeB(i, e.target.value)}
            className="w-full p-2 border rounded-lg mt-1"
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full mt-4 px-6 py-2 bg-error text-black  rounded-lg hover:bg-pink-600"
      >
        Show Compatibility
      </button>
    </div>
  );
};

export default QuizComponent;
