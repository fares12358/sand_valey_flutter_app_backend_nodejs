const verifyEmailTemplate = (username, link) => `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial; background: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 30px;">
      <h2 style="color: #06b6d4;">Welcome, ${username}!</h2>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${link}" style="display: inline-block; padding: 10px 20px; background: #06b6d4; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>Thank you,<br/>Sand Valley Team</p>
    </div>
  </body>
</html>
`;
export default verifyEmailTemplate;
