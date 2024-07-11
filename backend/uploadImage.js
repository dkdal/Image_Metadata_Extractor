import AWS from "aws-sdk";
import sizeOf from "image-size";

const s3 = new AWS.S3();

export const handler = async (event) => {
  try {
    console.log('Received event:', JSON.stringify(event, null, 2)); // Log received event

    const { action, email, image } = event;

    console.log('Action:', action); // Log action
    console.log('Email:', email); // Log email

    if (action === 'upload') {
      console.log('Action is upload'); // Log action is upload

      // Extract metadata from the uploaded image
      const dimensions = sizeOf(Buffer.from(image, 'base64'));

      console.log('Image dimensions:', dimensions); // Log image dimensions

      const bucketName = 'tas3'; // Replace with your S3 bucket name
      const key = bucketName + email.split('@')[0]; // Generate a unique key for the image

      console.log('Uploading image to S3:', key); // Log uploading image to S3

      // Upload image to S3
      await s3.upload({
        Bucket: bucketName,
        Key: key,
        Body: Buffer.from(image, 'base64')
      }).promise();

      console.log('Image uploaded successfully'); // Log image uploaded successfully

      // Return success response
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Image uploaded successfully!',
          dimensions: dimensions
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
  } catch (err) {
    console.error('Error:', err);
    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to upload image' })
    };
  }
};
