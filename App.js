import React, { useEffect, useState } from 'react';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ACCOUNT_ID = 'aaa';
const ACCESS_KEY_ID = 'bbb'; 
const SECRET_ACCESS_KEY =  'ccc'; 
const BUCKET_NAME =  "staging"; //"development";
const FILE_NAME =  "keyboard.png";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

function App() {
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    const fetchDownloadUrl = async () => {
      try {
        const url = await getSignedUrl(S3, new GetObjectCommand({ Bucket: BUCKET_NAME, Key: FILE_NAME }), { expiresIn: 10 });
        setDownloadUrl(url);
      } catch (error) {
        console.error('Error fetching download URL:', error);
      }
    };

    fetchDownloadUrl();
  }, []);

  return (
    <div className="App">
      {downloadUrl && (
        <a href={downloadUrl} download={FILE_NAME}>
          Download Object
        </a>
      )}
    </div>
  );
}

export default App;
