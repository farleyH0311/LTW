import { Injectable, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

export interface SendEmailDto {
  recipients: string[]; // danh sách email nhận
  subject: string;
  text?: string; // nội dung dạng plain text, optional
  html?: string; // nội dung dạng html, optional
}

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  private emailTransport() {
    const host = this.configService.get<string>('EMAIL_HOST');
    const port = this.configService.get<number>('EMAIL_PORT');
    const user = this.configService.get<string>('EMAIL_USER');
    const pass = this.configService.get<string>('EMAIL_PASSWORD');

    console.log('Email config:', { host, port, user });

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(dto: SendEmailDto) {
    const { recipients, subject, text, html } = dto;

    if (!text && !html) {
      throw new BadRequestException(
        'Email must have either text or html content',
      );
    }

    const transport = this.emailTransport();

    const options: nodemailer.SendMailOptions = {
      from: `"MyApp Support" <${this.configService.get<string>('EMAIL_USER')}>`,
      to: recipients.join(','),
      subject,
      text,
      html,
    };

    try {
      await transport.sendMail(options);
      console.log(`Email has been sent to: ${recipients.join(', ')}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
