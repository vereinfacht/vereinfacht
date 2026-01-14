<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Contracts\Queue\ShouldQueue;

class WelcomeClubAdminMailable extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public string $url;

    public string $supportEmail;

    /**
     * Create a new message instance.
     */
    public function __construct()
    {
        $this->url = env('WEB_APPLICATION_URL', 'http://app.vereinfacht.digital')
            . env('CLUB_ADMIN_LOGIN_PATH', '/admin/login');
        $this->supportEmail = env('MAIL_FROM_ADDRESS', 'hello@vereinfacht.digital');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('email.welcome_club_admin.subject'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.welcome-club-admin',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
