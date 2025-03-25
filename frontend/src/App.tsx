import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { CourseForm } from "./components/CourseForm";
import { DateRangeSelector } from "./components/DateRangeSelector";
import { WeekdaySelector } from "./components/WeekdaySelector";
import { FilterDates } from "./components/FilterDates";
import { Summary } from "./components/Summary";
import { AuthModal } from "./components/AuthModal";
import SyllabusForm from "./components/SyllabusForm"; // Import SyllabusForm
import { Course, Step, StepProgress, User } from "./types";
import { saveToLocalStorage, getFromLocalStorage, clearLocalStorage } from "./utils/storage";
import { validateStep } from "./utils/validation";
import { Calendar } from "lucide-react";

const initialCourse: Course = {
  id: crypto.randomUUID(),
  name: "",
  code: "",
  startDate: "",
  endDate: "",
  selectedDays: [],
  excludedDates: [],
  excludeHolidays: false,
  notes: "",
};

const initialStepProgress: StepProgress = {
  home: true,
  dateRange: false,
  weekdays: false,
  filter: false,
  summary: false,
  syllabusUpload: false, // Ensure syllabusUpload is part of progress
};

const steps: Step[] = [
  "home",
  "dateRange",
  "weekdays",
  "filter",
  "summary",
  "syllabusUpload",
];

function App() {
  const [currentStep, setCurrentStep] = useState<Step>("home");
  const [stepProgress, setStepProgress] = useState<StepProgress>(initialStepProgress);
  const [course, setCourse] = useState<Course>(initialCourse);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [isDateRangeValid, setIsDateRangeValid] = useState(true);

  useEffect(() => {
    // Clear local storage when the component mounts
    clearLocalStorage();
    // Reset state variables
    setStepProgress(initialStepProgress);
    setCourse(initialCourse);
    setUser(null);
  }, []);

  useEffect(() => {
    saveToLocalStorage("currentCourse", course);
    saveToLocalStorage("stepProgress", stepProgress);
  }, [course, stepProgress]);

  useEffect(() => {
    if (user) {
      saveToLocalStorage("user", user);
    }
  }, [user]);

  const goToNextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1 && validateStep(currentStep, course)) {
      if (currentStep === 'dateRange' && !isDateRangeValid) {
        return;
      }
      const nextStep = steps[currentIndex + 1] as Step;
      setStepProgress({ ...stepProgress, [nextStep]: true });
      setCurrentStep(nextStep);
    }
  };

  const handleStepChange = (step: Step) => {
    if (step === "syllabusUpload" || stepProgress[step]) {
      setCurrentStep(step);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setShowAuthModal(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'home':
        return <CourseForm course={course} onUpdate={setCourse} />;
      case 'dateRange':
        return stepProgress.dateRange ? (
          <DateRangeSelector 
            course={course} 
            onUpdate={setCourse} 
            onValidate={setIsDateRangeValid} 
          />
        ) : null;
      case 'weekdays':
        return stepProgress.weekdays ? <WeekdaySelector course={course} onUpdate={setCourse} /> : null;
      case 'filter':
        return stepProgress.filter ? <FilterDates course={course} onUpdate={setCourse} /> : null;
      case 'summary':
        return stepProgress.summary ? (
          <Summary 
            course={course} 
            user={user} 
            onLogin={handleLogin}
          />
        ) : null;
      case "syllabusUpload":
        return <SyllabusForm />; // Use SyllabusForm instead of SyllabusUpload
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100">
      <Navbar
        currentStep={currentStep}
        onNavigate={handleStepChange}
        stepProgress={stepProgress}
        user={user}
        onLogout={handleLogout}
      />

      {currentStep === "home" && (
        <div className="max-w-4xl mx-auto pt-8 px-4">
          <div className="text-center mb-8">
            <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Course Planner
            </h1>
            <p className="text-gray-600">
              Design your perfect teaching schedule with our intuitive course
              planning tool
            </p>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {renderStep()}
        {currentStep !== "summary" && currentStep !== "syllabusUpload"&& (
          <div className="mt-6 flex justify-end">
            <button
              onClick={goToNextStep}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;