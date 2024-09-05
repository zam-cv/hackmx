variable "digitalocean_token" {
  description = "DigitalOcean Token"
  type        = string
}

variable "region" {
  description = "Region for the Droplet"
  type        = string
}

variable "postgres_db_name" {
  description = "Database Name for PostgreSQL"
  type        = string
}

variable "postgres_user" {
  description = "User for PostgreSQL"
  type        = string
}

variable "rust_log" {
  description = "Rust Log Level"
  type        = string
}

variable "host" {
  description = "Host for the Application"
  type        = string
}

variable "port" {
  description = "Port for the Application"
  type        = number
}

variable "admin_default_email" {
  description = "Default Email for Admin"
  type        = string
}

variable "admin_default_password" {
  description = "Default Password for Admin"
  type        = string
}

variable "user_secret_key" {
  description = "Secret Key for User"
  type        = string
}

variable "admin_secret_key" {
  description = "Secret Key for Admin"
  type        = string
}

variable "user_cookie_name" {
  description = "Cookie Name for User"
  type        = string
}

variable "admin_cookie_name" {
  description = "Cookie Name for Admin"
  type        = string
}

variable "smtp_host" {
  description = "SMTP Host"
  type        = string
}

variable "smtp_username" {
  description = "SMTP Username"
  type        = string
}

variable "smtp_password" {
  description = "SMTP Password"
  type        = string
}

variable "smtp_sender" {
  description = "SMTP Sender"
  type        = string
}