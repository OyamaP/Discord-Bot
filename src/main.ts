import DiscordManager from "./modules/discord/Manager.js";

/**
 * DiscordBot 起動
 */
try {
  new DiscordManager();
} catch {
  console.error("Failed: Start Discord Bot");
}
