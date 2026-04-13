"use client"
import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email atau password salah")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-white px-4">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-1 text-primary hover:text-teal-900 font-semibold">
        ↩ Kembali
      </Link>
      <h1 className="text-3xl font-bold text-bolder mb-2">Selamat Datang!</h1>
      <p className="text-primary mb-8">Silahkan lakukan login akun terlebih dahulu</p>
      <Card className="w-full max-w-md p-6">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan Email"
                className="bg-gray-100 border-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan Password"
                className="bg-gray-100 border-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-teal-700" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Login"}
            </Button>
            <div className="text-center text-sm space-y-1">
              <p>Belum memiliki akun? <span className="text-primary font-medium">Registrasi</span></p>
              <p>Lupa Password? <span className="text-primary font-medium">Hubungi Admin</span></p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
