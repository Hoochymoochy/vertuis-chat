import { useState, useCallback } from "react";

type UseFileDropOptions = {
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in MB
  onFileDropped?: (file: File) => void;
  onError?: (message: string) => void;
};

export default function useFileDrop({
  acceptedFileTypes = ['.pdf', '.docx', '.txt'],
  maxFileSize = 10,
  onFileDropped,
  onError,
}: UseFileDropOptions = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragging(false);
      }
      return newCounter;
    });
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension)) {
      return `Please upload a file with one of these extensions: ${acceptedFileTypes.join(', ')}`;
    }

    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    return null;
  }, [acceptedFileTypes, maxFileSize]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      if (onError) {
        onError(error);
      } else {
        alert(error);
      }
      return;
    }

    setDroppedFile(file);
    if (onFileDropped) {
      onFileDropped(file);
    }
  }, [validateFile, onFileDropped, onError]);

  const clearDroppedFile = useCallback(() => {
    setDroppedFile(null);
  }, []);

  const resetDragState = useCallback(() => {
    setIsDragging(false);
    setDragCounter(0);
  }, []);

  return {
    isDragging,
    droppedFile,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
    clearDroppedFile,
    resetDragState,
  };
}