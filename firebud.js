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
            this._proto = false;
            this.screen = {
                innerX: 0,
                innerY: 0,
                outerX: 0,
                outerY: 0,
            };
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
            this.protoFire();
        }

        protoFire() {
            const element = new Image();
            Object.defineProperty(element, "id", {
                get: () => this.fire(true),
            });
            console.log("%c", element);
        }

        fire(forced = false) {
            let widthThreshold =
                window.outerWidth - window.innerWidth > this.threshold;
            let heightThreshold =
                window.outerHeight - window.innerHeight > this.threshold;
            let orientation = widthThreshold
                ? "vertical"
                : heightThreshold
                ? "horizontal"
                : "popup";

            if (
                window.innerWidth === this.screen.innerX &&
                window.innerHeight === this.screen.innerY &&
                !forced
            )
                return false;

            this.screen = {
                innerX: window.innerWidth,
                innerY: window.innerHeight,
                outerX: window.outerWidth,
                outerY: window.outerHeight,
            };

            if (
                (!(heightThreshold && widthThreshold) &&
                    ((window.Firebug &&
                        window.Firebug.chrome &&
                        window.Firebug.chrome.isInitialized) ||
                        widthThreshold ||
                        heightThreshold)) ||
                forced
            ) {
                if (!this.opened || forced) {
                    this.events.open({
                        opened: true,
                        orientation: orientation,
                    });
                }
                this.opened = true;
                this._proto = forced;
            } else {
                if (this.opened && !this._proto)
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
