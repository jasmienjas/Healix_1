import React, { useState } from 'react';

function Files() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [medicalTranscript, setMedicalTranscript] = useState(null);
  const [fileInput, setFileInput] = useState(null);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFiles([...uploadedFiles, file]);
    }
  };

  // Handle medical transcript upload (can be a PDF or document given by the doctor)
  const handleTranscriptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedicalTranscript(file);
    }
  };

  // Function to download a file
  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    link.click();
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold mb-6">Your Files</h1>

      <div className="file-upload-section mb-8">
        <h2 className="text-2xl font-semibold">Upload Your Documents</h2>
        <input
          type="file"
          className="border border-gray-300 p-2 mt-4"
          onChange={handleFileUpload}
        />
        <input
          type="file"
          className="border border-gray-300 p-2 mt-4"
          onChange={handleTranscriptUpload}
        />
      </div>

      <div className="uploaded-files-section mb-8">
        <h2 className="text-2xl font-semibold">Uploaded Documents</h2>
        <div className="mt-4">
          {uploadedFiles.length === 0 ? (
            <p>No files uploaded yet.</p>
          ) : (
            uploadedFiles.map((file, index) => (
              <div key={index} className="file-card p-4 border-b-2 mb-4">
                <p className="text-lg">{file.name}</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                  onClick={() => downloadFile(file)}
                >
                  Download
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="medical-transcript-section mb-8">
        <h2 className="text-2xl font-semibold">Medical Transcript</h2>
        {medicalTranscript ? (
          <div className="mt-4">
            <p className="text-lg">{medicalTranscript.name}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              onClick={() => downloadFile(medicalTranscript)}
            >
              Download Transcript
            </button>
          </div>
        ) : (
          <p>No medical transcript uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default Files;
