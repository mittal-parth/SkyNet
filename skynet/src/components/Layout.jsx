
import Navbar from "./Navbar";
import { ConnectButton } from '@rainbow-me/rainbowkit';


export default function Layout({ children }) {

  return (
    <>
      <div className="bg-primary relative w-full h-max">
          <div className="flex mx-20">
            <ConnectButton />
            <Navbar />
          </div>
            <main className="h-full w-full flex justify-center mb-24 ">
              <div className=" h-full w-full">
                {children}
              </div>
            </main>
        
        
      </div>
    </>
  );
}
