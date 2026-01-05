import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { javascriptQuestions, scenarioQuestion } from '../utils/mockData';
import { calculateSCI } from '../utils/sciCalculator';

const Assessment = () => {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isScenario, setIsScenario] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [selectedOption, setSelectedOption] = useState('');

    // Timer countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (optionLetter) => {
        setSelectedOption(optionLetter);
    };

    const handleNext = () => {
        // Save answer
        const currentQuestion = isScenario ? scenarioQuestion : javascriptQuestions[currentQuestionIndex];
        setAnswers({
            ...answers,
            [currentQuestion.id]: selectedOption
        });
        setSelectedOption('');

        if (!isScenario && currentQuestionIndex < javascriptQuestions.length - 1) {
            // Move to next MCQ
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (!isScenario && currentQuestionIndex === javascriptQuestions.length - 1) {
            // Move to scenario question
            setIsScenario(true);
        } else {
            // All done, submit
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        // Calculate scores
        let correctMCQs = 0;
        javascriptQuestions.forEach(q => {
            const userAnswer = answers[q.id];
            const correctOption = q.options.find(opt => opt.correct);
            if (userAnswer === correctOption.letter) {
                correctMCQs++;
            }
        });

        const assessmentScore = (correctMCQs / javascriptQuestions.length) * 100;

        // Check scenario answer
        const scenarioAnswer = answers[scenarioQuestion.id] || selectedOption;
        const correctScenario = scenarioQuestion.options.find(opt => opt.correct);
        const scenarioScore = scenarioAnswer === correctScenario.letter ? 80 : 20;

        // Get skill data
        const skillData = JSON.parse(localStorage.getItem('skillData'));

        // Calculate SCI
        const sciResult = calculateSCI(assessmentScore, skillData.lastUsed, scenarioScore);

        // Store result
        localStorage.setItem('sciResult', JSON.stringify(sciResult));

        // Navigate to result
        navigate('/result');
    };

    const currentQuestion = isScenario ? scenarioQuestion : javascriptQuestions[currentQuestionIndex];
    const totalQuestions = javascriptQuestions.length + 1;
    const currentProgress = isScenario
        ? javascriptQuestions.length + 1
        : currentQuestionIndex + 1;

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <h2>Assessment</h2>
                    <div className={`timer ${timeLeft < 60 ? 'warning' : ''}`}>
                        ⏱️ {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem'
                    }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Question {currentProgress} of {totalQuestions}
                        </span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            {Math.round((currentProgress / totalQuestions) * 100)}% Complete
                        </span>
                    </div>
                    <div className="progress-container">
                        <div
                            className="progress-bar"
                            style={{ width: `${(currentProgress / totalQuestions) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="question-card">
                    {isScenario && (
                        <div className="badge badge-success" style={{ marginBottom: '1rem' }}>
                            Scenario Question
                        </div>
                    )}

                    <h3 style={{ marginBottom: '2rem' }}>{currentQuestion.question}</h3>

                    <div>
                        {currentQuestion.options.map((option) => (
                            <div
                                key={option.letter}
                                className={`option ${selectedOption === option.letter ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(option.letter)}
                            >
                                <div className="option-letter">{option.letter}</div>
                                <div>{option.text}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={!selectedOption}
                    style={{ width: '100%', marginTop: '2rem' }}
                >
                    {isScenario ? 'Submit Assessment' : 'Next Question'}
                </button>
            </div>
        </div>
    );
};

export default Assessment;
