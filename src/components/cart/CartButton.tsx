import React, { useState } from 'react';
import CartIcon from './CartIcon';
import CartSidebar from './CartSidebar';

const CartButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CartIcon onClick={() => setOpen(true)} />
      <CartSidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default CartButton;
