// import React, { useState } from 'react';

// export const SyllabusUpload: React.FC = () => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploadStatus, setUploadStatus] = useState<string | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0] || null;
//     if (file) {
//       const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
//       if (!allowedTypes.includes(file.type)) {
//         setUploadStatus('Invalid file type. Please upload a PDF or DOCX file.');
//         setSelectedFile(null);
//         return;
//       }

//       setSelectedFile(file);
//       setUploadStatus(null);
//     }
//   };

//   const handleUpload = () => {
//     if (!selectedFile) {
//       setUploadStatus('No file selected. Please choose a syllabus file to upload.');
//       return;
//     }

//     // Simulating file upload process
//     setTimeout(() => {
//       setUploadStatus(`File "${selectedFile.name}" uploaded successfully!`);
//     }, 1000);
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl text-white">
//       <h2 className="text-2xl font-bold mb-6">Upload Syllabus</h2>
      
//       <input 
//         type="file" 
//         accept=".pdf,.doc,.docx" 
//         onChange={handleFileChange} 
//         className="mb-4 bg-gray-900 text-white p-2 rounded"
//       />
      
//       {selectedFile && (
//         <p className="text-green-400 mt-2">Selected File: {selectedFile.name}</p>
//       )}

//       {uploadStatus && (
//         <p className={`mt-2 ${uploadStatus.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
//           {uploadStatus}
//         </p>
//       )}

//       <button 
//         onClick={handleUpload} 
//         className="mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
//       >
//         Upload
//       </button>
//     </div>
//   );
// };
