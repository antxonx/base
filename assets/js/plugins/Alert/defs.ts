export interface AlertOptions {
    hasCancel?: boolean;
    onDismiss?: (status: boolean) => void;
    type?: ('info' | 'warning' | 'danger' | 'success');
    typeText?: string
}

export const DEFAULT_ALERT_OPTIONS: AlertOptions = {
    hasCancel: true,
    onDismiss: () => {},
    typeText: '',
}
