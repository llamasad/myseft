'use client';

import React, { ReactNode, memo, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import {
    MinusIcon,
    TabControlIcon,
    ShieldIcon,
    ExitIcon,
    ArrowIcon,
    MinimizeIcon,
    FullScreenIcon,
    PlusIcon,
    TabManagerIcon,
    ReloadIcon,
    ExportIcon,
} from '@/components/icons';
import { useMediaQuery } from 'react-responsive';
import classNames from 'classnames';
import { useState } from 'react';
import gsap from 'gsap';
import interact from 'interactjs';
import Overlay from '@/components/overlay';
import resizeObserver from '@/util/cookies/theme/observers/resize-observer';
import { useRouter } from 'next/navigation';
function MacbookWrapper({ children }: { children: ReactNode }) {
    const Route = useRouter();
    const [typeOfDisplay, setTypeOfDisplay] = useState<'desktop' | 'laptop' | 'tablet' | 'mobile' | null>(null);
    const [fullSize, setFullSize] = useState<boolean>(true);
    const isDesktopScreen = useMediaQuery({ query: '(min-width: 1280px)' });
    const isLaptopScreen = useMediaQuery({ query: '(min-width: 1024px)' });
    const isTabletScreen = useMediaQuery({ query: '(min-width: 640px)' });
    const isMobileScreen = useMediaQuery({ query: '(max-width: 639px)' });
    const positionRef = useRef<{ x: number; y: number } | null>(null);
    console.log(typeOfDisplay);
    const getDevice = useCallback(() => {
        if (isDesktopScreen) {
            return 1280;
        } else if (isLaptopScreen) {
            return 1024;
        } else if (isTabletScreen) {
            return 640;
        } else if (isMobileScreen) {
            return 360;
        }
    }, [isDesktopScreen, isLaptopScreen, isTabletScreen, isMobileScreen]);

    useLayoutEffect(() => {
        var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        gsap.fromTo(
            '.macbook-wrapper',
            { width: 0, height: 0, x: windowWidth / 2, y: windowHeight / 2 },
            { width: getDevice(), height: '90%', x: (windowWidth - (getDevice() as number)) / 2, y: windowHeight / 20 },
        );
    }, []);
    useEffect(() => {
        var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        var macbookWrapper = document.querySelector('.macbook-wrapper') as HTMLDivElement;
        const reiszeObserver = resizeObserver((entries) => {
            let widthSize = entries[0].contentRect.width;
            if (widthSize > 1280) {
                setTypeOfDisplay('desktop');
            } else if (widthSize > 1024) {
                setTypeOfDisplay('laptop');
            } else if (widthSize > 640) {
                setTypeOfDisplay('tablet');
            } else {
                setTypeOfDisplay('mobile');
            }
        }, macbookWrapper);

        let mouseOutterCount = 0;
        let test = 0;

        const position = {
            x: (windowWidth - (getDevice() as number)) / 2,
            y: windowHeight / 20,
        };

        positionRef.current = position;
        macbookWrapper.style.transform = `translate(${position.x}px, ${position.y}px`;

        let coatingMove: boolean = false;
        let blueCoating = false;
        let timeOut: any;
        const coatingEl = document.querySelector('.macbook-blue-coating') as HTMLDivElement;
        let tweenOpen: gsap.core.Tween;
        let tweenClose: gsap.core.Tween;
        interact('.resize-drag_macbook').resizable({
            // resize from all edges and corners
            edges: { left: true, right: true, bottom: true, top: true },

            listeners: {
                move(event) {
                    var target = event.target;
                    // update the element's style

                    target.style.width = event.rect.width + 'px';
                    target.style.height = event.rect.height + 'px';

                    // translate when resizing from top or left edges

                    position.x += event.deltaRect.left;
                    position.y += event.deltaRect.top;

                    target.style.transform = 'translate(' + position.x + 'px,' + position.y + 'px)';

                    target.setAttribute('data-x', position.x);
                    target.setAttribute('data-y', position.y);
                    coatingEl.style.transform = `translate(${position.x}px, ${position.y}px`;

                    coatingEl.style.width = event.target.offsetWidth - 2 + 'px';
                    coatingEl.style.height = event.target.offsetHeight - 2 + 'px';
                },
            },
            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent',
                }),

                // minimum size
                interact.modifiers.restrictSize({
                    min: { width: 100, height: 50 },
                }),
            ],

            inertia: true,
        });
        interact('.resize-drag_macbook-header').draggable({
            cursorChecker: function (action, interactable, element, interacting) {
                if (action.name === 'drag' && interacting) {
                    return 'all-scroll';
                }
                return 'default';
            },
            ignoreFrom: '.macbook-header_item',
            listeners: {
                start() {
                    console.log(position);

                    coatingMove = false;
                    blueCoating = false;
                    tweenOpen = gsap.to(coatingEl, { paused: true });
                    tweenClose = gsap.to(coatingEl, { paused: true });
                },

                end(event) {
                    var windowWidth =
                        window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                    var windowHeight =
                        window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                    if (blueCoating) {
                        setFullSize(false);

                        gsap.fromTo(
                            event.target.parentNode,
                            { x: position.x, y: position.y },
                            {
                                width: windowWidth + 'px',
                                height: windowHeight + 'px',
                                top: 0,
                                left: 0,
                                position: 'fixed',
                                x: 0,
                                y: 0,
                                duration: 0.5,
                            },
                        );
                    } else {
                        coatingMove && timeOut && clearTimeout(timeOut);
                        coatingMove &&
                            gsap.to(coatingEl, {
                                width: event.target.parentNode.offsetWidth + 'px',
                                height: event.target.parentNode.offsetHeight + 'px',
                                x: position.x,
                                y: position.y,
                            });
                    }
                    mouseOutterCount = 0;
                    test = 0;
                },
                move(event) {
                    position.x += event.dx;
                    test += event.dy;

                    // }

                    if (position.y + event.dy < 0 && mouseOutterCount >= 0) {
                        event.dy = position.y + event.dy;
                        position.y = 0;
                    }

                    if (position.y === 0) {
                        if (mouseOutterCount + event.dy > 0 && mouseOutterCount < 0) {
                            event.dy = mouseOutterCount + event.dy;
                            mouseOutterCount = 0;
                        } else {
                            mouseOutterCount += event.dy;
                        }
                    }

                    if (mouseOutterCount >= 0) {
                        mouseOutterCount = 0;

                        position.y += event.dy;
                    }

                    if (mouseOutterCount < -30) {
                        blueCoating = true;
                    } else {
                        blueCoating = false;
                    }
                    if (position.y === 0) {
                        if (blueCoating) {
                            if (!tweenOpen.progress()) {
                                var windowWidth =
                                    window.innerWidth ||
                                    document.documentElement.clientWidth ||
                                    document.body.clientWidth;
                                var windowHeight =
                                    window.innerHeight ||
                                    document.documentElement.clientHeight ||
                                    document.body.clientHeight;
                                tweenOpen.kill();
                                tweenOpen = gsap.to(coatingEl, { paused: true });

                                coatingMove && timeOut && clearTimeout(timeOut);
                                coatingMove = false;
                                console;
                                tweenOpen = gsap.fromTo(
                                    coatingEl,

                                    {
                                        width: event.target.parentNode.offsetWidth + 'px',
                                        height: event.target.parentNode.offsetHeight + 'px',
                                        x: position.x,
                                        y: position.y,
                                        borderColor: '#1f75e6',
                                        backgroundColor: '#1f75e690',
                                    },
                                    {
                                        width: windowWidth,
                                        height: windowHeight,
                                        top: 0,
                                        left: 0,
                                        position: 'fixed',
                                        x: 0,
                                        y: 0,
                                        duration: 0.5,
                                        ease: 'sine.in',
                                        paused: true,
                                        backgroundColor: '#1f75e690',
                                    },
                                );
                                tweenOpen.play();
                            }
                        } else {
                            tweenOpen &&
                                tweenOpen.progress() &&
                                coatingMove === false &&
                                (coatingMove = true) &&
                                (timeOut = setTimeout(() => {
                                    coatingMove = false;
                                    tweenOpen.progress() && (tweenOpen = gsap.to(coatingEl, { paused: true }));
                                    tweenClose = gsap.to(coatingEl, {
                                        background: 'transparent',
                                        borderColor: 'transparent',
                                    });
                                }, 500));
                            //         tweenClose &&
                            //         (tweenClose = gsap.to(coatingEl, {
                            //             width: event.target.parentNode.offsetWidth - 2 + 'px',
                            //             height: event.target.parentNode.offsetHeight - 2 + 'px',
                            //             x: position.x,
                            //             y: position.y,
                            //             duration: 0.5,
                            //             onStart: () => {},
                            //             onComplete: () => {
                            //                 tweenClose.kill();
                            //                 tweenClose = gsap.to(coatingEl, { paused: true });
                            //                 coatingEl.style.transform = `translate(${position.x}px, ${position.y}px`;

                            //                 console.log('cc');
                            //                 coatingEl.style.width = event.target.parentNode.offsetWidth - 2 + 'px';
                            //                 coatingEl.style.height = event.target.parentNode.offsetHeight - 2 + 'px';
                            //                 tweenOpen.progress() && (tweenOpen = gsap.to(coatingEl, { paused: true }));
                            //             },
                            //         }));
                        }
                    }

                    if (coatingMove) {
                        gsap.to(coatingEl, {
                            width: event.target.parentNode.offsetWidth - 2 + 'px',
                            height: event.target.parentNode.offsetHeight - 2 + 'px',
                            x: position.x,
                            y: position.y,
                        });
                    }
                    event.target.parentNode.style.transform = `translate(${position.x}px, ${position.y}px)`;
                    if (!tweenOpen.progress()) {
                        coatingEl.style.transform = `translate(${position.x}px, ${position.y}px`;
                        coatingEl.style.width = event.target.parentNode.offsetWidth - 2 + 'px';
                        coatingEl.style.height = event.target.parentNode.offsetHeight - 2 + 'px';
                    }
                },
            },
            modifiers: [
                interact.modifiers.restrict({
                    restriction: (document.querySelector('.resize-drag_macbook') as HTMLDivElement)
                        .parentNode as HTMLDivElement,
                    elementRect: { top: 200, left: 0.9, bottom: 1, right: 0.1 },
                }),
            ],
        });
        console.log(position);
        return () => {
            reiszeObserver.disconnect();
            tweenClose && tweenClose.kill();
            tweenOpen && tweenOpen.kill();
        };
    }, []);
    return (
        <div className="fixed inset-0 z-[21] flex m-0">
            <div
                className={classNames(
                    'macbook-wrapper relative shadow shadow-weak bg-[rgb(var(--background-start-rgb))] z-20   overflow-hidden rounded-xl z-[22] mb:w-mb-body tl:w-tl-body h-[90%]  lt:w-lt-body dt:w-dt-body',
                    { 'resize-drag_macbook ': fullSize },
                )}
            >
                <header
                    className={classNames(
                        ' h-[44px] backdrop-blur-2xl bg-[#cccccc]  flex items-center justify-between ',
                        { 'resize-drag_macbook-header': fullSize },
                    )}
                >
                    <div className="flex items-center">
                        <div className="h-full flex items-center space-x-[6px] mx-[12px]">
                            <span
                                onClick={() => {
                                    if (positionRef.current) {
                                        const tl = gsap.timeline();

                                        const macbook = document.querySelector('.macbook-wrapper') as HTMLDivElement;
                                        var macbookWidth = macbook.offsetWidth;
                                        var macbookHeight = macbook.offsetHeight;
                                        const coatingEl = document.querySelector(
                                            '.macbook-blue-coating',
                                        ) as HTMLDivElement;
                                        coatingEl.style.display = 'none';
                                        if (fullSize) {
                                            tl.fromTo(
                                                macbook,
                                                {
                                                    width: macbookWidth,
                                                    height: macbookHeight,
                                                    x: positionRef.current.x,
                                                    y: positionRef.current.y,
                                                },
                                                {
                                                    width: 0,
                                                    height: 0,
                                                    x: positionRef.current.x + macbookWidth / 2,
                                                    y: positionRef.current.y + macbookHeight / 2,
                                                    onComplete: () => {
                                                        Route.back();
                                                    },
                                                },
                                            );
                                            tl.to('.overlay', { opacity: 0 }, '<');
                                        } else {
                                            tl.to(macbook, {
                                                width: 0,
                                                height: 0,
                                                x: macbookWidth / 2,
                                                y: macbookHeight / 2,
                                                onComplete: () => {
                                                    Route.back();
                                                },
                                            });
                                        }
                                        tl.to('.overlay', { opacity: 0 }, '<');
                                    }
                                }}
                                className="macbook-header_item group exit-macbook bg-[#ff605c] cursor-pointer w-[15px]  rounded-full inline-block h-[15px]"
                            >
                                <ExitIcon className="text-[#0000006a] group-hover:block hidden text-center w-[8px] translate-x-[3.5px]" />
                            </span>
                            <span className="macbook-header_item group minus-macbook bg-[#ffbd44] cursor-pointer w-[15px] rounded-full inline-block h-[15px]">
                                <MinusIcon className="text-[#000000aa] text-center w-[8px] group-hover:block hidden translate-x-[3px]" />
                            </span>
                            <span
                                onClick={() => {
                                    setFullSize((state) => !state);
                                    var windowWidth =
                                        window.innerWidth ||
                                        document.documentElement.clientWidth ||
                                        document.body.clientWidth;
                                    var windowHeight =
                                        window.innerHeight ||
                                        document.documentElement.clientHeight ||
                                        document.body.clientHeight;
                                    var macbookWrapper = document.querySelector('.macbook-wrapper') as HTMLDivElement;
                                    if (fullSize) {
                                        const tween = gsap.fromTo(
                                            macbookWrapper,
                                            {
                                                x: positionRef.current ? (positionRef.current.x as number) : 0,
                                                y: positionRef.current ? (positionRef.current.y as number) : 0,
                                            },
                                            {
                                                width: windowWidth,
                                                x: 0,
                                                height: windowHeight,
                                                y: 0,
                                                onComplete: () => {
                                                    tween.kill();
                                                },
                                            },
                                        );
                                    } else {
                                        const minimizeWidth = getDevice() as number;
                                        const minimizeHeight = (windowHeight * 90) / 100;
                                        const paddingX = (windowWidth - minimizeWidth) / 2;
                                        const paddingY = (windowHeight - minimizeHeight) / 2;
                                        const tween = gsap.to(macbookWrapper, {
                                            width: minimizeWidth,
                                            x: paddingX,
                                            height: minimizeHeight,
                                            y: paddingY,
                                            onComplete: () => {
                                                tween.kill();
                                            },
                                        });
                                        const tween2 = gsap.to('.macbook-blue-coating', {
                                            width: minimizeWidth,
                                            x: paddingX,
                                            height: minimizeHeight,
                                            y: paddingY,
                                            onComplete: () => {
                                                tween2.kill();
                                            },
                                        });
                                        if (positionRef.current) {
                                            positionRef.current.x = paddingX;
                                            positionRef.current.y = paddingY;
                                        }
                                    }
                                }}
                                className="macbook-header_item group bg-[#00ca4e] cursor-pointer w-[15px] rounded-full inline-block h-[15px]"
                            >
                                {fullSize ? (
                                    <FullScreenIcon className="group-hover:block hidden text-[#0000006a] text-center w-[12px] translate-y-[3px] translate-x-[1.5px]" />
                                ) : (
                                    <MinimizeIcon className="group-hover:block hidden text-[#0000006a] text-center w-[12px] translate-y-[1px] translate-x-[1.5px]" />
                                )}
                            </span>
                        </div>

                        <TabControlIcon className="macbook-header_item ml-[8px] h-[28px] text-[#cccccc] cursor-not-allowed translate-y-[0.5px] " />
                        <ArrowIcon className="macbook-header_item ml-[16px] h-[14px] text-[#333] w-[14px] cursor-not-allowed rotate-90" />
                        <ArrowIcon className="macbook-header_item ml-[16px] h-[14px] text-[#333] w-[14px] cursor-not-allowed rotate-[-90deg] " />
                    </div>
                    <div className=" flex items-center">
                        <ShieldIcon className="macbook-header_item w-[20px] text-[#333] cursor-not-allowed h-[20px]" />
                        <div className=" macbook-header_item flex ml-[12px] cursor-pointer items-center bg-[#bdbdbd] rounded overflow-hidden pr-[8px]">
                            <input
                                type="text"
                                className="pl-[8px]  w-[400px] text-[#222] bg-[#bdbdbd] outline-none"
                                value={'https://concacgido.com'}
                            />
                            <ReloadIcon className="w-[18px] cursor-pointer h-[14px] rotate-[125deg] text-[#555]" />
                        </div>
                    </div>
                    <div className=" flex items-center">
                        <ExportIcon className="macbook-header_item w-[20px] text-[#404040] h-[20px] cursor-not-allowed " />
                        <PlusIcon className="macbook-header_item cursor-not-allowed ml-[16px] text-[#404040]" />
                        <TabManagerIcon className="macbook-header_item   w-[24px] h-[24px] text-[#ccc] translate-y-[1px] mx-[16px]" />
                    </div>
                </header>
                <div
                    className={classNames('mx-auto ', {
                        'w-dt-body': typeOfDisplay === 'desktop',
                        'w-lt-body': typeOfDisplay === 'laptop',
                        'w-tl-body': typeOfDisplay === 'tablet',
                        'w-mb-body': typeOfDisplay === 'mobile',
                    })}
                >
                    {children}
                </div>
            </div>
            <div className="macbook-blue-coating absolute rounded-xl border-[2px] border-solid border-[#1f75e6] z-[21] translate-y-[-6px]"></div>

            <Overlay />
        </div>
    );
}

export default memo(MacbookWrapper);
