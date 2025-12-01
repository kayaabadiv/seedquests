/**
 * @name SeedQuests
 * @author Kayaaba
 * @description Plugin to complete Discord Quest Automatly
 * @version 1.0.0
 */

class SeedQuests {
    constructor() {
        this.dependencies = null;
        this.processing = false;
        this.abortController = new AbortController();
    }

    start() {
        console.log("[SeedQuests] Starting...");
        this.abortController = new AbortController();
        this.loadDependencies();
        this.checkFirstRun();
        
        if (this.dependencies) {
            // Run immediately on start
            this.run().catch(e => console.error("[SeedQuests] Error in main loop:", e));
        } else {
            console.error("[SeedQuests] Failed to load dependencies.");
        }
    }

    stop() {
        console.log("[SeedQuests] Stopping...");
        this.abortController.abort();
        this.processing = false;
    }

    checkFirstRun() {
        const hasSeenIntro = BdApi.Data.load("SeedQuests", "hasSeenIntro");
        if (!hasSeenIntro) {
            this.showIntroModal();
            BdApi.Data.save("SeedQuests", "hasSeenIntro", true);
        }
    }

    showIntroModal() {
        const bannerUrl = 'https://raw.githubusercontent.com/kayaabadiv/seedquests/main/banner.png';
        
        const ModalContent = () => {
            const React = BdApi.React;
            
            // Helper for the section header with line
            const SectionHeader = ({ text, color = "var(--text-positive)" }) => {
                return React.createElement("div", {
                    style: {
                        display: "flex",
                        alignItems: "center",
                        marginTop: "24px",
                        marginBottom: "16px",
                        gap: "16px"
                    }
                }, [
                    React.createElement("span", {
                        style: {
                            color: color,
                            fontWeight: "800",
                            textTransform: "uppercase",
                            fontSize: "12px",
                            letterSpacing: "0.02em",
                            whiteSpace: "nowrap"
                        }
                    }, text),
                    React.createElement("div", {
                        style: {
                            height: "1px",
                            width: "100%",
                            backgroundColor: color,
                            opacity: 0.6
                        }
                    })
                ]);
            };

            // Helper for bullet points
            const BulletPoint = ({ title, children }) => {
                return React.createElement("div", {
                    style: {
                        display: "flex",
                        marginBottom: "12px",
                        gap: "12px",
                        alignItems: "flex-start"
                    }
                }, [
                    React.createElement("div", {
                        style: {
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: "var(--header-secondary)",
                            marginTop: "6px",
                            flexShrink: 0
                        }
                    }),
                    React.createElement("div", {
                        style: {
                            color: "var(--text-muted)",
                            fontSize: "14px",
                            lineHeight: "1.4"
                        }
                    }, [
                        React.createElement("strong", { style: { color: "var(--header-primary)" } }, title + " "),
                        children
                    ])
                ]);
            };

            // Helper for social icons
            const SocialIcon = ({ href, path, viewBox = "0 0 24 24" }) => {
                return React.createElement("a", {
                    href: href,
                    target: "_blank",
                    style: {
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "color 0.2s ease",
                        cursor: "pointer"
                    },
                    onMouseEnter: (e) => e.currentTarget.style.color = "var(--text-normal)",
                    onMouseLeave: (e) => e.currentTarget.style.color = "var(--text-muted)"
                }, 
                    React.createElement("svg", {
                        viewBox: viewBox,
                        width: "20",
                        height: "20",
                        fill: "currentColor"
                    }, 
                        React.createElement("path", { d: path })
                    )
                );
            };

            return React.createElement("div", {
                style: {
                    display: "flex",
                    flexDirection: "column",
                    color: "var(--text-normal)",
                    fontFamily: "var(--font-display)"
                }
            }, [
                // Date (Subtitle style)
                React.createElement("div", {
                    style: {
                        color: "var(--text-muted)",
                        fontSize: "12px",
                        marginBottom: "20px",
                        marginTop: "0px",
                        fontWeight: "600"
                    }
                }, new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })),

                // Banner
                React.createElement("img", {
                    src: bannerUrl,
                    style: {
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        marginBottom: "16px"
                    }
                }),

                // Intro Text
                React.createElement("p", {
                    style: {
                        fontSize: "14px",
                        lineHeight: "1.6",
                        color: "var(--text-normal)",
                        marginBottom: "8px"
                    }
                }, [
                    "SeedQuests is a plugin that incorporates ",
                    React.createElement("a", {
                        href: "https://gist.github.com/aamiaa/204cd9d42013ded9faf646fae7f89fbb",
                        target: "_blank",
                        style: { color: "var(--text-link)", textDecoration: "none" }
                    }, "aamiaa"),
                    "'s code as a BetterDiscord plugin. Available only on PC, this addition allows you to automatically complete Discord quests for the connected account."
                ]),

                // Section 1: Green (Improvements/Features)
                React.createElement(SectionHeader, { text: "WHAT IT DOES", color: "var(--green-360)" }),
                
                React.createElement(BulletPoint, { title: "Automatic Acceptance." }, 
                    "The plugin detects new quests and enrolls you without any intervention on your part."
                ),
                React.createElement(BulletPoint, { title: "Activity Simulation." }, 
                    "Whether streaming, gaming, or watching videos, SeedQuests simulates activity in the background. Discord won't be any the wiser, and you can do something else with your precious time."
                ),
                
                // Section 2: Blurple (Advanced stuff)
                React.createElement(SectionHeader, { text: "COOL STUFF", color: "var(--text-brand)" }),
                
                React.createElement(BulletPoint, { title: "Robust Queue." }, 
                    "Quests are processed one by one to ensure maximum stability and avoid conflicts."
                ),
                React.createElement(BulletPoint, { title: "Claim Rewards." }, 
                    "As soon as a quest is validated, the gift can be claimed. This is not automatic due to the captcha requested by Discord."
                ),

                // Footer
                React.createElement("div", {
                    style: {
                        marginTop: "32px",
                        paddingTop: "16px",
                        borderTop: "1px solid var(--background-modifier-accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                        color: "var(--text-muted)",
                        fontSize: "12px"
                    }
                }, [
                    React.createElement("div", { style: { display: "flex", gap: "12px" } }, [
                         // Website Icon (Globe)
                         React.createElement(SocialIcon, { 
                             href: "https://theseed.dev", 
                             path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                         }),
                         // Github Icon
                         React.createElement(SocialIcon, { 
                             href: "https://github.com/kayaabadiv/seedquests", 
                             path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                         })
                    ]),
                    React.createElement("div", { style: { fontWeight: "600" } }, "Star on github!")
                ])
            ]);
        };

        BdApi.UI.showConfirmationModal("SeedQuests Release", BdApi.React.createElement(ModalContent), {
            confirmText: "Let's go!",
            cancelText: null,
            onConfirm: () => {}
        });
    }

    loadDependencies() {
        if (window.$) delete window.$;
        
        const wpRequire = window.webpackChunkdiscord_app?.push([[Symbol()], {}, r => r]);
        window.webpackChunkdiscord_app?.pop();

        if (!wpRequire) return;

        const getModule = (filter) => {
            const modules = Object.values(wpRequire.c);
            return modules.find(x => x?.exports && filter(x.exports))?.exports;
        };
        
        // Helper to traverse prototype chain if needed, similar to original code
        const findByProto = (prop) => Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.[prop])?.exports?.Z;
        const findByProp = (prop) => Object.values(wpRequire.c).find(x => x?.exports?.[prop])?.exports;
        const findByNestedProp = (prop) => Object.values(wpRequire.c).find(x => x?.exports?.ZP?.[prop])?.exports?.ZP;

        this.dependencies = {
            ApplicationStreamingStore: findByProto("getStreamerActiveStreamMetadata"),
            RunningGameStore: findByNestedProp("getRunningGames"),
            QuestsStore: findByProto("getQuest"),
            ChannelStore: findByProto("getAllThreadsForParent"),
            GuildChannelStore: findByNestedProp("getSFWDefaultChannel"),
            FluxDispatcher: findByProto("flushWaitQueue"),
            api: Object.values(wpRequire.c).find(x => x?.exports?.tn?.get)?.exports?.tn,
            DiscordNative: window.DiscordNative
        };
    }

    async run() {
        if (this.processing) return;
        this.processing = true;

        try {
            // 1. Enroll in all available quests
            await this.enrollAll();

            // 2. Process quests one by one
            await this.processQueue();

            // 3. Claim rewards
            await this.claimAll();
            
        } finally {
            this.processing = false;
        }
    }

    async enrollAll() {
        const { QuestsStore, api } = this.dependencies;
        if (!QuestsStore || !api) return;

        const quests = [...QuestsStore.quests.values()];
        const unenrolled = quests.filter(x => 
            !x.userStatus?.enrolledAt && 
            new Date(x.config.expiresAt).getTime() > Date.now()
        );

        if (unenrolled.length > 0) {
            console.log(`[SeedQuests] Found ${unenrolled.length} unenrolled quests. Enrolling...`);
            for (const quest of unenrolled) {
                if (this.abortController.signal.aborted) return;
                try {
                    await api.post({url: `/quests/${quest.id}/enroll`});
                    console.log(`[SeedQuests] Enrolled in ${quest.config.messages.questName}`);
                    await new Promise(r => setTimeout(r, 1000)); // Delay to be safe
                } catch (e) {
                    console.error(`[SeedQuests] Failed to enroll in ${quest.config.messages.questName}`, e);
                }
            }
        }
    }

    async claimAll() {
        const { QuestsStore, api } = this.dependencies;
        if (!QuestsStore || !api) return;

        // Refresh quests from store
        const quests = [...QuestsStore.quests.values()];
        const claimable = quests.filter(x => 
            x.userStatus?.completedAt && 
            !x.userStatus?.claimedAt
        );

        if (claimable.length > 0) {
            console.log(`[SeedQuests] Found ${claimable.length} claimable rewards. Claiming...`);
            for (const quest of claimable) {
                if (this.abortController.signal.aborted) return;
                try {
                    await api.post({
                        url: `/quests/${quest.id}/claim-reward`, 
                        body: { platform: "desktop" }
                    });
                    console.log(`[SeedQuests] Claimed reward for ${quest.config.messages.questName}`);
                    await new Promise(r => setTimeout(r, 1000));
                } catch (e) {
                    console.error(`[SeedQuests] Failed to claim reward for ${quest.config.messages.questName}`, e);
                }
            }
        }
    }

    async processQueue() {
        const { QuestsStore } = this.dependencies;
        if (!QuestsStore) return;

        // Get incomplete quests
        const getIncompleteQuests = () => [...QuestsStore.quests.values()].filter(x => 
            x.userStatus?.enrolledAt && 
            !x.userStatus?.completedAt && 
            new Date(x.config.expiresAt).getTime() > Date.now() &&
            x.id !== "1412491570820812933" // Ignore specific ID from original code
        );

        let quests = getIncompleteQuests();
        
        if (quests.length === 0) {
            console.log("[SeedQuests] No pending quests found.");
            return;
        }

        console.log(`[SeedQuests] Starting queue with ${quests.length} quests.`);

        for (const quest of quests) {
            if (this.abortController.signal.aborted) break;
            
            // Refresh quest state
            const currentQuest = QuestsStore.getQuest(quest.id);
            if (currentQuest?.userStatus?.completedAt) continue;

            console.log(`[SeedQuests] Processing quest: ${currentQuest.config.messages.questName}`);
            try {
                await this.completeQuest(currentQuest);
            } catch (e) {
                console.error(`[SeedQuests] Error processing quest ${currentQuest.config.messages.questName}:`, e);
            }
            
            await new Promise(r => setTimeout(r, 2000)); // Cooldown between quests
        }
    }

    async completeQuest(quest) {
        const { taskName, secondsNeeded, secondsDone } = this.getQuestInfo(quest);
        if (!taskName) {
            console.log(`[SeedQuests] Unknown task type for ${quest.config.messages.questName}`);
            return;
        }

        if (secondsDone >= secondsNeeded) return;

        console.log(`[SeedQuests] Starting task ${taskName} for ${quest.config.messages.questName}`);

        switch (taskName) {
            case "WATCH_VIDEO":
            case "WATCH_VIDEO_ON_MOBILE":
                await this.spoofVideo(quest, secondsNeeded, secondsDone);
                break;
            case "PLAY_ON_DESKTOP":
                await this.spoofPlayDesktop(quest, secondsNeeded, secondsDone);
                break;
            case "STREAM_ON_DESKTOP":
                await this.spoofStreamDesktop(quest, secondsNeeded, secondsDone);
                break;
            case "PLAY_ACTIVITY":
                await this.spoofPlayActivity(quest, secondsNeeded);
                break;
            default:
                console.log(`[SeedQuests] Unhandled task: ${taskName}`);
        }
    }

    getQuestInfo(quest) {
        const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
        const taskName = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"].find(x => taskConfig.tasks[x] != null);
        const secondsNeeded = taskConfig.tasks[taskName].target;
        const secondsDone = quest.userStatus?.progress?.[taskName]?.value ?? 0;
        return { taskName, secondsNeeded, secondsDone };
    }

    // --- Spoofing Logic ---

    async spoofVideo(quest, secondsNeeded, initialSecondsDone) {
        const { api } = this.dependencies;
        const maxFuture = 10, speed = 7, interval = 1;
        const enrolledAt = new Date(quest.userStatus.enrolledAt).getTime();
        let secondsDone = initialSecondsDone;

        while (secondsDone < secondsNeeded) {
            if (this.abortController.signal.aborted) return;

            const maxAllowed = Math.floor((Date.now() - enrolledAt) / 1000) + maxFuture;
            const timestamp = secondsDone + speed;

            if (maxAllowed - secondsDone >= speed) {
                try {
                    const res = await api.post({
                        url: `/quests/${quest.id}/video-progress`, 
                        body: { timestamp: Math.min(secondsNeeded, timestamp + Math.random()) }
                    });
                    secondsDone = Math.min(secondsNeeded, timestamp);
                    
                    if (res.body.completed_at) return;
                } catch (e) {
                    console.error("[SeedQuests] Video progress failed", e);
                }
            }
            
            await new Promise(resolve => setTimeout(resolve, interval * 1000));
        }
        
        // Final call to ensure completion
        try {
            await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: secondsNeeded}});
        } catch(e) {}
    }

    async spoofPlayDesktop(quest, secondsNeeded, initialSecondsDone) {
        const { api, RunningGameStore, FluxDispatcher, DiscordNative } = this.dependencies;
        const isApp = typeof DiscordNative !== "undefined";
        
        if (!isApp) {
            console.log("[SeedQuests] Browser detected. Cannot spoof PLAY_ON_DESKTOP correctly without native bindings, but attempting fallback...");
        }

        const applicationId = quest.config.application.id;
        const pid = Math.floor(Math.random() * 30000) + 1000;

        // Fetch app details
        const res = await api.get({url: `/applications/public?application_ids=${applicationId}`});
        const appData = res.body[0];
        const exeName = appData.executables.find(x => x.os === "win32").name.replace(">", "");

        const fakeGame = {
            cmdLine: `C:\\Program Files\\${appData.name}\\${exeName}`,
            exeName,
            exePath: `c:/program files/${appData.name.toLowerCase()}/${exeName}`,
            hidden: false,
            isLauncher: false,
            id: applicationId,
            name: appData.name,
            pid: pid,
            pidPath: [pid],
            processName: appData.name,
            start: Date.now(),
        };

        // Mock Store
        const realGetRunningGames = RunningGameStore.getRunningGames;
        const realGetGameForPID = RunningGameStore.getGameForPID;
        const originalGames = RunningGameStore.getRunningGames();

        RunningGameStore.getRunningGames = () => [fakeGame];
        RunningGameStore.getGameForPID = (pid) => pid === fakeGame.pid ? fakeGame : null;
        
        FluxDispatcher.dispatch({
            type: "RUNNING_GAMES_CHANGE", 
            removed: originalGames, 
            added: [fakeGame], 
            games: [fakeGame]
        });

        console.log(`[SeedQuests] Spoofing game: ${appData.name}`);

        return new Promise((resolve, reject) => {
            const handler = (data) => {
                if (this.abortController.signal.aborted) {
                    cleanup();
                    reject("Aborted");
                    return;
                }

                let progress = quest.config.configVersion === 1 
                    ? data.userStatus.streamProgressSeconds 
                    : Math.floor(data.userStatus.progress.PLAY_ON_DESKTOP.value);
                
                console.log(`[SeedQuests] Game Progress: ${progress}/${secondsNeeded}`);

                if (progress >= secondsNeeded) {
                    cleanup();
                    resolve();
                }
            };

            const cleanup = () => {
                FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", handler);
                RunningGameStore.getRunningGames = realGetRunningGames;
                RunningGameStore.getGameForPID = realGetGameForPID;
                FluxDispatcher.dispatch({
                    type: "RUNNING_GAMES_CHANGE", 
                    removed: [fakeGame], 
                    added: [], 
                    games: []
                });
            };

            FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", handler);
        });
    }

    async spoofStreamDesktop(quest, secondsNeeded, initialSecondsDone) {
        const { ApplicationStreamingStore, FluxDispatcher, DiscordNative } = this.dependencies;
        const isApp = typeof DiscordNative !== "undefined";

        if (!isApp) {
             console.log("[SeedQuests] Browser detected. STREAM_ON_DESKTOP might fail.");
        }

        const applicationId = quest.config.application.id;
        const pid = Math.floor(Math.random() * 30000) + 1000;

        const realFunc = ApplicationStreamingStore.getStreamerActiveStreamMetadata;
        ApplicationStreamingStore.getStreamerActiveStreamMetadata = () => ({
            id: applicationId,
            pid,
            sourceName: null
        });

        console.log(`[SeedQuests] Spoofing stream for ${quest.config.messages.questName}`);

        return new Promise((resolve, reject) => {
            const handler = (data) => {
                if (this.abortController.signal.aborted) {
                    cleanup();
                    reject("Aborted");
                    return;
                }

                let progress = quest.config.configVersion === 1 
                    ? data.userStatus.streamProgressSeconds 
                    : Math.floor(data.userStatus.progress.STREAM_ON_DESKTOP.value);
                
                console.log(`[SeedQuests] Stream Progress: ${progress}/${secondsNeeded}`);

                if (progress >= secondsNeeded) {
                    cleanup();
                    resolve();
                }
            };

            const cleanup = () => {
                FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", handler);
                ApplicationStreamingStore.getStreamerActiveStreamMetadata = realFunc;
            };

            FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", handler);
        });
    }

    async spoofPlayActivity(quest, secondsNeeded) {
        const { ChannelStore, GuildChannelStore, api } = this.dependencies;
        
        // Try to find a voice channel to "play" in
        const channelId = ChannelStore.getSortedPrivateChannels()[0]?.id 
            ?? Object.values(GuildChannelStore.getAllGuilds()).find(x => x?.VOCAL?.length > 0)?.VOCAL[0]?.channel?.id;
        
        if (!channelId) {
            console.error("[SeedQuests] No voice channel found to spoof activity.");
            return;
        }

        const streamKey = `call:${channelId}:1`;
        console.log(`[SeedQuests] Spoofing activity in channel ${channelId}`);

        while (true) {
            if (this.abortController.signal.aborted) break;

            const res = await api.post({
                url: `/quests/${quest.id}/heartbeat`, 
                body: {stream_key: streamKey, terminal: false}
            });
            
            const progress = res.body.progress.PLAY_ACTIVITY.value;
            console.log(`[SeedQuests] Activity Progress: ${progress}/${secondsNeeded}`);

            if (progress >= secondsNeeded) {
                await api.post({
                    url: `/quests/${quest.id}/heartbeat`, 
                    body: {stream_key: streamKey, terminal: true}
                });
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 20 * 1000));
        }
    }
}

module.exports = SeedQuests;
