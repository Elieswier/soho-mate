import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast(error.message, { duration: 2500, position: "bottom-center" });
  };

  const signUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) toast(error.message, { duration: 2500, position: "bottom-center" });
    else toast("Check your email to confirm", { duration: 2500, position: "bottom-center" });
  };

  return (
    <div className="min-h-screen bg-sh-bg flex items-center justify-center px-5">
      <div className="w-full max-w-sm flex flex-col gap-5">
        <h1 className="font-serif text-[48px] text-sh-text text-center leading-none mb-4">
          Soho Mate
        </h1>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-sh-muted mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full px-3 py-2.5 text-[14px] bg-sh-bg border border-sh-border rounded-none text-sh-text"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-sh-muted mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full px-3 py-2.5 text-[14px] bg-sh-bg border border-sh-border rounded-none text-sh-text"
          />
        </div>

        <button
          onClick={signIn}
          disabled={loading || !email || !password}
          className="w-full py-3 text-[14px] bg-sh-btn text-sh-btn-text rounded-none disabled:opacity-50"
        >
          Sign in
        </button>

        <button
          onClick={signUp}
          disabled={loading || !email || !password}
          className="w-full py-3 text-[14px] bg-sh-bg text-sh-text border border-sh-border rounded-none disabled:opacity-50"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Auth;
