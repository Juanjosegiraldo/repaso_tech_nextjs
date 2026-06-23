import nodemailer from "nodemailer";

// Single transporter configured from environment variables.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send a welcome email to a newly created user.
// Caller is responsible for not letting a failure block user creation.
export const sendWelcomeEmail = async (
  nombre: string,
  email: string
): Promise<void> => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Bienvenido a TechNova",
    html: `
      <h1>Hola, ${nombre} 👋</h1>
      <p>Tu cuenta en <strong>TechNova</strong> fue creada con éxito.</p>
    `,
  });
};
