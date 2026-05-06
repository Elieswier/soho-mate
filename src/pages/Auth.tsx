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

  const forgotPassword = async () => {
    if (!email) {
      toast("Enter your email first", { duration: 2000, position: "bottom-center" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setLoading(false);
    if (error) toast(error.message, { duration: 2500, position: "bottom-center" });
    else toast("Reset link sent — check your email", { duration: 3000, position: "bottom-center" });
  };

  const inputStyle = { fontSize: 16, WebkitTextSizeAdjust: "100%" as const };

  return (
    <div className="h-screen min-h-screen overflow-hidden bg-sh-bg flex items-center justify-center px-5">
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
            style={inputStyle}
            className="w-full px-3 py-2.5 bg-sh-bg border border-sh-border rounded-none text-sh-text"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] uppercase tracking-widest text-sh-muted">
              Password
            </label>
            <button
              type="button"
              onClick={forgotPassword}
              disabled={loading}
              className="text-[10px] text-sh-muted underline underline-offset-2 disabled:opacity-50"
            >
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={inputStyle}
            className="w-full px-3 py-2.5 bg-sh-bg border border-sh-border rounded-none text-sh-text"
          />
        </div>

        <button
          onClick={signIn}
          disabled={loading || !email || !password}
          className="w-full py-3 text-[14px] bg-sh-btn text-sh-btn-text rounded-none disabled:opacity-50"
        >
          Log in
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
