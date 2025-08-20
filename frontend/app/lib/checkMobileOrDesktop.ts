import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

// receives page headers and check if it is a mobile device
export function checkDeviceIsMobile(headers: ReadonlyHeaders) {
  const userAgent = headers!.get("user-agent");

  const isMobile = userAgent!.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  );

  return isMobile ? true : false;
}
