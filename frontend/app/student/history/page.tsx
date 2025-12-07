"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, History, Trophy } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");

    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/student/my-results", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data);
      } catch (error) {
        console.error("Gagal ambil history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Dashboard
          </Button>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <History className="text-blue-500 h-5 w-5" />
            <span className="font-bold text-gray-700">Riwayat Ujian Saya</span>
          </div>
        </div>

        {/* STATISTIK SINGKAT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg opacity-90">Total Ujian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{history.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg opacity-90">Rata-Rata Nilai</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {history.length > 0 
                  ? (history.reduce((acc, curr) => acc + curr.score, 0) / history.length).toFixed(0)
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TABEL RIWAYAT */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Daftar Hasil Ujian</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Daftar semua ujian yang telah kamu kerjakan.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Judul Ujian</TableHead>
                  <TableHead>Waktu Mengerjakan</TableHead>
                  <TableHead className="text-right">Nilai Kamu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-gray-500">
                      Kamu belum mengerjakan ujian apapun.
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-semibold text-gray-700">
                        {item.exam.title}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(item.submitted_at).toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`px-3 py-1 rounded-full font-bold text-sm ${
                          item.score >= 75 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {item.score}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}