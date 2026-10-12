const ACTIVE_VERSIONS = ["v1", "v2"];
const VERSION_COOKIE = "quennie_version";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const parseCookies = (header = "") =>
  Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([key, value]) => key && value)
      .map(([key, value]) => [key, decodeURIComponent(value)])
  );

const normalizeVersion = (value = "") => {
  const candidate = String(value).toLowerCase();
  if (candidate === "1") return "v1";
  if (candidate === "2") return "v2";
  return ACTIVE_VERSIONS.includes(candidate) ? candidate : "";
};

module.exports = function versionRouter(request, response) {
  const protocol = request.headers["x-forwarded-proto"] || "https";
  const host = request.headers.host || "quennie-portfolio.vercel.app";
  const incoming = new URL(request.url || "/", `${protocol}://${host}`);
  const cookies = parseCookies(request.headers.cookie);
  const requested = normalizeVersion(incoming.searchParams.get("version") || incoming.searchParams.get("v"));
  const remembered = normalizeVersion(cookies[VERSION_COOKIE]);
  const selected = requested || remembered || ACTIVE_VERSIONS[Math.floor(Math.random() * ACTIVE_VERSIONS.length)];

  incoming.searchParams.delete("version");
  incoming.searchParams.delete("v");
  const query = incoming.searchParams.toString();
  const target = `/${selected}/${query ? `?${query}` : ""}${incoming.hash || ""}`;

  response.setHeader(
    "Set-Cookie",
    `${VERSION_COOKIE}=${selected}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax; Secure`
  );
  response.setHeader("Cache-Control", "private, no-store");
  response.setHeader("Location", target);
  response.statusCode = 307;
  response.end();
};
