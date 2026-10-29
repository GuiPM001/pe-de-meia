"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/button";
import { api } from "@/core/services/api";

export default function ApiTokenPage() {
  const pathname = usePathname();
  const { status } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const issuedFromLogin = useRef(false);

  const issueToken = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<{ token: string }>("/token");
      setToken((response as unknown as { token: string }).token);
    } catch (issueError) {
      setError((issueError as { message?: string }).message ?? "Não foi possível gerar o token.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated" || issuedFromLogin.current) return;
    if (!new URLSearchParams(window.location.search).has("issue")) return;

    issuedFromLogin.current = true;
    window.history.replaceState(null, "", pathname);
    void issueToken();
  }, [issueToken, pathname, status]);

  const handleGoogleSignIn = () =>
    signIn("google", { callbackUrl: `${pathname}?issue=1` });

  const copyToken = async () => {
    if (token) await navigator.clipboard.writeText(token);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
      <section className="w-full max-w-xl space-y-5 rounded-3xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-gray-800">Token de acesso</h1>

        {status === "loading" ? (
          <p>Verificando sessão…</p>
        ) : token ? (
          <div className="space-y-4">
            <p>Copie e guarde este token. Ele não será armazenado e desaparecerá ao recarregar a tela.</p>
            <textarea className="w-full rounded border p-2" readOnly value={token} rows={7} />
            <Button onClick={copyToken}>Copiar token</Button>
          </div>
        ) : status === "authenticated" ? (
          <div className="space-y-4">
            <p>O token fica somente nesta tela. Gere-o para esta sessão.</p>
            <Button onClick={issueToken} disabled={loading}>
              {loading ? "Gerando…" : "Gerar token"}
            </Button>
          </div>
        ) : (
          <Button onClick={handleGoogleSignIn}>
            Entrar com Google
          </Button>
        )}

        {error && <p className="text-red-600">{error}</p>}
      </section>
    </main>
  );
}
