import path from 'path'

export const COMPRESSRC = path.join(
    process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'],
    '.compressrc'
);
