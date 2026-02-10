export interface ChatMessageProps {
    id: string
    message: string
    isLast?: boolean
    isStreaming?: boolean
}
export interface OverlayProps {
    isDragging: boolean;
};

export interface MapProps {
    openMap: boolean;
    needsOnboarding?: boolean;
    setOpenMap: (open: boolean) => void;
};

export interface InputBoxProps {
    onSubmit: (message: string) => void
    isLoading?: boolean
    disabled?: boolean
    placeholder?: string
}

export interface TaglineProps {
    isSubmitted: boolean;
    t: (key: string) => string;
    isCollapsed: boolean;
};
