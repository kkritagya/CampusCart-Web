"use client";

import {
  resetPasswordAction,
  type AuthActionState,
} from "@/lib/actions/authentication_action";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const initialState: AuthActionState = { success: false, message: "" };

export function ResetPasswordForm({token}:{token:string}) {
  const [state,action]=useActionState(resetPasswordAction,initialState);
  if(state.success)return <div className="auth-form"><p className="form-success" role="status">{state.message}</p><Link className="auth-button" href="/login">Continue to login</Link></div>;
  return <form className="auth-form" action={action} noValidate>
    <input type="hidden" name="token" value={token}/>
    <label className="field" htmlFor="newPassword"><span>New password</span><input id="newPassword" name="newPassword" type="password" autoComplete="new-password" minLength={8} required aria-invalid={Boolean(state.fieldErrors?.newPassword)} />{state.fieldErrors?.newPassword?.[0]?<span className="field-error">{state.fieldErrors.newPassword[0]}</span>:null}</label>
    <label className="field" htmlFor="confirmPassword"><span>Confirm password</span><input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required aria-invalid={Boolean(state.fieldErrors?.confirmPassword)} />{state.fieldErrors?.confirmPassword?.[0]?<span className="field-error">{state.fieldErrors.confirmPassword[0]}</span>:null}</label>
    <SubmitButton disabled={!token}/>
    {state.message?<p className="form-error" role="status">{state.message}</p>:null}
  </form>;
}

function SubmitButton({disabled}:{disabled:boolean}){const {pending}=useFormStatus();return <button className="auth-button" type="submit" disabled={disabled||pending}>{pending?"Resetting…":"Reset password"}</button>}
