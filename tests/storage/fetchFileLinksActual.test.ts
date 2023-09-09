import "env";
import { assertEquals } from "https://deno.land/std@0.199.0/assert/mod.ts";
import fetchFileLinks from "../../src/storage/fetchFileLinks.ts";

const { DISCORD_JEST_GUILD_ID } = Deno.env.toObject();

Deno.test("fetchFileLinks", async () => {
  const fileName = "fuka_jitome1";
  const pathName = `/${DISCORD_JEST_GUILD_ID || ""}`;
  const fileLinks = await fetchFileLinks(fileName, pathName);

  console.log(fileLinks);
  assertEquals(fileLinks.length, 1);
});
