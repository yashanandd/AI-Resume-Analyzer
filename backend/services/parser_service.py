import io
import pdfplumber
import docx

def extract_text_from_file(file_content: bytes, ext: str) -> str:
    """
    Extracts text from PDF or DOCX bytes.
    """
    text = ""
    if ext == ".pdf":
        try:
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
        except Exception as e:
            raise Exception(f"Failed to read PDF: {str(e)}")
            
    elif ext == ".docx":
        try:
            doc = docx.Document(io.BytesIO(file_content))
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            raise Exception(f"Failed to read DOCX: {str(e)}")
            
    return text.strip()
