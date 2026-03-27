interface AuthUser {
  _id: string
  first_name: string
  last_name: string
  email: string
  status: number
  created_at: string
  updated_at: string
  job_title: string
  company: {
    _id: string
  }
  settings: {
    language?: string
    time_format?: "FULLTIME" | "HALFTIME"
    date_format?: "Y-m-d" | "d/m/Y" | string
  }
  role: string
  roles: string[]
  smtp_details: {
    host: string
    port: number
    secure: boolean
    username: string
    password: string
  }
  imap_details: {
    host: string
    port: number
    secure: boolean
    username: string
    password: string
  }
  statistics: {
    emails_sent_today: number
  }
}

interface AuthUserDataResponse {
  result: boolean
  message: string
  data: {
    user: AuthUser
    roles: string[]
  }
}
