
import React from 'react';
import { MetaMedia } from '../types';

interface MediaSelectorProps {
  mediaList: MetaMedia[];
  onSelect: (media: MetaMedia) => void;
  onCancel: () => void;
}

const MediaSelector: React.FC<MediaSelectorProps> = ({ mediaList, onSelect, onCancel }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Escolha o Post/Reel</h3>
        <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {mediaList.map((media) => (
          <div 
            key={media.id}
            onClick={() => onSelect(media)}
            className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-indigo-500 transition-all"
          >
            <img src={media.media_url} alt={media.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <p className="text-[10px] text-white line-clamp-2 leading-tight">{media.caption}</p>
            </div>
            {media.media_type === 'VIDEO' && (
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md p-1.5 rounded-lg text-white text-[10px]">
                    <i className="fa-solid fa-play"></i>
                </div>
            )}
          </div>
        ))}
      </div>
      
      <p className="text-center text-slate-500 text-[10px] uppercase font-bold tracking-widest">
        Exibindo as 10 mídias mais recentes
      </p>
    </div>
  );
};

export default MediaSelector;
