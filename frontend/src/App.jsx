import { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const [documentType, setDocumentType] = useState("Employment Contract");
  const [parties, setParties] = useState("");
  const [terms, setTerms] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [generatedDocument, setGeneratedDocument] = useState("");
  const [generating, setGenerating] = useState(false);

  // Upload and analyze legal document
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF or DOCX file first.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload document
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await axios.post(
        "http://127.0.0.1:8000/upload-document",
        formData
      );

      console.log("Upload response:", uploadResponse.data);

      // Step 2: Send extracted text to Gemini
      const text = uploadResponse.data.text_preview;

      const summaryResponse = await axios.post(
        "http://127.0.0.1:8000/summarize-text",
        null,
        {
          params: {
            text: text,
          },
        }
      );

      console.log("Summary response:", summaryResponse.data);

      setSummary(summaryResponse.data.summary);

      alert("Document analyzed successfully! 🎉");
    } catch (error) {
      console.error("Upload/Summary error:", error);
      alert("Failed to analyze document.");
    } finally {
      setLoading(false);
    }
  };

  // Generate a new legal document
  const handleGenerate = async () => {
    if (!parties || !terms || !effectiveDate) {
      alert("Please fill in all the required fields.");
      return;
    }

    setGenerating(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/generate-document",
        {
          document_type: documentType,
          parties: parties,
          terms: terms,
          effective_date: effectiveDate,
        }
      );

      console.log("Generated document:", response.data);

      setGeneratedDocument(response.data.document);

      alert("Legal document generated successfully! 🎉");
    } catch (error) {
      console.error("Document generation error:", error);
      alert("Failed to generate the legal document.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="app">

      {/* Navbar */}
      <header className="navbar">
        <div className="logo">
          ⚖️ LegalEase
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#generator">Generator</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>

        <button className="login-btn">
          Login
        </button>
      </header>


      <main id="home">

        {/* Hero Section */}
        <section className="hero">

          <div className="hero-text">

            <p className="tagline">
              AI-POWERED LEGAL ASSISTANT
            </p>

            <h1>
              Understand Your
              <span> Legal Documents </span>
              Easily.
            </h1>

            <p className="description">
              LegalEase helps you understand complex legal documents
              using AI-powered summaries and simple explanations.
            </p>

            <div className="hero-buttons">

              <input
                type="file"
                accept=".pdf,.docx"
                id="file-upload"
                style={{ display: "none" }}
                onChange={(e) =>
                  setSelectedFile(e.target.files[0])
                }
              />

              <button
                className="primary-btn"
                onClick={async () => {
                  if (!selectedFile) {
                    document
                      .getElementById("file-upload")
                      .click();
                  } else {
                    await handleUpload();
                  }
                }}
                disabled={loading}
              >
                {loading
                  ? "🤖 Analyzing..."
                  : "📄 Upload Document"}
              </button>

            </div>

          </div>


          <div className="hero-card">

            <div className="card-icon">
              ⚖️
            </div>

            <h2>
              LegalEase AI
            </h2>

            <p>
              Upload a legal document and get a clear,
              structured summary in seconds.
            </p>

            <div className="card-item">
              ✓ Document Analysis
            </div>

            <div className="card-item">
              ✓ Important Clauses
            </div>

            <div className="card-item">
              ✓ Key Dates & Obligations
            </div>

          </div>

        </section>


        {/* Legal Document Generator */}
        <section
          id="generator"
          className="generator-section"
        >

          <div className="generator-container">

            <div className="generator-header">

              <p className="tagline">
                GENERATIVE AI LEGAL DOCUMENTS
              </p>

              <h2>
                Generate Your Legal Document
              </h2>

              <p>
                Enter the required details and let LegalEase
                create a professionally structured legal
                document using AI.
              </p>

            </div>


            <div className="generator-form">

              <label>
                Document Type
              </label>

              <select
                value={documentType}
                onChange={(e) =>
                  setDocumentType(e.target.value)
                }
              >
                <option>
                  Employment Contract
                </option>

                <option>
                  Non-Disclosure Agreement (NDA)
                </option>

                <option>
                  Lease Agreement
                </option>

                <option>
                  Service Agreement
                </option>

                <option>
                  Custom Legal Document
                </option>
              </select>


              <label>
                Parties Involved
              </label>

              <textarea
                placeholder="Example: ABC Technologies Pvt. Ltd. and John Doe"
                value={parties}
                onChange={(e) =>
                  setParties(e.target.value)
                }
              />


              <label>
                Terms & Conditions
              </label>

              <textarea
                placeholder="Enter salary, responsibilities, duration, payment terms, obligations, notice period, etc."
                value={terms}
                onChange={(e) =>
                  setTerms(e.target.value)
                }
              />


              <label>
                Effective Date
              </label>

              <input
                type="date"
                value={effectiveDate}
                onChange={(e) =>
                  setEffectiveDate(e.target.value)
                }
              />


              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating
                  ? "🤖 Generating..."
                  : "✨ Generate Legal Document"}
              </button>

            </div>

          </div>

        </section>


        {/* Generated Document Preview */}
        {generatedDocument && (
  <section className="generated-section">

    <h2>
      📄 Generated Legal Document
    </h2>

    <div className="generated-card">

      <textarea
        className="document-editor"
        value={generatedDocument}
        onChange={(e) =>
          setGeneratedDocument(e.target.value)
        }
      />

            <div className="download-buttons">

        {/* Download TXT */}
        <button
          className="download-btn"
          onClick={async () => {
            try {
              const response = await axios.post(
                "http://127.0.0.1:8000/download-txt",
                {
                  document: generatedDocument
                },
                {
                  responseType: "blob"
                }
              );

              const blob = new Blob([response.data], {
                type: "text/plain"
              });

              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");

              link.href = url;
              link.download = "legal_document.txt";

              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              window.URL.revokeObjectURL(url);
            } catch (error) {
              console.error("TXT download error:", error);
              alert("Failed to download the TXT file.");
            }
          }}
        >
          📥 Download TXT
        </button>

        {/* Download PDF */}
        <button
          className="download-btn"
          onClick={async () => {
            try {
              const response = await axios.post(
                "http://127.0.0.1:8000/download-pdf",
                {
                  document: generatedDocument
                },
                {
                  responseType: "blob"
                }
              );

              const blob = new Blob([response.data], {
                type: "application/pdf"
              });

              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");

              link.href = url;
              link.download = "legal_document.pdf";

              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              window.URL.revokeObjectURL(url);
            } catch (error) {
              console.error("PDF download error:", error);
              alert("Failed to download the PDF file.");
            }
          }}
        >
          📄 Download PDF
        </button>

        {/* Download DOCX */}
        <button
          className="download-btn"
          onClick={async () => {
            try {
              const response = await axios.post(
                "http://127.0.0.1:8000/download-docx",
                {
                  document: generatedDocument
                },
                {
                  responseType: "blob"
                }
              );

              const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              });

              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");

              link.href = url;
              link.download = "legal_document.docx";

              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              window.URL.revokeObjectURL(url);

              alert("DOCX downloaded successfully!");
            } catch (error) {
              console.error("DOCX download error:", error);
              alert("Failed to download the DOCX file.");
            }
          }}
        >
          📝 Download DOCX
        </button>

      </div>

    </div>

  </section>
)}

        {/* AI Summary */}
        {summary && (
          <section className="summary-section">

            <h2>
              🤖 AI Legal Summary
            </h2>

            <div className="summary-card">

              <pre>
                {summary}
              </pre>

            </div>

          </section>
        )}


        {/* Features */}
        <section
          id="features"
          className="features"
        >

          <h2>
            What LegalEase Can Do
          </h2>

          <div className="feature-grid">

            <div className="feature-card">

              <div>
                📄
              </div>

              <h3>
                Document Analysis
              </h3>

              <p>
                Upload PDF or DOCX legal documents
                for AI-powered analysis.
              </p>

            </div>


            <div className="feature-card">

              <div>
                🤖
              </div>

              <h3>
                AI Summary
              </h3>

              <p>
                Get complicated legal information
                explained in simple language.
              </p>

            </div>


            <div className="feature-card">

              <div>
                ✨
              </div>

              <h3>
                Legal Document Generation
              </h3>

              <p>
                Generate structured legal documents
                based on your requirements.
              </p>

            </div>

          </div>

        </section>


        {/* About */}
        <section
          id="about"
          className="about"
        >

          <h2>
            About LegalEase
          </h2>

          <p>
            LegalEase is an AI-powered legal information
            assistant designed to make legal documents
            easier to understand and generate.
          </p>

          <p className="disclaimer">
            LegalEase provides informational assistance
            and is not a substitute for professional
            legal advice.
          </p>

        </section>

      </main>


      {/* Footer */}
      <footer>

        <p>
          © 2026 LegalEase • AI Legal Information Assistant
        </p>

      </footer>

    </div>
  );
}

export default App;
