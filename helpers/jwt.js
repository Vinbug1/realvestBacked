var { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "POST"] },
      { url: /\/api\/v1\/items(.*)/, methods: ["GET", "POST"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "POST"] },
      { url: /\/api\/v1\/interests(.*)/, methods: ["GET", "POST"] },
      { url: /\/api\/v1\/maintenances(.*)/, methods: ["GET", "POST"] },
      { url: /\/api\/v1\/repairs(.*)/, methods: ["GET", "POST"] },
      { url: /\/api\/v1\/investments(.*)/, methods: ["GET", "POST"] },
      { url: /\/api\/v1\/transactions(.*)/, methods: ["GET", "POST"] },
      { url: /\/api\/v1\/posts(.*)/, methods: ["GET", "POST"] },
      { url: /\/api\/v1\/orders(.*)/, methods: ["GET", "OPTIONS", "POST"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}
async function isRevoked(req, payload, done) {
  if (!payload.user) {
    done(null, true);
  }
  done();
}

module.exports = authJwt;
