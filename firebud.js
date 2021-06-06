/*
    firebud
    Electron & Cross-browser Devtools Utility
    https://github.com/DeveloperAdeel/firebud
    By Adeel Khan
    MIT License
*/

(function () {
    "use strict";
    class Firebud {
        constructor() {
            this.allowedEvents = ["open", "close"];
            this.threshold = 150;
            this.events = new Proxy(
                {},
                {
                    get(target, prop) {
                        if (!target.hasOwnProperty(prop)) return () => null;
                        return target[prop];
                    },
                }
            );
            this.opened = false;
            this.start();
        }

        on(event, callback) {
            if (!this.allowedEvents.includes(event))
                throw new Error(
                    `firebud: event type ${event} not supported. only supported: [${this.allowedEvents.join(
                        ", "
                    )}]`
                );

            this.events[event] = callback;
            return this.events;
        }

        start() {
            if (typeof window !== "undefined") {
                window.onresize = function () {
                    return window.Firebud.fire();
                };
                if (window.Firebug) {
                    window.Firebug = new Proxy(window.Firebug, {
                        set(target, prop, value) {
                            window.Firebud.fire();
                            target[prop] = value;
                            return true;
                        },
                    });
                }
            }
            this.fire();
        }

        fire() {
            let widthThreshold =
                window.outerWidth - window.innerWidth > this.threshold;
            let heightThreshold =
                window.outerHeight - window.innerHeight > this.threshold;
            let orientation = widthThreshold ? "vertical" : "horizontal";
            if (
                !(heightThreshold && widthThreshold) &&
                ((window.Firebug &&
                    window.Firebug.chrome &&
                    window.Firebug.chrome.isInitialized) ||
                    widthThreshold ||
                    heightThreshold)
            ) {
                if (!this.opened) {
                    this.events.open({
                        opened: true,
                        orientation: orientation,
                    });
                }
                this.opened = true;
            } else {
                if (this.opened)
                    this.events.close({
                        opened: false,
                        orientation: null,
                    });

                this.opened = false;
            }
        }
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = Firebud;
    } else {
        window.Firebud = new Firebud();
    }
})();
