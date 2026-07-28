export type AuthUser = {
  id?: string;
  _id?: string;
  name?: string;
  fullName?: string;
  email: string;
  role?: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  fullName: string;
};
