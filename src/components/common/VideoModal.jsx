import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineExpand, AiOutlineShrink, AiOutlineCloseCircle } from 'react-icons/ai';

// Plays a module video inline, in-app, with standard playback controls
// (play/pause, seek, volume) plus an explicit maximize/fullscreen toggle.
const VideoModal = ({ isOpen, onClose, title, src }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose?.();
      }
    };
    if (isOpen) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    // Reset playback whenever a new video is opened, and stop it on close
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen, src]);

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!document.fullscreenElement) {
      el?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
    onClose?.();
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4'
      onClick={handleClose}
    >
      <div
        ref={containerRef}
        className='relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between px-4 py-2 bg-base-200'>
          <h3 className='font-poppins font-semibold text-sm md:text-base truncate pr-2'>
            {title}
          </h3>
          <div className='flex items-center gap-3 shrink-0'>
            <button
              onClick={toggleFullscreen}
              className='text-xl hover:text-primary'
              aria-label={isFullscreen ? 'Exit maximized view' : 'Maximize video'}
              title={isFullscreen ? 'Exit maximized view' : 'Maximize video'}
              type='button'
            >
              {isFullscreen ? <AiOutlineShrink /> : <AiOutlineExpand />}
            </button>
            <button
              onClick={handleClose}
              className='text-xl hover:text-error'
              aria-label='Close video'
              title='Close video'
              type='button'
            >
              <AiOutlineCloseCircle />
            </button>
          </div>
        </div>
        <video
          ref={videoRef}
          src={src}
          controls
          controlsList='nodownload'
          playsInline
          className='w-full max-h-[75vh] bg-black'
        >
          Your browser does not support embedded video playback.
        </video>
      </div>
    </div>
  );
};

export default VideoModal;
