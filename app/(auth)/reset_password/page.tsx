import Image from "next/image";
import Link from "next/link";
import "../login/login.css";
import "../forget_password/forgot_password.css";
import "./reset_password.css";
import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage({searchParams}:{searchParams:Promise<{token?:string}>}) {
  const {token=""}=await searchParams;
  return <main className="auth-shell"><div className="password-card"><Link href="/" className="brand-lockup" aria-label="CampusCart home"><Image src="/campuscart-logo.png" alt="CampusCart" width={180} height={180} className="brand-logo" priority/></Link><div className="auth-heading"><p className="eyebrow">Account security</p><h1>Create a new password</h1><p>{token?"Choose a secure password for your CampusCart account.":"This reset link is missing its secure token. Request a new link."}</p></div><ResetPasswordForm token={token}/><p className="auth-switch"><Link href="/forget_password">Request another reset link</Link></p></div></main>;
}
