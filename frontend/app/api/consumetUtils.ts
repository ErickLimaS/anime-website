import { SourceType } from "../ts/interfaces/episodesSource";
import { consumetProviders } from "./consumetProviders";

export function checkProviderValidity(provider: Omit<SourceType["source"], "crunchyroll" | "anilist" | "aniwatch">) {
  if (provider) {
    if (!consumetProviders.find((item) => item == provider.toLowerCase())) {
      throw new Error(
        `Provider ${provider} is not supported. Supported providers: ${consumetProviders.join(", ")}`
      );
    }
  }
}
