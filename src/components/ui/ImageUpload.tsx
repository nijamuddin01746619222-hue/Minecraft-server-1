import React from "react";
import { useState, useRef } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ImageUpload({ value, onChange, placeholder = "Image URL (e.g. https://...)", className = "" }: ImageUploadProps) {
  const { settings } = useSettingsStore();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!settings.imgbbApiKey) {
      toast.error('Image upload API key is not configured.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${settings.imgbbApiKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        onChange(data.data.url);
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error(data.error?.message || 'Failed to upload image');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Error uploading image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1 flex items-center">
        <LinkIcon className="absolute left-3 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder={placeholder}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white border-2 border-black rounded-lg py-3 pl-10 pr-4 text-black font-bold outline-none disabled:opacity-50"
          disabled={uploading}
        />
      </div>
      
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-black border-2 border-black rounded-lg px-4 py-3 font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
        title="Upload Image"
      >
        {uploading ? (
           <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
        ) : (
          <Upload className="w-5 h-5" />
        )}
        <span className="hidden sm:inline">{uploading ? 'Uploading...' : 'Upload'}</span>
      </button>
      
      {value && (
        <a href={value} target="_blank" rel="noreferrer" className="flex-shrink-0 bg-primary hover:bg-primary/80 text-black border-2 border-black rounded-lg p-3 transition-colors" title="View Image">
          <ImageIcon className="w-5 h-5" />
        </a>
      )}
    </div>
  );
}
