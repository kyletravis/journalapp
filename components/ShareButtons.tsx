'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  content: string;
}

export default function ShareButtons({ title, content }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    const textToCopy = `${title}\n\n${content}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`Check out my journal entry: "${title}"`);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, 'twitter-share', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, 'facebook-share', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, 'linkedin-share', 'width=550,height=420');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out my journal entry: ${title}`);
    const body = encodeURIComponent(`${title}\n\n${content}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-gray-600">Share:</span>

      {/* Twitter */}
      <button
        onClick={handleTwitterShare}
        title="Share on Twitter"
        className="p-2 rounded-lg hover:bg-blue-100 text-blue-500 hover:text-blue-700 transition-colors"
        aria-label="Share on Twitter"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 01.77 16.107a11.59 11.59 0 006.29 1.84" />
        </svg>
      </button>

      {/* Facebook */}
      <button
        onClick={handleFacebookShare}
        title="Share on Facebook"
        className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-colors"
        aria-label="Share on Facebook"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M20 10a10 10 0 1 0-11.56 9.88v-7h-2.5v-2.88h2.5V8.37c0-2.49 1.48-3.87 3.75-3.87 1.09 0 2.22.19 2.22.19v2.44h-1.25c-1.23 0-1.6.77-1.6 1.55v1.87h2.73l-.44 2.88h-2.3v7C17.16 19.29 20 15.04 20 10z" />
        </svg>
      </button>

      {/* LinkedIn */}
      <button
        onClick={handleLinkedInShare}
        title="Share on LinkedIn"
        className="p-2 rounded-lg hover:bg-blue-100 text-blue-700 hover:text-blue-900 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.5 0h-15C1.1 0 0 1.1 0 2.5v15C0 18.9 1.1 20 2.5 20h15c1.4 0 2.5-1.1 2.5-2.5v-15C20 1.1 18.9 0 17.5 0zm-12 17h-3v-10h3v10zm-1.5-11.3c-1 0-1.7-.7-1.7-1.7s.7-1.7 1.7-1.7 1.7.7 1.7 1.7-.8 1.7-1.7 1.7zm13.5 11.3h-3v-5c0-1.3-.5-2.1-1.5-2.1-1 0-1.6.7-1.9 1.3-.1.2-.1.5-.1.7v5.1h-3v-10h3v1.4c.4-.6 1.2-1.5 2.9-1.5 2.1 0 3.7 1.4 3.7 4.4v5.7z" />
        </svg>
      </button>

      {/* Email */}
      <button
        onClick={handleEmailShare}
        title="Share via Email"
        className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
        aria-label="Share via Email"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </button>

      {/* Copy to Clipboard */}
      <button
        onClick={handleCopyToClipboard}
        title="Copy to Clipboard"
        className={`p-2 rounded-lg transition-colors ${
          copied
            ? 'bg-green-100 text-green-700'
            : 'hover:bg-gray-200 text-gray-600 hover:text-gray-800'
        }`}
        aria-label="Copy to Clipboard"
      >
        {copied ? (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
