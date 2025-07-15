/*
 * Utility Service Module
 * ---------------------
 * Provides utility functions for domain token generation, domain name extraction, RSA encryption, and request header setup.
 * Used throughout the application for secure API requests and domain-related utilities.
 *
 * Author: [Your Name]
 * Last Modified: [Update Date]
 */

const utilService = {
  rsaPublicKey: `-----BEGIN PUBLIC KEY-----
   MIICITANBgkqhkiG9w0BAQEFAAOCAg4AMIICCQKCAgB0rRSHGZK/FtK15IRfQxtl
   dN5ToPtfXGzTNBe1vGhow5xqp6BLubMKKPwCj3zOJiAm1Ip1VNqqYxWnaL8ZErBF
   rErtE0r7kn50QgGgJCpdrWJ4unhaoe1su207d9oY6D6OBH90v1aXA6ZjN7zTJmiq
   FJZOOTQE6t/XwNAOphq/B6Lcr1iQSQmSqaMozy4OQ4NvIzNTQn5tcs9qJBMsKFeU
   cSp8VK76JBNEqSuEHNmbV2d/IQ5XAqVUiAs34kH2xWRSbBmy0WK3c3QKGzC1MRWM
   9JauLN56TKUFOmUSjfWY3caJru6HxsiMTGKnvflXHfgA2aLAPxu72pIHoCTy5Hxj
   AUoKM7qXUn/kQj4Ci0M/0LRF4boqd37wpbyVNeXNvqm+dLjxklf/+NHMfNL2Wvb4
   ekHUVI8nMVPgswIcQ7q/Njf9DC+LA+/duf8m9JDjI3J6r9y1gQugdkLETGzF2Gj1
   ToU0Pocrg6CFHImqq2z+cOeWnURrV0f0I1UWWGCb79OZxZ5oDjM9uCLRsoe8+Npg
   ACZNf4AbnM7OUNj5TEYs6t/tUYouvTB7gH452I3EH6KWBl+ZTgCg0RFkOMazNOjn
   4J0yfbaPvpVgKzF2WRyn63mTO2tdLRl5s9uqMFhXmCs6IzEqBpxMKL1aS6ONZLDG
   5qPtpCPJnUFQEBTVlSO15QIDAQAB
   -----END PUBLIC KEY-----`,

  /**
   * Generates a domain token using the domain name and current timestamp.
   * @returns {string} The generated domain token.
   */
  getAppDomainToken: function () {
    const domainName = this.getDomainName('infinityssr.dev.futuretravelplatform.com');
    return `${domainName}~${new Date().getTime()}`;
  },

  /**
   * Extracts the domain name from a URL.
   * @param {string} domain - The domain URL.
   * @returns {string} The extracted domain name.
   */
  getDomainName: function (domain) {
    return domain.replace(/^(https?:\/\/)?/, '');
  },

  /**
   * Encrypts data using the provided RSA public key.
   * @param {string} publicKey - The RSA public key.
   * @param {string} data - The data to encrypt.
   * @returns {string|null} The encrypted data, or null if encryption fails.
   */
  rsaEncrypt: function (publicKey, data) {
    try {
      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(publicKey);
      const encrypted = encryptor.encrypt(data);
      return encrypted;
    } catch (error) {
      return null;
    }
  },

  /**
   * Sets up request headers with a domain token and encrypted string, and appends a timestamp to the URL.
   * @param {Request} request - The original request object.
   * @returns {Request} The new request object with updated headers and URL.
   */
  headerSetup: function (request) {
    let domainToken = this.getAppDomainToken();
    let key = this.rsaPublicKey;
    let encryptedString = this.rsaEncrypt(key, domainToken).toString();
    const timestamp = new Date().getTime();

    const headers = new Headers(request.headers);
    headers.set('token', encryptedString);

    let url = new URL(request.url);
    url.searchParams.set('_ts', timestamp.toString());

    const newRequest = new Request(url.toString(), {
      ...request,
      headers: headers
    });

    return newRequest;
  }
};