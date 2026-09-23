import React from "react";

interface Props {
    text: string;
    children: React.ReactNode;
}

const WatermarkOverlay: React.FC<Props> = ({ text, children }) => {
    return (
        <div className="relative w-full h-full">

            {children}

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 text-4xl font-bold rotate-[-30deg]">
                {text}
            </div>

        </div>
    );
};

export default WatermarkOverlay;