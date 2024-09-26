import Axios from "axios";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  setMediaTitleLanguageCookie: async ({ lang }: { lang?: string }) => {
    try {
      const setCookieResult = await Axios({
        url: `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/media-title-language`,
        method: "POST",
        data: { titleLanguage: lang },
      });

      return setCookieResult;
    } catch (err) {
      console.log(err);

      return err;
    }
  },

  setAdultContentCookie: async ({ isEnabled }: { isEnabled?: string }) => {
    try {
      const setAdultContentResult = await Axios({
        url: `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/adult-content`,
        method: "POST",
        data: { isAdultContentEnabled: isEnabled },
      });

      return setAdultContentResult;
    } catch (err) {
      console.log(err);

      return err;
    }
  },

  setSubtitleLanguageCookie: async ({ lang }: { lang?: string }) => {
    try {
      const setAdultContentResult = await Axios({
        url: `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/subtitle`,
        method: "POST",
        data: { subtitleLanguage: lang },
      });

      return setAdultContentResult;
    } catch (err) {
      console.log(err);

      return err;
    }
  },

  setPlayWrongMediaCookie: async ({
    playWrongMedia,
  }: {
    playWrongMedia?: string;
  }) => {
    try {
      const setPlayWrongMedia = await Axios({
        url: `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/wrong-media-enabled`,
        method: "POST",
        data: { isEnabled: playWrongMedia },
      });

      return setPlayWrongMedia;
    } catch (err) {
      console.log(err);

      return err;
    }
  },
};
