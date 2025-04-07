import { NextResponse } from "next/server";
import { googleResponse } from "../../mock/google-response";
import { Job } from "@/components/JobView";
import { TECHNOLOGY_TAGS } from "../constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let index = searchParams.get("index");
  if (!index) {
    index = "0";
  }
  const job = await getJob(+index);
  return NextResponse.json({ job });
}

async function getJob(index: number): Promise<Job> {
  const job = googleResponse.items[+index];
  const { title, link, pagemap } = job;
  const slugName = link.replace("https://", "").split("/")[1];

  const imageLink =
    pagemap?.cse_thumbnail?.[0]?.src ||
    pagemap.metatags[0]["og:image"] ||
    pagemap.metatags[0]["twitter:image"];

  const description = title + " " +
    pagemap?.metatags?.[0]?.["og:description"] ||
    pagemap?.metatags?.[0]?.["twitter:description"] ||
    "";
  const tags = TECHNOLOGY_TAGS.filter((tag) =>
    description.toLowerCase().includes(tag.toLowerCase())
  );

  const { companyName, jobTitle } = destructureJobTitle(title, slugName);

  return {
    companyName,
    jobTitle,
    tags,
    companyLogo: imageLink,
    url: fixLink(link),
  };
}

function destructureJobTitle(title: string, slugName: string) {
  const hiphenParts = title.split("-");
  const atParts = hiphenParts[0].split("at");
  const slugParts = slugName.split("-");
  let companyName: string | undefined = undefined;

  if (hiphenParts.length > 1) {
    companyName = hiphenParts.find((part) =>
      slugParts.some((slugPart) =>
        part.toLowerCase().includes(slugPart.toLowerCase())
      )
    );
  } else if (atParts.length > 1 && !companyName) {
    companyName = atParts.find((part) =>
      slugParts.some((slugPart) =>
        part.toLowerCase().includes(slugPart.toLowerCase())
      )
    );
  }
  if (!companyName) {
    companyName = slugName
  }

  companyName = companyName!.trim();

  const jobTitle = title
    .replace(companyName as string, "")
    .trim()
    .replace(/^\s*-\s*/, "")
    .replace(/-$/, "")
    .replace(/^\s*at\s*/, "")
    .trim();

  return { companyName, jobTitle };
}

function fixLink(link: string) {
  if (link.endsWith("/apply")) {
    return link.replace("/apply", "");
  }
  return link;
}
