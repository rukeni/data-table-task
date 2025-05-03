import type { ModalProps as AntModalProps } from 'antd';

import { Modal as AntModal } from 'antd';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export interface ModalProps extends Omit<AntModalProps, 'visible'> {
  open?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ children, open = false, ...props }) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalRoot(document.getElementById('modal-root'));
  }, []);

  if (!modalRoot) return null;

  return createPortal(
    <AntModal open={open} {...props}>
      {children}
    </AntModal>,
    modalRoot,
  );
};
