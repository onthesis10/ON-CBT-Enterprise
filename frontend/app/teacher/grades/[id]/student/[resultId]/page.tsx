"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, ArrowLeft, CheckCircle, XCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StudentDetailPage({ params }: { params: Promise<{ id: string; resultId: string }> }) {
  const resolvedParams = use(params);
  const resultId = resolvedParams.resultId;
  const router = useRouter();
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newScore, setNewScore] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get(`http://127.0.0.1:8000/results/${resultId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setResult(res.data);
        setNewScore(res.data.score); 
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [resultId]);

  const handleUpdateScore = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://127.0.0.1:8000/results/${resultId}/score`, 
        { score: newScore }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Nilai berhasil diupdate!");
      router.back();
    } catch (error) {
      alert("Gagal update nilai.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto"/> Memuat Jawaban...</div>;

  const studentAnswers = JSON.parse(result.answers || "{}");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4"/> Kembali</Button>
          <div className="text-right">
            <h1 className="text-2xl font-bold uppercase">{result.student.full_name}</h1>
            <p className="text-gray-500">Exam: {result.exam.title}</p>
          </div>
        </div>

        {/* KARTU NILAI & EDIT */}
        <Card className="border-t-4 border-blue-600 shadow-md sticky top-4 z-10">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase">Nilai Saat Ini</p>
              <h2 className="text-4xl font-bold text-blue-600">{result.score}</h2>
            </div>
            
            <div className="flex items-end gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="w-32">
                <Label>Koreksi Nilai</Label>
                <Input type="number" value={newScore} onChange={(e) => setNewScore(parseInt(e.target.value))} />
              </div>
              <Button onClick={handleUpdateScore} disabled={saving} className="bg-green-600 hover:bg-green-700">
                {saving ? <Loader2 className="animate-spin" /> : <><Save className="mr-2 h-4 w-4"/> Simpan Perubahan</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* DAFTAR JAWABAN */}
        <div className="space-y-4">
          {result.exam.questions.map((q: any, idx: number) => {
            const qIdStr = q.id.toString();
            // Ambil jawaban (bisa format lama string, atau format baru object)
            let studentText = "";
            let earnedScore = 0;
            
            if (studentAnswers[qIdStr]) {
                if (typeof studentAnswers[qIdStr] === 'object') {
                    studentText = studentAnswers[qIdStr].answer;
                    earnedScore = studentAnswers[qIdStr].score;
                } else {
                    studentText = studentAnswers[qIdStr];
                    // Hitung skor manual utk format lama
                    if (q.question_type === 'multiple_choice' && studentText.toLowerCase() === q.correct_answer.toLowerCase()) {
                        earnedScore = q.score;
                    }
                }
            }

            let isCorrect = earnedScore > 0; // Logika simpel: kalau dapet nilai berarti benar/sebagian benar
            const options = q.options ? JSON.parse(q.options) : {};

            return (
              <Card key={q.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardHeader className="bg-gray-50/50 pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base font-bold">Soal No. {idx + 1} <span className="text-xs font-normal text-gray-500 ml-2">({q.question_type === 'essay' ? 'ESAI' : 'PG'})</span></CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Skor:</span>
                      <span className={`font-bold px-2 py-1 rounded ${earnedScore > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {earnedScore} / {q.score}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-800 mt-2 font-medium">{q.content}</p>
                </CardHeader>
                
                <CardContent className="pt-4 space-y-4">
                  
                  {/* TAMPILAN PILIHAN GANDA (LENGKAP) */}
                  {q.question_type === 'multiple_choice' && (
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(options).map(([key, val]: any) => {
                        const isSelected = studentText === key;
                        const isKey = q.correct_answer === key;
                        
                        let styleClass = "border-gray-200 bg-white"; // Netral
                        
                        if (isKey) {
                            styleClass = "border-green-500 bg-green-50 ring-1 ring-green-500"; // Kunci Jawaban
                        } else if (isSelected && !isKey) {
                            styleClass = "border-red-500 bg-red-50"; // Jawaban Salah Siswa
                        }

                        return (
                          <div key={key} className={`flex items-center p-3 border rounded-lg text-sm ${styleClass}`}>
                             <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 font-bold border ${
                                 isKey ? 'bg-green-600 text-white border-green-600' : 
                                 isSelected ? 'bg-red-600 text-white border-red-600' : 'bg-gray-100 text-gray-500 border-gray-300'
                             }`}>
                                {key}
                             </div>
                             <span className={isKey ? "font-bold text-green-900" : "text-gray-700"}>{val}</span>
                             
                             {/* Label Status */}
                             <div className="ml-auto flex gap-2">
                                {isSelected && <span className="text-xs bg-gray-800 text-white px-2 py-0.5 rounded">Dijawab Siswa</span>}
                                {isKey && <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded font-bold">Kunci</span>}
                             </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* TAMPILAN ESAI (Simple) */}
                  {q.question_type === 'essay' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="p-3 rounded border bg-gray-50">
                            <p className="font-bold text-gray-500 mb-1">Jawaban Siswa:</p>
                            <p className="text-gray-900">{studentText || "-"}</p>
                        </div>
                        <div className="p-3 rounded border bg-blue-50 border-blue-200">
                            <p className="font-bold text-blue-600 mb-1">Kunci Referensi:</p>
                            <p className="text-gray-900">{q.correct_answer}</p>
                        </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}