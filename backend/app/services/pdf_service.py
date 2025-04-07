# backend/app/services/pdf_service.py
import os
import PyPDF2
from typing import List, Dict, Any

class PDFService:
    def __init__(self, pdf_directory: str = "data/pdfs"):
        self.pdf_directory = pdf_directory
        
    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text content from a PDF file"""
        full_path = os.path.join(self.pdf_directory, file_path)
        
        if not os.path.exists(full_path):
            raise FileNotFoundError(f"PDF file not found: {full_path}")
        
        text = ""
        with open(full_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        
        return text
    
    def search_pdfs_for_keywords(self, keywords: List[str], documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Search multiple PDFs for keywords and return relevant documents"""
        relevant_docs = []
        
        for doc in documents:
            # Check if any keywords match the document metadata
            meta_match = any(keyword.lower() in doc["title"].lower() or 
                            keyword.lower() in doc["summary"].lower() or
                            any(keyword.lower() in kw.lower() for kw in doc["keywords"])
                            for keyword in keywords)
            
            if meta_match:
                relevant_docs.append(doc)
                continue
            
            # Only extract and search text for documents that didn't match on metadata
            try:
                text = self.extract_text_from_pdf(doc["file_path"])
                if any(keyword.lower() in text.lower() for keyword in keywords):
                    relevant_docs.append(doc)
            except Exception as e:
                print(f"Error searching PDF {doc['file_path']}: {e}")
        
        return relevant_docs