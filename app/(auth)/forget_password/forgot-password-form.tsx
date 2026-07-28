"use client";

import {
  forgotPasswordAction,
  type AuthActionState,
} from "@/lib/actions/authentication_action";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const initialState: AuthActionState = { success: false, message: "" };

export function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPasswordAction, initialState);
  return (
    <form className="auth-form" action={action} noValidate>
      <label className="field" htmlFor="email">
        <span>Email</span>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@campus.edu" required aria-invalid={Boolean(state.fieldErrors?.email)} aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}/>
        {state.fieldErrors?.email?.[0]?<span id="email-error" className="field-error">{state.fieldErrors.email[0]}</span>:null}
      </label>
      <SubmitButton />
      {state.message?<p className={state.success?"form-success":"form-error"} role="status">{state.message}</p>:null}
    </form>
  );
}

function SubmitButton(){
  const {pending}=useFormStatus();
  return <button type="submit" className="auth-button" disabled={pending}>{pending?"Sending…":"Send reset link"}</button>;
}
