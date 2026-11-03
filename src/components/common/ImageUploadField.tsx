import React, { useRef } from 'react';
import { UploadCloud, Image, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';
import { getSportVisual } from '../../utils/sportsIcons';

interface ImageUploadFieldProps {
  label?: string;
  value?: string;
  onChange: (dataUrl: string) => void;
  sport?: string;
  category?: string;
  helperText?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label = 'Reference Image',
  value = '',
  onChange,
  sport = '',
  category = '',
  helperText = 'Upload a photo from your gallery/device (optional). If left empty, an official sport icon & emoji will be assigned.'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const visual = getSportVisual(sport, category);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Selected image exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">{label}</label>
        {value && (
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Image attached
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        /* Image Preview Box with Controls */
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
          <img
            src={value}
            alt="Reference preview"
            className="w-full h-36 object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-100 flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Change Photo</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-500 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty State with Upload Trigger + Sport Fallback Preview */
        <div className="p-3.5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${visual.gradient} text-white flex items-center justify-center text-2xl shadow-xs shrink-0 select-none`}>
              {visual.emoji}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Default: {visual.category} Icon ({visual.emoji})</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                No custom photo attached. Sport emoji will be displayed.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 hover:text-emerald-700 hover:border-emerald-300 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <Image className="w-4 h-4 text-emerald-600" />
            <span>Add from Gallery</span>
          </button>
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-slate-400 leading-normal">{helperText}</p>
      )}
    </div>
  );
};
