import gsap from 'gsap';
import { useEffect } from 'react';
import AngleBracketsXWrapper from '@/components/wrapper-components/angle-bracket';
function Intro() {
    useEffect(() => {
        let tl = gsap.timeline({ scrollTrigger: { trigger: '.preview-container', start: 'top 65px' } });
        tl.to('.preview-intro--1', { x: 0, opacity: 1 });
        tl.to('.preview-intro--2', { x: 0, opacity: 1 }, '<');
        tl.to('.intro-section--name', { opacity: 0 }, '<');
        return () => {
            tl.kill();
        };
    }, []);
    return (
        <div className="section_scroll-x w-[100vw] relative pb-[65px] flex flex-col justify-center  items-center">
            <AngleBracketsXWrapper
                className="intro-section--name absolute top-[10px] left-[50%] translate-x-[-50%]"
                height="60px"
            >
                <p className="text-[30px]">Preview section</p>
            </AngleBracketsXWrapper>
            <p className=" font-medium text-tl preview-intro--1 translate-x-[-200px] text-[54px] opacity-0">
                The following is a summary of what you need in
            </p>
            <p className=" font-medium text-tl preview-intro--2 translate-x-[100px] opacity-0 text-[54px]">
                a developer like me on my website
            </p>
        </div>
    );
}

export default Intro;
