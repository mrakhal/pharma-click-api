const { dbQuery, db, transporter, createToken } = require('../config')
const Crypto = require('crypto')

module.exports = {
    forgetPassword: async (req, res, next) => {
        try {
            let { email } = req.body
            
            let verifyEmail = `SELECT * from user where email = ${db.escape(email)};`
            verifyEmail = await dbQuery(verifyEmail)

            if (verifyEmail.length > 0) {
                let { iduser, fullname, gender, age, username, idrole, idstatus, profile_image, cart, address } = verifyEmail[0]
                let token = createToken({ iduser, fullname, gender, age, username, idrole, idstatus, profile_image, cart, address })

                let mail = {
                    from: 'PHARMACLICK-ADMIN <allysa.rahagustiani@gmail.com>',
                    to: email,
                    subject: '[PHARMACLICK RESET PASSWORD]',
                    html: ` <table cellpadding="0" cellspacing="0" class="es-content" align="center">
                <tbody>
                    <tr>
                        <td class="esd-stripe" align="center">
                            <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="700">
                                <tbody>
                                    <tr>
                                        <td class="esd-structure es-p40t es-p20b es-p20r es-p20l" align="left" esd-custom-block-id="334499">
                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td width="660" class="esd-container-frame" align="center" valign="top">
                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="center" class="esd-block-image" style="font-size: 0px;"><a target="_blank"><img src="https://tlr.stripocdn.email/content/guids/CABINET_2663efe83689b9bda1312f85374f56d2/images/10381620386430630.png" alt style="display: block;" width="100"></a></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center" class="esd-block-text">
                                                                            <h2>Verify your email to finish signing up</h2>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center" class="esd-block-spacer es-p10t es-p10b es-m-txt-c" style="font-size:0">
                                                                            <table border="0" width="40%" height="100%" cellpadding="0" cellspacing="0" style="width: 40% !important; display: inline-table;">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style="border-bottom: 1px solid #cccccc; background:none; height:1px; width:100%; margin:0px 0px 0px 0px;"></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center" class="esd-block-text es-p5t es-p5b es-p40r es-m-p0r" esd-links-underline="none">
                                                                            <p>Thank you for choosing PHARMACLICK.</p>
                                                                            <p><br></p>
                                                                            <p>To reset pasword, please click<strong><a target="_blank" href="mailto:${email}" style="text-decoration: none;">${email}</a></strong>&nbsp;is your email address by input OTP on the button below to <a target="_blank" href="http://localhost:3000/reset/${token}" style="text-decoration: none; word-break: break-all;">this link</a> within <strong>12 hours</strong> or click button below.</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center" class="esd-block-spacer es-p10t es-p10b es-m-txt-c" style="font-size:0">
                                                                            <table border="0" width="40%" height="100%" cellpadding="0" cellspacing="0" style="width: 40% !important; display: inline-table;">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style="border-bottom: 1px solid #cccccc; background:none; height:1px; width:100%; margin:0px 0px 0px 0px;"></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                    <td align="center">
                                                                        <a href="http://localhost:3000/reset/${token}">
                                                                            <button>
                                                                                <h4>Reset password</h4>
                                                                            </button>
                                                                        </a>
                                                                    </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>`
                }
                await transporter.sendMail(mail)
                res.status(200).send({ status: 200, messages: "Password reset link sent to your e-mail!", verifyEmail: true })
            } else {
                res.status(404).send({ status: 404, messages: "Email not found. Make sure your email is registered!", verifyEmail: false })
            }

        } catch (error) {
            next(error)
        }
    }
}