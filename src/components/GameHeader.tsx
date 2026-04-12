import toLogoSm from "@/assets/TO_logo_sm_clr.svg";

export default function GameHeader() {
  return (
    <header className="relative z-20 px-4 sm:px-6 pt-4 pb-3">
      <div className="flex items-center">
        <div className="flex items-center flex-shrink-0 select-none">
          <img
            src={toLogoSm}
            alt="Trivolivia"
            className="h-8 w-auto"
            draggable={false}
          />
        </div>
      </div>
    </header>
  );
}
