import {Client } from "minio";

export const minioClient = new Client({
    endPoint: "127.0.0.1",
    port: 9000,
    useSSL: false,
    accessKey: "minioadmin",
    secretKey: "minioadmin",
});

export const bucketName = "skillswap-resources";