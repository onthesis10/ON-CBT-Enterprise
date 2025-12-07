"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { Loader2, Printer, ArrowLeft, School } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrintCardsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const classId = resolvedParams.id;
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [school, setSchool] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const uRes = await axios.get("http://127.0.0.1:8000/users/me", { headers: { Authorization: `Bearer ${token}` } });
        setSchool(uRes.data.school);
        const sRes = await axios.get(`http://127.0.0.1:8000/classrooms/${classId}/students`, { headers: { Authorization: `Bearer ${token}` } });
        setStudents(sRes.data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, [classId]);

  if (loading) return <div className="p-10 text-center">Memuat Kartu...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
      
      {/* HEADER (Hilang saat print) */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <Button variant="outline" onClick={() => window.history.back()}><ArrowLeft className="mr-2 h-4 w-4"/> Kembali</Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Cetak Kartu Peserta</h1>
          <p className="text-gray-500">{students.length} Siswa ditemukan</p>
        </div>
        <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Printer className="mr-2 h-4 w-4"/> Print Sekarang
        </Button>
      </div>

      {/* AREA KARTU */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 gap-4 print:block print:gap-0">
        {students.map((s, idx) => (
          <div key={s.id} className="bg-white border-2 border-gray-800 p-4 rounded-none mb-4 break-inside-avoid print:mb-4 print:break-inside-avoid page-break-after-avoid" style={{ pageBreakInside: 'avoid' }}>
            {/* KOP KARTU */}
            <div className="flex items-center border-b-2 border-gray-400 pb-2 mb-2">
              <div className="w-12 h-12 mr-3 flex items-center justify-center border border-gray-300">
                {school?.logo ? <img src={school.logo} alt="Logo" className="w-full h-full object-contain" /> : <School className="w-8 h-8 text-gray-400"/>}
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold uppercase tracking-wide">{school?.name || "SEKOLAH INDONESIA"}</h2>
                <p className="text-[10px] text-gray-600">KARTU PESERTA UJIAN BERBASIS KOMPUTER</p>
              </div>
            </div>

            {/* ISI KARTU */}
            <div className="grid grid-cols-3 gap-2 text-sm font-mono">
              <div className="col-span-1">
                <div className="w-24 h-32 border border-gray-300 bg-gray-50 flex items-center justify-center text-xs text-gray-400 mx-auto mt-1">
                  FOTO 3x4
                </div>
              </div>

              <div className="col-span-2 space-y-1 mt-1">
                <div className="grid grid-cols-3">
                  <span className="font-semibold text-xs">No. Ujian</span>
                  <span className="col-span-2 font-bold">: {s.exam_number || `U-${s.username}`}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="font-semibold text-xs">Nama</span>
                  <span className="col-span-2 uppercase truncate">: {s.full_name}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="font-semibold text-xs">NISN</span>
                  <span className="col-span-2">: {s.nisn || s.username}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="font-semibold text-xs">Kelas</span>
                  <span className="col-span-2">: {s.classroom?.name || "-"}</span>
                </div>
                
                {/* AKUN LOGIN BOX */}
                <div className="mt-3 p-1.5 bg-gray-100 border border-gray-400 text-center">
                  <p className="text-[10px] text-gray-500 mb-0.5">AKUN LOGIN SISWA</p>
                  <div className="flex justify-around text-xs font-bold text-black">
                    <span>User: {s.username}</span>
                    <span>Pass: {s.original_password || "******"}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-[9px] text-center text-gray-400 mt-2 italic">*Bawa kartu ini saat ujian. Dilarang mencoret-coret kartu.</p>
          </div>
        ))}
      </div>
    </div>
  );
}