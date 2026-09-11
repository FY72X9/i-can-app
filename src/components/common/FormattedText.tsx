import React from 'react';
import { ExternalLink, MessageCircle } from 'lucide-react';

interface FormattedTextProps {
  content: string;
  className?: string;
}

/**
 * Helper to parse a single line with inline formatting:
 * - Bold: **text**
 * - URLs: https://..., http://..., bit.ly/...
 * - Contact / WhatsApp: 08xx / wa.me/...
 */
const renderInlineFormatted = (text: string): React.ReactNode[] => {
  // Regex to match URLs (https://, http://, bit.ly/), WhatsApp numbers (08xxxxxxxxxx), and bold (**...**)
  const pattern = /(\*\*.*?\*\*|https?:\/\/[^\s]+|bit\.ly\/[^\s]+|wa\.me\/[^\s]+|\b08\d{8,12}\b)/g;
  const parts = text.split(pattern);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Bold text **...**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={idx} className="font-black text-slate-800">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // URL: http/https or bit.ly
    if (part.startsWith('http://') || part.startsWith('https://') || part.startsWith('bit.ly/')) {
      const href = part.startsWith('http') ? part : `https://${part}`;
      return (
        <a
          key={idx}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-700 underline underline-offset-2 font-bold px-1 py-0.5 rounded-md hover:bg-blue-50 transition-colors"
        >
          <span>{part}</span>
          <ExternalLink className="w-3 h-3 inline-block shrink-0" />
        </a>
      );
    }

    // wa.me link
    if (part.startsWith('wa.me/')) {
      return (
        <a
          key={idx}
          href={`https://${part}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 underline underline-offset-2 font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 transition-colors"
        >
          <MessageCircle className="w-3 h-3 inline-block shrink-0 text-emerald-600" />
          <span>{part}</span>
        </a>
      );
    }

    // Indonesian phone number format 08xxxx
    if (/^08\d{8,12}$/.test(part)) {
      const waNumber = '62' + part.slice(1);
      return (
        <a
          key={idx}
          href={`https://wa.me/${waNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 underline underline-offset-2 font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 transition-colors"
          title="Klik untuk chat WhatsApp"
        >
          <MessageCircle className="w-3 h-3 inline-block shrink-0 text-emerald-600" />
          <span>{part}</span>
        </a>
      );
    }

    return <span key={idx}>{part}</span>;
  });
};

export const FormattedText: React.FC<FormattedTextProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split content into lines
  const lines = content.split('\n');

  // Group contiguous bullet lines into <ul> blocks
  const blocks: Array<{ type: 'paragraph' | 'bullet_list' | 'heading'; items?: string[]; text?: string }> = [];
  let currentBullets: string[] = [];

  const flushBullets = () => {
    if (currentBullets.length > 0) {
      blocks.push({ type: 'bullet_list', items: [...currentBullets] });
      currentBullets = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check if line is bullet list item (- item or • item or * item)
    if (/^[-*•]\s+/.test(trimmed)) {
      const bulletContent = trimmed.replace(/^[-*•]\s+/, '');
      currentBullets.push(bulletContent);
      continue;
    }

    flushBullets();

    if (trimmed === '') {
      // Empty line -> empty paragraph separator
      blocks.push({ type: 'paragraph', text: '' });
    } else if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
      const headingText = trimmed.replace(/^#{2,3}\s+/, '');
      blocks.push({ type: 'heading', text: headingText });
    } else {
      blocks.push({ type: 'paragraph', text: rawLine });
    }
  }

  flushBullets();

  return (
    <div className={`space-y-2 text-xs sm:text-sm text-text-secondary leading-relaxed ${className}`}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'heading') {
          return (
            <h4 key={bIdx} className="text-xs sm:text-sm font-black text-slate-800 pt-1 pb-0.5">
              {block.text}
            </h4>
          );
        }

        if (block.type === 'bullet_list' && block.items) {
          return (
            <ul key={bIdx} className="space-y-1 my-1 pl-1">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span className="flex-1">{renderInlineFormatted(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Paragraph
        if (!block.text) {
          return <div key={bIdx} className="h-1.5" />;
        }

        return (
          <p key={bIdx} className="min-h-[1rem]">
            {renderInlineFormatted(block.text)}
          </p>
        );
      })}
    </div>
  );
};

