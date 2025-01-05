// src/components/URLInput/URLInputDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'lucide-react';
import { useEditor } from '@/contexts/EditorContext';

const URLInputDialog: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { dispatch } = useEditor();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      if (!blob.type.startsWith('image/')) {
        throw new Error('URL does not point to a valid image');
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch({ type: 'SET_IMAGE', payload: e.target?.result as string });
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      setError('Failed to load image from URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Load Image from URL</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter image URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
              required
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Loading...' : 'Load Image'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default URLInputDialog;