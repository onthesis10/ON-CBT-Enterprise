import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bot, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  School, 
  Users 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-6 py-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <School className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">ON-CBT</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="ghost" className="font-semibold text-gray-600 hover:text-blue-600">
              Masuk
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 font-semibold shadow-md">
              Daftar Sekolah
            </Button>
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
            Platform Ujian #1 Berbasis AI
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            Ujian Online Canggih,<br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Aman & Otomatis.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            Dilengkapi AI Generator Soal, Koreksi Esai Otomatis, dan Sistem Anti-Curang. 
            Solusi terbaik untuk Sekolah Modern di Era Digital.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition-all">
                Coba Gratis Sekarang <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-12 px-8 border-gray-300 hover:bg-gray-50 text-gray-700">
                Demo Guru
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-200 rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-200 rounded-full blur-[100px] opacity-20"></div>
        </div>
      </section>

      {/* --- FITUR UNGGULAN --- */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kenapa Memilih ON-CBT?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Fitur lengkap yang dirancang khusus untuk memudahkan Guru dan menjaga integritas Siswa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitur 1 */}
            <Card className="border-t-4 border-purple-500 shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">AI Assistant</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Generate 50 soal dalam 5 detik cukup dengan topik. Koreksi jawaban esai siswa secara otomatis dengan akurasi tinggi.
              </CardContent>
            </Card>

            {/* Fitur 2 */}
            <Card className="border-t-4 border-red-500 shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Anti-Cheat System</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Deteksi pindah tab, blokir aplikasi lain, dan mode layar penuh. Siswa curang langsung kena peringatan otomatis.
              </CardContent>
            </Card>

            {/* Fitur 3 */}
            <Card className="border-t-4 border-green-500 shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Analisis Lengkap</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Dapatkan rekap nilai instan, analisis tingkat kesukaran soal, dan download laporan format Excel siap cetak.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* --- STATISTIK --- */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">100+</div>
              <div className="text-gray-400">Sekolah Bergabung</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">50k+</div>
              <div className="text-gray-400">Siswa Ujian</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">1M+</div>
              <div className="text-gray-400">Soal Tergenerate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-gray-400">Server Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA BAWAH --- */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Siap Transformasi Ujian Sekolah Anda?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan sekolah-sekolah modern lainnya. Gratis uji coba fitur lengkap tanpa kartu kredit.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-gray-900 hover:bg-black">
                Daftarkan Sekolah <School className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-md text-white">
              <School className="h-4 w-4" />
            </div>
            <span className="font-bold text-gray-900">ON-CBT</span>
          </div>
          <div className="text-sm text-gray-500">
            © 2025 ON-CBT Indonesia. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-blue-600">Privacy</a>
            <a href="#" className="hover:text-blue-600">Terms</a>
            <a href="#" className="hover:text-blue-600">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}