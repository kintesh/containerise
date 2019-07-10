import HostStorage from './Storage/HostStorage';

const allowedExternalExtensions = [
  '{c607c8df-14a7-4f28-894f-29e8722976af}', // Temporary Containers
];

export const messageExternalListener = (message, sender) => {

  if (!allowedExternalExtensions.includes(sender.id)) {
    throw new Error('Extension not allowed to receive an answer');
  }

  switch (message.method) {
    case 'getHostMap':
      if (typeof message.url === 'undefined') {
        throw new Error('Missing message.url');
      }
      return HostStorage.get(message.url);

    default:
      throw new Error('Unknown message.method');
  }
};
