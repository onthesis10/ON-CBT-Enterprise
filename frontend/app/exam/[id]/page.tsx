"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, Clock, CheckCircle, AlertTriangle, ShieldAlert, Timer, WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const examId = resolvedParams.id;

  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [user, setUser] = useState<any>(null); 
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // STATE KEAMANAN
  const [warnings, setWarnings] = useState(0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isOnline, setIsOnline] = useState(true); // Status koneksi CCTV
  
  const answersRef = useRef<Record<number, string>>({}); 
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { answersRef.current = answers; }, [answers]);

  // 1. LOAD DATA
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    const fetchExamData = async () => {
      try {
        const uRes = await axios.get("http://127.0.0.1:8000/users/me", { headers: { Authorization: `Bearer ${token}` } });
        setUser(uRes.data);

        const response = await axios.get("http://127.0.0.1:8000/exams/", { headers: { Authorization: `Bearer ${token}` } });
        const foundExam = response.data.find((e: any) => e.id.toString() === examId);
        if (foundExam) {
          setExam(foundExam);
          const parsedQuestions = foundExam.questions.map((q: any) => ({
            ...q,
            optionsObj: q.options ? JSON.parse(q.options) : {},
          }));
          setQuestions(parsedQuestions);
        } else {
          alert("Ujian tidak ditemukan!"); router.push("/dashboard");
        }
      } catch (error) { console.error("Error:", error); } finally { setLoading(false); }
    };
    fetchExamData();
  }, [examId, router]);

  // 2. KONEKSI WEBSOCKET (DENGAN AUTO-RECONNECT) 📡
  useEffect(() => {
    if (!isExamStarted || !user) return;

    const connectWebSocket = () => {
      if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) return;

      console.log("Menghubungkan ke CCTV...");
      const socket = new WebSocket(`ws://127.0.0.1:8000/ws/${examId}/${encodeURIComponent(user.username)}`);

      socket.onopen = () => {
        console.log("Terhubung ke Pengawas");
        setIsOnline(true);
        if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === "command") {
          // RESET
          if (data.action === "reset_exam") {
            alert("⚠️ UJIAN DI-RESET OLEH GURU! ⚠️\nHalaman akan dimuat ulang.");
            localStorage.removeItem(`exam_end_${examId}`);
            window.location.reload();
          }
          // ADD TIME
          if (data.action === "add_time") {
            const minutes = data.minutes;
            alert(`📢 Guru menambahkan waktu ${minutes} menit!`);
            const addedMs = minutes * 60 * 1000;
            const currentEnd = localStorage.getItem(`exam_end_${examId}`);
            if (currentEnd) {
              const newEnd = parseInt(currentEnd) + addedMs;
              localStorage.setItem(`exam_end_${examId}`, newEnd.toString());
              setTimeLeft((prev) => prev + (minutes * 60));
            }
          }
        }
      };

      socket.onclose = () => {
        console.log("Koneksi terputus. Mencoba reconnect...");
        setIsOnline(false);
        ws.current = null;
        reconnectTimeout.current = setTimeout(connectWebSocket, 3000);
      };

      ws.current = socket;
    };

    connectWebSocket();

    return () => {
      if (ws.current) ws.current.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [isExamStarted, user, examId]);

  const sendSignal = (type: string, status: string, message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, status, message }));
    }
  };

  // 3. LOGIKA TIMER
  useEffect(() => {
    if (!isExamStarted || timeLeft <= 0) return;
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) { 
            clearInterval(timerInterval); 
            handleSubmit(true, "WAKTU HABIS!"); 
            return 0; 
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [isExamStarted, timeLeft]);

  // 4. MULAI UJIAN
  const startExamMode = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen().catch(err => console.log(err));
    
    const savedEndTime = localStorage.getItem(`exam_end_${examId}`);
    const now = Date.now();

    if (savedEndTime && parseInt(savedEndTime) > now) {
      setTimeLeft(Math.floor((parseInt(savedEndTime) - now) / 1000));
    } else {
      const endTime = now + (exam.duration_minutes * 60 * 1000);
      localStorage.setItem(`exam_end_${examId}`, endTime.toString());
      setTimeLeft(exam.duration_minutes * 60);
    }
    setIsExamStarted(true);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSubmit = async (autoSubmit = false, reason = "") => {
    if (!autoSubmit && !confirm("Yakin ingin mengumpulkan jawaban?")) return;
    setSubmitting(true);
    const token = localStorage.getItem("token");
    const answersToSubmit = autoSubmit ? answersRef.current : answers;

    try {
      const payload = { answers: answersToSubmit };
      const res = await axios.post(`http://127.0.0.1:8000/exams/${examId}/submit`, payload, { headers: { Authorization: `Bearer ${token}` } });
      
      localStorage.removeItem(`exam_end_${examId}`);
      sendSignal("submit", "finished", "Siswa telah menyelesaikan ujian.");
      
      if (autoSubmit) alert(`${reason} Nilai Kamu: ${res.data.score}`);
      else alert(`Ujian Selesai! Nilai Kamu: ${res.data.score}`);
      
      if (document.fullscreenElement) document.exitFullscreen().catch(err => console.log(err));
      router.push("/dashboard");
    } catch (error) { alert("Gagal submit."); } finally { setSubmitting(false); }
  };

  useEffect(() => {
    if (!isExamStarted) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarnings((prev) => {
          const newCount = prev + 1;
          sendSignal("violation", "warning", `Pindah Tab (${newCount}/3)`);
          if (newCount >= 3) {
             sendSignal("violation", "banned", "Siswa didiskualifikasi");
             handleSubmit(true, "PELANGGARAN: PINDAH TAB 3X!"); 
          }
          else alert(`⚠️ JANGAN PINDAH TAB! (${newCount}/3)`);
          return newCount;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isExamStarted]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Memuat Soal...</div>;

  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-xl border-t-4 border-red-600">
          <CardHeader className="text-center">
            <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Mode Ujian Aman</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
              <p className="font-bold mb-2">Peraturan Ujian:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Waktu berjalan mundur otomatis.</li>
                <li>Dilarang pindah tab (Maks 3x).</li>
              </ul>
            </div>
            <p className="text-center text-gray-600">Ujian: <b>{exam?.title}</b></p>
            <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 font-bold" onClick={startExamMode}>Mulai Mengerjakan</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {!isOnline && (
          <Alert variant="destructive" className="bg-red-600 text-white border-none animate-pulse">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>KONEKSI TERPUTUS!</AlertTitle>
            <AlertDescription>Sedang mencoba menghubungkan ulang ke server...</AlertDescription>
          </Alert>
        )}
        {warnings > 0 && (
          <Alert variant="destructive" className="animate-pulse border-2 border-red-600 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>PERINGATAN PELANGGARAN</AlertTitle>
            <AlertDescription>Anda telah melakukan {warnings}/3 pelanggaran.</AlertDescription>
          </Alert>
        )}
        <div className={`p-4 rounded-lg shadow-md border-l-4 sticky top-4 z-50 flex justify-between items-center transition-colors ${timeLeft < 300 ? 'bg-red-50 border-red-600' : 'bg-white border-blue-600'}`}>
          <div><h1 className="text-lg font-bold text-gray-800 line-clamp-1">{exam?.title}</h1><p className="text-xs text-gray-500">Dipantau oleh Guru.</p></div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-xl shadow-sm ${timeLeft < 300 ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-100 text-blue-800'}`}>
            <Timer className={`w-6 h-6 ${timeLeft < 300 ? 'animate-bounce' : ''}`} />{formatTime(timeLeft)}
          </div>
        </div>
        {questions.map((q, index) => (
          <Card key={q.id} className="shadow-sm">
            <CardHeader className="bg-gray-50/50 border-b pb-3">
              <CardTitle className="text-lg flex gap-3">
                <span className="bg-gray-800 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm flex-shrink-0">{index + 1}</span>
                <span className="font-normal">{q.content}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {q.question_type === 'multiple_choice' ? (
                <RadioGroup value={answers[q.id] || ""} onValueChange={(val) => handleAnswerChange(q.id, val)} className="space-y-3">
                  {Object.entries(q.optionsObj).map(([key, value]) => (
                    <div key={key} className={`flex items-center space-x-3 border p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer ${answers[q.id] === key ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200'}`}>
                      <RadioGroupItem value={key} id={`q${q.id}-${key}`} />
                      <Label htmlFor={`q${q.id}-${key}`} className="flex-1 cursor-pointer font-medium text-gray-700"><span className="font-bold mr-2 text-gray-900">{key}.</span> {value as string}</Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <Textarea 
                  placeholder="Ketik jawaban esai Anda di sini..." 
                  className="min-h-[150px] text-lg p-4 bg-gray-50 focus:bg-white transition-colors"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
              )}
            </CardContent>
          </Card>
        ))}
        <div className="pt-6 pb-20">
          <Button size="lg" className="w-full shadow-xl bg-green-600 hover:bg-green-700 text-lg py-6" onClick={() => handleSubmit(false)} disabled={submitting}>
            {submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <><CheckCircle className="mr-2 h-5 w-5" /> Kumpulkan Jawaban</>}
          </Button>
        </div>
      </div>
    </div>
  );
}