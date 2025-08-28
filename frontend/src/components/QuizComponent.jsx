import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Loading from "../components/Loading";

const QuizComponent = () => {
  const { user, token, API } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [partnerAnswers, setPartnerAnswers] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/api/quiz/questions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.length) {
          setQuestions(res.data);
          setAnswers(new Array(res.data.length).fill(""));
        } else {
          setError("No questions available");
        }
      } catch (err) {
        console.error("Fetch questions error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to load questions");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [API, token]);

  // Fetch partner answers
  const fetchPartnerAnswers = async () => {
    if (!user?.partnerEmail) {
      setPartnerAnswers([]);
      setError("No partner linked");
      return;
    }
    try {
      const res = await axios.get(`${API}/api/quiz/partner`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPartnerAnswers(res.data.answers || []);
      if (!res.data.answers.length) {
        console.log("Partner answers empty:", res.data.message || "No message provided");
      }
    } catch (err) {
      console.error("Fetch partner answers error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load partner answers");
    }
  };

  // Check existing quiz submission
  useEffect(() => {
    const checkSubmission = async () => {
      try {
        const res = await axios.get(`${API}/api/quiz/submit`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.submitted) {
          setCompleted(true);
          setAnswers(res.data.answers.map((a) => a.answer));
          await fetchPartnerAnswers();
        }
      } catch (err) {
        console.error("Check submission error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to check submission");
      }
    };
    checkSubmission();
  }, [API, token]);

  // Poll for partner answers after submission
  useEffect(() => {
    if (completed && !partnerAnswers.length) {
      const interval = setInterval(fetchPartnerAnswers, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [completed, partnerAnswers]);

  const handleAnswerChange = (value) => {
    setError("");
    if (value.length > 500) {
      setError("Answer cannot exceed 500 characters");
      return;
    }
    const updated = [...answers];
    updated[currentIndex] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    setError("");
    if (answers.length !== questions.length) {
      setError(`Please answer all ${questions.length} questions`);
      return;
    }
    if (answers.some((answer) => !answer.trim())) {
      setError("Please fill in all answers");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${API}/api/quiz/submit`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompleted(true);
      await fetchPartnerAnswers();
    } catch (err) {
      console.error("Submit quiz error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to submit quiz");
    } finally {
      setLoading(false);
    }
  };

  // Calculate score when partner answers are available
  useEffect(() => {
    if (completed && partnerAnswers.length) {
      let s = 0;
      partnerAnswers.forEach((pa) => {
        const userAnswer = answers[pa.questionId];
        if (userAnswer && pa.answer.toLowerCase() === userAnswer.toLowerCase()) s++;
      });
      setScore(s);
    }
  }, [partnerAnswers, completed, answers]);

  if (loading && !questions.length) return <Loading />;

  if (completed) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-md mt-10">
        <h2 className="text-2xl font-bold text-center mb-4">Quiz Completed!</h2>
        {error && (
          <div role="alert" className="alert alert-error my-2" aria-live="polite">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="btn btn-xs btn-ghost ml-auto"
            >
              ✕
            </button>
          </div>
        )}
        {partnerAnswers.length > 0 ? (
          <>
            <p className="text-center mb-2">
              Your Compatibility Score: {score}/{questions.length}
            </p>
            <div className="space-y-4">
              {questions.map((q, i) => (
                <div key={i} className="border p-2 rounded">
                  <p>
                    <strong>Q:</strong> {q}
                  </p>
                  <p>
                    <strong>Your Answer:</strong> {answers[i] || "Not answered"}
                  </p>
                  <p>
                    <strong>Partner's Answer:</strong>{" "}
                    {partnerAnswers.find((pa) => pa.questionId === i)?.answer || "Not answered yet"}
                  </p>
                </div>
              ))}
            </div>
            <button
              className="btn btn-primary mt-4"
              onClick={() => {
                setError("");
                fetchPartnerAnswers();
              }}
              aria-label="Refresh partner answers"
            >
              Refresh Partner Answers
            </button>
          </>
        ) : (
          <>
            <p className="text-center">Waiting for your partner to complete the quiz...</p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => {
                setError("");
                fetchPartnerAnswers();
              }}
              aria-label="Refresh partner answers"
            >
              Refresh
            </button>
          </>
        )}
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-md mt-10">
        <p className="text-center text-red-500">{error || "No questions available"}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Quiz</h2>
      {error && (
        <div role="alert" className="alert alert-error my-2" aria-live="polite">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="btn btn-xs btn-ghost ml-auto"
          >
            ✕
          </button>
        </div>
      )}
      <div>
        <label htmlFor="answer" className="mb-2 block">
          <strong>
            {currentIndex + 1}. {questions[currentIndex]}
          </strong>
        </label>
        <input
          id="answer"
          type="text"
          className="input input-bordered w-full"
          value={answers[currentIndex] || ""}
          onChange={(e) => handleAnswerChange(e.target.value)}
          aria-required="true"
        />
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="btn btn-outline"
          onClick={() => {
            setError("");
            setCurrentIndex(currentIndex - 1);
          }}
          disabled={currentIndex === 0}
          aria-label="Previous question"
        >
          Previous
        </button>
        {currentIndex === questions.length - 1 ? (
          <button
            className="btn btn-error"
            onClick={handleSubmit}
            disabled={loading || !answers[currentIndex]?.trim()}
            aria-busy={loading}
            aria-label="Submit quiz"
          >
            {loading ? <Loading /> : "Submit Quiz"}
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => {
              setError("");
              setCurrentIndex(currentIndex + 1);
            }}
            disabled={!answers[currentIndex]?.trim()}
            aria-label="Next question"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;