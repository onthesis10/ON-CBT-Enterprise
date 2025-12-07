"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, User, Lock, UserCircle, School, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", full_name: "", password: "", role: "siswa", school_code: "", classroom_id: "" });
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<any[]>([]); // Data kelas
  const [error, setError] = useState("");

  // Auto-fetch Kelas saat Kode Sekolah diketik (minimal 4 karakter)
  useEffect(() => {
    if (formData.school_code.length >= 4) {
      axios.get(`http://127.0.0.1:8000/classrooms/?school_code=${formData.school_code}`)
        .then(res => setClasses(res.data))
        .catch(err => setClasses([]));
    }
  }, [formData.school_code]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      // Jika siswa, wajib pilih kelas. Jika guru, boleh kosong (null)
      const payload = { ...formData, classroom_id: formData.role === 'siswa' && formData.classroom_id ? parseInt(formData.classroom_id) : null };
      await axios.post("http://127.0.0.1:8000/users/", payload);
      alert("Pendaftaran Berhasil!"); router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Gagal mendaftar.");
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-green-600">
        <CardHeader className="space-y-1 text-center"><CardTitle>Daftar Akun</CardTitle><CardDescription>Bergabung dengan ON-CBT</CardDescription></CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && <div className="bg-red-50 p-3 text-red-600 border border-red-200 text-sm rounded">⚠️ {error}</div>}
            
            <div className="space-y-2">
              <Label>Kode Sekolah</Label>
              <div className="relative"><School className="absolute left-3 top-2.5 h-4 w-4 text-green-600" /><Input placeholder="Contoh: SMAN1JKT" className="pl-9" value={formData.school_code} onChange={(e) => setFormData({...formData, school_code: e.target.value.toUpperCase()})} required /></div>
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="siswa">👨‍🎓 Siswa</SelectItem><SelectItem value="guru">👩‍🏫 Guru</SelectItem></SelectContent>
              </Select>
            </div>

            {/* PILIH KELAS (Hanya Muncul Jika Siswa & Kode Sekolah Valid) */}
            {formData.role === 'siswa' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label>Pilih Kelas</Label>
                <Select value={formData.classroom_id} onValueChange={(val) => setFormData({...formData, classroom_id: val})}>
                  <SelectTrigger><SelectValue placeholder={classes.length > 0 ? "Pilih Kelas Kamu" : "Menunggu Kode Sekolah..."} /></SelectTrigger>
                  <SelectContent>
                    {classes.length > 0 ? (
                      classes.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)
                    ) : (
                      <div className="p-2 text-xs text-gray-500 text-center">Kelas tidak ditemukan</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2"><Label>Nama Lengkap</Label><div className="relative"><UserCircle className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input placeholder="Andi" className="pl-9" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} required /></div></div>
            <div className="space-y-2"><Label>Username</Label><div className="relative"><User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input placeholder="andi123" className="pl-9" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required /></div></div>
            <div className="space-y-2"><Label>Password</Label><div className="relative"><Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input type="password" placeholder="***" className="pl-9" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required /></div></div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-green-600 hover:bg-green-700" type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : "Daftar"}</Button>
            <div className="text-center text-sm"><a href="/login" className="text-blue-600 hover:underline">Login di sini</a></div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}