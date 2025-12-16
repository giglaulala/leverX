export type TDateBirth = {
  year: number;
  month: number;
  day: number;
};

export type TManager = {
  id: string;
  first_name: string;
  last_name: string;
};

export type TVisa = {
  issuing_country: string;
  type: string;
  start_date: number;
  end_date: number;
};

export type TUser = {
  _id: string;
  isRemoteWork: boolean;
  user_avatar: string;
  first_name: string;
  last_name: string;
  first_native_name: string;
  last_native_name: string;
  middle_native_name: string;
  department: string;
  building: string;
  room: string;
  date_birth: TDateBirth;
  desk_number: number;
  manager: TManager;
  phone: string;
  email: string;
  skype: string;
  cnumber: string;
  citizenship: string;
  visa: TVisa[];
};

export type Role = "admin" | "hr" | "employee";

export type TAuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};


