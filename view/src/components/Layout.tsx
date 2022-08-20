import Navbar from "./Navbar";

export default function Layout({children} : any){
    return (
        <main className="flex flex-col justify-between">
            <div className="flex flex-col">
                <Navbar />
                { children }
            </div> 
            <footer>2022 - Disarm</footer>   
        </main>

    )
}