'use client';
import React, { useState } from 'react';
import { 
  Twitter, Facebook, MessageCircle, Send, 
  Instagram, Link as LinkIcon, Check, Share2 
} from 'lucide-react';
// @ts-ignore
import { track } from '@vercel/analytics';

interface SocialShareProps {
  title: string;
  url?: string;
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    track('share_copy_link', { title });
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    {
      name: 'X',
      icon: <Twitter size={18} />,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-slate-900 hover:text-white',
      analytics: 'share_x'
    },
    {
      name: 'Facebook',
      icon: <Facebook size={18} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-600 hover:text-white',
      analytics: 'share_facebook'
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={18} />,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:bg-emerald-500 hover:text-white',
      analytics: 'share_whatsapp'
    },
    {
      name: 'Telegram',
      icon: <Send size={18} />,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-sky-500 hover:text-white',
      analytics: 'share_telegram'
    },
    {
      name: 'Instagram',
      icon: <Instagram size={18} />,
      href: '#',
      onClick: copyToClipboard,
      color: 'hover:bg-gradient-to-tr hover:from-orange-500 hover:to-purple-600 hover:text-white',
      analytics: 'share_instagram_copy'
    }
  ];

  const handleShare = (p: any) => {
    track(p.analytics, { title });
    if (p.onClick) {
      p.onClick();
    } else {
      window.open(p.href, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
        <Share2 size={12} /> Distribution_Node
      </div>
      <div className="flex flex-wrap gap-3">
        {platforms.map((p) => (
          <button
            key={p.name}
            onClick={() => handleShare(p)}
            title={`Share to ${p.name}`}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${p.color}`}
          >
            {p.icon}
          </button>
        ))}
        
        <button
          onClick={copyToClipboard}
          className={`px-6 h-12 flex items-center gap-3 rounded-2xl border transition-all duration-300 ${
            copied 
            ? 'bg-emerald-500 border-emerald-500 text-white' 
            : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
          }`}
        >
          {copied ? <Check size={18} /> : <LinkIcon size={18} />}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {copied ? 'Copied_Link' : 'Copy_Reference'}
          </span>
        </button>
      </div>
    </div>
  );
}