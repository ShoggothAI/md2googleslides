 // Copyright 2023 Google Inc.
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
import { v2 as cloudinary } from 'cloudinary';

const debug = Debug('md2gslides');

// Hardcoded credentials for testing - these will be used if environment variables are not set
const DEFAULT_CLOUD_NAME = 'dyzlnv4o8';
const DEFAULT_API_KEY = '269495699773311';
const DEFAULT_API_SECRET = 'YAwvET2tKJufP6EvPAFTFs5Ko2U';

/**
 * Configures Cloudinary with credentials from environment variables or defaults.
 *
 * Tries to use environment variables first:
 * - CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
 * - CLOUDINARY_API_KEY: Your Cloudinary API key
 * - CLOUDINARY_API_SECRET: Your Cloudinary API secret
 *
 * Falls back to default values if environment variables are not set.
 *
 * @returns {boolean} True if configuration was successful, false otherwise
 */
export function configureCloudinary(): boolean {
  // Try environment variables first
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY || DEFAULT_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || DEFAULT_API_SECRET;

  // Debug configuration
  debug('Cloudinary configuration:');
  debug('Cloud name: %s', cloudName);
  debug('API key: %s', apiKey ? '(set)' : '(not set)');
  debug('API secret: %s', apiSecret ? '(set)' : '(not set)');

  if (!cloudName || !apiKey || !apiSecret) {
    debug('Missing Cloudinary credentials. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });

  debug('Cloudinary configured successfully');
  return true;
}

export default cloudinary;
