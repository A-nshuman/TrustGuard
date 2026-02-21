import { Images } from "../assets/images";

export default function Navbar() {
    return (
        <nav className="w-full bg-gray-900 shadow-md px-6 py-4 border-b border-gray-800 shadow-green-500/5">
            <div className="max-w-7xl mx-auto flex items-center justify-between relative">

                <div className="flex items-center gap-2">
                    <img
                        src={Images.logo}
                        alt="TrustGuard Logo"
                        className="h-12 w-auto"
                    />
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <h1 className="text-[30px] font-bold text-accent tracking-wide">
                        TrustGuard
                    </h1>
                </div>

                <div>
                    <a
                        href="#about"
                        className="bg-accent text-black px-4 py-2 rounded"
                    >
                        About Us
                    </a>
                </div>

            </div>
        </nav>
    );
}