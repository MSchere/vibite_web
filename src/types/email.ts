export interface Message {
    messageId?: string;
    subject: string;
    text: string;
    html: string;
    amp?: string;
    attachments?: string[];
}
export interface Email {
    from?: string;
    to: string[];
    message?: Message;
    replyTo?: string;
    toUids?: string[];
    cc?: string[];
    ccUids?: string[];
    bcc?: string[];
    bccUids?: string[];
    headers?: string[];
    template?: string;
}
