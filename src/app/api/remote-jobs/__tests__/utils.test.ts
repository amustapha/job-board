import {
  extractSlugName,
  extractImageLink,
  buildDescription,
  extractTags,
  findCompanyNameFromParts,
  cleanJobTitle,
  fixLink,
  destructureJobTitle,
  getJob,
} from "../utils";
import { PageMap } from "../types";
import * as constants from "../constants";

// Mock the googleResponse
jest.mock("../../mock/google-response", () => ({
  googleResponse: {
    items: [
      {
        title: "Senior Frontend Developer - Example Corp",
        link: "https://example.com/example/senior-frontend-developer",
        pagemap: {
          cse_thumbnail: [{ src: "https://example.com/logo.png" }],
          metatags: [
            {
              "og:description": "Join our team as a Senior Frontend Developer",
              "twitter:description":
                "Join our team as a Senior Frontend Developer",
            },
          ],
        },
      },
    ],
  },
}));

describe("extractSlugName", () => {
  it("should extract the slug name from a URL", () => {
    const link = "https://example.com/example/senior-frontend-developer";
    expect(extractSlugName(link)).toBe("example");
  });
});

describe("extractImageLink", () => {
  it("should extract the image link from pagemap data", () => {
    const pagemap: PageMap = {
      cse_thumbnail: [{ src: "https://example.com/logo.png" }],
      metatags: [
        {
          "og:image": "https://example.com/og-image.png",
          "twitter:image": "https://example.com/twitter-image.png",
        },
      ],
    };
    expect(extractImageLink(pagemap)).toBe("https://example.com/logo.png");
  });

  it("should fallback to og:image if cse_thumbnail is not available", () => {
    const pagemap: PageMap = {
      metatags: [
        {
          "og:image": "https://example.com/og-image.png",
          "twitter:image": "https://example.com/twitter-image.png",
        },
      ],
    };
    expect(extractImageLink(pagemap)).toBe("https://example.com/og-image.png");
  });

  it("should fallback to twitter:image if og:image is not available", () => {
    const pagemap: PageMap = {
      metatags: [
        {
          "twitter:image": "https://example.com/twitter-image.png",
        },
      ],
    };
    expect(extractImageLink(pagemap)).toBe(
      "https://example.com/twitter-image.png"
    );
  });

  it("should return empty string if no image is available", () => {
    const pagemap: PageMap = {
      metatags: [{}],
    };
    expect(extractImageLink(pagemap)).toBe("");
  });
});

describe("buildDescription", () => {
  it("should build a description from title and metatags", () => {
    const title = "Senior Frontend Developer";
    const pagemap: PageMap = {
      metatags: [
        {
          "og:description": "Join our team as a Senior Frontend Developer",
        },
      ],
    };
    expect(buildDescription(title, pagemap)).toBe(
      "Senior Frontend Developer Join our team as a Senior Frontend Developer"
    );
  });

  it("should fallback to twitter:description if og:description is not available", () => {
    const title = "Senior Frontend Developer";
    const pagemap: PageMap = {
      metatags: [
        {
          "twitter:description": "Join our team as a Senior Frontend Developer",
        },
      ],
    };
    expect(buildDescription(title, pagemap)).toBe(
      "Senior Frontend Developer Join our team as a Senior Frontend Developer"
    );
  });

  it("should return just the title if no description is available", () => {
    const title = "Senior Frontend Developer";
    const pagemap: PageMap = {
      metatags: [{}],
    };
    expect(buildDescription(title, pagemap)).toBe("Senior Frontend Developer ");
  });
});
