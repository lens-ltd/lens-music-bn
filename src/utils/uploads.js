import { BlobServiceClient } from '@azure/storage-blob';

// LOAD ENVIRONMENT VARIABLES
const { AZURE_STORAGE_CONNECTION_STRING } = process.env;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw Error('Azure Storage Connection string not found');
}

// Create the BlobServiceClient object with connection string
const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);

export const uploadBlob = async (
    file,
    options = {
        name: Date.now().toString(),
        type: '',
        extension: '',
    },
    containerName = 'avatars'
) => {
    try {
        // GET A REFERENCE TO CONTAINER CLIENT
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // GET A BLOCK BLOB CLIENT
        const blockBlobClient = containerClient.getBlockBlobClient(
            `${options.name}.${getFileExtension(file?.originalname) || options?.extension}`
        );

        // UPLOAD FILE
        await blockBlobClient.upload(file.buffer, file.size, {
            blobHTTPHeaders: {
                blobContentType: file?.mimetype,
            },
        });

        // RETURN FILE URL
        return blockBlobClient;
    } catch (error) {
        throw error;
    }
};

function getFileExtension(filename) {
    if (!filename) return null;
    const parts = filename.split('.');
    if (parts.length >= 2) {
        return parts[parts.length - 1];
    }
    return null;
};
