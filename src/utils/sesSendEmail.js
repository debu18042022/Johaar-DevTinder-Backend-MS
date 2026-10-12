const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
        Destination: {
            CcAddresses: [
            ],
            ToAddresses: [
                toAddress,
            ],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `<h1>This is the HTML_FORMAT_BODY</h1>`,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "This is the TEXT_FORMAT_BODY",
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "This is a EMAIL_SUBJECT hello world from Amazon SES",
            },
        },
        Source: fromAddress,
        ReplyToAddresses: [
            /* more items */
        ],
    });
};

const run = async () => {
    const sendEmailCommand = createSendEmailCommand(
        "sujeetsahu322@gmail.com",
        "sujeet@devtinders.in",
    );

    try {
        return await sesClient.send(sendEmailCommand);
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            const messageRejectedError = caught;
            return messageRejectedError;
        }
        throw caught;
    }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };