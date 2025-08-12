import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// 30 minutes (in seconds)
const TOTAL_TIME = 1800;

const QuestionContainer = [
  { id: 1, type: 'Question 1', Name: 'Which of the following is the correct syntax to declare a variable in C++?', o1: 'var x = 5;', o2: 'int x = 5;', o3: 'x := 5;', o4: 'let x = 5;' },
  { id: 2, type: 'Question 2', Name: 'Which JavaScript keyword is used to declare a constant variable?', o1: 'let', o2: 'const', o3: 'var', o4: 'static' },
  { id: 3, type: 'Question 3', Name: 'In C++, which operator is used to allocate memory dynamically?', o1: 'alloc', o2: 'malloc', o3: 'new', o4: 'create' },
  { id: 4, type: 'Question 4', Name: 'Which JavaScript method is used to parse a JSON string into an object?', o1: 'JSON.stringify()', o2: 'JSON.parse()', o3: 'parseJSON()', o4: 'toJSON()' },
  { id: 5, type: 'Question 5', Name: 'In C++, what does the "cout" object belong to?', o1: 'stdio.h', o2: 'iostream', o3: 'iomanip', o4: 'fstream' },
  { id: 6, type: 'Question 6', Name: 'Which JavaScript function can be used to delay execution of code?', o1: 'setTimeout()', o2: 'delay()', o3: 'wait()', o4: 'pause()' },
  { id: 7, type: 'Question 7', Name: 'In C++, what will happen if you do not provide a return type for a function?', o1: 'It defaults to int', o2: 'It will cause a compile error', o3: 'It defaults to void', o4: 'It runs without error' },
  { id: 8, type: 'Question 8', Name: 'Which JavaScript loop is guaranteed to run at least once?', o1: 'for', o2: 'while', o3: 'do...while', o4: 'foreach' },
  { id: 9, type: 'Question 9', Name: 'In C++, which header file is required to use std::string?', o1: '<string>', o2: '<cstring>', o3: '<strings>', o4: '<text>' },
  { id: 10, type: 'Question 10', Name: 'Which JavaScript operator is used for strict equality comparison?', o1: '==', o2: '=', o3: '===', o4: '=>=' },
  { id: 11, type: 'Question 11', Name: 'In C++, which keyword is used to define a constant variable?', o1: 'let', o2: 'static', o3: 'const', o4: 'final' },
  { id: 12, type: 'Question 12', Name: 'Which JavaScript method is used to remove the last element of an array?', o1: 'shift()', o2: 'pop()', o3: 'splice()', o4: 'removeLast()' },
  { id: 13, type: 'Question 13', Name: 'In C++, which operator is used to access a member of a pointer to an object?', o1: '.', o2: '->', o3: '::', o4: ':' },
  { id: 14, type: 'Question 14', Name: 'Which JavaScript method is used to join all elements of an array into a string?', o1: 'concat()', o2: 'join()', o3: 'toString()', o4: 'merge()' },
  { id: 15, type: 'Question 15', Name: 'In C++, which concept allows multiple functions with the same name but different parameters?', o1: 'Overloading', o2: 'Overriding', o3: 'Encapsulation', o4: 'Abstraction' },
  { id: 16, type: 'Question 16', Name: 'Which JavaScript keyword stops the execution of a loop?', o1: 'stop', o2: 'exit', o3: 'break', o4: 'end' },
  { id: 17, type: 'Question 17', Name: 'In C++, what is the output of sizeof(char)?', o1: '1', o2: '2', o3: '4', o4: '8' },
  { id: 18, type: 'Question 18', Name: 'In JavaScript, what will "typeof null" return?', o1: '"null"', o2: '"undefined"', o3: '"object"', o4: '"none"' },
  { id: 19, type: 'Question 19', Name: 'In C++, which loop is best when the number of iterations is known?', o1: 'while', o2: 'for', o3: 'do...while', o4: 'foreach' },
  { id: 20, type: 'Question 20', Name: 'Which JavaScript method adds one or more elements to the end of an array?', o1: 'push()', o2: 'append()', o3: 'add()', o4: 'insert()' },
  { id: 21, type: 'Question 21', Name: 'In C++, which feature allows a derived class to replace a base class method?', o1: 'Overloading', o2: 'Overriding', o3: 'Abstraction', o4: 'Polymorphism' },
  { id: 22, type: 'Question 22', Name: 'Which JavaScript method removes the first element from an array?', o1: 'shift()', o2: 'pop()', o3: 'splice()', o4: 'unshift()' },
  { id: 23, type: 'Question 23', Name: 'In C++, which symbol is used for single-line comments?', o1: '//', o2: '#', o3: '--', o4: '<!-- -->' },
  { id: 24, type: 'Question 24', Name: 'Which JavaScript built-in method sorts the elements of an array?', o1: 'sort()', o2: 'order()', o3: 'arrange()', o4: 'align()' },
  { id: 25, type: 'Question 25', Name: 'In C++, which header file is used for file handling?', o1: '<fstream>', o2: '<file>', o3: '<fileio>', o4: '<textfile>' },
  { id: 26, type: 'Question 26', Name: 'Which JavaScript method can convert a string to an integer?', o1: 'parseInt()', o2: 'Number()', o3: 'toInt()', o4: 'stringToInt()' },
  { id: 27, type: 'Question 27', Name: 'In C++, which keyword is used to inherit from a base class?', o1: 'extends', o2: 'inherits', o3: 'base', o4: ':' },
  { id: 28, type: 'Question 28', Name: 'In JavaScript, what is the output of 2 + "2"?', o1: '4', o2: '"4"', o3: '"22"', o4: 'Error' },
  { id: 29, type: 'Question 29', Name: 'In C++, which feature allows defining functions in a class without specifying them immediately?', o1: 'Virtual functions', o2: 'Abstract functions', o3: 'Function declaration', o4: 'Friend functions' },
  { id: 30, type: 'Question 30', Name: 'In JavaScript, what will be the result of Boolean(0)?', o1: 'true', o2: 'false', o3: 'undefined', o4: 'null' }
];

export default function AptitudeTest() {
  const location = useLocation();
  const navigate = useNavigate();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(TOTAL_TIME);
  const [fullscreenEnabled, setFullscreenEnabled] = useState(false);
  const [visibilityCounter, setVisibilityCounter] = useState(30);
  const [showReturnModal, setShowReturnModal] = useState(false);

  const visibilityTimerRef = useRef(null);  
  const isAwayRef = useRef(false);
  const hasPlayedAlertRef = useRef(false);

  const alertAudio = useRef(
    new window.Audio(
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQoAAAAA"
    )
  );

  // Safely get the current question object
  const currentQuestion = QuestionContainer[questionIndex];

  // Enter fullscreen cross-browser
  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => setFullscreenEnabled(true)).catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
      setFullscreenEnabled(true);
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
      setFullscreenEnabled(true);
    }
  };

  const handleFullscreenChange = () => {
    const isFull =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;
    if (!isFull) {
      setFullscreenEnabled(false);
      handleAwayStart();
    } else {
      setFullscreenEnabled(true);
      handleReturn();
    }
  };

  useEffect(() => {
    enterFullScreen();
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      handleFinishTest();
      return;
    }
    const id = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line
  }, [timer]);

  // Handle user away (tab change, fullscreen exit)
  const handleAwayStart = () => {
    isAwayRef.current = true;
    setShowReturnModal(false);
    hasPlayedAlertRef.current = false;

    if (visibilityTimerRef.current) clearInterval(visibilityTimerRef.current);

    visibilityTimerRef.current = setInterval(() => {
      setVisibilityCounter((prev) => {
        if (prev <= 1) {
          clearInterval(visibilityTimerRef.current);
          handleFinishTest(true);
          return 0;
        }
        if (prev === 11 && !hasPlayedAlertRef.current) {
          alertAudio.current.play().catch(() => {});
          hasPlayedAlertRef.current = true;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleReturn = () => {
    clearInterval(visibilityTimerRef.current);
    if (isAwayRef.current) {
      setShowReturnModal(true);
    }
    setVisibilityCounter(30);
    isAwayRef.current = false;
    hasPlayedAlertRef.current = false;

    alertAudio.current.play().catch(() => {});
  };

  // Detect tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleAwayStart();
      } else {
        handleReturn();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(visibilityTimerRef.current);
    };
  }, []);

  // Handle Continue / Submit modal actions
  const handleContinue = () => {
    setShowReturnModal(false);
    setVisibilityCounter(30);
  };

  const handleSubmitNow = () => {
    setShowReturnModal(false);
    handleFinishTest(true);
  };

  const handleCheckedChange = (value, id) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Next question button click
  const handleNextClick = () => {
    if (!fullscreenEnabled) {
      alert("⚠ Please stay in fullscreen mode to proceed.");
      return;
    }
    const currentAnswer = selectedAnswers[currentQuestion.id];
    if (!currentAnswer) {
      alert("⚠ Please select an answer before proceeding.");
      return;
    }
    if (questionIndex < QuestionContainer.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      handleFinishTest();
    }
  };

  // Navigator button click (jump to any question)
  const handleNavigatorButtonClick = (id) => {
    if (!fullscreenEnabled) {
      alert("⚠ Please stay in fullscreen mode to navigate questions.");
      return;
    }
    const index = QuestionContainer.findIndex((q) => q.id === id);
    if (index !== -1) {
      setQuestionIndex(index);
    }
  };

  // Finish test handler
  const handleFinishTest = useCallback(
    (autoSubmit) => {
      if (autoSubmit) {
        alert("⏰ You left the test window for too long. Test submitted automatically.");
      } else {
        alert("✅ Test Finished!");
      }
      navigate("/");
    },
    [navigate]
  );

  // Format seconds to mm:ss
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ---- THE GUARD: Only render test if we have a valid currentQuestion ----
  if (!currentQuestion) {
    return (
      <div style={{ textAlign: "center", margin: "4rem", fontSize: 22, color: "#e53935" }}>
        All questions completed or invalid question index.
        <br />
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="aptitude-test-container" style={{ padding: 20 }}>
      <header className="test-header">
        <p className="test-title" style={{ fontSize: 24, fontWeight: "bold" }}>Jobzz</p>
      </header>

      <div
        className="test-info-bar"
        style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}
      >
        <div className="info-item">{location.state?.C || "Test"}</div>
        <div className="info-item timer">Time Left: {formatTimer(timer)}</div>
        <div className="info-item">Total: {QuestionContainer.length}</div>
        <button
          className="finish-button"
          onClick={() => handleFinishTest(false)}
          style={{ backgroundColor: "red", color: "white", padding: "8px" }}
        >
          Finish Test
        </button>
      </div>

      {!fullscreenEnabled && (
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <button onClick={enterFullScreen} style={{ padding: 10, fontSize: 16 }}>
            Click to Enter Fullscreen
          </button>
        </div>
      )}

      {showReturnModal && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white", padding: 20, borderRadius: 8, maxWidth: 400, textAlign: "center",
            }}
          >
            <h2>You've returned to the test</h2>
            <p>Do you want to continue the test or submit it now?</p>
            <div style={{ marginTop: 20, display: "flex", justifyContent: "space-around" }}>
              <button onClick={handleContinue} style={{ padding: "10px 20px" }}>
                Continue
              </button>
              <button
                onClick={handleSubmitNow}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="test-content" style={{ display: "flex", gap: 20 }}>
        {/* Question Section */}
        <div className="question-container" style={{ flex: 1, border: "1px solid #ddd", padding: 20 }}>
          <div className="question-card">
            <h3 className="question-type" style={{ marginBottom: 10 }}>
              {currentQuestion.type}
            </h3>
            <p className="question-text" style={{ whiteSpace: "pre-line", marginBottom: 15 }}>
              {currentQuestion.Name}
            </p>
            <div className="options-container">
              {[currentQuestion.o1, currentQuestion.o2, currentQuestion.o3, currentQuestion.o4].map(
                (option, index) => (
                  <label
                    key={index}
                    className="option-label"
                    style={{
                      display: "block",
                      marginBottom: 8,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={selectedAnswers[currentQuestion.id] === option}
                      onChange={(e) => handleCheckedChange(e.target.value, currentQuestion.id)}
                      style={{ marginRight: 8 }}
                    />
                    {option}
                  </label>
                )
              )}
            </div>
            <button
              className={`next-button ${questionIndex === QuestionContainer.length - 1 ? "submit-button" : ""}`}
              onClick={handleNextClick}
              disabled={!fullscreenEnabled}
              style={{
                marginTop: 15,
                padding: "10px 20px",
                backgroundColor: questionIndex === QuestionContainer.length - 1 ? "#4caf50" : "#2196f3",
                color: "white",
                border: "none",
                cursor: fullscreenEnabled ? "pointer" : "not-allowed",
              }}
              title={!fullscreenEnabled ? "Please enter fullscreen to proceed" : ""}
            >
              {questionIndex === QuestionContainer.length - 1 ? "Submit Test" : "Next Question"}
            </button>
          </div>
        </div>

        {/* Navigator Section */}
        <div
          className="navigator-container"
          style={{
            width: 150,
            border: "1px solid #ddd",
            padding: 10,
            borderRadius: 5,
            height: "fit-content",
          }}
        >
          <h3 className="navigator-title" style={{ marginBottom: 10, textAlign: "center" }}>
            Question Navigator
          </h3>
          <div
            className="question-grid"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
              justifyContent: "center",
            }}
          >
            {QuestionContainer.map((q, idx) => {
              const isActive = questionIndex === idx;
              const isAnswered = !!selectedAnswers[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => handleNavigatorButtonClick(q.id)}
                  disabled={!fullscreenEnabled}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: "50%",
                    border: "none",
                    cursor: fullscreenEnabled ? "pointer" : "not-allowed",
                    backgroundColor: isActive
                      ? "#4caf50"
                      : isAnswered
                      ? "#2196f3"
                      : "#e0e0e0",
                    color: isActive || isAnswered ? "white" : "black",
                    fontWeight: "bold",
                  }}
                  title={
                    !fullscreenEnabled
                      ? "Enter fullscreen to navigate"
                      : `Question ${idx + 1}`
                  }
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
