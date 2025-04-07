import {
  extractSlugName,
  extractImageLink,
  buildDescription,
  extractTags,
  findCompanyNameFromParts,
  cleanJobTitle,
  fixLink,
  destructureJobTitle,
} from "../utils";
import { PageMap } from "../types";

// Mock the constants module
jest.mock("../constants", () => ({
  ...jest.requireActual("../constants"),
  TECHNOLOGY_TAGS: ["React", "TypeScript", "Node.js"],
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

describe("extractTags", () => {
  it("should extract technology tags from a description", () => {
    const description =
      "We are looking for a developer with experience in React and TypeScript";
    expect(extractTags(description)).toEqual(["React", "TypeScript"]);
  });

  it("should return an empty array if no tags are found", () => {
    const description =
      "We are looking for a developer with experience in Python";
    expect(extractTags(description)).toEqual([]);
  });
});

describe("findCompanyNameFromParts", () => {
  it("should find company name by matching parts against slug parts", () => {
    const parts = ["Senior Frontend Developer", "Example Corp"];
    const slugParts = ["example", "corp"];
    expect(findCompanyNameFromParts(parts, slugParts)).toBe("Example Corp");
  });

  it("should return undefined if no match is found", () => {
    const parts = ["Senior Frontend Developer", "Another Company"];
    const slugParts = ["example", "corp"];
    expect(findCompanyNameFromParts(parts, slugParts)).toBeUndefined();
  });
});

describe("cleanJobTitle", () => {
  it("should clean the job title by removing company name and extra characters", () => {
    const title = "Senior Frontend Developer - Example Corp";
    const companyName = "Example Corp";
    expect(cleanJobTitle(title, companyName)).toBe("Senior Frontend Developer");
  });

  it('should handle titles with "at"', () => {
    const title = "Senior Frontend Developer at Example Corp";
    const companyName = "Example Corp";
    expect(cleanJobTitle(title, companyName)).toBe("Senior Frontend Developer");
  });
});

describe("fixLink", () => {
  it("should remove the /apply suffix from a link", () => {
    const link = "https://example.com/jobs/senior-frontend-developer/apply";
    expect(fixLink(link)).toBe(
      "https://example.com/jobs/senior-frontend-developer"
    );
  });

  it("should return the original link if it does not end with /apply", () => {
    const link = "https://example.com/jobs/senior-frontend-developer";
    expect(fixLink(link)).toBe(
      "https://example.com/jobs/senior-frontend-developer"
    );
  });
});

describe("destructureJobTitle", () => {
  it("should extract company name and job title from a hyphenated title", () => {
    const title = "Senior Frontend Developer - Example Corp";
    const slugName = "example-corp";
    const result = destructureJobTitle(title, slugName);
    expect(result).toEqual({
      companyName: "Example Corp",
      jobTitle: "Senior Frontend Developer",
    });
  });

  it('should extract company name and job title from a title with "at"', () => {
    const title = "Senior Frontend Developer at Example Corp";
    const slugName = "example-corp";
    const result = destructureJobTitle(title, slugName);
    expect(result).toEqual({
      companyName: "Example Corp",
      jobTitle: "Senior Frontend Developer",
    });
  });

  it("should use the slug name as company name if no match is found", () => {
    const title = "Senior Frontend Developer";
    const slugName = "example-corp";
    const result = destructureJobTitle(title, slugName);
    expect(result).toEqual({
      companyName: "example-corp",
      jobTitle: "Senior Frontend Developer",
    });
  });
});
