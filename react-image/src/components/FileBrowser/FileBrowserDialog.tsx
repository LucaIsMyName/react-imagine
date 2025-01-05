// src/components/FileBrowser/FileBrowserDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Folder, Image, AlertCircle, FolderOpen } from 'lucide-react';
import { useEditor } from '@/contexts/EditorContext';

const FileBrowserDialog: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { dispatch } = useEditor();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [files, setFiles] = useState<FileSystemHandle[]>([]);

  const requestPermission = async () => {
    try {
      // Request permission to access files
      const dirHandle = await window.showDirectoryPicker({
        mode: 'read'
      });
      
      setHasPermission(true);
      await loadDirectory(dirHandle);
    } catch (error) {
      setHasPermission(false);
    }
  };

  const loadDirectory = async (dirHandle: FileSystemDirectoryHandle) => {
    const entries = [];
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'directory' || 
          (entry.kind === 'file' && entry.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))) {
        entries.push(entry);
      }
    }
    setFiles(entries);
    setCurrentPath(dirHandle.name);
  };

  const handleFileSelect = async (fileHandle: FileSystemFileHandle) => {
    try {
      const file = await fileHandle.getFile();
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch({ type: 'SET_IMAGE', payload: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Browse Images</DialogTitle>
        </DialogHeader>
        
        <div className="min-h-[300px] space-y-4">
          {hasPermission === null && (
            <div className="text-center space-y-4 py-8">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                To browse your images, we need permission to access your files.
              </p>
              <Button onClick={requestPermission}>
                Grant Permission
              </Button>
            </div>
          )}

          {hasPermission === false && (
            <div className="text-center space-y-4 py-8">
              <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
              <p className="text-sm text-muted-foreground">
                Permission denied. Please try again.
              </p>
              <Button onClick={requestPermission}>
                Try Again
              </Button>
            </div>
          )}

          {hasPermission === true && (
            <>
              <div className="p-2 bg-muted rounded text-sm">
                <FolderOpen className="w-4 h-4 inline-block mr-2" />
                {currentPath || 'Root'}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {files.map((handle, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (handle.kind === 'directory') {
                        loadDirectory(handle as FileSystemDirectoryHandle);
                      } else {
                        handleFileSelect(handle as FileSystemFileHandle);
                      }
                    }}
                    className="p-4 border rounded-lg hover:bg-accent text-left space-y-2"
                  >
                    {handle.kind === 'directory' ? (
                      <Folder className="w-8 h-8" />
                    ) : (
                      <Image className="w-8 h-8" />
                    )}
                    <p className="text-sm truncate">{handle.name}</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileBrowserDialog;