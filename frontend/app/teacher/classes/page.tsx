"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Plus, Users, User, ArrowLeft, RefreshCw, Printer, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function ClassManagerPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [newClass, setNewClass] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedClassName, setSelectedClassName] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);

  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://127.0.0.1:8000/classrooms/", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setClasses(res.data)).catch(err => console.error(err));
    }
  };

  const handleAddClass = async () => {
    if (!newClass) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:8000/classrooms/", { name: newClass }, { headers: { Authorization: `Bearer ${token}` } });
      setNewClass(""); fetchClasses();
    } catch (error) { alert("Gagal tambah kelas"); } finally { setLoading(false); }
  };

  const handleViewStudents = async (classId: number, className: string) => {
    setSelectedClassId(classId); setSelectedClassName(className);
    setLoadingStudents(true); setStudents([]);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://127.0.0.1:8000/classrooms/${classId}/students`, { headers: { Authorization: `Bearer ${token}` } });
      setStudents(res.data);
    } catch (error) { console.error(error); } finally { setLoadingStudents(false); }
  };

  // FUNGSI IMPORT SISWA 🎓
  const handleImportStudents = async () => {
    if (!importFile || !selectedClassId) return alert("Pilih file & kelas!");
    setImportLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", importFile);
      
      const res = await axios.post(`http://127.0.0.1:8000/classrooms/${selectedClassId}/import-students`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      
      alert(res.data.message);
      setImportFile(null); // Reset
      handleViewStudents(selectedClassId, selectedClassName); // Refresh list
    } catch (error) { alert("Gagal import siswa. Pastikan format Excel benar (Nama | NISN)."); } finally { setImportLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}><ArrowLeft className="h-5 w-5" /></Button>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800"><Users className="text-blue-600" /> Manajemen Kelas</h1>
          </div>
        </div>
        
        <Card className="mb-8 border-t-4 border-blue-600 shadow-sm">
          <CardContent className="pt-6 flex gap-4">
            <Input placeholder="Nama Kelas Baru (misal: XII-IPS-1)" value={newClass} onChange={(e) => setNewClass(e.target.value)} className="flex-1"/>
            <Button onClick={handleAddClass} disabled={loading} className="bg-blue-600 hover:bg-blue-700">{loading ? <Loader2 className="animate-spin" /> : <><Plus className="mr-2 h-4 w-4"/> Buat Kelas</>}</Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-semibold text-gray-700">Daftar Kelas</h3>
            <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto">
              {classes.map((c) => (
                <Card key={c.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedClassId === c.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`} onClick={() => handleViewStudents(c.id, c.name)}>
                  <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0"><CardTitle className="text-lg">{c.name}</CardTitle><Users className="h-4 w-4 text-gray-400" /></CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <Card className="min-h-[400px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-blue-600" /> {selectedClassId ? `Siswa Kelas ${selectedClassName}` : "Pilih Kelas"}</CardTitle>
                
                {selectedClassId && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => document.getElementById('fileInput')?.click()} disabled={importLoading}>
                      {importLoading ? <Loader2 className="animate-spin w-4 h-4"/> : <Upload className="w-4 h-4 mr-2"/>} Import Excel
                    </Button>
                    <input id="fileInput" type="file" accept=".xlsx" className="hidden" onChange={(e) => { setImportFile(e.target.files?.[0] || null); }} />
                    {importFile && <Button size="sm" onClick={handleImportStudents} className="bg-green-600 hover:bg-green-700">Upload {importFile.name}</Button>}
                    
                    <Button size="sm" className="bg-gray-800 text-white hover:bg-gray-700" onClick={() => router.push(`/teacher/classes/${selectedClassId}/print`)}>
                      <Printer className="w-4 h-4 mr-2" /> Cetak Kartu
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {!selectedClassId ? (
                  <div className="h-full flex items-center justify-center text-gray-400 py-20"><p>Klik kelas di kiri untuk kelola siswa.</p></div>
                ) : loadingStudents ? (
                  <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>
                ) : students.length === 0 ? (
                  <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-lg">Belum ada siswa. Silakan Import Excel.</div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {students.map((s, idx) => (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">{idx + 1}</div>
                          <div><p className="font-semibold text-gray-800">{s.full_name}</p><p className="text-xs text-gray-500">@{s.username} | NISN: {s.nisn || '-'}</p></div>
                        </div>
                        <div className="font-mono text-xs font-bold bg-gray-200 px-2 py-1 rounded">Pass: {s.original_password || '******'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}