import { consumetProviders } from "./consumetProviders";

export function checkProviderValidity(provider: string) {
  if (provider) {
    if (!consumetProviders.find((item) => item == provider.toLowerCase())) {
      throw new Error(
        `Provider ${provider} is not supported. Supported providers: ${consumetProviders.join(", ")}`
      );
    }
  }
}
