const AWS = require('aws-sdk');

const s3 = new AWS.S3();

exports.handler = async (event, context) => {
    try {
        console.log('Received event:', JSON.stringify(event, null, 2)); // Log received event
        // const { action, email } = JSON.parse(event.body);

        if (action === 'getimage') {
            console.log('Action is getimage'); // Log action

            // Assuming the S3 bucket name is 'tas3'
            const bucketName = 'tas3';

            // Generate the key based on the email
            const key = bucketName + email.split('@')[0];

            console.log('Fetching image from S3:', key); // Log key

            // Fetch the image from S3
            const params = {
                Bucket: bucketName,
                Key: key
            };

            const data = await s3.getObject(params).promise();

            console.log('Image fetched successfully'); // Log successful image fetch

            // If the image is found, return its data
            return {
                statusCode: 200,
                body: JSON.stringify({
                    image: data.Body.toString('base64')
                })
            };
        } else {
            console.log('Unknown action:', action); // Log unknown action

            // Handle unknown action
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Unknown action' })
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch image' })
        };
    }
};
