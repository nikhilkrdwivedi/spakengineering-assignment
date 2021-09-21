
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/
export const jwtSecret =  'my-32-character-ultra-secure-and-ultra-long-secret'
export const expiresIn =  '90d';
export const saltRounds = 10;
export const cloudName = '';
export const apiCloudinaryKey = '';
export const apiCloudinarySecretKey = '';
export default {passwordRegex,jwtSecret,expiresIn,saltRounds, cloudName, apiCloudinaryKey, apiCloudinarySecretKey}