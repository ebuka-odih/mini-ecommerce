import React from 'react';

interface HoneypotProps {
    fieldName?: string;
    onFormStart?: (startTime: number) => void;
}

const Honeypot: React.FC<HoneypotProps> = ({ 
    fieldName = 'website_url',
    onFormStart 
}) => {
    // Record form start time for timing analysis
    React.useEffect(() => {
        if (onFormStart) {
            onFormStart(Date.now());
        }
    }, [onFormStart]);

    return (
        <div style={{ display: 'none' }}>
            {/* Honeypot field - invisible to humans, visible to bots */}
            <label htmlFor={fieldName}>Leave this field empty</label>
            <input 
                type="text" 
                id={fieldName}
                name={fieldName}
                tabIndex={-1}
                autoComplete="off"
                style={{ 
                    position: 'absolute',
                    left: '-9999px',
                    top: '-9999px',
                    opacity: 0,
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
};

export default Honeypot;