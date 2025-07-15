const UtilService = {
  rsa_public_key: `-----BEGIN PUBLIC KEY-----
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

  getAppDomainToken: function () {
    const domainName = this.getDomainName('infinityssr.dev.futuretravelplatform.com');
    return `${domainName}~${new Date().getTime()}`;
  },

  getDomainName: function (domain) {
    return domain.replace(/^(https?:\/\/)?/, '');
  },

  RsaEncrypt: function (publicKey, data) {
    try {
      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(publicKey);
      const encrypted = encryptor.encrypt(data);
      return encrypted;
    } catch (error) {
      return null;
    }
  },

  headerSetup: function (request) {
    let domain_token = this.getAppDomainToken();
    let key = this.rsa_public_key;
    let encrypted_string = this.RsaEncrypt(key, domain_token).toString();
    const timestamp = new Date().getTime();

    const headers = new Headers(request.headers);
    headers.set('token', encrypted_string);

    let url = new URL(request.url);
    url.searchParams.set('_ts', timestamp.toString());

    const newRequest = new Request(url.toString(), {
      ...request,
      headers: headers
    });

    return newRequest;
  }
};