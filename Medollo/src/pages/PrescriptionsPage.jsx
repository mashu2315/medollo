import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CloudArrowUpIcon, DocumentTextIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import PageTransition from '../components/ui/PageTransition';

const PrescriptionsPage = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error

  // Past prescriptions 
  const pastPrescriptions = [
    { 
      id: 1, 
      name: 'General Checkup Prescription',
      doctor: 'Dr. Sharma',
      date: '2025-09-12',
      status: 'delivered',
      items: ['Paracetamol 500mg', 'Vitamin C', 'Multivitamin Tablets']
    },
    { 
      id: 2, 
      name: 'Fever Treatment',
      doctor: 'Dr. Patel',
      date: '2025-08-27',
      status: 'processed',
      items: ['Crocin Advance', 'Cough Syrup', 'ORS Powder']
    },
    { 
      id: 3, 
      name: 'Monthly Medication',
      doctor: 'Dr. Kumar',
      date: '2025-07-15',
      status: 'delivered',
      items: ['Metformin 500mg', 'Atorvastatin 10mg', 'Aspirin 75mg']
    }
  ];

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      handleFiles(newFiles);
      e.dataTransfer.clearData();
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      handleFiles(newFiles);
    }
  };

  const handleFiles = (newFiles) => {
    // Filter for image and PDF files
    const validFiles = newFiles.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    
    setUploadStatus('uploading');
    
    // Simulate upload process
    setTimeout(() => {
      setUploadStatus('success');
      
      // Reset after showing success message
      setTimeout(() => {
        setFiles([]);
        setUploadStatus('idle');
      }, 3000);
    }, 2000);
  };

  return (
    <PageTransition>
      <div className="bg-pink-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-primary">Upload Prescriptions</h1>
          
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Your Prescription</h2>
                <p className="text-gray-600 mb-6">
                  Upload your prescription and we will deliver the medicines to your doorstep.
                  We accept images (.jpg, .png) and PDF files.
                </p>
                
                {/* File Upload Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
                  }`}
                >
                  <CloudArrowUpIcon className="h-12 w-12 mx-auto text-primary mb-4" />
                  <p className="text-lg font-medium mb-2">Drag & Drop your files here</p>
                  <p className="text-gray-500 mb-4">or</p>
                  <label className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
                
                {/* Selected Files */}
                {files.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Selected Files:</h3>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-3" />
                            <span className="text-gray-700 truncate" style={{maxWidth: "200px"}}>
                              {file.name}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpload}
                      disabled={uploadStatus === 'uploading'}
                      className={`w-full mt-4 py-3 rounded-lg font-medium ${
                        uploadStatus === 'uploading' 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Prescription'}
                    </motion.button>
                    
                    {uploadStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center"
                      >
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        <span>Prescription uploaded successfully! Our pharmacist will review it shortly.</span>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">How It Works</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                      <CloudArrowUpIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Upload</h3>
                    <p className="text-gray-600 text-sm">Upload your prescription in image or PDF format</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                      <ClockIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Verification</h3>
                    <p className="text-gray-600 text-sm">Our pharmacists verify your prescription</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                      <CheckCircleIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Delivery</h3>
                    <p className="text-gray-600 text-sm">Medicines delivered to your doorstep</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Past Prescriptions</h2>
                
                <div className="space-y-4">
                  {pastPrescriptions.map(prescription => (
                    <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800">{prescription.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          prescription.status === 'delivered' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {prescription.status === 'delivered' ? 'Delivered' : 'Processing'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Dr: {prescription.doctor} • {prescription.date}</p>
                      
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-500 mb-1">Medicines:</p>
                        <ul className="text-sm text-gray-700">
                          {prescription.items.map((item, index) => (
                            <li key={index} className="flex items-center">
                              <span className="h-1.5 w-1.5 bg-primary rounded-full mr-2"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-4 flex space-x-3">
                        <button className="text-primary text-sm font-medium hover:underline">View Details</button>
                        <button className="text-primary text-sm font-medium hover:underline">Reorder</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-primary/5 mt-6 p-6 rounded-lg border border-primary/20">
                <h3 className="font-medium mb-2 text-primary">Need Assistance?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Our customer support team is available 24/7 to help you with your prescription orders.
                </p>
                <button 
                onClick={()=>navigate('/contact')}
                className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 text-sm">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PrescriptionsPage;