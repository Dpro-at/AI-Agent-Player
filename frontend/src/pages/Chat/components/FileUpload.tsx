import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChatIcons } from './Icons';

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  thumbnail?: string;
  compressed?: File;
  status: 'pending' | 'uploading' | 'uploaded' | 'error' | 'processing';
  progress: number;
  error?: string;
  uploadedUrl?: string;
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  onFileUpload?: (file: UploadedFile) => Promise<string>;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  enableImageCompression?: boolean;
  enableDragDrop?: boolean;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  onFileUpload,
  maxFiles = 10,
  maxFileSize = 100, // 100MB default
  acceptedTypes = [
    'image/*',
    'video/*',
    'audio/*',
    'application/pdf',
    'text/*',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed'
  ],
  enableImageCompression = true,
  enableDragDrop = true,
  className = ''
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Update parent when files change
  useEffect(() => {
    onFilesChange(files);
  }, [files, onFilesChange]);

  // File type validation
  const isFileTypeAccepted = (file: File): boolean => {
    return acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return file.type.startsWith(category + '/');
      }
      return file.type === type;
    });
  };

  // File size validation
  const isFileSizeValid = (file: File): boolean => {
    return file.size <= maxFileSize * 1024 * 1024;
  };

  // Generate file ID
  const generateFileId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Create file preview for images
  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(undefined);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    });
  };

  // Compress image file
  const compressImage = (file: File, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920x1080 for efficiency)
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  };

  // Process uploaded files
  const processFiles = async (fileList: FileList | File[]) => {
    const filesToProcess = Array.from(fileList);
    
    // Check file count limit
    if (files.length + filesToProcess.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles: UploadedFile[] = [];

    for (const file of filesToProcess) {
      // Validate file type
      if (!isFileTypeAccepted(file)) {
        alert(`File type ${file.type} is not supported`);
        continue;
      }

      // Validate file size
      if (!isFileSizeValid(file)) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB`);
        continue;
      }

      // Create uploaded file object
      const uploadedFile: UploadedFile = {
        id: generateFileId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'pending',
        progress: 0
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        uploadedFile.preview = await createFilePreview(file);
        
        // Compress image if enabled
        if (enableImageCompression) {
          uploadedFile.status = 'processing';
          try {
            uploadedFile.compressed = await compressImage(file);
          } catch (error) {
            console.error('Image compression failed:', error);
          }
          uploadedFile.status = 'pending';
        }
      }

      newFiles.push(uploadedFile);
    }

    setFiles(prev => [...prev, ...newFiles]);

    // Auto-upload if upload handler is provided
    if (onFileUpload) {
      for (const file of newFiles) {
        uploadFile(file);
      }
    }
  };

  // Upload individual file
  const uploadFile = async (uploadedFile: UploadedFile) => {
    if (!onFileUpload) return;

    setFiles(prev => prev.map(f => 
      f.id === uploadedFile.id 
        ? { ...f, status: 'uploading', progress: 0 }
        : f
    ));

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === uploadedFile.id && f.status === 'uploading') {
            const newProgress = Math.min(f.progress + 10, 90);
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 200);

      // Upload file (use compressed version if available)
      const fileToUpload = uploadedFile.compressed || uploadedFile.file;
      const uploadedUrl = await onFileUpload(uploadedFile);

      clearInterval(progressInterval);

      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { 
              ...f, 
              status: 'uploaded', 
              progress: 100, 
              uploadedUrl 
            }
          : f
      ));
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { 
              ...f, 
              status: 'error', 
              error: error instanceof Error ? error.message : 'Upload failed' 
            }
          : f
      ));
    }
  };

  // Remove file
  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  // Retry upload
  const retryUpload = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      uploadFile(file);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Reset input value to allow selecting same file again
    e.target.value = '';
  };

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon
  const getFileIcon = (type: string): string => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('zip')) return '📦';
    if (type.startsWith('text/')) return '📃';
    return '📎';
  };

  // Get status icon
  const getStatusIcon = (status: UploadedFile['status']): React.ReactNode => {
    switch (status) {
      case 'pending':
        return <ChatIcons.Clock />;
      case 'uploading':
      case 'processing':
        return <div className="spinner-small"></div>;
      case 'uploaded':
        return <span className="status-success">✓</span>;
      case 'error':
        return <span className="status-error">✗</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`file-upload ${className}`}>
      {/* Upload Area */}
      {enableDragDrop ? (
        <div
          className={`upload-area ${isDragging ? 'dragging' : ''} ${files.length > 0 ? 'has-files' : ''}`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-content">
            <div className="upload-icon">
              <ChatIcons.Upload />
            </div>
            <div className="upload-text">
              <p className="upload-primary">
                {isDragging ? 'Drop files here' : 'Drag & drop files here or click to browse'}
              </p>
              <p className="upload-secondary">
                Supports: Images, Videos, Audio, Documents (max {maxFileSize}MB each)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <button
          className="upload-button"
          onClick={() => fileInputRef.current?.click()}
        >
          <ChatIcons.Paperclip />
          Attach Files
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {/* Files List */}
      {files.length > 0 && (
        <div className="files-list">
          <div className="files-header">
            <h4>Attached Files ({files.length}/{maxFiles})</h4>
            {files.length > 0 && (
              <button
                className="clear-all-button"
                onClick={() => {
                  files.forEach(f => f.preview && URL.revokeObjectURL(f.preview));
                  setFiles([]);
                }}
              >
                Clear All
              </button>
            )}
          </div>

          <div className="files-grid">
            {files.map((file) => (
              <div key={file.id} className={`file-item ${file.status}`}>
                {/* File Preview */}
                <div className="file-preview">
                  {file.preview ? (
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="file-thumbnail"
                    />
                  ) : (
                    <div className="file-icon-large">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  
                  {/* Status Overlay */}
                  <div className="file-status-overlay">
                    {getStatusIcon(file.status)}
                  </div>
                </div>

                {/* File Info */}
                <div className="file-info">
                  <div className="file-name" title={file.name}>
                    {file.name}
                  </div>
                  <div className="file-details">
                    <span className="file-size">{formatFileSize(file.size)}</span>
                    {file.compressed && (
                      <span className="compression-info">
                        → {formatFileSize(file.compressed.size)} (compressed)
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {(file.status === 'uploading' || file.status === 'processing') && (
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                      <span className="progress-text">{file.progress}%</span>
                    </div>
                  )}

                  {/* Error Message */}
                  {file.status === 'error' && file.error && (
                    <div className="error-message">{file.error}</div>
                  )}
                </div>

                {/* File Actions */}
                <div className="file-actions">
                  {file.status === 'error' && onFileUpload && (
                    <button
                      className="retry-button"
                      onClick={() => retryUpload(file.id)}
                      title="Retry upload"
                    >
                      🔄
                    </button>
                  )}
                  <button
                    className="remove-button"
                    onClick={() => removeFile(file.id)}
                    title="Remove file"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Statistics */}
      {files.length > 0 && (
        <div className="upload-stats">
          <div className="stats-item">
            <span className="stats-label">Total Files:</span>
            <span className="stats-value">{files.length}</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">Total Size:</span>
            <span className="stats-value">
              {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
            </span>
          </div>
          <div className="stats-item">
            <span className="stats-label">Uploaded:</span>
            <span className="stats-value">
              {files.filter(f => f.status === 'uploaded').length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 