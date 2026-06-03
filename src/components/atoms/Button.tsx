import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className, ...props }: ButtonProps) => {
  // These classes match the cyan/rounded look in your TownScout design
  const baseStyles = "px-6 py-2 rounded-full font-semibold transition-all duration-200 active:scale-95";
  
  const variants = {
    primary: "bg-[#00D1FF] text-white shadow-lg hover:bg-[#00B8E6]", // The Cyan Signup button
    secondary: "bg-white text-[#00D1FF] border border-[#00D1FF] hover:bg-gray-50", // Outline style
    outline: "text-gray-600 hover:text-[#00D1FF]", // Simple text button (like Login)
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};