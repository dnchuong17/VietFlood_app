export type SignInPayload = {
  username: string;
  password: string;
};

export type SignUpPayload = {
  email: string;
  username: string;
  password: string;
  phone: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  province: string;
  ward: string;
  address_line: string;
};

export type SignInResponse = {
  accessToken: string;
  refresh_token?: string;
};

export type AuthProfile = {
  id?: number;
  email?: string;
  username?: string;
  phone?: string;
  role?: string;
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  date_of_birth?: string;
  address_line?: string;
  ward?: string;
  province?: string;
  created_at?: string;
  updated_at?: string;
};

export type UpdateProfilePayload = {
  phone?: string;
  province?: string;
  ward?: string;
  address_line?: string;
  password?: string;
};
