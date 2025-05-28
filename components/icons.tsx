
import React from 'react';

export const LocationPinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.145l.002-.001L10 18.43l.001.002.002.001.006.003.018.008a5.741 5.741 0 00.281-.145l.002-.001c.202-.1.445-.3.713-.563l.028-.028A7.5 7.5 0 0010 2.25C5.858 2.25 2.5 5.858 2.5 10c0 2.24.986 4.264 2.566 5.646l.028.028c.268.263.512.463.713.563l.002.001.006.003.018.008a5.741 5.741 0 00.281-.145l.002-.001.006-.003.018-.008A5.74 5.74 0 009 18.34l.001.002.002.001.006.003.018.008a5.741 5.741 0 00.281-.145l.002-.001L9.69 18.933zM10 8a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5z" />
  </svg>
);

export const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M2.695 4.222a2.25 2.25 0 012.016-.222L5 4.221V2.75A.75.75 0 015.75 2h8.5A.75.75 0 0115 2.75v1.471l.289-.222a2.25 2.25 0 012.016.222l1.105.689A2.25 2.25 0 0119.5 6.833V16.5a1.5 1.5 0 01-1.5 1.5H2a1.5 1.5 0 01-1.5-1.5V6.833c0-.71.345-1.364.93-1.77l1.105-.69zM5 6.55l-1.305-.81a.75.75 0 00-.66-.074L2.5 5.936V16.5h15V5.936l-.535-.267a.75.75 0 00-.66.073L15 6.55V14.5a1 1 0 01-1 1H6a1 1 0 01-1-1V6.55zM10 10.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5zM6.75 8a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" />
  </svg>
);

export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-3.75h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008Zm0-4.5h.008v.008H9.75v-.008Zm4.5 0h.008v.008H14.25v-.008Zm0 2.25h.008v.008H14.25v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5v-.008Z" />
  </svg>
);

export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const PlusCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.242.078 3.324.214m9.236-2.436a48.948 48.948 0 0 1-7.755 0m-4.754 0a48.948 48.948 0 0 1-7.755 0m7.755 0c-3.181 0-6.238-.583-9.131-1.599m16.662 0c-2.893 1.016-5.95 1.599-9.131 1.599" />
  </svg>
);
