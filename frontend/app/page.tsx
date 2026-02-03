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
  Users,
  CreditCard,
  Sparkles,
  Waves,
  Laptop2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 font-sans">
      
      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-2 rounded-lg text-white shadow-lg shadow-sky-500/30">
            <School className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">ON-CBT</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-200">
          <a href="#features" className="hover:text-white transition">Fitur</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#payment" className="hover:text-white transition">Payment</a>
        </div>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="ghost" className="font-semibold text-slate-200 hover:text-white hover:bg-white/10">
              Masuk
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 font-semibold shadow-lg shadow-sky-500/30">
              Daftar Sekolah
            </Button>
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="flex h-2 w-2 rounded-full bg-sky-400"></span>
              <span>Platform Ujian #1 Berbasis AI</span>
            </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            Ujian Online Canggih,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-500">
              Aman & Otomatis.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-700">
            Dilengkapi AI Generator Soal, Koreksi Esai Otomatis, dan Sistem Anti-Curang. 
            Solusi terbaik untuk Sekolah Modern di Era Digital.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/30 transition-all">
                Coba Gratis Sekarang <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-12 px-8 border-white/20 bg-white/5 text-white hover:bg-white/10">
                Demo Guru
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-sky-300" />
              <span>Integrasi payment otomatis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-sky-300" />
              <span>Mode fokus ala macOS</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-sky-300" />
              <span>Responsif di semua device</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/30 via-transparent to-blue-600/30 blur-3xl"></div>
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-sky-500/20 p-6">
            <div className="flex items-center gap-2 pb-4 border-b border-white/10">
              <span className="h-3 w-3 rounded-full bg-red-400"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
              <span className="h-3 w-3 rounded-full bg-green-400"></span>
              <span className="text-xs text-slate-300 ml-2">ON-CBT Dashboard</span>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-500/10 border border-white/10 p-4">
                <div className="flex items-center justify-between text-sm text-slate-200 mb-4">
                  <span className="font-semibold">Ujian Matematika</span>
                  <span className="text-sky-300">Live</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-sky-400 to-blue-500"></div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>312 siswa aktif</span>
                  <span>Durasi 90 menit</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 text-slate-200">
                    <Sparkles className="h-5 w-5 text-sky-300" />
                    <span className="text-sm font-semibold">AI Generator</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">50 soal siap pakai dalam 5 detik.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 text-slate-200">
                    <Laptop2 className="h-5 w-5 text-sky-300" />
                    <span className="text-sm font-semibold">Focus Mode</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Tampilan macOS, nyaman tanpa distraksi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-sky-500 rounded-full blur-[140px] opacity-20"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[140px] opacity-25"></div>
        </div>
      </section>

      {/* --- FITUR UNGGULAN --- */}
      <section id="features" className="py-20 bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kenapa Memilih ON-CBT?</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Fitur lengkap yang dirancang khusus untuk memudahkan Guru dan menjaga integritas Siswa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitur 1 */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-purple-300" />
                </div>
                <CardTitle className="text-xl text-white">AI Assistant</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Generate 50 soal dalam 5 detik cukup dengan topik. Koreksi jawaban esai siswa secara otomatis dengan akurasi tinggi.
              </CardContent>
            </Card>

            {/* Fitur 2 */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-red-300" />
                </div>
                <CardTitle className="text-xl text-white">Anti-Cheat System</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Deteksi pindah tab, blokir aplikasi lain, dan mode layar penuh. Siswa curang langsung kena peringatan otomatis.
              </CardContent>
            </Card>

            {/* Fitur 3 */}
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-green-300" />
                </div>
                <CardTitle className="text-xl text-white">Analisis Lengkap</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                Dapatkan rekap nilai instan, analisis tingkat kesukaran soal, dan download laporan format Excel siap cetak.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* --- STATISTIK --- */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-sky-300 mb-2">100+</div>
              <div className="text-slate-400">Sekolah Bergabung</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-300 mb-2">50k+</div>
              <div className="text-slate-400">Siswa Ujian</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-300 mb-2">1M+</div>
              <div className="text-slate-400">Soal Tergenerate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-300 mb-2">24/7</div>
              <div className="text-slate-400">Server Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-20 bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pricing Transparan & Fleksibel</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Pilih paket sesuai kebutuhan sekolah Anda. Semua paket sudah termasuk support 24/7 dan sistem keamanan ujian.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Waves className="h-5 w-5 text-sky-300" />
                  Starter
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-6">
                <div>
                  <div className="text-4xl font-bold text-white">Rp 249k</div>
                  <p className="text-sm text-slate-400">/ bulan · up to 500 siswa</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-sky-300" /> CBT dasar & bank soal</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-sky-300" /> Auto grading pilihan ganda</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-sky-300" /> Laporan nilai real-time</li>
                </ul>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white">Mulai Paket</Button>
              </CardContent>
            </Card>

            <Card className="border border-sky-400/40 bg-gradient-to-b from-sky-500/20 to-blue-600/10 backdrop-blur-xl shadow-2xl shadow-sky-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-sky-300" />
                  Pro School
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-200 space-y-6">
                <div>
                  <div className="text-4xl font-bold text-white">Rp 549k</div>
                  <p className="text-sm text-slate-300">/ bulan · up to 2.000 siswa</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-sky-300" /> AI Generator Soal</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-sky-300" /> Koreksi esai otomatis</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-sky-300" /> Anti-cheat & proctoring</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-sky-300" /> Dashboard analytics</li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white">Pilih Pro</Button>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-sky-300" />
                  Enterprise
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-6">
                <div>
                  <div className="text-4xl font-bold text-white">Custom</div>
                  <p className="text-sm text-slate-400">Unlimited siswa & multi campus</p>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-sky-300" /> SLA 99.9% uptime</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-sky-300" /> On-premise & SSO</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-sky-300" /> Dedicated success manager</li>
                </ul>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white">Hubungi Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* --- PAYMENT GATEWAY --- */}
      <section id="payment" className="py-20 bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-sm font-medium mb-4">
                <CreditCard className="h-4 w-4 text-sky-300" />
                Payment Gateway
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Sistem Pembayaran Otomatis & Aman
              </h2>
              <p className="text-slate-300 mb-6">
                Terima pembayaran sekolah dengan pilihan transfer bank, virtual account, QRIS, kartu kredit, dan e-wallet.
                Semua status pembayaran tersinkron otomatis ke dashboard admin.
              </p>
              <div className="grid gap-4">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <CheckCircle2 className="h-5 w-5 text-sky-300" />
                  <div>
                    <p className="text-white text-sm font-semibold">Notifikasi real-time</p>
                    <p className="text-xs text-slate-400">Invoice, pengingat otomatis, dan laporan keuangan siap ekspor.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <CheckCircle2 className="h-5 w-5 text-sky-300" />
                  <div>
                    <p className="text-white text-sm font-semibold">Harga fleksibel</p>
                    <p className="text-xs text-slate-400">Bisa per siswa, per kelas, atau langganan tahunan.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-300">Ringkasan Tagihan</p>
                <span className="text-xs text-slate-400">#INV-2025-08</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Langganan Pro School</span>
                  <span>Rp 549k</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Diskon paket tahunan</span>
                  <span className="text-emerald-300">-Rp 100k</span>
                </div>
                <div className="h-px bg-white/10"></div>
                <div className="flex items-center justify-between text-lg font-semibold text-white">
                  <span>Total</span>
                  <span>Rp 449k</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">VA Bank</div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">QRIS</div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">Kartu Kredit</div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">E-Wallet</div>
              </div>
              <Button className="mt-6 w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white">
                Bayar Sekarang
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA BAWAH --- */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Siap Transformasi Ujian Sekolah Anda?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan sekolah-sekolah modern lainnya. Gratis uji coba fitur lengkap tanpa kartu kredit.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500">
                Daftarkan Sekolah <School className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 border-t border-white/10 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-1.5 rounded-md text-white">
              <School className="h-4 w-4" />
            </div>
            <span className="font-bold text-white">ON-CBT</span>
          </div>
          <div className="text-sm text-slate-500">
            © 2025 ON-CBT Indonesia. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
