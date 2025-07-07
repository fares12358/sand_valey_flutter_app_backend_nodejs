const otpTemplate = (username, otp) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OTP Verification</title>
    <style>
      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
        }
        .otp-box {
          font-size: 20px !important;
        }
      }
    </style>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td align="center" style="padding: 40px 15px;">
          <table role="presentation" class="container" style="width: 100%; max-width: 600px; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            
            <!-- Logo -->
            <tr>
              <td style="text-align: center; padding: 0px;">
                <img src="https://res.cloudinary.com/dykittdyj/image/upload/v1751915034/uploads/zfdhxtiwfixqqrs9nnln.png" alt="Sand Valley Logo" style="height: 150px;" />
              </td>
            </tr>

            <!-- Header -->
            <tr>
              <td style="background-color: #f7941d; color: white; padding: 20px; text-align: center;">
                <h2 style="margin: 0; font-size: 24px;">🔐OTP Verification</h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">Hi <strong>${username}</strong>,</p>
                <p style="font-size: 16px; color: #333;">We received a request to verify your identity. Please use the OTP below:</p>
                
                <p class="otp-box" style="font-size: 28px; color: #f7941d; font-weight: bold; text-align: center; margin: 30px 0;">${otp}</p>
                
                <p style="font-size: 14px; color: #555;">This OTP is valid for 10 minutes. If you didn’t request this, you can safely ignore this email.</p>
                <p style="font-size: 14px; color: #999; margin-top: 40px;">Thanks,<br/>The Sand Valley Team</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #aaa;">
                &copy; ${new Date().getFullYear()} Sand Valley. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

export default otpTemplate;
