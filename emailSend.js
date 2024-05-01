import { Resend } from "resend";
const resend = new Resend('re_dagjq8BW_NRGUfJixQU94hps4qB9ie9Up');

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'sanamanisiddharam123@gmail.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
});
