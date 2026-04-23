export enum EnvMap {
  openai = 'OPENAI_API_KEY',
  whatsapp = 'WHATSAPP_API',
  messenger = 'MESSENGER_API'
}

export type ChangePasswordFormProps = {
  setForgotPasswordPopup: (value: boolean) => void;
};

export type SelectData = {
  titleKey: string;
  data: {
    id: number;
    value?: string;
    name?: string;
  }[];
};

export type PasswordState = {
  [key: number]: boolean;
};

export type ErrorsState = {
  [key: number]: string;
};

export type ValidatePasswordProps = {
  id: number;
  value: string;
  setErrors: React.Dispatch<React.SetStateAction<ErrorsState>>;
  setCorrectPassword: React.Dispatch<React.SetStateAction<PasswordState>>;
};

export interface ManageAccountFormProps {
  setOpenedPasswordManager: (value: boolean) => void;
  setForgotPasswordPopup: (value: boolean) => void;
}

export interface SendGridContact {
  email: string;
  first_name: string;
  custom_fields?: {
    comment?: string;
  }
}

export interface Auth0User {
  picture: string;
  updated_at: Date;
  created_at: Date;
  last_login: Date;
  email_verified: boolean;
  user_metadata: any;
  user_id: string;
  name: string;
  username: string;
  given_name: string;
  nickname: string;
  email: string;
  last_ip: string;
  logins_count: number;
  metadata?: Record<string, string>
}