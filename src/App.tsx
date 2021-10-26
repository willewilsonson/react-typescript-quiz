import { useState } from "react";
import { fetchQuizQuestions, Difficulty, QuestionState } from "./API";
import QuestionCard from "./components/QuestionCard";
import './App.css';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const App: React.FC = () => {
  const[loading, setLoading] = useState(false);
  const[questions, setQuestions] = useState<QuestionState[]>([]);
  const[number, setNumber] = useState(0);
  const[userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const[score, setScore] = useState(0);
  const[gameOver, setGameOver] = useState(true);

  const[quantity, setQuantity] = useState(0);

  console.log(questions);
  
  
  const startQuiz = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      quantity,
      Difficulty.EASY,
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;

      if (correct) setScore(prev => prev + 1);

      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };

      setUserAnswers(prev => [...prev, answerObject])
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;

    if (nextQuestion === quantity) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  const handleSubmit = (e: any) => {
    console.log(quantity);
    
  };

  return (
    <div className="App">
      <h1>
        Quizzon
      </h1>
      {gameOver || userAnswers.length === quantity ? (
      <form>
        <label htmlFor="quantity">Number of Questions: </label>
        <input type="number" min='1' max='50' placeholder='1' id='quantity' onChange={(e) => setQuantity(Number(e.target.value))}/>
        <label htmlFor="quantity">Number of Questions: </label>
        <input type="number" min='1' max='50' placeholder='1' id='quantity' onChange={(e) => setQuantity(Number(e.target.value))}/>
        <button className='start' onClick={startQuiz}>
          Start
        </button>
      </form>
      ) : null}
      {!gameOver ? <p className='score'>
        Score: {score}
      </p>
      : null}
      {loading && <p>Loading Questions ...</p>}
      {!loading && !gameOver && (
      <QuestionCard 
        questionNumber={number + 1}
        totalQuestions={quantity}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number] : undefined}
        callback={checkAnswer}
      />
      )}
      {!gameOver && !loading && userAnswers.length === number + 1 && number !== quantity - 1 ? (
      <button className='next' onClick={nextQuestion}>
        Next Question
      </button>
      ) : null}
    </div>
  );
}

export default App;
