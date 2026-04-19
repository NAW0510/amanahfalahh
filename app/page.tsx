import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import RotatingText from "@/components/rotating-text"
import FadeIn from "@/components/fade-in"
import AutoGallery from "@/components/auto-gallery"
import Navbar from "@/components/navbar"
import FaqAccordion from "@/components/faq-accordion"
import BackToTop from "@/components/back-to-top"
import Preloader from "@/components/preloader"
import ScrollProgress from "@/components/scroll-progress"
import ScrollIndicator from "@/components/scroll-indicator"
import StatsCounter from "@/components/stats-counter"
import TestimonialCarousel from "@/components/testimonial-carousel"

export default async function Home() {
  const session = await auth()

  if (session) {
    switch (session.user.role) {
      case "ADMIN":
        redirect("/admin/dashboard")
      case "PKM":
        redirect("/pkm/dashboard")
      case "DONATUR":
        redirect("/donatur/transparansi")
    }
  }

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 font-sans transition-colors duration-300">

      <Preloader />
      <ScrollProgress />
      <Navbar />
      <BackToTop />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section id="beranda" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 bg-white dark:bg-gray-950">
        <FadeIn>
          <div className="w-24 h-24 rounded-full border-4 border-[#037EBD] flex items-center justify-center mb-8 shadow-lg overflow-hidden mx-auto">
            <div className="w-full h-full bg-gradient-to-br from-[#037EBD] to-[#025f8f] flex items-center justify-center">
              <span className="text-white text-2xl font-bold">AF</span>
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={200}>
          <h1 className="text-4xl md:text-6xl font-bold text-[#0A3D5C] dark:text-white leading-tight mb-5 max-w-3xl">
            Amanah Terjaga, Transparansi Nyata
          </h1>
        </FadeIn>
        <FadeIn delay={400}>
          <RotatingText
            texts={[
              "Laporan Falah Berbasis Syariah",
              "Transparansi Keuangan Panti Asuhan",
              "Amanah Digital untuk Umat",
              "Akuntabel, Transparan, Terpercaya",
            ]}
            className="text-lg md:text-xl font-semibold text-[#037EBD] mb-4 h-8"
          />
        </FadeIn>
        <FadeIn delay={600}>
          <p className="text-gray-400 dark:text-gray-500 text-sm max-w-2xl mb-10 leading-relaxed">
            AmanahFalah adalah aplikasi digital untuk membantu panti asuhan dalam mencatat, mengelola,
            dan melaporkan keuangan sesuai prinsip syariah.
          </p>
        </FadeIn>
        <FadeIn delay={800}>
          <Link
            href="/login"
            className="bg-[#037EBD] hover:bg-[#025f8f] text-white font-semibold px-10 py-3.5 rounded-lg transition-all text-sm hover:scale-105 active:scale-95"
          >
            Lihat Pedoman Digital
          </Link>
        </FadeIn>

        <ScrollIndicator />
      </section>

      {/* ── Tantangan ─────────────────────────────────────────────── */}
      <section className="min-h-screen bg-[#0A3D5C] dark:bg-[#061f2e] flex items-center px-10 py-20">
        <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
          <FadeIn direction="left" className="flex-1">
            <div className="bg-[#0d4d72] dark:bg-[#082840] rounded-2xl p-10 h-72 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 w-full opacity-70">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-[#037EBD] rounded-lg h-10" />
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn direction="right" className="flex-1 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-snug">
              Tantangan Pelaporan Keuangan di Sektor Sosial
            </h2>
            <p className="text-blue-200 text-base leading-relaxed">
              Pengelolaan keuangan pada panti asuhan sering menghadapi tantangan dalam
              pelaporan. Standar yang ada seperti ISAK 35 dinilai kompleks, kurang adaptif
              untuk organisasi kecil, dan belum sepenuhnya berbasis prinsip syariah.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Solusi ────────────────────────────────────────────────── */}
      <section id="tentang" className="min-h-screen flex items-center px-10 py-20 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
          <FadeIn direction="left" className="flex-1">
            <img
              src="/img/TotalPenerimaan.svg"
              alt="Total Penerimaan"
              className="w-full max-w-xl dark:opacity-90"
            />
          </FadeIn>
          <FadeIn direction="right" className="flex-1 order-2 md:order-1">
            <p className="text-[#037EBD] text-sm font-semibold mb-2 uppercase tracking-wide">Solusi Kami:</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D5C] dark:text-white mb-6 leading-snug">
              Laporan Falah<br />Berbasis Syariah
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-6">
              AmanahFalah hadir melalui konsep Semesta Sophiana dan Sharia Transaction Theory.
              Kami menawarkan pertanggungjawaban ganda — transparan kepada donatur dan
              masyarakat, serta vertikal kepada Allah SWT.
            </p>
            <Link
              href="/login"
              className="inline-block bg-[#037EBD] hover:bg-[#025f8f] text-white text-sm font-semibold px-7 py-3 rounded-lg transition-all hover:scale-105 active:scale-95"
            >
              Mulai Sekarang
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── Fitur Unggulan ────────────────────────────────────────── */}
      <section className="min-h-screen bg-[#0A3D5C] dark:bg-[#061f2e] flex items-center px-10 py-20">
        <div className="max-w-5xl mx-auto w-full text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Mewujudkan Amanah Melalui Fitur Unggulan
            </h2>
            <p className="text-blue-200 text-sm mb-14">
              Dirancang khusus untuk kebutuhan panti asuhan yang transparan dan akuntabel
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "📋", judul: "Pencatatan Praktis", deskripsi: "Sistem pencatatan laporan keuangan syariah yang sederhana dan praktis." },
              { icon: "⚖️", judul: "Transparansi & Akuntabilitas", deskripsi: "Membantu panti asuhan menjaga transparansi dan akuntabilitas." },
              { icon: "🤝", judul: "Kepercayaan Donatur", deskripsi: "Tingkatkan kepercayaan publik dan donatur melalui laporan yang terbuka." },
            ].map((f, i) => (
              <FadeIn key={i} delay={i * 200}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                  <div className="w-14 h-14 bg-[#0A3D5C] dark:bg-[#037EBD]/20 rounded-full flex items-center justify-center mx-auto mb-5">
                    <span className="text-2xl">{f.icon}</span>
                  </div>
                  <h3 className="text-[#037EBD] font-bold text-base mb-3">{f.judul}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.deskripsi}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Counter ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#037EBD] to-[#025f8f] py-20 px-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
              Dampak Nyata AmanahFalah
            </h2>
            <p className="text-blue-100 text-sm text-center mb-12">
              Angka yang berbicara tentang kepercayaan dan transparansi
            </p>
          </FadeIn>
          <StatsCounter
            stats={[
              { value: 150, suffix: "+", label: "Donatur Aktif" },
              { value: 3,   suffix: "",   label: "Panti Asuhan" },
              { value: 500, suffix: "Jt", label: "Dana Tersalurkan" },
              { value: 100, suffix: "%",  label: "Transparansi" },
            ]}
          />
        </div>
      </section>

      {/* ── Visi & Misi ───────────────────────────────────────────── */}
      <section id="visi" className="min-h-screen flex items-center px-10 py-20 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto w-full">
          <FadeIn>
            <div className="text-center mb-14">
              <h3 className="text-center text-2xl font-bold text-gray-800 dark:text-white mb-8">Visi</h3>
              <p className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed -mt-2">
                Menjadi platform digital yang mendorong pengelolaan keuangan syariah yang
                transparan, amanah, dan inklusif bagi seluruh panti asuhan di Indonesia.
              </p>
            </div>
          </FadeIn>
          <FadeIn>
            <h3 className="text-center text-2xl font-bold text-gray-800 dark:text-white mb-8">Misi</h3>
          </FadeIn>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              "Memberikan pedoman digital untuk laporan keuangan panti asuhan",
              "Mengintegrasikan nilai amanah, kepatuhan, dan pertanggungjawaban syariah dalam pencatatan",
              "Menyediakan sistem yang ramah pengguna dan bisa diakses secara luas",
              "Mendukung gerakan literasi dan inklusi keuangan syariah di sektor sosial",
            ].map((m, i) => (
              <FadeIn key={i} delay={i * 150}>
                <div className="bg-[#f0f9ff] dark:bg-[#037EBD]/10 border border-[#bae6fd] dark:border-[#037EBD]/30 rounded-xl p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">{m}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Galeri Tim ────────────────────────────────────────────── */}
      <section id="tim" className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center px-10 py-20">
        <div className="max-w-5xl mx-auto w-full">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-2">
              Galeri Kegiatan Tim
            </h2>
            <p className="text-gray-400 dark:text-gray-500 text-sm text-center mb-12">
              Dokumentasi perjalanan tim kami dalam mengembangkan AmanahFalah dan berinovasi bersama Panti Asuhan.
            </p>
          </FadeIn>
          <FadeIn>
            <AutoGallery
              items={[
                { label: "Mansyur Kota" },
                { label: "Panti Asuhan KH. Mas Mansyur Kota Malang" },
                { label: "LKSA Taqwa Al-Hikmah" },
              ]}
              interval={4000}
            />
          </FadeIn>
        </div>
      </section>

      {/* ── Testimoni ─────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-950 py-20 px-10">
        <div className="max-w-3xl mx-auto w-full">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-2">
              Apa Kata Mereka
            </h2>
            <p className="text-gray-400 dark:text-gray-500 text-sm text-center mb-12">
              Pengalaman nyata dari pengguna AmanahFalah
            </p>
          </FadeIn>
          <TestimonialCarousel
            items={[
              {
                name: "Bapak Ahmad Fauzi",
                role: "Pengurus Panti Asuhan",
                text: "AmanahFalah sangat membantu kami dalam mengelola laporan keuangan yang transparan dan sesuai syariah. Kini kami lebih mudah mempertanggungjawabkan setiap donasi yang masuk.",
              },
              {
                name: "Ibu Siti Rahayu",
                role: "Donatur Tetap",
                text: "Saya merasa tenang karena bisa memantau penggunaan donasi secara langsung melalui platform ini. Transparansinya benar-benar membuat saya semakin percaya.",
              },
              {
                name: "Rizky Pratama",
                role: "Relawan PKM",
                text: "Sistem yang user-friendly dan sangat memudahkan proses pencatatan keuangan panti asuhan. Fitur-fiturnya lengkap dan mudah dipahami.",
              },
            ]}
          />
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section id="faq" className="min-h-screen flex items-center px-10 py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto w-full">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-12">FAQ</h2>
          </FadeIn>
          <FaqAccordion
            items={[
              {
                question: "Apa itu AmanahFalah?",
                answer: "AmanahFalah adalah aplikasi digital yang membantu panti asuhan dalam mencatat, mengelola, dan melaporkan keuangan secara transparan sesuai prinsip syariah.",
              },
              {
                question: "Apakah laporan keuangan yang dihasilkan sesuai syariah?",
                answer: "Ya, AmanahFalah dirancang berdasarkan konsep Semesta Sophiana dan Sharia Transaction Theory untuk menghasilkan laporan yang sesuai prinsip syariah.",
              },
              {
                question: "Bagaimana cara donatur melihat laporan?",
                answer: "Donatur dapat login ke sistem menggunakan akun yang diberikan oleh admin panti asuhan, lalu mengakses halaman transparansi untuk melihat laporan keuangan.",
              },
              {
                question: "Apakah menggunakan AmanahFalah membutuhkan biaya?",
                answer: "Saat ini AmanahFalah tersedia secara gratis sebagai bagian dari inisiatif sosial untuk meningkatkan transparansi keuangan di sektor panti asuhan.",
              },
              {
                question: "Apakah laporan bisa dicetak?",
                answer: "Ya, laporan keuangan dapat diunduh dalam format PDF dan dicetak untuk keperluan dokumentasi atau pelaporan kepada pihak terkait.",
              },
            ]}
          />
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="bg-[#0A3D5C] dark:bg-[#061f2e] py-14 px-10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <span className="text-[#037EBD] text-xs font-bold">AF</span>
              </div>
              <span className="text-white font-bold text-base">AmanahFalah</span>
            </div>
            <p className="text-blue-200 text-xs leading-relaxed mb-5">
              Amanah Terjaga, Transparansi Nyata
            </p>
            <div className="flex gap-3">
              {["YT", "IG", "TW", "FB"].map((s, i) => (
                <div key={i} className="w-8 h-8 bg-[#037EBD] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#025f8f] hover:scale-110 transition-all">
                  <span className="text-white text-xs font-semibold">{s[0]}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Peta Situs</h4>
            <div className="space-y-2">
              {["Beranda", "Tentang Kami", "Visi & Misi", "Tim", "FAQ"].map((item, i) => (
                <Link key={i} href={`#${item.toLowerCase().replace(/\s/g, "")}`} className="block text-blue-200 text-xs hover:text-white transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legalitas</h4>
            <div className="space-y-2">
              {["Kebijakan Privasi", "Ketentuan Layanan"].map((item, i) => (
                <p key={i} className="text-blue-200 text-xs cursor-pointer hover:text-white transition-colors">{item}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-[#037EBD]/40 pt-6 text-center">
          <p className="text-blue-300 text-xs">Hak Cipta © 2024 AmanahFalah. Semua Hak Dilindungi.</p>
        </div>
      </footer>

    </div>
  )
}
