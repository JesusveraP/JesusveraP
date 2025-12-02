<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address; // ✅ agregado
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $resetUrl;
    public $token;

    public function __construct($user, $token)
    {
        $this->user = $user;
        $this->token = $token;
        $this->resetUrl = url(route('password.reset', [
            'token' => $token,
            'email' => $user->email,
        ], false));
    }

    public function envelope(): Envelope
    {
        $to = [];

        // ✅ Solo agrega destinatario si existe correo
        if (!empty($this->user->email)) {
            $to[] = new Address($this->user->email);
        }

        return new Envelope(
            to: $to,
            subject: 'Restablecimiento de Contraseña - Sistema SENA',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reset-password',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
