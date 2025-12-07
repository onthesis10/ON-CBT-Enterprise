"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LogOut, User, BookOpen, Clock, PlusCircle, FileText, Trash2, History, Users, School, Settings, Radio, Printer } from "lucide-react"; // <-- Tambah Printer

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const userRes = await axios.get("http://127.0.0.1:8000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);
      localStorage.setItem("user_role", userRes.data.role);

      const examRes = await axios.get("http://127.0.0.1:8000/exams/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(examRes.data);

    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); 
      return;
    }
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleDeleteExam = async (examId: number, title: string) => {
    const confirmDelete = confirm(`⚠️ BAHAYA!\n\nYakin ingin menghapus ujian "${title}"?\nSemua soal dan nilai siswa akan ikut terhapus permanen!`);
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/exams/${examId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Ujian berhasil dihapus!");
      fetchData(); 
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus ujian.");
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* NAVBAR */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-3">
          
          {user?.school?.logo ? (
            <img 
              src={user.school.logo} 
              alt="Logo" 
              className="h-10 w-10 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <School className="h-6 w-6" />
            </div>
          )}
          
          <div className="bg-blue-600 p-2 rounded-lg text-white hidden">
             <School className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
              {user?.school?.name || "ON-CBT Dashboard"}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Computer Based Test System</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="hidden md:flex flex-col items-end">
            <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">{user?.full_name}</span>
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded-full uppercase font-bold">
              {user?.role}
            </span>
          </div>
          
          {(user?.role === "guru" || user?.role === "admin") && (
            <Button variant="ghost" size="icon" onClick={() => router.push("/school/settings")} title="Pengaturan Sekolah">
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
          )}

          <Button variant="destructive" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Keluar</span>
          </Button>
        </div>
      </nav>

      <main className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Selamat Datang! 👋</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {user?.role === 'guru' 
                ? "Kelola ujian dan pantau perkembangan siswa Anda." 
                : "Siap untuk melaksanakan ujian hari ini?"}
            </p>
          </div>

          <div className="flex gap-2">
            {user?.role === "siswa" && (
              <Button 
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800"
                onClick={() => router.push("/student/history")}
              >
                <History className="mr-2 h-4 w-4" />
                Riwayat Nilai
              </Button>
            )}

            {(user?.role === "guru" || user?.role === "admin") && (
              <>
                <Button 
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-white dark:bg-gray-800 dark:text-blue-400 dark:border-blue-400 shadow-sm"
                  onClick={() => router.push("/teacher/classes")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Kelas
                </Button>

                <Button 
                  className="bg-blue-600 hover:bg-blue-700 shadow-lg dark:text-white"
                  onClick={() => router.push("/teacher/create")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Buat Ujian
                </Button>
              </>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Daftar Ujian Tersedia
        </h3>

        {exams.length === 0 ? (
          <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400">
            <p className="text-lg font-medium">Belum ada ujian yang tersedia.</p>
            {user?.role === 'guru' && <p className="text-sm">Klik tombol "Buat Ujian" untuk memulai.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500 dark:border-t-blue-400 flex flex-col justify-between group bg-white dark:bg-gray-800 dark:border-gray-700">
                <div>
                  <CardHeader className="relative pb-2">
                    <CardTitle className="line-clamp-2 pr-6 text-lg dark:text-white">{exam.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1 dark:text-gray-400">{exam.description}</CardDescription>
                    
                    {(user?.role === "guru" || user?.role === "admin") && (
                      <button 
                        onClick={() => handleDeleteExam(exam.id, exam.title)}
                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors bg-white dark:bg-gray-700 rounded-full p-1 hover:bg-red-50 dark:hover:bg-red-900"
                        title="Hapus Ujian"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {exam.duration_minutes}m
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Guru ID: {exam.created_by}
                      </div>
                    </div>
                    
                    {exam.classrooms && exam.classrooms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exam.classrooms.map((c: any) => (
                          <span key={c.id} className="text-[10px] bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800 font-medium">
                            {c.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </div>
                <CardFooter className="flex gap-2 pt-0 pb-6 px-6">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-white"
                    onClick={() => router.push(`/exam/${exam.id}`)}
                  >
                    Kerjakan
                  </Button>
                  
                  {(user?.role === "guru" || user?.role === "admin") && (
                    <>
                      <Button 
                        variant="outline"
                        className="border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300"
                        onClick={() => router.push(`/teacher/grades/${exam.id}`)}
                        title="Lihat Nilai"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      
                      {/* TOMBOL MONITOR CCTV */}
                      <Button className="bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-600" onClick={() => router.push(`/teacher/monitor/${exam.id}`)} title="Live CCTV"><Radio className="w-4 h-4" /></Button>

                      {/* [BARU] TOMBOL ADMINISTRASI */}
                      <Button 
                        variant="outline"
                        className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                        onClick={() => router.push(`/teacher/exams/${exam.id}/administration`)}
                        title="Cetak Absen & Berita Acara"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}