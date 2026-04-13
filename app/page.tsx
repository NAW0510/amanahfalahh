import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

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
    <div className="flex flex-col bg-white font-sans">

      {/* Navbar */}
      <header className="w-full border-b border-gray-100 px-10 py-4 flex items-center justify-between fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#037EBD] flex items-center justify-center">
            <span className="text-white text-xs font-bold">AF</span>
          </div>
          <span className="text-[#037EBD] font-bold text-lg">AmanahFalah</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600 font-medium">
          <Link href="#beranda" className="text-[#037EBD] border-b-2 border-[#037EBD] pb-0.5">Beranda</Link>
          <Link href="#tentang" className="hover:text-[#037EBD] transition-colors">Tentang Kami</Link>
          <Link href="#visi" className="hover:text-[#037EBD] transition-colors">Visi & Misi</Link>
          <Link href="#tim" className="hover:text-[#037EBD] transition-colors">Tim</Link>
          <Link href="#faq" className="hover:text-[#037EBD] transition-colors">FAQ</Link>
        </nav>
        <Link href="/login" className="bg-[#037EBD] hover:bg-[#025f8f] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
          Login
        </Link>
      </header>

      {/* Hero Section */}
      <section id="beranda" className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 bg-white">
        <div className="w-24 h-24 rounded-full border-4 border-[#037EBD] flex items-center justify-center mb-8 shadow-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-[#037EBD] to-[#025f8f] flex items-center justify-center">
            <span className="text-white text-2xl font-bold">AF</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-[#0A3D5C] leading-tight mb-5 max-w-1xl">
          Amanah Terjaga, Transparansi Nyata
        </h1>
        <p className="text-lg md:text-xl font-semibold text-[#037EBD] mb-4">
          Laporan Falah Berbasis Syariah
        </p>
        <p className="text-gray-400 text-sm max-w-2xl mb-10 leading-relaxed">
          AmanahFalah adalah aplikasi digital untuk membantu panti asuhan dalam mencatat, mengelola,
          dan melaporkan keuangan sesuai prinsip syariah.
        </p>
        <Link href="/login" className="bg-[#037EBD] hover:bg-[#025f8f] text-white font-semibold px-10 py-3.5 rounded-lg transition-colors text-sm">
          Lihat Pedoman Digital
        </Link>
      </section>

      {/* Tantangan Section */}
      <section className="min-h-screen bg-[#0A3D5C] flex items-center px-10 py-20">
        <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="bg-[#0d4d72] rounded-2xl p-10 h-72 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 w-full opacity-70">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-[#037EBD] rounded-lg h-10"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-snug">
              Tantangan Pelaporan Keuangan di Sektor Sosial
            </h2>
            <p className="text-blue-200 text-base leading-relaxed">
              Pengelolaan keuangan pada panti asuhan sering menghadapi tantangan dalam
              pelaporan. Standar yang ada seperti ISAK 35 dinilai kompleks, kurang adaptif
              untuk organisasi kecil, dan belum sepenuhnya berbasis prinsip syariah.
            </p>
          </div>
        </div>
      </section>

      {/* Solusi Section */}
      <section id="tentang" className="min-h-screen flex items-center px-10 py-20 bg-white">
        <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
          <img
            src="/img/TotalPenerimaan.svg"
            alt="Total Penerimaan"
            className="w-full max-w-xl"

          />
          <div className="flex-1 order-2 md:order-1">
            <p className="text-[#037EBD] text-sm font-semibold mb-2 uppercase tracking-wide">Solusi Kami:</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D5C] mb-6 leading-snug">
              Laporan Falah<br />Berbasis Syariah
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              AmanahFalah hadir melalui konsep Semesta Sophiana dan Sharia Transaction Theory.
              Kami menawarkan pertanggungjawaban ganda — transparan kepada donatur dan
              masyarakat, serta vertikal kepada Allah SWT.
            </p>
            <Link href="/login" className="inline-block bg-[#037EBD] hover:bg-[#025f8f] text-white text-sm font-semibold px-7 py-3 rounded-lg transition-colors">
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Fitur Unggulan */}
      <section className="min-h-screen bg-[#0A3D5C] flex items-center px-10 py-20">
        <div className="max-w-5xl mx-auto w-full text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Mewujudkan Amanah Melalui Fitur Unggulan
          </h2>
          <p className="text-blue-200 text-sm mb-14">
            Dirancang khusus untuk kebutuhan panti asuhan yang transparan dan akuntabel
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "📋", judul: "Pencatatan Praktis", deskripsi: "Sistem pencatatan laporan keuangan syariah yang sederhana dan praktis." },
              { icon: "⚖️", judul: "Transparansi & Akuntabilitas", deskripsi: "Membantu panti asuhan menjaga transparansi dan akuntabilitas." },
              { icon: "🤝", judul: "Kepercayaan Donatur", deskripsi: "Tingkatkan kepercayaan publik dan donatur melalui laporan yang terbuka." },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 bg-[#0A3D5C] rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl">{f.icon}</span>
                </div>
                <h3 className="text-[#037EBD] font-bold text-base mb-3">{f.judul}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section id="visi" className="min-h-screen flex items-center px-10 py-20 bg-white">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-14">
            <h3 className="text-center text-2xl font-bold text-gray-800 mb-8">Visi</h3>
            <p className="text-lg md:text-xl font-semibold text-gray-700 max-w-2xl mx-auto leading-relaxed -mt-2">
              Menjadi platform digital yang mendorong pengelolaan keuangan syariah yang
              transparan, amanah, dan inklusif bagi seluruh panti asuhan di Indonesia.
            </p>
          </div>
          <h3 className="text-center text-2xl font-bold text-gray-800 mb-8">Misi</h3>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              "Memberikan pedoman digital untuk laporan keuangan panti asuhan",
              "Mengintegrasikan nilai amanah, kepatuhan, dan pertanggungjawaban syariah dalam pencatatan",
              "Menyediakan sistem yang ramah pengguna dan bisa diakses secara luas",
              "Mendukung gerakan literasi dan inklusi keuangan syariah di sektor sosial",
            ].map((m, i) => (
              <div key={i} className="bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-5 text-center">
                <p className="text-gray-600 text-xs leading-relaxed">{m}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri Tim */}
      <section id="tim" className="min-h-screen bg-gray-50 flex items-center px-10 py-20">
        <div className="max-w-5xl mx-auto w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">Galeri Kegiatan Tim</h2>
          <p className="text-gray-400 text-sm text-center mb-12">
            Dokumentasi perjalanan tim kami dalam mengembangkan AmanahFalah dan berinovasi bersama Panti Asuhan.
          </p>
          <div className="grid grid-cols-3 gap-5">
            {[
              { label: "Mansyur Kota", highlight: false },
              { label: "Panti Asuhan KH. Mas Mansyur Kota Malang", highlight: true },
              { label: "LKSA Taqwa Al-Hikmah", highlight: false },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden shadow-sm ${item.highlight ? "ring-2 ring-[#037EBD] shadow-lg scale-105" : ""} transition-transform`}>
                <div className="bg-[#0A3D5C] h-56 flex items-end p-4">
                  <span className="text-white text-sm font-medium">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`rounded-full transition-all ${i === 1 ? "w-5 h-2 bg-[#037EBD]" : "w-2 h-2 bg-gray-300"}`}></div>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-5">
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#037EBD] hover:text-[#037EBD] transition-colors text-lg">‹</button>
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#037EBD] hover:text-[#037EBD] transition-colors text-lg">›</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="min-h-screen flex items-center px-10 py-20 bg-white">
        <div className="max-w-2xl mx-auto w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12">FAQ</h2>
          <div className="space-y-3">
            {[
              "Apa itu AmanahFalah?",
              "Apakah laporan keuangan yang dihasilkan sesuai syariah?",
              "Bagaimana cara donatur melihat laporan?",
              "Apakah menggunakan AmanahFalah membutuhkan biaya?",
              "Apakah laporan bisa dicetak?",
            ].map((q, i) => (
              <div key={i} className="border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between cursor-pointer hover:border-[#037EBD] hover:shadow-sm transition-all group">
                <p className="text-gray-700 text-sm font-medium group-hover:text-[#037EBD] transition-colors">{q}</p>
                <span className="text-gray-400 text-xl ml-4 group-hover:text-[#037EBD] transition-colors">›</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A3D5C] py-14 px-10">
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
                <div key={i} className="w-8 h-8 bg-[#037EBD] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#025f8f] transition-colors">
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
        <div className="border-t border-[#037EBD] pt-6 text-center">
          <p className="text-blue-300 text-xs">Hak Cipta © 2024 AmanahFalah. Semua Hak Dilindungi.</p>
        </div>
      </footer>

    </div>
  )
}
