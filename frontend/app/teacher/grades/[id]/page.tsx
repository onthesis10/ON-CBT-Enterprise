"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, ArrowLeft, Trophy, Download, BarChart2, List, Eye } from "lucide-react"; // Tambah Eye icon
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GradebookPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const examId = resolvedParams.id;
  
  const router = useRouter();
  const [results, setResults] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any[]>([]);
  const [examInfo, setExamInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");

    const fetchData = async () => {
      try {
        const examRes = await axios.get("http://127.0.0.1:8000/exams/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const currentExam = examRes.data.find((e: any) => e.id.toString() === examId);
        setExamInfo(currentExam);

        const resultRes = await axios.get(`http://127.0.0.1:8000/exams/${examId}/results`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResults(resultRes.data);

        const analysisRes = await axios.get(`http://127.0.0.1:8000/exams/${examId}/analysis`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalysis(analysisRes.data.data);

      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examId, router]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://127.0.0.1:8000/exams/${examId}/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Nilai_${examInfo?.title || 'Ujian'}.csv`); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Gagal export excel.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin mr-2"/> Memuat Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
            onClick={handleExport}
            disabled={exporting || results.length === 0}
          >
            {exporting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Download className="mr-2 h-4 w-4" />}
            Download Excel
          </Button>
        </div>

        <Card className="border-t-4 border-blue-600 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl">{examInfo?.title}</CardTitle>
            <p className="text-gray-500">{examInfo?.description}</p>
          </CardHeader>
          <CardContent className="flex gap-4 text-sm text-gray-600">
             <div className="bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
               Total Peserta: <span className="font-bold text-blue-700">{results.length}</span> Siswa
             </div>
             {results.length > 0 && (
               <div className="bg-green-50 px-3 py-1 rounded-md border border-green-100">
                 Rata-rata: <b>{(results.reduce((acc, curr) => acc + curr.score, 0) / results.length).toFixed(1)}</b>
               </div>
             )}
          </CardContent>
        </Card>

        <Tabs defaultValue="grades" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mb-4">
            <TabsTrigger value="grades"><List className="mr-2 h-4 w-4"/> Daftar Nilai</TabsTrigger>
            <TabsTrigger value="analysis"><BarChart2 className="mr-2 h-4 w-4"/> Analisis Soal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="grades">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="w-[50px] text-center">No</TableHead>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Waktu Submit</TableHead>
                    <TableHead className="text-center">Nilai Akhir</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-32 text-gray-500">Belum ada data nilai.</TableCell></TableRow>
                  ) : (
                    results.map((res, index) => (
                      <TableRow key={res.id}>
                        <TableCell className="text-center font-medium">{index + 1}</TableCell>
                        <TableCell className="font-semibold text-gray-700">{res.student.full_name}</TableCell>
                        <TableCell className="text-gray-500">{new Date(res.submitted_at).toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-center">
                          <span className={`px-3 py-1 rounded-full font-bold text-sm ${res.score >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {res.score}
                          </span>
                        </TableCell>
                        
                        {/* TOMBOL LIHAT JAWABAN [BARU] */}
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => router.push(`/teacher/grades/${examId}/student/${res.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" /> Lihat Jawaban
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="grid grid-cols-1 gap-4">
              {analysis.length === 0 ? (
                <div className="text-center p-12 bg-white border border-dashed rounded text-gray-400">
                  Belum ada data analisis.
                </div>
              ) : (
                analysis.map((item, idx) => (
                  <Card key={idx} className={`border-l-4 shadow-sm hover:shadow-md transition-shadow ${item.label === 'Sukar' ? 'border-l-red-500' : item.label === 'Mudah' ? 'border-l-green-500' : 'border-l-yellow-500'}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Soal No. {idx + 1}</CardTitle>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase shadow-sm ${item.label === 'Sukar' ? 'bg-red-500' : item.label === 'Mudah' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                          {item.label}
                        </div>
                      </div>
                      <CardDescription className="text-gray-600 mt-1">{item.content}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex-1 bg-gray-50 p-4 rounded-lg text-center border">
                          <div className="text-3xl font-bold text-gray-800">{item.correct_count}</div>
                          <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Siswa Benar</div>
                        </div>
                        <div className="flex-1 bg-gray-50 p-4 rounded-lg text-center border">
                          <div className="text-3xl font-bold text-gray-800">{item.difficulty_index}</div>
                          <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Indeks Kesukaran</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${item.label === 'Sukar' ? 'bg-red-500' : item.label === 'Mudah' ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${item.difficulty_index * 100}%` }}></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}