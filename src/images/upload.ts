// Copyright 2019 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import Debug from 'debug';
import path from 'path';
import cloudinary, { configureCloudinary } from './cloudinary-config';
import retry from 'promise-retry';

const debug = Debug('md2gslides');

const retryOptions = {
  retries: 3,
  randomize: true,
};

/**
 * Uploads a local file to Cloudinary so it is HTTP/S accessible.
 *
 * Uses Cloudinary for image hosting. Requires environment variables:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 *
 * @param {string} filePath -- Local path to image to upload
 * @returns {Promise<string>} URL to hosted image
 */
async function uploadLocalImage(filePath: string): Promise<string> {
  debug('Uploading file to Cloudinary: %s', filePath);

  // Configure Cloudinary with environment variables
  const configured = configureCloudinary();
  if (!configured) {
    throw new Error('Cloudinary configuration failed. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
  }

  // Generate a unique public_id based on the filename and timestamp
  const filename = path.basename(filePath);
  const publicId = `md2gslides_${Date.now()}_${filename}`;

  try {
    // Upload with retry logic
    const result = await retry(async (doRetry) => {
      try {
        return await cloudinary.uploader.upload(filePath, {
          public_id: publicId,
          resource_type: 'auto',
          overwrite: true,
        });
      } catch (err) {
        // Retry on network errors or Cloudinary server errors
        if (err.http_code >= 500 || err.code === 'ECONNRESET' ||
            err.code === 'ETIMEDOUT' || err.code === 'ENOTFOUND') {
          doRetry(err);
        }
        throw err;
      }
    }, retryOptions);

    debug('Cloudinary upload successful: %s', result.secure_url);
    return result.secure_url;
  } catch (error) {
    debug('Cloudinary upload failed: %O', error);
    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
  }
}

export default uploadLocalImage;
