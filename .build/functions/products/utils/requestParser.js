const buildUrlObjectWithRawUrl = (rawUrl) => {
  return new URL(`https://${process.env.HOST ?? "localhost:3000"}${rawUrl}`);
};

const parseRequest = (req) => {
  const { url: rawUrl, method, headers } = req;
  const urlObj = buildUrlObjectWithRawUrl(rawUrl);
  return { url: urlObj, method, headers };
};

module.exports = {
  parseRequest,
  buildUrlObjectWithRawUrl,
};
