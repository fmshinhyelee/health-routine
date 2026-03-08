import { useState } from 'react'
import { useAuthStore } from '../hooks/useAuthStore'

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle } = useAuthStore()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [signUpDone, setSignUpDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (isSignUp) {
      const err = await signUp(email, password)
      if (err) {
        setError(err)
      } else {
        setSignUpDone(true)
      }
    } else {
      const err = await signIn(email, password)
      if (err) setError(err)
    }

    setLoading(false)
  }

  const handleGoogle = async () => {
    setError(null)
    const err = await signInWithGoogle()
    if (err) setError(err)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      <div className="mb-8 text-center">
        <div className="mb-2 text-4xl">💚</div>
        <h1 className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-2xl font-bold text-transparent">
          건강 루틴
        </h1>
        <p className="mt-1 text-sm text-sub">매일의 건강을 기록하세요</p>
      </div>

      {signUpDone ? (
        <div className="w-full max-w-sm rounded-2xl bg-card p-6 text-center">
          <div className="mb-2 text-3xl">📧</div>
          <p className="text-sm text-text">
            인증 이메일을 보냈습니다.<br />
            메일함을 확인해 주세요.
          </p>
          <button
            onClick={() => { setSignUpDone(false); setIsSignUp(false) }}
            className="mt-4 text-sm text-accent underline"
          >
            로그인으로 돌아가기
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit} className="rounded-2xl bg-card p-6">
            <div className="mb-4">
              <label className="mb-1.5 block text-xs text-sub">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-card2 px-4 py-3 text-sm text-text outline-none focus:border-accent"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1.5 block text-xs text-sub">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="6자 이상"
                className="w-full rounded-xl border border-border bg-card2 px-4 py-3 text-sm text-text outline-none focus:border-accent"
              />
            </div>

            {error && (
              <p className="mb-3 rounded-lg bg-red/10 px-3 py-2 text-xs text-red">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-br from-accent to-accent2 py-3 text-sm font-bold text-white transition-opacity active:opacity-80 disabled:opacity-50"
            >
              {loading ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
            </button>

            <p className="mt-3 text-center text-xs text-sub">
              {isSignUp ? '이미 계정이 있나요?' : '계정이 없나요?'}{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(null) }}
                className="text-accent underline"
              >
                {isSignUp ? '로그인' : '회원가입'}
              </button>
            </p>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-sub">또는</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={handleGoogle}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-text transition-opacity active:opacity-80"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google로 계속하기
          </button>
        </div>
      )}
    </div>
  )
}
