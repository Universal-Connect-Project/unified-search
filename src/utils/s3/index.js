const { S3Client, ListObjectsCommand, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const logger = require('../../infra/logger')
const { Upload } = require('@aws-sdk/lib-storage')

module.exports = function (config) {
  const { bucket, region } = config
  const client = new S3Client({
    region
    // credentials: {
    //   secretAccessKey: accessKey,
    //   accessKeyId
    // },
  })
  return {
    async List (prefix) {
      let ret = []
      try {
        let res = {}
        do {
          command = new ListObjectsCommand({
            Bucket: bucket,
            Prefix: prefix,
            Marker: res?.NextMarker || ret[ret.length - 1]?.Key
          })
          res = await client.send(command)
          ret = [...ret, ...(res.Contents || [])]
        } while (res?.IsTruncated)
      } catch (e) {
        logger.error(`Error listing s3 objects: ${prefix}`, e)
      }
      return ret
    },
    async GetObject (key, parseJson) {
      try {
        const command = new GetObjectCommand({
          Bucket: bucket,
          Key: key
        })
        const ret = await client.send(command)
        if (ret && ret.Body) {
          if (parseJson) {
            return JSON.parse(await ret.Body.transformToString())
          } else {
            return await ret.Body.transformToString()
          }
        }
      } catch (e) {
        logger.error(`Error getting s3 object: ${key}`, e)
      }
    },
    async PutObject (key, data) {
      try {
        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: data
        })
        await client.send(command)
      } catch (e) {
        logger.error(`Error putting s3 object: ${key}`, e)
      }
    },
    async DeleteObject (key) {
      try {
        const command = new DeleteObjectCommand({
          Bucket: bucket,
          Key: key
        })
        return await client.send(command)
      } catch (e) {
        logger.error(`Error deleting s3 object: ${key}`, e)
      }
    },
    async UploadFile (key, stream) {
      const target = {
        Bucket: bucket,
        Key: key,
        Body: stream
      }
      try {
        const listCommand = new ListObjectsCommand({
          Bucket: bucket,
          Prefix: key
        })
        const ret = await client.send(listCommand)
        if (ret && ret.Contents && ret.Contents.length > 0) {
          return false
        }

        const parallelUploads3 = new Upload({
          client,
          // tags: [...], // optional tags
          // queueSize: 4, // optional concurrency configuration
          leavePartsOnError: false, // optional manually handle dropped parts
          params: target
        })

        parallelUploads3.on('httpUploadProgress', (progress) => {
          // console.log(progress);
        })

        await parallelUploads3.done()
        return true
      } catch (e) {
        logger.error(`Error uploading s3 object: ${key}`, e)
      }
    }
  }
}
