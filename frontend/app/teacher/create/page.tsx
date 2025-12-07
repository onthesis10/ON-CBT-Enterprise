"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, Plus, BookOpen, Sparkles, Bot, Type, ListChecks, FileSpreadsheet, Upload, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function CreateExamPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [examId, setExamId] = useState<number | null>(null);
  const [previewQuestions, setPreviewQuestions] = useState<any[]>([]);
  
  const [qType, setQType] = useState<'multiple_choice' | 'essay'>('multiple_choice');
  const [examData, setExamData] = useState({ title: "", description: "", duration_minutes: "60" });
  const [question, setQuestion] = useState({ content: "", optionA: "", optionB: "", optionC: "", optionD: "", correct_answer: "", score: "10" });
  const [aiPrompt, setAiPrompt] = useState({ topic: "", count: "5" });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  const fetchQuestions = async (currentExamId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/exams/", { headers: { Authorization: `Bearer ${token}` } });
      const currentExam = res.data.find((e: any) => e.id === currentExamId);
      if (currentExam && currentExam.questions) {
        const parsedQ = currentExam.questions.map((q: any) => ({
          ...q,
          optionsObj: q.options ? JSON.parse(q.options) : {}
        }));
        setPreviewQuestions(parsedQ);
      }
    } catch (error) { console.error(error); }
  };

  const handleCreateExam = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = { title: examData.title, description: examData.description, duration_minutes: parseInt(examData.duration_minutes) };
      const res = await axios.post("http://127.0.0.1:8000/exams/", payload, { headers: { Authorization: `Bearer ${token}` } });
      setExamId(res.data.id); setStep(2);
    } catch (error) { alert("Gagal buat ujian."); } finally { setLoading(false); }
  };

  const handleAddQuestion = async () => {
    if (!question.content) return alert("Isi pertanyaan!");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let optionsJson = null;
      if (qType === 'multiple_choice') {
        optionsJson = JSON.stringify({ A: question.optionA, B: question.optionB, C: question.optionC, D: question.optionD });
      }
      const payload = { content: question.content, question_type: qType, options: optionsJson, correct_answer: question.correct_answer, score: parseInt(question.score) };
      await axios.post(`http://127.0.0.1:8000/exams/${examId}/questions/`, payload, { headers: { Authorization: `Bearer ${token}` } });
      setQuestion({ ...question, content: "", optionA: "", optionB: "", optionC: "", optionD: "", correct_answer: "" });
      if (examId) fetchQuestions(examId);
    } catch (error) { alert("Gagal simpan soal."); } finally { setLoading(false); }
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.topic) return alert("Topik?");
    setAiLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = { topic: aiPrompt.topic, count: parseInt(aiPrompt.count) };
      const res = await axios.post(`http://127.0.0.1:8000/exams/${examId}/generate-ai`, payload, { headers: { Authorization: `Bearer ${token}` } });
      alert(`AI membuat ${res.data.data.length} soal.`);
      if (examId) fetchQuestions(examId);
    } catch (error) { alert("AI Error."); } finally { setAiLoading(false); }
  };

  // [BARU] DOWNLOAD TEMPLATE
  const handleDownloadTemplate = () => {
    window.open("http://127.0.0.1:8000/downloads/template", "_blank");
  };

  // [REVISI] IMPORT EXCEL
  const handleImportExcel = async () => {
    if (!file) return alert("Pilih file dulu!");
    setImportLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`http://127.0.0.1:8000/exams/${examId}/import`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      
      // Tampilkan pesan asli dari backend (biar tau berapa soal yg masuk)
      alert(res.data.message); 
      if (examId) fetchQuestions(examId);
      
    } catch (error) {
      console.error(error);
      alert("Gagal import. Pastikan pakai format Template!");
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-6xl space-y-6">
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-blue-600" /> Mode Guru
          </h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>Kembali</Button>
        </div>

        {step === 1 && (
          <Card className="border-t-4 border-blue-600 shadow-md max-w-2xl mx-auto">
            <CardHeader><CardTitle>Langkah 1: Buat Ujian Baru</CardTitle><CardDescription>Isi detail ujian.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Judul</Label><Input value={examData.title} onChange={(e) => setExamData({...examData, title: e.target.value})} /></div>
              <div><Label>Deskripsi</Label><Textarea value={examData.description} onChange={(e) => setExamData({...examData, description: e.target.value})} /></div>
              <div><Label>Durasi (Menit)</Label><Input type="number" value={examData.duration_minutes} onChange={(e) => setExamData({...examData, duration_minutes: e.target.value})} /></div>
            </CardContent>
            <CardFooter><Button className="w-full bg-blue-600" onClick={handleCreateExam} disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : "Lanjut"}</Button></CardFooter>
          </Card>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="border-t-4 border-purple-600 shadow-md">
                <CardHeader>
                  <CardTitle>Tambah Soal</CardTitle>
                  <CardDescription>Ujian: <b>{examData.title}</b></CardDescription>
                  
                  <Tabs defaultValue="manual" className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="manual">Manual</TabsTrigger>
                      <TabsTrigger value="ai">AI Magic</TabsTrigger>
                      <TabsTrigger value="import">Import Excel</TabsTrigger>
                    </TabsList>

                    {/* TAB MANUAL */}
                    <TabsContent value="manual" className="space-y-4 pt-4">
                      <div className="flex gap-2 mb-4">
                        <Button size="sm" variant={qType==='multiple_choice'?'default':'outline'} onClick={()=>setQType('multiple_choice')}><ListChecks className="w-4 h-4 mr-2"/> PG</Button>
                        <Button size="sm" variant={qType==='essay'?'default':'outline'} onClick={()=>setQType('essay')}><Type className="w-4 h-4 mr-2"/> Esai</Button>
                      </div>
                      <div className="space-y-2"><Label>Pertanyaan</Label><Textarea value={question.content} onChange={(e) => setQuestion({...question, content: e.target.value})} /></div>
                      {qType === 'multiple_choice' && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <Input placeholder="A" value={question.optionA} onChange={(e) => setQuestion({...question, optionA: e.target.value})} />
                            <Input placeholder="B" value={question.optionB} onChange={(e) => setQuestion({...question, optionB: e.target.value})} />
                            <Input placeholder="C" value={question.optionC} onChange={(e) => setQuestion({...question, optionC: e.target.value})} />
                            <Input placeholder="D" value={question.optionD} onChange={(e) => setQuestion({...question, optionD: e.target.value})} />
                          </div>
                          <div className="flex gap-4">
                            <div className="flex-1"><Label>Kunci</Label><Select value={question.correct_answer} onValueChange={(val) => setQuestion({...question, correct_answer: val})}><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger><SelectContent><SelectItem value="A">A</SelectItem><SelectItem value="B">B</SelectItem><SelectItem value="C">C</SelectItem><SelectItem value="D">D</SelectItem></SelectContent></Select></div>
                            <div className="flex-1"><Label>Bobot</Label><Input type="number" value={question.score} onChange={(e) => setQuestion({...question, score: e.target.value})} /></div>
                          </div>
                        </>
                      )}
                      {qType === 'essay' && (
                        <div className="space-y-4">
                          <div className="space-y-2"><Label>Kunci Referensi</Label><Textarea value={question.correct_answer} onChange={(e) => setQuestion({...question, correct_answer: e.target.value})} /></div>
                          <div className="flex-1"><Label>Bobot</Label><Input type="number" value={question.score} onChange={(e) => setQuestion({...question, score: e.target.value})} /></div>
                        </div>
                      )}
                      <Button className="w-full bg-gray-800" onClick={handleAddQuestion} disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : "Simpan"}</Button>
                    </TabsContent>

                    {/* TAB AI */}
                    <TabsContent value="ai" className="space-y-4 pt-4">
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                        <Bot className="w-10 h-10 mx-auto text-purple-600 mb-2" />
                        <h3 className="text-md font-bold text-purple-800">Asisten AI</h3>
                        <div className="text-left space-y-3 mt-4">
                          <div><Label>Topik</Label><Input value={aiPrompt.topic} onChange={(e) => setAiPrompt({...aiPrompt, topic: e.target.value})} /></div>
                          <div><Label>Jumlah</Label><Select value={aiPrompt.count} onValueChange={(val) => setAiPrompt({...aiPrompt, count: val})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="3">3</SelectItem><SelectItem value="5">5</SelectItem></SelectContent></Select></div>
                        </div>
                        <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700" onClick={handleGenerateAI} disabled={aiLoading}>{aiLoading ? <Loader2 className="animate-spin" /> : "Generate!"}</Button>
                      </div>
                    </TabsContent>

                    {/* TAB IMPORT EXCEL [REVISI] */}
                    <TabsContent value="import" className="space-y-4 pt-4">
                      <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center">
                        <FileSpreadsheet className="w-12 h-12 mx-auto text-green-600 mb-2" />
                        <h3 className="text-md font-bold text-green-800">Import dari Excel</h3>
                        
                        {/* TOMBOL DOWNLOAD TEMPLATE */}
                        <div className="my-4">
                          <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="text-green-700 border-green-300 hover:bg-green-100">
                            <Download className="w-4 h-4 mr-2" /> Download Format Template .xlsx
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-green-300 border-dashed rounded-lg cursor-pointer bg-green-50 hover:bg-green-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-green-500" />
                              <p className="mb-2 text-sm text-green-500"><span className="font-semibold">Klik upload</span> atau drag file</p>
                              <p className="text-xs text-gray-500">File harus .xlsx</p>
                            </div>
                            <Input type="file" accept=".xlsx" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                          </label>
                        </div>
                        {file && <p className="text-sm mt-2 font-bold text-gray-700">File: {file.name}</p>}

                        <Button className="w-full mt-4 bg-green-600 hover:bg-green-700" onClick={handleImportExcel} disabled={importLoading}>
                          {importLoading ? <Loader2 className="animate-spin" /> : "Upload & Import"}
                        </Button>
                      </div>
                    </TabsContent>

                  </Tabs>
                </CardHeader>
              </Card>
              <Button variant="secondary" className="w-full py-4 border-2" onClick={() => router.push("/dashboard")}>Selesai</Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" /> Daftar Soal ({previewQuestions.length})</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {previewQuestions.map((q, idx) => (
                  <Card key={idx} className="bg-white shadow-sm border-l-4 border-l-blue-400">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-blue-600">No. {idx + 1} ({q.question_type === 'essay' ? 'ESAI' : 'PG'})</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Skor: {q.score}</span>
                      </div>
                      <p className="font-medium text-gray-800 mb-3">{q.content}</p>
                      {q.question_type === 'multiple_choice' ? (
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className={q.correct_answer === 'A' ? "text-green-600 font-bold" : ""}>A. {q.optionsObj?.A}</div>
                          <div className={q.correct_answer === 'B' ? "text-green-600 font-bold" : ""}>B. {q.optionsObj?.B}</div>
                          <div className={q.correct_answer === 'C' ? "text-green-600 font-bold" : ""}>C. {q.optionsObj?.C}</div>
                          <div className={q.correct_answer === 'D' ? "text-green-600 font-bold" : ""}>D. {q.optionsObj?.D}</div>
                        </div>
                      ) : (
                        <div className="bg-blue-50 p-2 rounded text-sm text-blue-800 italic">
                          Kunci: {q.correct_answer}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}