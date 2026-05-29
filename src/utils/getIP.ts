function getIP(req: any) {
  const headers = req.headers;

  const xForwardedFor =
    headers?.get?.("x-forwarded-for") || headers?.["x-forwarded-for"]; // Web API style // Express style

  const ip =
    req.ip ||
    (typeof xForwardedFor === "string"
      ? xForwardedFor.split(",")[0]
      : undefined) ||
    "unknown";

  return ip;
}

export default getIP;
