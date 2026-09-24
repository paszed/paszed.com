module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm start --port 3101",
      startServerReadyPattern: "Ready in",
      startServerReadyTimeout: 60000,
      url: [
        "http://localhost:3101/",
        "http://localhost:3101/about",
        "http://localhost:3101/projects",
        "http://localhost:3101/specs",
        "http://localhost:3101/de",
        "http://localhost:3101/hu",
      ],
      numberOfRuns: 1,
      settings: { chromeFlags: "--no-sandbox" },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci/reports" },
  },
};
