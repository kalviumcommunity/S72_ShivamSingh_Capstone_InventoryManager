import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
}

const ModalPortal: React.FC<ModalPortalProps> = ({ children, isOpen }) => {
  const [mounted, setMounted] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create modal root element if it doesn't exist
    let element = document.getElementById('modal-root');
    if (!element) {
      element = document.createElement('div');
      element.setAttribute('id', 'modal-root');
      document.body.appendChild(element);
    }
    setPortalRoot(element);
    setMounted(true);

    // Cleanup on unmount
    return () => {
      // Optionally remove the element if it was created here and is no longer needed
      // Be careful with this in a multi-modal app; it might be better to leave it.
      // if (element && element.parentElement) {
      //   element.parentElement.removeChild(element);
      // }
    };
  }, []);

  if (!mounted || !portalRoot || !isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40" />

      {/* Modal Content Wrapper */}
      <div className="relative z-50">
        {children}
      </div>
    </div>,
    portalRoot
  );
};

export default ModalPortal; 