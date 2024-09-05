use crate::config;
use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use lazy_static::lazy_static;
use std::sync::Mutex;
use std::time::Duration;
use tokio::time::sleep;

lazy_static! {
    static ref MAILER: Mutex<SmtpTransport> = Mutex::new(create_mailer());
}

fn create_mailer() -> SmtpTransport {
    let creds = Credentials::new(config::SMTP_USERNAME.clone(), config::SMTP_PASSWORD.clone());
    SmtpTransport::starttls_relay(&config::SMTP_HOST)
        .expect("Error configurando el servidor SMTP")
        .port(587)
        .credentials(creds)
        .build()
}

pub struct EmailPayload {
    pub title: String,
    pub body: String,
    pub emails: Vec<String>,
}

pub async fn send_email(email_payload: EmailPayload) -> anyhow::Result<()> {
    for to in email_payload.emails {
        let email = Message::builder()
            .from(config::SMTP_SENDER.parse()?)
            .to(to.parse()?)
            .subject(email_payload.title.clone())
            .header(ContentType::TEXT_HTML)
            .body(email_payload.body.clone())?;

        let mut retries = 3;
        let mut backoff = Duration::from_secs(1);

        while retries > 0 {
            let result = {
                if let Ok(mailer) = MAILER.lock() {
                    mailer.send(&email)
                } else {
                    log::error!("Failed to lock the mailer");
                    break;
                }
            };

            match result {
                Ok(_) => break,
                Err(e) => {
                    log::error!("Error sending email to {}: {:?}", to, e);

                    if e.is_permanent() {
                        log::error!("Permanent error encountered. Not retrying: {:?}", e);
                        break;
                    } else if e.is_transient() || e.is_timeout() || e.is_tls() {
                        retries -= 1;
                        if retries > 0 {
                            log::info!("Transient error or timeout. Retrying... {} attempts left", retries);
                            sleep(backoff).await;
                            backoff *= 2;

                            if let Ok(mut mailer) = MAILER.lock() {
                                *mailer = create_mailer();
                            } else {
                                log::error!("Failed to lock the mailer");
                                break;
                            }
                        } else {
                            log::error!("Failed to send email after several attempts");
                            break;
                        }
                    } else if e.is_client() || e.is_response() {
                        log::error!("Client or response error encountered. Not retrying: {:?}", e);
                        break;
                    } else {
                        log::error!("Unknown error encountered: {:?}", e);
                        retries -= 1;
                        if retries > 0 {
                            log::info!("Unknown error. Retrying... {} attempts left", retries);
                            sleep(backoff).await;
                            backoff *= 2;

                            if let Ok(mut mailer) = MAILER.lock() {
                                *mailer = create_mailer();
                            } else {
                                log::error!("Failed to lock the mailer");
                                break;
                            }
                        } else {
                            log::error!("Failed to send email after several attempts");
                            break;
                        }
                    }
                }
            }
        }
    }

    Ok(())
}
