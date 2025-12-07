"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Radio, AlertTriangle, CheckCircle, UserX, UserCheck, RefreshCw, Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type ActivityLog = { time: string; student: string; message: string; type: "status" | "violation" | "submit" | "info"; };
type StudentStatus = { id?: number; name: string; status: "online" | "warning" | "banned" | "finished" | "offline"; lastMessage: string; };

export default function MonitorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const examId = resolvedParams.id;
  const router = useRouter();
  
  const [exam, setExam] = useState<any>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [students, setStudents] = useState<Record<string, StudentStatus>>({});
  const [studentMap, setStudentMap] = useState<Record<string, number>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStudentData = useCallback(async (token: string) => {
    try {
      const attRes = await axios.get(`http://127.0.0.1:8000/exams/${examId}/attendance`, { headers: { Authorization: `Bearer ${token}` } });
      const map: Record<string, number> = {};
      attRes.data.students.forEach((s: any) => { map[s.username] = s.student_id; });
      setStudentMap(map);
    } catch (e) { console.error(e); }
  }, [examId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    const init = async () => {
      try {
        const uRes = await axios.get("http://127.0.0.1:8000/users/me", { headers: { Authorization: `Bearer ${token}` } });
        setCurrentUser(uRes.data);
        const eRes = await axios.get("http://127.0.0.1:8000/exams/", { headers: { Authorization: `Bearer ${token}` } });
        setExam(eRes.data.find((e: any) => e.id.toString() === examId));
        await fetchStudentData(token);
      } catch (e) { console.error(e); }
    };
    init();
  }, [examId, router, fetchStudentData]);

  useEffect(() => {
    if (!currentUser) return;
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${examId}/ADMIN_GURU`);
    ws.onopen = () => { addLog("System", "Koneksi berhasil.", "info"); };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { student, type, status, message } = data;
      if (student === "ADMIN_GURU") return;
      if (status === 'online') {
         const token = localStorage.getItem("token");
         if(token) fetchStudentData(token);
      }
      setStudents((prev) => ({ 
        ...prev, 
        [student]: { name: student, status: status, lastMessage: message, id: studentMap[student] } 
      }));
      if (type === "violation" || type === "submit" || type === "status") addLog(student, message, type);
    };
    return () => ws.close();
  }, [currentUser, examId, studentMap, fetchStudentData]);

  const addLog = (student: string, message: string, type: any) => {
    setLogs((prev) => [{ time: new Date().toLocaleTimeString(), student, message, type }, ...prev]);
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    const token = localStorage.getItem("token");
    if(token) await fetchStudentData(token);
    setRefreshing(false);
  };

  const handleReset = async (username: string) => {
    const studentId = studentMap[username] || students[username]?.id;
    if (!studentId) return alert(`Gagal: ID untuk ${username} belum ditemukan. Refresh dulu.`);
    if (!confirm(`RESET ujian untuk ${username}?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://127.0.0.1:8000/exams/${examId}/reset/${studentId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert(`Berhasil mereset ${username}.`);
      addLog(username, "Ujian di-reset oleh Guru", "info");
    } catch (e) { alert("Gagal reset"); }
  };

  const handleAddTime = async (username: string) => {
    const studentId = studentMap[username] || students[username]?.id;
    if (!studentId) return alert("ID belum ketemu. Refresh.");
    if (!confirm(`Tambah waktu 10m buat ${username}?`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://127.0.0.1:8000/exams/${examId}/add-time/${studentId}?minutes=10`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert(`Waktu ${username} ditambah.`);
      addLog(username, "Waktu ditambah 10 menit", "info");
    } catch (e) { alert("Gagal tambah waktu"); }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => router.push("/dashboard")}><ArrowLeft className="mr-2 h-4 w-4" /> Exit</Button>
          <div><h1 className="text-2xl font-bold flex items-center gap-2 text-red-500 animate-pulse"><Radio className="h-6 w-6" /> LIVE MONITOR</h1><p className="text-sm text-gray-400">Ujian: <span className="text-white font-bold">{exam?.title}</span></p></div>
        </div>
        <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={handleManualRefresh} disabled={refreshing} className="text-xs bg-gray-800 border-gray-600 hover:bg-gray-700 text-white"><RotateCcw className={`mr-2 h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} /> Refresh Data</Button>
            <div className="bg-gray-800 px-4 py-2 rounded-full border border-gray-700 text-sm"><span className="text-green-400 font-bold">{Object.keys(students).length}</span> Siswa</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">
        <div className="lg:col-span-2 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.values(students).map((s) => {
               const validId = s.id || studentMap[s.name];
               return (
                <Card key={s.name} className={`border-l-4 shadow-lg bg-gray-800 border-gray-700 text-gray-200 ${s.status==='warning'?'border-l-yellow-500 animate-pulse':''} ${s.status==='banned'?'border-l-red-600 bg-red-900/20':''} ${s.status==='finished'?'border-l-green-500 opacity-60':''} ${s.status==='online'?'border-l-blue-500':''}`}>
                    <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg truncate" title={s.name}>{s.name}</h3>
                        {s.status==='warning'&&<AlertTriangle className="h-5 w-5 text-yellow-500"/>}
                        {s.status==='banned'&&<UserX className="h-5 w-5 text-red-500"/>}
                        {s.status==='finished'&&<CheckCircle className="h-5 w-5 text-green-500"/>}
                        {s.status==='online'&&<UserCheck className="h-5 w-5 text-blue-500"/>}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{s.lastMessage}</p>
                    <div className={`mt-2 text-xs font-bold px-2 py-1 rounded w-fit uppercase ${s.status==='warning'?'bg-yellow-900 text-yellow-200':''} ${s.status==='banned'?'bg-red-900 text-red-200':''} ${s.status==='finished'?'bg-green-900 text-green-200':''} ${s.status==='online'?'bg-blue-900 text-blue-200':'bg-gray-700'}`}>{s.status}</div>
                    </CardContent>
                    <CardFooter className="p-2 bg-gray-900/50 flex justify-between gap-2">
                    <Button size="sm" variant="destructive" className="h-7 text-[10px] flex-1" onClick={() => handleReset(s.name)} disabled={!validId}><RefreshCw className="w-3 h-3 mr-1"/> Reset</Button>
                    <Button size="sm" className="h-7 text-[10px] bg-blue-600 hover:bg-blue-700 flex-1 text-white" onClick={() => handleAddTime(s.name)} disabled={!validId}><Clock className="w-3 h-3 mr-1"/> +10m</Button>
                    </CardFooter>
                </Card>
            )})}
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-gray-700 bg-gray-800"><h3 className="font-bold text-gray-200 flex items-center gap-2">Aktivitas Terkini</h3></div>
          <ScrollArea className="flex-1 p-4"><div className="space-y-3">{logs.map((log,idx)=>(<div key={idx} className="flex gap-3 text-sm border-b border-gray-700 pb-2 last:border-0"><span className="text-gray-500 font-mono text-xs">{log.time}</span><div><span className={`font-bold mr-2 ${log.type==='violation'?'text-red-400':log.type==='submit'?'text-green-400':'text-blue-400'}`}>{log.student}</span><span className="text-gray-300">{log.message}</span></div></div>))}</div></ScrollArea>
        </div>
      </div>
    </div>
  );
}