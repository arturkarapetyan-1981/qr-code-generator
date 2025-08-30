"use client"
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { toast, Toaster } from 'react-hot-toast';
import { FiDownload, FiTrash2, FiLink, FiCopy, FiSun, FiMoon, FiShare2 } from 'react-icons/fi';

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [size, setSize] = useState(256);
  const [darkMode, setDarkMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const generateQRCode = async () => {
    if (!text.trim()) {
      toast.error('Please enter text or URL');
      return;
    }

    setIsGenerating(true);
    try {
      const qrDataUrl = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: {
          dark: darkMode ? '#3b82f6' : '#1f2937',
          light: darkMode ? '#1f2937' : '#f9fafb'
        }
      });
      setQrCode(qrDataUrl);
      toast.success('QR code generated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qrcode-${text.substring(0, 10)}.png`.replace(/[^a-zA-Z0-9]/g, '-');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded!');
  };

  const clearAll = () => {
    setText('');
    setQrCode('');
    toast.success('Cleared');
  };

  const copyToClipboard = () => {
    if (!text) return;
    
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Failed to copy'));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(`${!darkMode ? 'Dark' : 'Light'} mode enabled`);
  };

  const shareQRCode = async () => {
    if (!qrCode) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(qrCode);
      const blob = await response.blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'QR Code',
          text: 'Check out this QR code I generated!',
          files: [file],
        });
        toast.success('QR code shared successfully!');
      } else {
        // Fallback for browsers that don't support Web Share API
        copyToClipboard();
        toast('URL copied to clipboard for sharing');
      }
    } catch (err) {
      // Don't show error if user canceled the share
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
        toast.error('Sharing failed or is not supported');
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800'}`}>
      <header>
        <title>QR Code Generator</title>
        <meta name="description" content="Generate beautiful QR codes for free" />
        <link rel="icon" href="/favicon.ico" />
      </header>

      <Toaster position="top-center" toastOptions={{
        className: darkMode ? 'bg-gray-800 text-white' : '',
        duration: 3000,
      }} />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">QR Code Generator</h1>
            <p className="text-lg opacity-80">Create beautiful QR codes for URLs, text, and more</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full transition-all hover:scale-110 ${darkMode ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 shadow-md'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>

        {/* Input Card */}
        <div className={`rounded-2xl shadow-xl p-6 mb-8 transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="space-y-6">
            <div>
              <label htmlFor="text" className="block text-sm font-medium mb-2 flex items-center">
                <FiLink className="mr-2" /> Enter URL or Text
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="https://example.com or any text"
                  className={`w-full px-4 py-3 pr-20 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
                  onKeyPress={(e) => e.key === 'Enter' && generateQRCode()}
                />
                {text && (
                  <button
                    onClick={clearAll}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-red-500 transition-colors"
                    aria-label="Clear input"
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="size" className="block text-sm font-medium mb-2">
                QR Code Size: {size}px
              </label>
              <input
                type="range"
                id="size"
                min="128"
                max="512"
                step="32"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Small</span>
                <span>Medium</span>
                <span>Large</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={generateQRCode}
                disabled={isGenerating}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center
                  ${isGenerating 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : 'Generate QR Code'}
              </button>
              
              {text && (
                <button
                  onClick={copyToClipboard}
                  className={`py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  title="Copy to clipboard"
                >
                  <FiCopy size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Display */}
        {qrCode && (
          <div className={`rounded-2xl shadow-xl p-6 transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                Your QR Code
              </h2>
              
              <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <img 
                  src={qrCode} 
                  alt="Generated QR Code" 
                  className="mx-auto"
                  width={size}
                  height={size}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button
                  onClick={downloadQRCode}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition flex items-center justify-center"
                >
                  <FiDownload className="mr-2" />
                  Download
                </button>
                
                <button
                  onClick={shareQRCode}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center"
                >
                  <FiShare2 className="mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className={`rounded-2xl shadow-xl p-6 mt-8 transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            How to Use
          </h3>
          <ul className="list-disc list-inside space-y-2 opacity-80">
            <li>Enter any URL or text in the input field</li>
            <li>Adjust the size slider to change QR code dimensions</li>
            <li>Click "Generate QR Code" to create your QR code</li>
            <li>Download or share your QR code as needed</li>
          </ul>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center opacity-70 text-sm">
          <p>Created by A & K</p>
        </footer>
      </div>
    </div>
  );
}