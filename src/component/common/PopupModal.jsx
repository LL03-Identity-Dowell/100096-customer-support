import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useEffect, useRef } from 'react';

function PopupModal({ children, toggleModals, modalName }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        toggleModals(modalName);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);

    }, 2000)

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center py-4 px-4 z-50'>
      <div ref={modalRef} onClick={(e) => e.stopPropagation()} className='min-w-[40%] flex flex-col'>
        <button className='text-white text-xl place-self-end my-2 -mr-6' onClick={() => toggleModals(modalName)}>
          <AiOutlineCloseCircle />
        </button>
        {children}
      </div>
    </div>
  );
}

export default PopupModal;
