import { useState } from 'react';

export function useTogglePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((current) => !current);
  return { showPassword, togglePassword };
}
