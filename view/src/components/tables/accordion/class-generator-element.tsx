/** Because tailwind will only generate classes that have been used, the div below is intended as a generator so that classes can be dynamic.  */

export default function ClassGeneratorElement() {
    return <>
        <div className="hidden grid-cols-8"></div>
        <div className='hidden mt-2.5'></div>
        <div className="col-span-8"></div>
    </>
}