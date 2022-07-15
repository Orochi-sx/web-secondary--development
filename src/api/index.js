const PUBLIC_KEY =
  'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANNmSJW87EE2Z3KDW5Kod8cL + 7lUBgfKLm86CGfMQxvc8w + JnOE7GV72DVyg2kCMGho5g9AR64BmrGobbG4xMZECAwEAAQ ==';

// 加密
import JSEncrypt from "./jsencrypt";
export const Encrypt = text => {
  if (!text) {
    return;
  }
  // console.log(text)
  // 使用公钥加密
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(
    '-----BEGIN PUBLIC KEY-----' + PUBLIC_KEY + '-----END PUBLIC KEY-----'
  );

  var encrypted = encrypt.encrypt(text);
  // console.log(encrypted);

  return encrypted.toString();
};
