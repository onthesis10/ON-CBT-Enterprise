"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, School, Upload, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default function SchoolSettingsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      // Bikin preview gambar biar kelihatan sebelum upload
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Pilih gambar dulu!");
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      await axios.post("http://127.0.0.1:8000/schools/logo", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      
      alert("Logo berhasil diupdate! Silakan refresh dashboard.");
      router.push("/dashboard");
      
    } catch (error) {
      console.error(error);
      alert("Gagal upload logo. Pastikan file gambar (JPG/PNG).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Kembali</h1>
          </div>
          <CardTitle className="text-2xl flex items-center gap-2">
            <School className="text-blue-600" /> Pengaturan Sekolah
          </CardTitle>
          <CardDescription>Ganti identitas dan logo sekolah Anda di sini.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          
          {/* AREA UPLOAD */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
            {preview ? (
              <div className="mb-4">
                <img src={preview} alt="Logo Preview" className="h-32 w-32 object-contain border rounded-full bg-white p-2" />
                <p className="text-xs text-center text-gray-500 mt-2">Preview Logo Baru</p>
              </div>
            ) : (
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
            )}
            
            <label className="cursor-pointer">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">
                Pilih Logo (JPG/PNG)
              </span>
              <Input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            <p className="text-xs text-gray-400 mt-2">Maksimal ukuran 2MB</p>
          </div>

        </CardContent>
        <CardFooter>
          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleUpload} disabled={loading || !file}>
            {loading ? <Loader2 className="animate-spin mr-2" /> : <><Save className="mr-2 h-4 w-4" /> Simpan Perubahan</>}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}