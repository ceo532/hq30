import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Award,
  Sparkles,
  User,
  Check,
  ChevronRight,
  Send,
  HelpCircle,
} from 'lucide-react';

interface QuestionItem {
  cau: number;
  hoi: string;
  A: string;
  B: string;
  C: string;
  D: string;
  dapAn: 'A' | 'B' | 'C' | 'D';
}

const QUESTIONS: QuestionItem[] = [
  {
    cau: 1,
    hoi: "Choose the word with a different sound:",
    A: "color",
    B: "home",
    C: "post",
    D: "sofa",
    dapAn: "A",
  },
  {
    cau: 2,
    hoi: "Choose the word with a different sound:",
    A: "books",
    B: "maps",
    C: "cats",
    D: "dogs",
    dapAn: "D",
  },
  {
    cau: 3,
    hoi: "We study about plants and animals in ______.",
    A: "Maths",
    B: "Science",
    C: "History",
    D: "Music",
    dapAn: "B",
  },
  {
    cau: 4,
    hoi: "My new school ______ a large playground.",
    A: "have",
    B: "has",
    C: "having",
    D: "is having",
    dapAn: "B",
  },
  {
    cau: 5,
    hoi: "Look! The girls ______ in the schoolyard.",
    A: "skip",
    B: "skips",
    C: "are skipping",
    D: "is skipping",
    dapAn: "C",
  },
  {
    cau: 6,
    hoi: "\"______ are you from?\" - \"I am from Vietnam.\"",
    A: "What",
    B: "Where",
    C: "Who",
    D: "How",
    dapAn: "B",
  },
  {
    cau: 7,
    hoi: "My sister is very ______. She always does her homework and helps my mother.",
    A: "lazy",
    B: "hard-working",
    C: "shy",
    D: "funny",
    dapAn: "B",
  },
  {
    cau: 8,
    hoi: "There ______ a bed, a desk and a chair in my bedroom.",
    A: "is",
    B: "are",
    C: "have",
    D: "has",
    dapAn: "A",
  },
  {
    cau: 9,
    hoi: "My dog likes sleeping ______ the sofa.",
    A: "in",
    B: "on",
    C: "at",
    D: "between",
    dapAn: "B",
  },
  {
    cau: 10,
    hoi: "I often ______ judo on weekends.",
    A: "play",
    B: "study",
    C: "have",
    D: "do",
    dapAn: "D",
  },
  {
    cau: 11,
    hoi: "She has a ______ face and big black eyes.",
    A: "short",
    B: "long",
    C: "round",
    D: "tall",
    dapAn: "C",
  },
  {
    cau: 12,
    hoi: "\"Nice to meet you, Hoa.\" - \"______\"",
    A: "I'm fine, thanks.",
    B: "Nice to meet you, too.",
    C: "Goodbye.",
    D: "Good morning.",
    dapAn: "B",
  },
  {
    cau: 13,
    hoi: "Is there ______ milk in the bottle?",
    A: "some",
    B: "a",
    C: "any",
    D: "many",
    dapAn: "C",
  },
  {
    cau: 14,
    hoi: "We often wear our ______ when we go to school.",
    A: "uniforms",
    B: "books",
    C: "bicycles",
    D: "bags",
    dapAn: "A",
  },
  {
    cau: 15,
    hoi: "\"______ do you often go to school?\" - \"By bike.\"",
    A: "How",
    B: "What",
    C: "Where",
    D: "When",
    dapAn: "A",
  },
  {
    cau: 16,
    hoi: "The cat is hiding ______ the door.",
    A: "in front",
    B: "behind",
    C: "between",
    D: "next",
    dapAn: "B",
  },
  {
    cau: 17,
    hoi: "Read and choose the best word: Hello, I am Peter. I study at a boarding school (17) ______ Sydney.",
    A: "on",
    B: "at",
    C: "in",
    D: "about",
    dapAn: "C",
  },
  {
    cau: 18,
    hoi: "Read and choose the best word: I usually (18) ______ up at 6 a.m.",
    A: "gets",
    B: "getting",
    C: "get",
    D: "to get",
    dapAn: "C",
  },
  {
    cau: 19,
    hoi: "Read and choose the best word: My school is big and (19) ______.",
    A: "beauty",
    B: "beautiful",
    C: "beautifully",
    D: "beautify",
    dapAn: "B",
  },
  {
    cau: 20,
    hoi: "Read and choose the best word: I love my school because my teachers are very (20) ______ and helpful.",
    A: "kind",
    B: "shy",
    C: "bad",
    D: "lazy",
    dapAn: "A",
  },
];

const STUDENT_NAMES = ["Hoàng Quân"];
const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbw00EtPyhylfx8ZUg3o7CFvc5g44RK17byvTJqy8kMY6grcfIVpTAT7Enu9NenGnBFR/exec";

type Screen = 'welcome' | 'quiz' | 'result';
type AnswerRecord = Record<number, 'A' | 'B' | 'C' | 'D'>;

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswerRecord>({});
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'wrong'>('all');
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const hasSentWebhook = useRef<boolean>(false);

  // Calculate score
  const correctCount = QUESTIONS.reduce((acc, q) => {
    return answers[q.cau] === q.dapAn ? acc + 1 : acc;
  }, 0);

  // Send webhook when reaching result screen
  useEffect(() => {
    if (screen === 'result' && !hasSentWebhook.current) {
      hasSentWebhook.current = true;
      const payload = {
        ten: selectedStudent,
        lop: "6",
        diem: correctCount,
        tongCau: QUESTIONS.length,
        url: window.location.href,
      };

      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.error('Lỗi khi gửi kết quả về Google Sheet:', err);
      });
    }
  }, [screen, selectedStudent, correctCount]);

  const handleStartQuiz = () => {
    if (!selectedStudent) return;
    setScreen('quiz');
    setCurrentIndex(0);
    setAnswers({});
    hasSentWebhook.current = false;
  };

  const handleSelectOption = (optionKey: 'A' | 'B' | 'C' | 'D') => {
    const currentQ = QUESTIONS[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.cau]: optionKey,
    }));
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowSubmitModal(false);
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setScreen('welcome');
    setSelectedStudent('');
    setCurrentIndex(0);
    setAnswers({});
    setShowSubmitModal(false);
    hasSentWebhook.current = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const answeredCount = Object.keys(answers).length;
  const currentQuestion = QUESTIONS[currentIndex];
  const selectedAnswer = currentQuestion ? answers[currentQuestion.cau] : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50/30 flex flex-col justify-between text-slate-800">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-sky-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Tiếng Anh Lớp 6
              </h1>
              <p className="text-xs text-sky-600 font-medium">
                Ôn Tập Kiến Thức Trắc Nghiệm
              </p>
            </div>
          </div>

          {screen === 'quiz' && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
                <User className="w-3.5 h-3.5 text-sky-600" />
                <span>{selectedStudent}</span>
              </span>
            </div>
          )}

          {screen === 'result' && (
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col">
        {/* ================= 1. MÀN HÌNH CHỌN TÊN ================= */}
        {screen === 'welcome' && (
          <div className="flex-1 flex items-center justify-center py-6 sm:py-12">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-100/60 border border-sky-100 transition-all">
              {/* Header Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white mx-auto mb-5 shadow-md shadow-sky-200">
                <BookOpen className="w-8 h-8" />
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Bài Tập Trắc Nghiệm
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Chào mừng em đến với bài kiểm tra 20 câu trắc nghiệm Tiếng Anh lớp 6. Hãy chọn tên của mình để bắt đầu nhé!
                </p>
              </div>

              {/* Form Input */}
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="student-select"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Chọn tên của em
                  </label>
                  <div className="relative">
                    <select
                      id="student-select"
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="w-full h-12 px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-slate-50/50 text-slate-800 text-base font-medium focus:border-sky-500 focus:bg-white focus:outline-none transition-all cursor-pointer shadow-xs"
                    >
                      <option value="">-- Chọn tên của em --</option>
                      {STUDENT_NAMES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!selectedStudent && (
                    <p className="text-xs text-amber-600 mt-2 flex items-center gap-1 font-medium">
                      <span>* Vui lòng chọn tên để mở nút bắt đầu</span>
                    </p>
                  )}
                </div>

                {/* Features Highlights */}
                <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 space-y-2 text-xs text-sky-900">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Bộ 20 câu hỏi trắc nghiệm A/B/C/D</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Tự động chấm điểm và xem lại chi tiết từng câu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Tự động lưu điểm vào hệ thống lớp học</span>
                  </div>
                </div>

                {/* Submit / Start Button */}
                <button
                  onClick={handleStartQuiz}
                  disabled={!selectedStudent}
                  className={`w-full h-13 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                    selectedStudent
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-sky-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer active:translate-y-0'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <span>Bắt đầu làm bài</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. MÀN HÌNH LÀM BÀI ================= */}
        {screen === 'quiz' && (
          <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
            {/* Progress Header */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-sky-100 mb-4">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600 mb-2">
                <span className="text-sky-700 font-bold">
                  Câu {currentIndex + 1} / {QUESTIONS.length}
                </span>
                <span className="text-slate-500">
                  Đã làm: {answeredCount}/{QUESTIONS.length} câu
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-400 to-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Navigation Bubbles */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {QUESTIONS.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = answers[q.cau] !== undefined;
                  return (
                    <button
                      key={q.cau}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Đi tới câu ${q.cau}`}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-sky-600 text-white ring-2 ring-sky-300 font-bold scale-105'
                          : isAnswered
                          ? 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {q.cau}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-lg shadow-sky-100/50 border border-sky-100 mb-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Câu hỏi số {currentQuestion.cau}
                  </span>
                  {selectedAnswer ? (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                      Đã chọn: {selectedAnswer}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 italic">
                      Chưa chọn đáp án
                    </span>
                  )}
                </div>

                {/* EXACT QUESTION TEXT: DO NOT TRANSLATE OR ALTER */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-6">
                  {currentQuestion.hoi}
                </h3>

                {/* Answer Options */}
                <div className="space-y-3">
                  {(['A', 'B', 'C', 'D'] as const).map((key) => {
                    const isSelected = selectedAnswer === key;
                    const optionContent = currentQuestion[key];

                    return (
                      <button
                        key={key}
                        onClick={() => handleSelectOption(key)}
                        className={`w-full min-h-[58px] p-4 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all text-sm sm:text-base font-medium cursor-pointer ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50/80 text-sky-950 shadow-sm ring-2 ring-sky-200'
                            : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50/60 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {key}
                        </span>
                        <span className="flex-1 leading-normal font-medium">
                          {optionContent}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1.5 transition-all ${
                    currentIndex === 0
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Câu trước</span>
                </button>

                {currentIndex === QUESTIONS.length - 1 ? (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md shadow-emerald-200 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Nộp bài</span>
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md shadow-sky-200 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Câu tiếp theo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Helper Tip */}
            <div className="text-center text-xs text-slate-500 mb-4">
              Em có thể bấm vào các ô số ở trên để chuyển nhanh qua lại giữa các câu hỏi nhé.
            </div>
          </div>
        )}

        {/* ================= 3. MÀN HÌNH KẾT QUẢ ================= */}
        {screen === 'result' && (
          <div className="flex-1 max-w-2xl mx-auto w-full py-4 space-y-6">
            {/* Score Showcase Hero */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-100/60 border border-sky-100 text-center relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-100/50 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />

              <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-amber-200">
                <Award className="w-10 h-10" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
                Kết Quả Bài Làm
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
                Chúc mừng em {selectedStudent}!
              </h2>

              {/* Exact required text: "Em đúng X/20 câu" */}
              <div className="my-4 py-3 px-6 rounded-2xl bg-sky-50 border border-sky-200 inline-block">
                <p className="text-xl sm:text-2xl font-black text-sky-700">
                  Em đúng {correctCount}/20 câu
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Điểm số: {(correctCount * 0.5).toFixed(1)} / 10 điểm (
                  {Math.round((correctCount / QUESTIONS.length) * 100)}%)
                </p>
              </div>

              <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                {correctCount >= 18
                  ? 'Xuất sắc! Em nắm rất vững kiến thức Tiếng Anh lớp 6. Tiếp tục phát huy nhé!'
                  : correctCount >= 14
                  ? 'Rất tốt! Em làm bài rất cừ, chỉ cần chú ý thêm một vài câu nữa là đạt điểm tối đa rồi!'
                  : correctCount >= 10
                  ? 'Khá lắm! Em hãy xem lại các câu chưa đúng bên dưới để củng cố thêm kiến thức nhé!'
                  : 'Cố lên nhé! Em hãy xem lại đáp án chi tiết bên dưới và thử làm lại để đạt điểm cao hơn nhé!'}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-sky-200 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm lại từ đầu</span>
                </button>
              </div>
            </div>

            {/* Answer Review Section */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-md border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Chi Tiết Bài Làm Của Em
                  </h3>
                  <p className="text-xs text-slate-500">
                    Xem lại từng câu hỏi, đáp án em đã chọn và đáp án chính xác
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterType === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tất cả (20)
                  </button>
                  <button
                    onClick={() => setFilterType('correct')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterType === 'correct'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    Đúng ({correctCount})
                  </button>
                  <button
                    onClick={() => setFilterType('wrong')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterType === 'wrong'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    Sai ({QUESTIONS.length - correctCount})
                  </button>
                </div>
              </div>

              {/* Question list review */}
              <div className="space-y-4">
                {QUESTIONS.filter((q) => {
                  const isCorrect = answers[q.cau] === q.dapAn;
                  if (filterType === 'correct') return isCorrect;
                  if (filterType === 'wrong') return !isCorrect;
                  return true;
                }).map((q) => {
                  const studentAnswerKey = answers[q.cau];
                  const isCorrect = studentAnswerKey === q.dapAn;
                  const correctAnswerText = q[q.dapAn];
                  const studentAnswerText = studentAnswerKey ? q[studentAnswerKey] : 'Chưa chọn';

                  return (
                    <div
                      key={q.cau}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-rose-200 bg-rose-50/30'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 text-white'
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">
                            Câu {q.cau}:
                          </span>
                          <span className="font-semibold text-slate-900 text-sm sm:text-base">
                            {q.hoi}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm pl-10">
                        {/* Student choice */}
                        <div
                          className={`p-2.5 rounded-xl border ${
                            isCorrect
                              ? 'bg-emerald-100/60 border-emerald-200 text-emerald-900'
                              : 'bg-rose-100/60 border-rose-200 text-rose-900'
                          }`}
                        >
                          <span className="font-bold">Đáp án của em: </span>
                          <span>
                            {studentAnswerKey ? `${studentAnswerKey}. ${studentAnswerText}` : '(Chưa làm)'}
                          </span>
                          <span className="ml-1.5 font-bold">
                            {isCorrect ? '✓ Đúng' : '✗ Sai'}
                          </span>
                        </div>

                        {/* Correct answer */}
                        <div className="p-2.5 rounded-xl border bg-emerald-50 border-emerald-300 text-emerald-900">
                          <span className="font-bold">Đáp án đúng: </span>
                          <span className="font-semibold">
                            {q.dapAn}. {correctAnswerText}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom restart button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleRestart}
                  className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm lại từ đầu</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal when submitting */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Xác Nhận Nộp Bài?
            </h4>
            <p className="text-sm text-slate-600 mb-4">
              {answeredCount < QUESTIONS.length ? (
                <>
                  Em còn{' '}
                  <span className="font-bold text-amber-600">
                    {QUESTIONS.length - answeredCount} câu
                  </span>{' '}
                  chưa làm. Em có chắc chắn muốn nộp bài bây giờ không?
                </>
              ) : (
                'Em đã hoàn thành tất cả 20 câu! Em có chắc chắn muốn nộp bài để xem điểm không?'
              )}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Kiểm tra lại
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                Nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-sky-100 bg-white/70 py-4 text-center text-xs text-slate-500">
        <p>© 2026 Bài Tập Trắc Nghiệm Tiếng Anh Lớp 6 · Dành cho học sinh</p>
      </footer>
    </div>
  );
}
