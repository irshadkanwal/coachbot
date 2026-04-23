import React, { useRef, ChangeEvent } from "react";
import { uploadUserAvatar } from '@/server/actions/userActions';

type PhotoUploaderProps = {
  content?: string;
  onUploadSuccess?: () => void;
};

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ content, onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const base64 = await convertFileToBase64(file);
      await uploadUserAvatar(base64, file.type);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
    }
  };

  const convertFileToBase64 = async (file: File): Promise<string> => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <span>
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*" // Додаємо для обмеження типу файлів
        onChange={handleFileChange}
      />
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          fileInputRef.current?.click();
        }}
        className="text-blue-500 underline cursor-pointer"
      >
        {content} Coming soon...
      </a>
    </span>
  );
};

export default PhotoUploader;
