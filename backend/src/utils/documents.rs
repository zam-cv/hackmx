use actix_multipart::form::tempfile::TempFile;
use actix_web::{Error, Result};
use validator::Validate;

pub trait Doc {
    fn id(&mut self) -> &mut Option<i32>;
    fn name(&mut self) -> &mut String;
}

pub trait Upload {
    fn name(&self) -> &String;
    fn temp_file(self) -> TempFile;
}

pub trait DocService<D: Clone + Doc + Validate, U: Upload> {
    fn folder(&self) -> &str;
    fn prefix(&self) -> &str;

    fn transform_string(&self, id: &i32, image: &mut String) {
        *image = self.get_filepath(*id, &image);
    }

    fn transform(&self, document: &mut D) {
        if let Some(id) = document.id().clone() {
            let name = document.name();
            if !name.is_empty() {
                *name = self.get_filepath(id, name);
            }
        }
    }

    fn transform_all(&self, documents: &mut Vec<D>) {
        for document in documents.iter_mut() {
            self.transform(document);
        }
    }

    async fn db_create_document(&self, document: D) -> anyhow::Result<i32>;
    async fn db_delete_document_by_id(&self, id: i32) -> anyhow::Result<D>;
    async fn db_get_document_by_id(&self, id: i32) -> anyhow::Result<Option<D>>;

    fn delete_file_system(&self, id: i32, name: &String) {
        let _ = std::fs::remove_file(format!("./{}", self.get_filepath(id, name)));
    }

    fn get_filepath(&self, id: i32, name: &String) -> String {
        let filename = format!("{}-{}-{}", self.prefix(), id, name);
        format!(
            "{}/{}",
            self.folder(),
            sanitize_filename::sanitize(filename)
        )
    }

    async fn save_file(&self, upload_form: U, mut document: D) -> Result<D, Error> {
        let name = upload_form.name().clone();

        if let Err(_) = document.validate() {
            return Err(actix_web::error::ErrorBadRequest("Invalid data"));
        }

        match self.db_create_document(document.clone()).await {
            Ok(id) => {
                *document.id() = Some(id);
                let temp_file = upload_form.temp_file();
                let filepath = self.get_filepath(id, &name);

                if let Err(_) = temp_file.file.persist(format!("./{}", filepath)) {
                    return Err(actix_web::error::ErrorBadRequest("Failed to save file"));
                }

                return Ok(document);
            }
            Err(_) => {}
        }

        Err(actix_web::error::ErrorBadRequest("Failed to save file"))
    }

    async fn delete_file(&self, id: i32) -> Result<(), Error> {
        match self.db_delete_document_by_id(id).await {
            Ok(mut document) => {
                let name = document.name().clone();
                self.delete_file_system(id, &name);
                return Ok(());
            }
            Err(_) => Err(actix_web::error::ErrorBadRequest("Failed to delete file")),
        }
    }

    async fn update_file(&self, id: i32, upload_form: U) -> Result<D, Error> {
        let document = match self.db_get_document_by_id(id).await {
            Ok(Some(mut document)) => {
                let name = document.name().clone();
                self.delete_file_system(id, &name);
                document
            }
            _ => return Err(actix_web::error::ErrorBadRequest("Document not found")),
        };

        let name = upload_form.name().clone();
        let temp_file = upload_form.temp_file();
        let filepath = self.get_filepath(id, &name);

        if let Err(_) = temp_file.file.persist(format!("./{}", filepath)) {
            return Err(actix_web::error::ErrorBadRequest("Failed to save file"));
        }

        Ok(document)
    }
}
